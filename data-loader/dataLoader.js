var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("persistPerson", "http://localhost:3000/people", "POST");

client.methods.persistPerson({data: {name:'Bar', email:'baz@foo.com'}, headers:{"Content-Type": "application/json"}},
    function(data, response) {
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});