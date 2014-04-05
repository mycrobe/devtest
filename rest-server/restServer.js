var express = require('express');
var app = express();

var mysql = require('mysql');
var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'factory',
    password : 'fact0ry'
});

// to parse POSTed bodies, whether JSON, urlencoded or multipart
app.use(express.bodyParser());

app.get('/', function(req, res) {
    pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        var solution = rows[0].solution;
        res.type('text/plain');
        res.send('The solution is: ' + solution);
    });
});

app.listen(3000);