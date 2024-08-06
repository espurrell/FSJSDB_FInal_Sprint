-- SQL script to create tables for the DMV database

-- Create Driver table
CREATE TABLE IF NOT EXISTS Driver (
    driver_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    licence_number VARCHAR(20),
    birthdate DATE
);

-- Create Vehicle table
CREATE TABLE IF NOT EXISTS Vehicle (
    vin_number VARCHAR(17) PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    color VARCHAR(20)
);

-- Create Registration table
CREATE TABLE IF NOT EXISTS Registration (
    registration_id SERIAL PRIMARY KEY,
    driver_id INT REFERENCES Driver(driver_id),
    vin_number VARCHAR(17) REFERENCES Vehicle(vin_number),
    registration_date DATE,
    expiry_date DATE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
