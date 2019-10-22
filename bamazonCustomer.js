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

    app_start();
});

function app_start() {
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw (err);
        

    
        
  


    })
}