var Client = require('node-rest-client').Client;
var client = new Client();
var fs = require('fs');
var csv = require('csv');

client.registerMethod("persistPerson", "http://localhost:3000/people", "POST");

// client errors; looks like we need to manually handle server errors, etc
client.on('error', function (err) {
    console.error('Something went wrong on the client', err);
});

function csvToRest(entityType, filename, restMethod, transform) {
    csv().from.path(filename, {delimiter: '\t', columns: true})
        .transform(transform)
        .on('record', function (row, index) {
            restMethod({data: row, headers: {"Content-Type": "application/json"}},
                function (data, response) {
                    if (response.statusCode != 200) {
                        console.log('Error! %s returned with code %s. Error message %s \n   Data in question: %s', response.statusCode, data.code, data.message, JSON.stringify(row));
                    }
                    else {
                        console.log("Added %s %s with id %s", entityType, row.name, data.json.id);
                    }
                });
        });
}

csvToRest('person', '../data/customers.txt', client.methods.persistPerson, function (row) {
    row.state_or_province = row['state/province'];
    delete row['state/province'];
    return row;
});

