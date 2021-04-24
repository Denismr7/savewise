INSERT INTO Categories (c_id, c_name, c_user_id, c_category_type_id) VALUES (1, N'Payroll', 1, 1);
INSERT INTO Categories (c_id, c_name, c_user_id, c_category_type_id) VALUES (2, N'Rent', 1, 2);
ALTER TABLE Categories ALTER COLUMN c_id RESTART WITH 3;