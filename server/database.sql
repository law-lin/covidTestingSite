CREATE DATABASE covid_testing;

CREATE TABLE employee(
  employee_id VARCHAR(20) PRIMARY KEY,
  email VARCHAR(50),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  password VARCHAR(50)
);

CREATE TABLE lab_employee(
  lab_id VARCHAR(20) PRIMARY KEY,
  password VARCHAR(50)
);

CREATE TABLE employee_test(
  test_barcode VARCHAR(50) PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL,
  collection_time TIMESTAMP,
  collected_by VARCHAR(20),
  CONSTRAINT fk_employee_test_employee
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  CONSTRAINT fk_employee_test_employee
    FOREIGN KEY (collected_by) REFERENCES lab_employee(lab_id)
);

CREATE TABLE pool(
  pool_barcode VARCHAR(50) PRIMARY KEY
);

CREATE TABLE well(
  well_barcode VARCHAR(50) PRIMARY KEY
);

CREATE TABLE pool_map(
  test_barcode VARCHAR(50),
  pool_barcode VARCHAR(50),
  CONSTRAINT fk_pool_map_employee_test
    FOREIGN KEY (test_barcode) REFERENCES employee_test(test_barcode),
  CONSTRAINT fk_pool_map_pool
    FOREIGN KEY (pool_barcode) REFERENCES pool(pool_barcode)
);

CREATE TABLE well_testing(
  pool_barcode VARCHAR(50),
  well_barcode VARCHAR(50),
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
