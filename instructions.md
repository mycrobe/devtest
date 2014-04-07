# Requirements
+ Mysql (I used 5.6)
+ Nodejs
+ Ports 3000 and 8000 available
+ I used a mac. It will probably work on linux.

# Procedure
1. Update to latest.
2. Create the database
    $ cd <root>/sql
    $ mysql -uroot < create_database.sql
    $ mysql -ufactory -pfact0ry < ddl.sql
3. Start the REST server
    $ cd <root>/rest-server
    $ npm install
    $ npm start
4. Populate the database
    $ cd <root>/data-loader
    $ npm install
    $ npm start
5. Start the angular app
    $ cd <root>/client-app
    $ npm install
    $ npm start

# Post-mortem
## What's done
+ Database schema
+ REST-style services wrapping db
+ data loader that pushes data to the datastore
+ client app that pulls data from the datastore

## What's not done
+ client interface for CRUD
+ server-side services for the "UD" in CRUD
+ beautification of UI
+ refactoring the code to be more modular / idiomatic; I abstracted bits of logic when necessary and would
  like to go back and rationalize them.
+ tests.
+ Paging in the reports. All filtering is done on the client on the full dataset.
+ The "orders" report uses ng-table. The others should too to enable CSV export and server side filtering/sorting
+ There are no links between the reports of the "click a person in an order to see all the orders" kind
  and no "find" methods on the server.
+ Anything with the salesperson data.

## General Comments about the devtest
I like the problem; it's nicely real-world.

I'm not particularly happy with the results of this for a number of reasons. In my opinion,
the downside of the extreme there's-lots-to-do-and-not-enough-time configuration here is that
it really, really did not encourage good coding standards. Also I wrote no tests.

...But I only have myself to blame for picking such an unfamiliar tech stack.

## Tech stack notes
I had not written an app in angular.js or node.js before this exercise, so I decided to stick with
mysql for the datastore because I know it and because you guys know it. I had a lot of difficulty with
the node:mysql boundary of the application.
+ I'd not worked within node's asynchronous model before. I spent far to long digging various holes while trying to
  populate the database.
+ How do you know it's OK to release a pooled connection? What if somewhere in a pyramid of callbacks
there is a loop? (Perhaps loops in these callbacks pyramids is considered harmful? Oops. Reading required.)
+ The server ran much faster with a pool of 10 connections, but it wasn't clear why it worked and added extra
  layers of callbacks.
+ The mysql tools are immature.
+ These data might be more convenient to store in a document database...
+ I originally had a category table for parts but there was really no point.