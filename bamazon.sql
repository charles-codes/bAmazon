DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grinder", "Kitchen Appliances", 19.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("French Press", "Kitchen Appliances", 29.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Espresso Machine", "Kitchen Appliances", 99.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ecuadorian Coffee Beans", "Groceries", 12.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Digital Printer", "Consumer Electronics", 129.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Custom Stationary", "Crafts", 15.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lined Ruler", "Crafts", 3.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ink Cartridges", "Consumer Electronics", 16.99, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Envelopes", "Crafts", 9.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bic Calligraphy Pen", "Crafts", 7.99, 50);

-- SELECT * FROM products;