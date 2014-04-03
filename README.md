Here are the rules. You have 24 hours from when we sent you the link to the repo to complete this test. You may not be able to finish everything. That’s okay! Relax. You’re not necessarily supposed to finish it all in that time. Commit it and send it back to us at the end of the test anyway, even if it’s incomplete. Let us know what happened and why it’s not done - if you didn’t know how to do something, say so. If you had a catastrophe elsewhere in your life and couldn’t get to it, let us know. We may ask you for clarifications, revisions, or bugfixes after we’ve got it, though.

If you get stuck on something early on and are unable to proceed, let us know. We’ll help you out to get you past that and onto the parts you do know. We are trying to assess your ability to communicate with other developers as well as write good code.

It has to be able to run in a unix-type environment (at least on linux and preferably on Mac OS X). You can assume that we’ve got a MySQL 5 database up and running, and also a plain-jane Apache web environment with no modules on it. There’s also at least Perl 5.10 and a standard CPAN install. We’ve probably got Python and Ruby installs sitting around with whatever standard modules those languages have, too. Maybe even a Node.js server!

But otherwise? Solve the problems however you’d like. We’re mainly a Perl and Javascript shop, so those are the solutions we like to see. But if you’re a solid developer and can do it best for us in another language, then have at it. We love good code no matter the language, but just keep in mind that you’ll need to get your Perl and Javascript up to speed once you’re on board if it’s not.

Like life, this test is open book. Please use any and all resources you can find on the internet, in books, or wherever. The only constraint is that you have to do it yourself and can’t ask for help. So by all means use resources like Google and StackOverflow. We want to see how well you can integrate known patterns and solutions.

You may also use any and all 3rd party tools or frameworks you’d like, either on the frontend or the backend. But we may not have them installed, so include instructions on how to get them and set ‘em up. If your software needs compilation or a Makefile or the like, include it for us in your repository.

You may need to justify your choices — if you write your own software to do a particular task when there’s a well known library out there for those purposes, we may ask you why. Be prepared to justify your choices!

Likewise, use 3rd party tools judiciously. If you find a project out there that solves everything we asked for, it won’t give us a good sense of how well you code. Use your judgement.

Finally, we’re all programmers here. You’ve used 3rd party tools, you’ve looked at other people’s code, and you’ve had to support software written by other people. So try to give us something that you’d be happy with if someone else handed it to you.

Good luck, and on with the show:

We run a factory. We need an application to help us manage it. First, create us a database.

We produce 3 types of parts — widgets, doodads, and thingamajigs. Each item needs a unique part number, a description, and the quantity we have in stock.

We also want to manage our orders, eventually. So keep track of customers (name, address, phone number), and also orders per customer (unique order number, parts ordered, quantity of each part ordered, order date).

Included, find a set of excel spreadsheets with sample data in them. Some of the part numbers may overlap, so if you change any of the IDs, please provide a report mapping the old ids to the new ones.

Be sure to provide the loading script so we can re-run it. We may add more part numbers to the spreadsheet while you’re working on this. If the loader can’t handle Excel directly, then tell us what format the input file needs to be and how we can convert the spreadsheet to it.

Now that the database is up, we need to produce a couple of reports. So let’s use a web interface.

I’d like the user to come in and get a menu of three reports — parts in stock, customers, and orders.

The parts in stock report should just be all the part numbers, which type, the description, and quantities. The descriptions get kinda long, so only show the first 20 characters.

The customers report should be a list of all customers we have — any customer ID, their name, address, phone.

The orders report should include the order number, the customer name and phone, and the part numbers and quantity ordered.

Oh, and we also need to be able to import those reports into the legacy system, so in addition to an HTML version, please provide the option to download a tab delimited file with the same data. It’d be preferrable to just download a file, instead of displaying it in the browser.

We really like things whizbang and web 2.0, so please set up the menu page so it has three links across the top to each of the three reports, and bringing up a report displays it inline in the page below the report names, without reloading the page itself. If you can’t, but can do it all server side, we can fall back to that. You can safely assume that it will be running in an environment with javascript. Oh, but not Internet Explorer. At all. Include a note on IE that it won’t work.

Make the reports look as pretty as you’d like.

Finally, we don’t want to manage all of this stuff through excel spreadsheets. So build us a web interface to edit all of the above data (add/edit a customer, add/edit an order, add/edit a part). We get more orders than new parts or new customers, so an interface to edit that is the priority. Same as with the reports up above, we really like fancy web 2.0 interfaces, so a single screen interface saves the order would be awesome.

