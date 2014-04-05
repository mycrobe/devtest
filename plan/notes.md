Rough plan after 45 minutes of googling:

## Planned technology stack
+ mysql db
+ node.js/express server to wrap mysql db in RESTish API
+ x for ETL, using REST server to populate DB, where x in javascript, perl, groovy
+ angularjs front end, also consuming REST
+ twitter bootstrap

## Links of useful things I found
+ node-csv lib here: https://github.com/wdavidw/node-csv
+ node REST from first principles blog post: http://blog.modulus.io/nodejs-and-express-create-rest-api
+ mysql/express/node REST server blog post: http://www.nodewiz.biz/nodejs-rest-api-with-mysql-and-express/
+ canonical CRUD example in Angular: http://angularjs.org/#wire-up-a-backend
+ more advanced REST/CRUD Angular toolset: https://github.com/mgonto/restangular

## Plan of action
0. Summarize high-level requirements.
1. Sketch data model.
2. Write schema.
3. Wrap schema in CRUD REST server.
5. Load data using REST.
6. Read-only UI.
7. Allow REST server to expose data as CSV
8. CRUD UI

## Notes
+ Use denormalized "total_price" to attempt to disambiguate collisions of part numbers?
+ Interesting db design issue implied by supplied "sales_force.txt" and "customers.txt" files, but sales force is not mentioned in requirements doc. I'd probably rename table to "people" and have a 1:1 "foreign key is primary key" mapping to a "salespeople" table with employee/sales info. (This is not reflected in the sketch data model correctly.)

## Schema implementation notes
+ For simplicity, just one name field for full name
+ Could have some kind of part >-< alias relationship for part numbers instead of parts.original_part_number column
+ Could/should put address in separate table and validate states and suchlike.