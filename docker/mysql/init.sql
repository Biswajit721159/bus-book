-- This script runs automatically when MySQL container starts for the first time
-- It creates all the databases needed by the microservices

CREATE DATABASE IF NOT EXISTS bus_users_db;
CREATE DATABASE IF NOT EXISTS bus_fleet_db;
CREATE DATABASE IF NOT EXISTS bus_booking_db;
CREATE DATABASE IF NOT EXISTS bus_payment_db;
