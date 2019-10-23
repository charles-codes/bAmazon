var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tarheels",
    database: "bamazon_db"
});

connection.connect(function(err){
    if(err) throw(err);

    buy();
    console.log("\n");
    productsList();
    
   
});

function productsList() {
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw (err);
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | " + results[i].price + " | ");
        }
        console.log("=======================================");
        //connection.end();
    });
};

function buy() {
    //console.log("\n");
    inquirer.prompt({
        name: "product",
        type: "input",
        message: "Type the product id number of the product you'd like to buy.",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
            }
    },
    {
        name: "quantity",
        type: "input",
        message: "How many units would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
        }
    })
    .then(function(answer) {
        connection.query("SELECT product_name, department_name, price, stock_quantity * FROM  products WHERE ?", {item_id: answer.item_id}, function(err, results){
            if (err) throw (err);
            if (results[0].stock_quantity >= answer.quantity) {
                let itemQuantity = results[0].stock_quantity - answer.quantity;
                connection.query("UPDATE products SET ? WHERE ?"), [
                    {
                        stock_quantity: itemQuantity
                    },
                    {
                        item_id: answer.item_id
                    }
                ], function (err, results) {

                };

                var cost = results[0].price * answer.quantity;
                console.log("\n Order complete. Your cost is $" + cost.toFixed(2) + "\n.");
                shoppingPrompt();
            }
            else {
                console.log("\nInsufficient quantity available. We are unable to complete your order.\n");
                shoppingPrompt();
            }
        })
    })

}

function shoppingPrompt() {
    inquirer.prompt({
        name: "shop",
        type: "list",
        message: "Would you like to continue shopping?\n",
        choices: ["Yes", "No"]
    })
    .then(function(answer){
        switch(answer.shop) {
            case "Yes":
                productsList();
                buy();
            break;
            
            case "No":
                connection.end();
            break;
        }
    })
};

//buy();