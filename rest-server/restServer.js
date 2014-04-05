var express = require('express');
var app = express();

var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'factory',
    password : 'fact0ry',
    database : 'factory'
});

var tables = { 'people': true, 'categories' : true, 'orders': true, 'parts_ordered': true, 'parts': true};
function checkTable(table) {
    return tables[table];
}

// to parse POSTed bodies, whether JSON, urlencoded or multipart
app.use(express.bodyParser());

// very thin REST layer over schema for reading... for now
app.get('/:table/:id?', function(req,res){
    var tableName = req.params.table;
    if(!checkTable(tableName)) {
        res.statusCode = 422;
        res.send({result: 'error', err: 'invalid table name'});
        return;
    }

    pool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
        } else {
            // if id parameter is supplied, get just that row, otherwise list all
            var id    = req.params.id,
                query = 'SELECT * FROM '+ tableName;

            if(id) {
               query += ' where id = ?'
            }

            query += ' order by id asc';

            connection.query(query, id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send({
                    result: 'success',
                    err:    '',
                    fields: fields,
                    json:   rows,
                    length: rows.length
                });
                connection.release();
            });
        }
    });
});
//app.get('/:table/:id', function(req,res){});
//app.post('/:table', function(req,res){});
//app.put('/:table/:id', function(req,res){});
//app.delete('/:table/:id', function(req,res){});


app.listen(3000);
console.log("Rest server running on port 3000 ( perhaps http://localhost:3000 )");