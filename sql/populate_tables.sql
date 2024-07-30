-- SQL script to populate tables using CSV files

-- Populate Driver table
COPY public.Driver(driver_id, first_name, last_name, email, birthdate, phone_number, address, licence_number)
FROM '/path/to/Driver.csv'
DELIMITER ','
CSV HEADER;

-- Populate Vehicle table
COPY public.Vehicle(vin_number, make, model, color, year)
FROM '/path/to/Vehicle.csv'
DELIMITER ','
CSV HEADER;

-- Populate Registration table
COPY public.Registration(registration_id, driver_id, vin_number, registration_date, expiry_date)
FROM '/path/to/Registration.csv'
DELIMITER ','
CSV HEADER;
