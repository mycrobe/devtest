var express = require('express');
var app = express();

var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'factory',
    password: 'fact0ry',
    database: 'factory'
});

//var Q = require("q");
//var promisedQuery = function (connection, query, queryParams) {
//    var deferred = Q.defer();
//    connection.query(query, queryParams, deferred.resolve);
//    return deferred.promise;
//};

// to parse POSTed bodies, whether JSON, urlencoded or multipart
app.use(express.bodyParser());

/**
 * Object containing allowed table names
 */
var tables = { 'people': true, 'part_types': true, 'orders': true, 'parts_ordered': true, 'parts': true};

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
 * @param userError evaluated as boolean. True -> 403 error; False -> 503 error
 * @returns {boolean} returns true if an error was returned.
 */
function handleError(type, err, res, userError) {
    if (err) {
        console.error(type, ' error', err);
        try {
            res.statusCode = userError ? 403 : 503;
            res.type('application/json');
            res.send({
                result: 'error',
                code: err.code,
                message: err.message
            });
        } catch(e) {
            console.error('Response probably already sent for error');
        }
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
    pool.getConnection(function (err, connection) {
        if (!handleError("CONNECTION", err, res)) {
            connection.query(query, queryParams, callback);
        }
        connection.release();
    });
}

// very thin REST layer over schema for reading... for now
// if id parameter is supplied, get just that row, otherwise list all
app.get('/:table/:id?', function (req, res) {
    var tableName = req.params.table,
        id = req.params.id,
        query = 'select * from ' + tableName,
        getResponseBodyFromQueryResults = function (rows, fields) {
            return {
                result: 'success',
                err: '',
                rows: rows,
                fields: fields,
                length: rows.length
            }
        };

    if (id) {
        query += ' where id = ?'
    }
    query += ' order by id asc';

    doQueryAndRespond(res, query, id, getResponseBodyFromQueryResults);

});

app.post('/orders', function (req, res) {
    var orderId;
    pool.getConnection(function (err, connection) {
        if (handleError('CONNECTION', err, res)) {
            return
        }
        function rollbackOnError(err, res) {
            if (err) {
                connection.rollback(function (e, rows) {
                    if(e) {
                        console.log("Could not roll back :" + e.message );
                    }
                    else {
                        console.log("Rolled back. Affected rows: " + rows.affectedRows);
                    }
                });
            }
            return handleError('TRANSACTION-QUERY', err, res);
        }
        function notSingleResult(rows, res) {
            
        }

//        try {
            connection.beginTransaction(function (err) {
                if(rollbackOnError(err, res)) { return }
                var orderInfo = req.body,
                    orderQuery = 'insert into orders(order_number, order_date, total_sale, customer_id) select ?, ?, ?, id from people where name = ?',
                    partsOrderedQuery = 'insert into parts_ordered(order_id, quantity, part_id) select ?, ?, id from parts where part_number = ?',
                    orderParams = [orderInfo.order_number, orderInfo.order_date, orderInfo.total_sale, orderInfo.customer],
                    partsOrdered = orderInfo.parts_ordered;

                connection.query(orderQuery, orderParams, function (err, rows) {
                    connection.release();
                    if(rollbackOnError(err, res)) { return }
                    orderId = rows.insertId;

                    for (var i = 0; i < partsOrdered.length; i++) {
                        var partOrdered = partsOrdered[i],
                            partParams = [orderId, partOrdered.quantity, partOrdered.part];

                        connection.query(partsOrderedQuery, partParams, function (err, rows) {
                                rollbackOnError(err, res);
                            });
                    }

                    connection.commit(function(err, rows) {
                        if(rollbackOnError(err, res)) { return }
                        try {
                            res.type('application/json');
                            res.send({
                                result: 'success',
                                err: '',
                                json: {'id': orderId}
                            });

                        } catch (e) {
                            console.error('Response probably already sent for error');
                        }
                    })
                });
//                });
            });
            connection.release();
//        } catch (err) {
//            handleError('TRANSACTION', err, res);
//        } finally {
//            connection.release();
//        }
    });
});

app.post('/:table', function (req, res) {
    var rowInfo = req.body,
        tableName = req.params.table,
        query = 'insert into ' + tableName + ' set ?',
        getResponseJsonFromSqlResults = function (result) {
            return {'id': result.insertId}
        };

    if (handleError("TABLE_NAME", tableNameInvalid(tableName), res, true)) {
        return;
    }

    doQueryAndRespond(res, query, rowInfo, getResponseJsonFromSqlResults);
});

app.listen(3000);
console.log("Rest server running on port 3000 ( perhaps http://localhost:3000 )");