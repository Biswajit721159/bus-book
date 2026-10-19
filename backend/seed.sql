-- ==============================================================================
-- Seed Data for Bus Booking Platform (bus_fleet_db)
-- ==============================================================================

USE bus_fleet_db;

-- 1. Insert sample verified buses
INSERT INTO bus (id, bus_name, total_seat, status, is_active, average_rating, total_rating_sum, total_reviews_count, created_by, created_at, updated_at) VALUES
(1, 'GreenLine Volvo Multi-Axle', 40, 'APPROVED', 1, 4.8, 480, 100, 1, NOW(), NOW()),
(2, 'Royal Cruiser Scania AC', 36, 'APPROVED', 1, 4.6, 230, 50, 1, NOW(), NOW()),
(3, 'Himachal Express Volvo 9600', 42, 'APPROVED', 1, 4.9, 490, 100, 1, NOW(), NOW()),
(4, 'KSRTC FlyBus AC Sleeper', 32, 'APPROVED', 1, 4.7, 376, 80, 1, NOW(), NOW()),
(5, 'IntrCity SmartBus Premium', 36, 'APPROVED', 1, 4.5, 450, 100, 1, NOW(), NOW()),
(6, 'Shivneri Volvo AC', 40, 'APPROVED', 1, 4.8, 576, 120, 1, NOW(), NOW()),
(7, 'Garuda Plus Volvo Multi-Axle', 40, 'APPROVED', 1, 4.7, 470, 100, 1, NOW(), NOW()),
(8, 'SRS Travels Scania AC Sleeper', 36, 'APPROVED', 1, 4.6, 230, 50, 1, NOW(), NOW()),
(9, 'Zingbus Electric Superfast Express', 42, 'APPROVED', 1, 4.9, 490, 100, 1, NOW(), NOW()),
(10, 'Parveen Travels Mercedes Benz Glider', 32, 'APPROVED', 1, 4.8, 384, 80, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. Insert intermediate route stations
-- Bus 1: Kolkata -> Malda -> Siliguri
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(1, 'Kolkata', 1, '20:00:00', 0, NOW(), NOW()),
(1, 'Malda', 2, '02:30:00', 330, NOW(), NOW()),
(1, 'Siliguri', 3, '07:30:00', 250, NOW(), NOW());

-- Bus 2: Kolkata -> Durgapur -> Asansol -> Dhanbad
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(2, 'Kolkata', 1, '06:00:00', 0, NOW(), NOW()),
(2, 'Durgapur', 2, '09:00:00', 170, NOW(), NOW()),
(2, 'Asansol', 3, '10:00:00', 40, NOW(), NOW()),
(2, 'Dhanbad', 4, '11:30:00', 65, NOW(), NOW());

-- Bus 3: Delhi -> Chandigarh -> Kullu -> Manali
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(3, 'Delhi', 1, '18:00:00', 0, NOW(), NOW()),
(3, 'Chandigarh', 2, '22:30:00', 245, NOW(), NOW()),
(3, 'Kullu', 3, '06:00:00', 230, NOW(), NOW()),
(3, 'Manali', 4, '07:45:00', 40, NOW(), NOW());

-- Bus 4: Bangalore -> Hosur -> Salem -> Coimbatore
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(4, 'Bangalore', 1, '21:30:00', 0, NOW(), NOW()),
(4, 'Hosur', 2, '22:45:00', 40, NOW(), NOW()),
(4, 'Salem', 3, '02:15:00', 160, NOW(), NOW()),
(4, 'Coimbatore', 4, '06:00:00', 170, NOW(), NOW());

-- Bus 5: Bangalore -> Tumkur -> Hubli -> Goa
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(5, 'Bangalore', 1, '19:00:00', 0, NOW(), NOW()),
(5, 'Tumkur', 2, '20:15:00', 70, NOW(), NOW()),
(5, 'Hubli', 3, '01:30:00', 340, NOW(), NOW()),
(5, 'Goa', 4, '06:15:00', 180, NOW(), NOW());

-- Bus 6: Mumbai -> Navi Mumbai -> Lonavala -> Pune
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(6, 'Mumbai', 1, '07:00:00', 0, NOW(), NOW()),
(6, 'Navi Mumbai', 2, '08:00:00', 30, NOW(), NOW()),
(6, 'Lonavala', 3, '09:30:00', 65, NOW(), NOW()),
(6, 'Pune', 4, '11:00:00', 65, NOW(), NOW());

-- Bus 7: Hyderabad -> Suryapet -> Vijayawada
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(7, 'Hyderabad', 1, '22:00:00', 0, NOW(), NOW()),
(7, 'Suryapet', 2, '00:30:00', 135, NOW(), NOW()),
(7, 'Vijayawada', 3, '03:15:00', 140, NOW(), NOW());

-- Bus 8: Bangalore -> Hosur -> Vellore -> Chennai
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(8, 'Bangalore', 1, '23:00:00', 0, NOW(), NOW()),
(8, 'Hosur', 2, '23:50:00', 40, NOW(), NOW()),
(8, 'Vellore', 3, '02:45:00', 170, NOW(), NOW()),
(8, 'Chennai', 4, '05:30:00', 140, NOW(), NOW());

-- Bus 9: Delhi -> Gurgaon -> Neemrana -> Jaipur
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(9, 'Delhi', 1, '06:00:00', 0, NOW(), NOW()),
(9, 'Gurgaon', 2, '07:00:00', 30, NOW(), NOW()),
(9, 'Neemrana', 3, '09:00:00', 100, NOW(), NOW()),
(9, 'Jaipur', 4, '11:45:00', 150, NOW(), NOW());

-- Bus 10: Chennai -> Villupuram -> Trichy -> Madurai
INSERT INTO stations (bus_id, station_name, station_order, arrival_time, distance_from_last_station, created_at, updated_at) VALUES
(10, 'Chennai', 1, '20:30:00', 0, NOW(), NOW()),
(10, 'Villupuram', 2, '23:00:00', 160, NOW(), NOW()),
(10, 'Trichy', 3, '02:30:00', 165, NOW(), NOW()),
(10, 'Madurai', 4, '05:45:00', 135, NOW(), NOW());
