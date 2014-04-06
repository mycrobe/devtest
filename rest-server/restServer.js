var express = require('express');
var app = express();

var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'factory',
    password : 'fact0ry',
    database : 'factory'
});

// to parse POSTed bodies, whether JSON, urlencoded or multipart
app.use(express.bodyParser());

/**
 * Object containing allowed table names
 */
var tables = { 'people': true, 'part_types' : true, 'orders': true, 'parts_ordered': true, 'parts': true};

/**
 * Check if the table name supplied is disallowed.
 * @param table
 * @returns {object} an error object if the table is invalid, otherwise null
 */
function tableNameInvalid(table) {
    if (tables[table]) {
        return null;
    } else {
        return { 'code': 'ILLEGAL_TABLE', 'message': 'Table name supplied is not allowed' };
    }
}

/**
 * Handle a potential error in the context of an HTTP request. If there's an error,
 * set the response to a 503 and provide error info to the client in a standard format
 * @param type a string describing the type of error, e.g. "CONNECTION" or "QUERY"
 * @param err the error object. For maximum utlity, this should contain a code and a message
 * @param res the response object to which the error will be written
 * @returns {boolean} returns true if an error was returned.
 */
function handleError(type, err, res, userError) {
    if(err) {
        console.error(type, ' error', err);
        res.statusCode = userError ? 403 : 503;
        res.type('application/json');
        res.send({
            result: 'error',
            code: err.code,
            message: err.message
        });
    }
    return !!err;
}

/**
 * Abstraction of logic used when querying the database from within a route. It checks for
 * errors connecting to the database, checks for query errors returned from the database and
 * returns a message in the client request in a standardized format.
 * @param res the response object
 * @param query the query, in string format
 * @param queryParams query parameters. The required format depends on the query string, but can be a scalar,
 *                      or an object. Maybe also an array but I haven't tested that.
 * @param getResponseJsonFromSqlResults function that takes the rows and fields returned from the database
 *                      and should return an object that can be serialized to JSON that represents the query
 *                      results.
 */
function doQueryAndRespond(res, query, queryParams, getResponseJsonFromSqlResults) {
    doQuery(res, query, queryParams, function (err, rows, fields) {
        if (!handleError("QUERY", err, res, true)) {
            res.type('application/json');
            res.send({
                result: 'success',
                err: '',
                json: getResponseJsonFromSqlResults(rows, fields)
            });
        }
    });
}

/**
 * Abstraction of logic used when querying the database from within a route. It checks for
 * errors connecting to the database and --if there were no errors-- calls the provided callback.
 * Errors are returned nicely to the client so it's important not to write to the response object
 * in the callback if the error object is not null.
 * @param res the response object
 * @param query the query, in string format
 * @param queryParams query parameters. The required format depends on the query string, but can be a scalar,
 *                      or an object. Maybe also an array but I haven't tested that.
 * @param callback the function to call with the results. (This is passed directly to connection.query)
 */
function doQuery(res, query, queryParams, callback) {
    pool.getConnection(function(err, connection) {
        if (!handleError("CONNECTION", err, res)) {
            connection.query(query, queryParams, callback);
        }
        connection.release();
    });
}

// very thin REST layer over schema for reading... for now
// if id parameter is supplied, get just that row, otherwise list all
app.get('/:table/:id?', function(req,res){
    var tableName = req.params.table,
        id = req.params.id,
        query = 'select * from '+ tableName,
        getResponseBodyFromQueryResults = function(rows, fields) {
            return {
                result: 'success',
                err: '',
                rows: rows,
                fields: fields,
                length: rows.length
            }
        };

    if(id) {
       query += ' where id = ?'
    }
    query += ' order by id asc';

    doQueryAndRespond(res, query, id, getResponseBodyFromQueryResults);

});

app.post('/:table', function(req,res) {
    var rowInfo = req.body,
        tableName = req.params.table,
        query = 'insert into ' + tableName + ' set ?',
        getResponseJsonFromSqlResults = function(result) { return {'id': result.insertId} };

    if(handleError("TABLE_NAME", tableNameInvalid(tableName), res, true)) {
        return;
    }

    doQueryAndRespond(res, query, rowInfo, getResponseJsonFromSqlResults);
});

//app.put('/:table/:id', function(req,res) {
//    var tableName = req.params.table,
//        id = req.params.id,
//        updates = req.body;
//
//    if(handleError('TABLE_NAME', tableNameInvalid(tableName), res)) { return }
//
//    doQuery(res, 'select * from ' + tableName + ' where id = ?', id, function(err, rows, fields) {
//        if(handleError("QUERY", err, res)) { return }
//        if(rows.length == 0) {
//            handleError("QUERY", {code: 'NOT_FOUND', message: 'Did not find entity with id ' + id + ' in ' + tableName}, res);
//            return;
//        }
//        if(rows.length > 1) {
//            handleError("QUERY", {code: 'WTF', message: 'Found > 1 entity with id ' + id + ' in ' + tableName}, res);
//            return;
//        }
//
//        var entity = rows[0];
//
//        fields.map( function(field) {
//            if(updates[field.name]) {
//                entity[field] = updates[field];
//            }
//        });
//
//
//    });
//});

//app.get('/:table/:id', function(req,res){});
//app.post('/:table', function(req,res){});
//app.put('/:table/:id', function(req,res){});
//app.delete('/:table/:id', function(req,res){});

app.listen(3000);
console.log("Rest server running on port 3000 ( perhaps http://localhost:3000 )");