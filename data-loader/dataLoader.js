var Client = require('node-rest-client').Client;
var client = new Client();
var fs = require('fs');
var csv = require('csv');

client.registerMethod("persistPerson", "http://localhost:3000/people", "POST");
client.registerMethod("persistPart", "http://localhost:3000/parts", "POST");
client.registerMethod("persistOrder", "http://localhost:3000/orders", "POST");

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
        console.log("Sending %s %s", entityType, row[entityName]);
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

var handleCustomerRow = createRowHandler(client.methods.persistPerson, 'person', 'name');
var handlePartRow = createRowHandler(client.methods.persistPart, 'part', 'part_number');
var handleOrderRow = createRowHandler(client.methods.persistOrder, 'order', 'order_number');

function transformCustomer(row) {
    renameProperty(row, 'state/province', 'state_or_province');
    return row;
};

function transformPart(row) {
    row.cost = row.cost.slice(1);
    row.retail_price = row.retail_price.slice(1);
    return row;
}

function transformOrder(row) {
    // GRMZM0000060:23,GRMZM0000027:52,GRMZM0000014:25,GRMZM0000045:70,GRMZM0000046:6
    renameProperty(row, 'products/quantities', 'parts_ordered');
    var splitPartsOrdered = row.parts_ordered.split(','),
        partsOrderedMap = {},
        partsOrderedArray = [];

    // combine orders for the same part
    for(var i = 0; i < splitPartsOrdered.length; i++) {
        var p_q = splitPartsOrdered[i].split(':'),
            part = p_q[0],
            quant = parseInt(p_q[1]);
        if(partsOrderedMap[part]) {
            partsOrderedMap[part] += quant;
        }
        else {
            partsOrderedMap[part] = quant;
        }
    }

    // transform from map of {part: quantity} to array of {'part':part, 'quantity':quantity}
    for(part in partsOrderedMap) {
        partsOrderedArray.push({ part: part, quantity: partsOrderedMap[part] });
    }
    row.parts_ordered = partsOrderedArray;

    return row;
}

csv().from.path('../data/customers.txt', {delimiter: '\t', columns: true})
    .transform(transformCustomer)
    .on('record', handleCustomerRow);

csv().from.path('../data/parts.txt', {delimiter: '\t', columns: true})
    .transform(transformPart)
    .on('record', handlePartRow);

csv().from.path('../data/orders.txt', {delimiter: '\t', columns: true})
    .transform(transformOrder)
    .on('record', handleOrderRow);
