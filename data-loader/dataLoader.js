var Client = require('node-rest-client').Client;
var client = new Client();
var fs = require('fs');
var csv = require('csv');

client.registerMethod("persistPerson", "http://localhost:3000/people", "POST");
client.registerMethod("persistPart", "http://localhost:3000/parts", "POST");

// client errors; looks like we need to manually handle server errors, etc
client.on('error', function (err) {
    console.error('Something went wrong on the client', err);
});

function renameProperty(o, oldName, newName) {
    o[newName] = o[oldName];
    delete o[oldName];
}

function createRowHandler(persistFunction, entityType, entityName) {
    return function (row) {
        persistFunction({data: row, headers: {"Content-Type": "application/json"}},
            function (data, response) {
                if (response.statusCode != 200) {
                    console.log('Error! %s returned with code %s. Error message %s \n   Data in question: %s', response.statusCode, data.code, data.message, JSON.stringify(row));
                }
                else {
                    console.log("Added %s %s with id %s", entityType, row[entityName], data.json.id);
                }
            });
    };
}

csv().from.path('../data/customers.txt', {delimiter: '\t', columns: true})
    .transform(function (row) {
        renameProperty(row, 'state/province', 'state_or_province');
        return row;
    })
    .on('record', createRowHandler(client.methods.persistPerson, 'person', 'name'));

csv().from.path('../data/parts.txt', {delimiter: '\t', columns: true})
    .transform(function(row) {
        row.cost = row.cost.slice(1);
        row.retail_price = row.retail_price.slice(1);
        return row;
    })
    .on('record', createRowHandler(client.methods.persistPart, 'part', 'part_number'));


