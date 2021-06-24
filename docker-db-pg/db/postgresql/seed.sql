INSERT INTO Users (u_id, u_login, u_name, u_lastname, u_password) VALUES (1, N'Admin', N'Administrator', N'Savewise', N'1000.tFjxDTifW2QcDJ8KFcLDsA==.7R02lxNENThOfCZRR7ldJXGZZW6Pby/I3siB1XdepCc=');
ALTER TABLE Users ALTER COLUMN u_id RESTART WITH 2;

INSERT INTO CategoryTypes (ct_id, ct_name) VALUES (1, 'Incomes');
INSERT INTO CategoryTypes (ct_id, ct_name) VALUES (2, 'Expenses');
INSERT INTO CategoryTypes (ct_id, ct_name) VALUES (3, 'Vaults Incomes');
INSERT INTO CategoryTypes (ct_id, ct_name) VALUES (4, 'Vaults Expenses');
ALTER TABLE CategoryTypes ALTER COLUMN ct_id RESTART WITH 5;