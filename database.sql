/* Clauses */
CREATE DATABASE commercedb;

CREATE TABLE pieces (
    piece_id SERIAL PRIMARY KEY,
    description VARCHAR (255),
    img_url VARCHAR
);

CREATE TABLE baskets (
    user_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    quantity INTEGER
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE,
    user_first_name VARCHAR(30),
    user_last_name VARCHAR(30),
    username VARCHAR (30),
    display_img_url VARCHAR,
    basket_id INTEGER
);

INSERT INTO users (user_email, user_first_name, user_last_name, username, display_img_url)
VALUES (
    'Kennedy4011@outlook.com',
    'Mathew',
    'Kennedy',
    'MKennedy',
    'myimgurl'
);