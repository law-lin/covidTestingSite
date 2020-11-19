CREATE DATABASE covid_testing;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE employee(
  employee_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE lab_employee(
  lab_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255)
);

CREATE TABLE employee_test(
  test_barcode VARCHAR(255) PRIMARY KEY,
  employee_id uuid NOT NULL,
  collection_time TIMESTAMP,
  collected_by VARCHAR(20),
  CONSTRAINT fk_employee_test_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  CONSTRAINT fk_employee_test_employee
    FOREIGN KEY (collected_by) REFERENCES lab_employee(lab_id)
);

CREATE TABLE pool(
  pool_barcode VARCHAR(255) PRIMARY KEY
);

CREATE TABLE well(
  well_barcode VARCHAR(255) PRIMARY KEY
);

CREATE TABLE pool_map(
  test_barcode VARCHAR(255),
  pool_barcode VARCHAR(255),
  CONSTRAINT fk_pool_map_employee_test
    FOREIGN KEY (test_barcode) REFERENCES employee_test(test_barcode),
  CONSTRAINT fk_pool_map_pool
    FOREIGN KEY (pool_barcode) REFERENCES pool(pool_barcode)
);

CREATE TABLE well_testing(
  pool_barcode VARCHAR(255),
  well_barcode VARCHAR(255),
  testing_start_time TIMESTAMP,
  testing_end_time TIMESTAMP,
  result VARCHAR(20),
  CONSTRAINT fk_well_testing_pool
    FOREIGN KEY (pool_barcode) REFERENCES pool(pool_barcode),
   CONSTRAINT fk_well_testing_well
    FOREIGN KEY (well_barcode) REFERENCES well(well_barcode)  
);

ALTER TABLE well_testing
  ADD CONSTRAINT check_result
  CHECK (result = 'in progress' OR result = 'negative' OR result = 'positive');

-- insert dummy data
INSERT INTO employee(email, first_name, last_name, password) VALUES ('lawrence.lin@stonybrook.edu', 'Lawrence', 'Lin', 'asdf1234');
INSERT INTO lab_employee(email, first_name, last_name, password) VALUES ('lawrence.lin@stonybrook.edu', 'Lawrence', 'Lin', 'asdf1234');
