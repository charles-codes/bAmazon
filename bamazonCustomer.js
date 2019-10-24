// variables for node package requirements
var mysql = require("mysql");
var inquirer = require("inquirer");

// variable for initial mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "bamazon_db"
});

// initializing mysql connection
connection.connect(function(err){
    if(err) throw(err);
    console.log("============================================================");

    // run the start shopping function which will be the beginning of customer experience 
    startShopping();
});

// function that includes all of operational logic 
function startShopping() {

    // mysql connecton query
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;

        // loop to display all products in inventory for customer to peruse
        console.log("ID | Product Name | Department | Price");
        console.log("============================================================");
        for (let i = 0; i < results.length; i++) {
            console.log("------------------------------------------------------------");
            console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | ");
            console.log("------------------------------------------------------------");
        };

        // inquirer prompt to begin the customer's options and actions while shoping
        inquirer.prompt({
            name: "item",
            type: "rawlist",

            // the choices for this list is formed by a function and array with loop in it
            choices: function() {
                let choicesArr = [];
                for (let i = 0; i <results.length; i++) {
                    choicesArr.push(results[i].product_name);
                }
                return choicesArr;
                },
            message: "Which product would you like to buy?"
        }).then(function(answer) {
            if (err) throw err;

            // loop to cycle through products for a match the selected item
            for (i = 0; i < results.length; i++) {
                if (results[i].product_name == answer.item) {
                    let chosenItem = results[i];
                    inquirer.prompt({
                        name: "quantity",
                        type: "input",
                        message: "How many " + answer.item + " would you like to purchase?",

                        // validation as a funciton to ensure the input is a number
                        validate: function(value) {
                            if (isNaN(value) == false) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }).then(function(answer) {

                        // checking for selected item quantity
                        if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                            let updateInventory = chosenItem.stock_quantity - parseInt(answer.quantity);

                            // query to update the inventory
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: updateInventory
                                }, 
                                {
                                id: chosenItem.id
                            }], 

                            // function to calculate items cost 
                            function () {
                                let cost = chosenItem.price * parseInt(answer.quantity);
                                console.log("============================================================");;
                                console.log("Order successful. Your shopping cart is updated.\n");
                                console.log("You purchased " + (parseInt(answer.quantity)) + " " + (chosenItem.product_name) + " at the price of $" + chosenItem.price + " each.");
                                console.log("Your subtotal is: $" + cost.toFixed(2));
                                console.log("\nThank you for your purchase!");
                                console.log("============================================================");;
                                
                                // inquirer to determine whether the customer wants to continue shopping
                                inquirer.prompt({
                                    name: "continue",
                                    type: "list",
                                    message: "Would you like to continue shopping?",
                                    choices: ["Yes", "No"]
                                }).then(function(answer){
                                    
                                    // customer wants to continue shopping so we call start shopping function and start again
                                    if (answer.continue == "Yes") {
                                        startShopping();
                                    }
                                    else {
                                        // customer is finished shopping so we end the connection to the mysql database
                                        connection.end();
                                    }
                                });
                            })
                        }
                        else {
                            console.log("============================================================\n");
                            console.log("Insufficient quantity.");
                            console.log("============================================================");;

                            // call startShopping function to begin the shopping prompt
                            startShopping();
                        }
                    })
                }
            }
        })
    });
};