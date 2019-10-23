// variables for node package requirements
var mysql = require("mysql");
var inquirer = require("inquirer");

// variable for initial mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tarheels",
    database: "bamazon_db"
});

// initializing mysql connection
connection.connect(function(err){
    if(err) throw(err);
    console.log("=======================================");

    // run the start shopping function which will be the beginning of customer experience 
    startShopping();
});

// function that includes all of operational logic 
function startShopping() {
    // mysql connecton query
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw (err);

        // loop to display all products in inventory for customer to peruse
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | ");
            console.log("=======================================")
        };
        // inquirer prompt to begin the customer's options and actions while shoping
        inquirer.prompt({
            name: "item",
            type: "rawlist",
            choices: function() {
                var choicesArr = [];
                for (var i = 0; i <results.length; i++) {
                    choicesArr.push(results[i].product_name);
                }
                return choicesArr;
                },
            message: "Which product would you like to buy?"
        }).then(function(answer) {
            if (err) throw err;
            for (i = 0; i < results.length; i++) {
                if (results[i].product_name == answer.item) {
                    var chosenItem = results[i];
                    inquirer.prompt({
                        name: "quantity",
                        type: "input",
                        message: "How many " + answer.item + " would you like to purchase?",
                        validate: function(value) {
                            if (isNaN(value) == false) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }).then(function(answer) {
                        if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                            var updateInventory = chosenItem.stock_quantity - parseInt(answer.quantity);
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: updateInventory
                            }, 
                            {
                                id: chosenItem.id
                            }], function () {
                                var cost = chosenItem.price * parseInt(answer.quantity);
                                console.log("=======================================");
                                console.log("Order successful. Your shopping cart is updated.\n");
                                console.log("You purchased " + (parseInt(answer.quantity)) + " " + (chosenItem.product_name) + " at the price of $" + chosenItem.price + " each.");
                                console.log("Your subtotal is: $" + cost);
                                console.log("\nThank you for your purchase!");
                                console.log("=======================================");
                                connection.end();
                            })
                        }
                        else {
                            console.log("Insufficient quantity.");
                            start
                        }
                    })
                }
            }
        })
    });
};