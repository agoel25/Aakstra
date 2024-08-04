DROP TABLE Customer CASCADE CONSTRAINTS;
DROP TABLE Project CASCADE CONSTRAINTS;
DROP TABLE PartOf CASCADE CONSTRAINTS;
DROP TABLE AddressInfo CASCADE CONSTRAINTS;
DROP TABLE BillingInfo CASCADE CONSTRAINTS;
DROP TABLE PaymentInfo CASCADE CONSTRAINTS;
DROP TABLE ServiceType CASCADE CONSTRAINTS;
DROP TABLE ServiceDetails CASCADE CONSTRAINTS;
DROP TABLE CustomerUsesService CASCADE CONSTRAINTS;
DROP TABLE ProjectUsesService CASCADE CONSTRAINTS;
DROP TABLE Storage CASCADE CONSTRAINTS;
DROP TABLE Compute CASCADE CONSTRAINTS;
DROP TABLE Functional CASCADE CONSTRAINTS;
DROP TABLE Region CASCADE CONSTRAINTS;
DROP TABLE AvailableIn CASCADE CONSTRAINTS;
DROP TABLE ProjectSecurity CASCADE CONSTRAINTS;
DROP TABLE SecurityProtocol CASCADE CONSTRAINTS;
DROP TABLE SecurityInfo CASCADE CONSTRAINTS;
DROP TABLE ServerTypeInfo CASCADE CONSTRAINTS;
DROP TABLE ServerInfo CASCADE CONSTRAINTS;
DROP TABLE Instance CASCADE CONSTRAINTS;
DROP TABLE Bills CASCADE CONSTRAINTS;

CREATE TABLE Customer (
Email VARCHAR(30) PRIMARY KEY,
Name VARCHAR(30) NOT NULL,
PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
Password VARCHAR(30) NOT NULL,
Address VARCHAR(50) NOT NULL
);

CREATE TABLE Project (
ProjectID INTEGER PRIMARY KEY,
Name VARCHAR(30),
Description VARCHAR(100),
CreationDate DATE NOT NULL,
Status VARCHAR(20),
PartnerEmail VARCHAR(30));

CREATE TABLE PartOf (
Email VARCHAR(30),
ProjectID INTEGER,
PRIMARY KEY (Email, ProjectID),
FOREIGN KEY (Email) REFERENCES Customer(Email),
FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID) ON DELETE CASCADE
);

CREATE TABLE AddressInfo (
PostalCode VARCHAR(15) PRIMARY KEY,
City VARCHAR(20) NOT NULL,
Country VARCHAR(20) NOT NULL
);

CREATE TABLE BillingInfo (
CardNumber CHAR(16) PRIMARY KEY,
PaymentType VARCHAR(6) NOT NULL
);

CREATE TABLE PaymentInfo (
CardNumber CHAR(16),
Email VARCHAR(30),
CVV INTEGER NOT NULL,
PostalCode VARCHAR(15) NOT NULL,
ExpiryDate DATE NOT NULL,
IsDefault VARCHAR(5),
PRIMARY KEY (CardNumber, Email),
FOREIGN KEY (Email) REFERENCES Customer(Email) ON DELETE CASCADE,
FOREIGN KEY (CardNumber) REFERENCES BillingInfo(CardNumber) ON DELETE CASCADE,
FOREIGN KEY (PostalCode) REFERENCES AddressInfo(PostalCode) ON DELETE CASCADE
);

CREATE TABLE ServiceType (
Type VARCHAR(20) PRIMARY KEY,
CostType VARCHAR(20) NOT NULL
);

CREATE TABLE ServiceDetails (
Name VARCHAR(30) PRIMARY KEY,
Type VARCHAR(20) NOT NULL,
Description VARCHAR(100) NOT NULL,
Status VARCHAR(20),
CostPerUnit INTEGER NOT NULL,
FOREIGN KEY (Type) REFERENCES ServiceType(Type)
);

CREATE TABLE CustomerUsesService (
Email VARCHAR(30),
Name VARCHAR(30),
PRIMARY KEY (Email, Name),
FOREIGN KEY (Email) REFERENCES Customer(Email) ON DELETE CASCADE,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE
);

CREATE TABLE ProjectUsesService (
ProjectID INTEGER,
Name VARCHAR(30),
PRIMARY KEY (ProjectID, Name),
FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID) ON DELETE CASCADE,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE
);

CREATE TABLE Storage (
Name VARCHAR(30) PRIMARY KEY,
Capacity INTEGER,
Latency INTEGER,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE
);

CREATE TABLE Compute (
Name VARCHAR(30) PRIMARY KEY,
CPUCores INTEGER,
MaxMemory INTEGER,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE
);

CREATE TABLE Functional (
Name VARCHAR(30) PRIMARY KEY,
Timeout INTEGER,
ConcurrencyLimit INTEGER,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE
);

CREATE TABLE Region (
Name VARCHAR(30) PRIMARY KEY,
Location VARCHAR(20) NOT NULL,
Capacity INTEGER,
Status VARCHAR(20)
);

CREATE TABLE AvailableIn (
ServiceName VARCHAR(30),
RegionName VARCHAR(30),
PRIMARY KEY (ServiceName, RegionName),
FOREIGN KEY (ServiceName) REFERENCES ServiceDetails(Name) ON DELETE CASCADE,
FOREIGN KEY (RegionName) REFERENCES Region(Name) ON DELETE CASCADE
);

CREATE TABLE ProjectSecurity (
ProjectID INTEGER PRIMARY KEY,
SecurityGroupID INTEGER UNIQUE NOT NULL,
FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID) ON DELETE CASCADE
);

CREATE TABLE SecurityProtocol (
InboundProtocol VARCHAR(20) PRIMARY KEY,
OutboundProtocol VARCHAR(20)
);

CREATE TABLE SecurityInfo (
ProjectID INTEGER PRIMARY KEY,
Name VARCHAR(50),
InboundProtocol VARCHAR(20),
CreationDate DATE,
FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID) ON DELETE CASCADE,
FOREIGN KEY (InboundProtocol) REFERENCES SecurityProtocol(InboundProtocol)
);

CREATE TABLE ServerTypeInfo (
ServerType VARCHAR(30) PRIMARY KEY,
Memory INTEGER,
Storage INTEGER,
OS VARCHAR(20),
CPUCores INTEGER
);

CREATE TABLE ServerInfo (
ServerID INTEGER PRIMARY KEY,
Name VARCHAR(30),
ServerType VARCHAR(30),
Status VARCHAR(20),
Uptime INTEGER,
CreatedAt DATE,
UpdatedAt DATE,
FOREIGN KEY (Name) REFERENCES Region(Name) ON DELETE CASCADE,
FOREIGN KEY (ServerType) REFERENCES ServerTypeInfo(ServerType) ON DELETE CASCADE
);

CREATE TABLE Instance (
InstanceID INTEGER PRIMARY KEY,
Name VARCHAR(30) NOT NULL,
ServerID INTEGER NOT NULL,
ProjectID INTEGER,
Type VARCHAR(20),
TotalCost INTEGER,
Status VARCHAR(20),
LaunchDate DATE,
StopDate DATE,
FOREIGN KEY (Name) REFERENCES ServiceDetails(Name) ON DELETE CASCADE,
FOREIGN KEY (ServerID) REFERENCES ServerInfo(ServerID) ON DELETE CASCADE,
FOREIGN KEY (ProjectID) REFERENCES ProjectSecurity(ProjectID) ON DELETE SET NULL
);

CREATE TABLE Bills (
InstanceID INTEGER,
Email VARCHAR(30),
CardNumber CHAR(16),
Cost INTEGER,
PRIMARY KEY (InstanceID, Email, CardNumber),
FOREIGN KEY (InstanceID) REFERENCES Instance(InstanceID),
FOREIGN KEY (CardNumber, Email) REFERENCES PaymentInfo(CardNumber, Email),
FOREIGN KEY (CardNumber) REFERENCES BillingInfo(CardNumber)
);

INSERT INTO Customer (Email, Name, PhoneNumber, Password, Address)
VALUES ('john.doe@dummy.com', 'John Doe', '1234567890', 'password', '9090 main st, Vancouver');
INSERT INTO Customer (Email, Name, PhoneNumber, Password, Address)
VALUES ('james.w@dummy.com', 'James Welch', '2345678901', 'security1', '212 oak st, Tokyo');
INSERT INTO Customer (Email, Name, PhoneNumber, Password, Address)
VALUES ('arjund122@dummy.com', 'Arjun Div', '3456789012', '12345pass', '1009 nh 29, New Delhi');
INSERT INTO Customer (Email, Name, PhoneNumber, Password, Address)
VALUES ('jin.park@dummy.com', 'Jin Park', '4567890123', 'password', 'Blue springs, Seoul');
INSERT INTO Customer (Email, Name, PhoneNumber, Password, Address)
VALUES ('jane.doe@dummy.com', 'Jane Doe', '5678901234', 'num123', '2100 Student Union, Vancouver');

INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (1, 'Migrate', 'Migrating app to cloud', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'james.w@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (2, 'Analytics', 'Cloud analytics', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'john.doe@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (3, 'OpsPipeline', 'Operations Pipeline', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'john.doe@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (4, 'ModelTraining', 'AI models on cloud GPU', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'john.doe@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (5, 'Store', 'Cloud storage', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'john.doe@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (6, 'Optimization', 'Optimizing all workflows', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'james.w@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (7, 'DevOps', 'Creating DevOps workflows', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'james.w@dummy.com');
INSERT INTO Project (ProjectID, Name, Description, CreationDate, Status, PartnerEmail)
VALUES (8, 'Networking', 'Creating a cloud network', TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Active', 'james.w@dummy.com');


INSERT INTO PartOf(Email, ProjectID) VALUES ('john.doe@dummy.com', 1);
INSERT INTO PartOf(Email, ProjectID) VALUES ('james.w@dummy.com', 2);
INSERT INTO PartOf(Email, ProjectID) VALUES ('arjund122@dummy.com', 3);
INSERT INTO PartOf(Email, ProjectID) VALUES ('jin.park@dummy.com', 4);
INSERT INTO PartOf(Email, ProjectID) VALUES ('jane.doe@dummy.com', 5);
INSERT INTO PartOf(Email, ProjectID) VALUES ('john.doe@dummy.com', 6);
INSERT INTO PartOf(Email, ProjectID) VALUES ('john.doe@dummy.com', 7);
INSERT INTO PartOf(Email, ProjectID) VALUES ('john.doe@dummy.com', 8);
INSERT INTO PartOf(Email, ProjectID) VALUES ('james.w@dummy.com', 6);
INSERT INTO PartOf(Email, ProjectID) VALUES ('james.w@dummy.com', 7);
INSERT INTO PartOf(Email, ProjectID) VALUES ('james.w@dummy.com', 8);

INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('4536123465366009', 'Credit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('7878932100108375', 'Credit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('2233600070708181', 'Credit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('2378001083456789', 'Credit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('0101999963531010', 'Credit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('1763867695430090', 'Debit');
INSERT INTO BillingInfo(CardNumber, PaymentType)
VALUES ('0065142595430090', 'Debit');

INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('V6T1Z2', 'Vancouver', 'Canada');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('135-0016', 'Tokyo', 'Japan');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('110001', 'New Delhi', 'India');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('01014', 'Seoul', 'South Korea');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('89116', 'Las Vegas', 'United States');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('145-0654', 'Kyoto', 'Japan');
INSERT INTO AddressInfo(PostalCode, City, Country)
VALUES ('1205', 'Geneva', 'Switzerland');

INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('4536123465366009', 'john.doe@dummy.com', 001, 'V6T1Z2', TO_DATE('2024-12-01', 'YYYY-MM-DD'), 'TRUE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('7878932100108375', 'james.w@dummy.com', 900, '135-0016', TO_DATE('2025-12-01', 'YYYY-MM-DD'), 'TRUE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('2233600070708181', 'arjund122@dummy.com', 500, '110001', TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'TRUE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('2378001083456789', 'jin.park@dummy.com', 400, '01014', TO_DATE('2026-06-30', 'YYYY-MM-DD'), 'TRUE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('0101999963531010', 'jane.doe@dummy.com', 249, '89116', TO_DATE('2025-05-25', 'YYYY-MM-DD'), 'TRUE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('1763867695430090', 'john.doe@dummy.com', 234, '145-0654', TO_DATE('2029-06-01', 'YYYY-MM-DD'), 'FALSE');
INSERT INTO PaymentInfo(CardNumber, Email, CVV, PostalCode, ExpiryDate, IsDefault)
VALUES ('0065142595430090', 'john.doe@dummy.com', 982, '1205', TO_DATE('2027-03-03', 'YYYY-MM-DD'), 'FALSE');

INSERT INTO ServiceType(Type, CostType)
VALUES ('Serverless', 'PerJob');
INSERT INTO ServiceType(Type, CostType)
VALUES ('Authentication', 'PerUser');
INSERT INTO ServiceType(Type, CostType)
VALUES ('GPUCompute', 'PerDay');
INSERT INTO ServiceType(Type, CostType)
VALUES ('HPC', 'PerDay');
INSERT INTO ServiceType(Type, CostType)
VALUES ('Database', 'PerQuery');

INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('gamma', 'Serverless', 'Handling serverless functions', 'Active', 2);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('authIt', 'Authentication', 'Authentication with large capacity', 'Active', 2);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('GPUb', 'GPUCompute', 'GPU-based rendering service', 'Active', 10);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('RapidX', 'HPC', 'High performance computing service', 'Active', 3);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('cSQL', 'Database', 'Cloud SQL database service', 'Active', 3);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('dSQL', 'Database', 'Dynamic SQL', 'Active', 1);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('veryFy', 'Authentication', 'Faster authentication', 'Active', 3);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('gigaGPU', 'GPUCompute', 'GPU-based gaming', 'Active', 10);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('mlGPU', 'GPUCompute', 'GPU-based ML training', 'Active', 9);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('aSQL', 'Database', 'Agile SQL', 'Active', 1);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('bSQL', 'Database', 'Broadcom SQL', 'Active', 1);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('eSQL', 'Database', 'Eth SQL', 'Active', 1);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('RapidZ', 'HPC', 'Better High performance computing service', 'Active', 3);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('beta', 'Serverless', 'Handling serverless functions slower', 'Active', 2);
INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)
VALUES ('veryFyIt', 'Authentication', 'Even faster authentication', 'Active', 3);

INSERT INTO CustomerUsesService (Email, Name) VALUES ('john.doe@dummy.com', 'gamma');
INSERT INTO CustomerUsesService (Email, Name) VALUES ('john.doe@dummy.com', 'authIt');
INSERT INTO CustomerUsesService (Email, Name) VALUES ('james.w@dummy.com', 'authIt');
INSERT INTO CustomerUsesService (Email, Name) VALUES ('arjund122@dummy.com', 'GPUb');
INSERT INTO CustomerUsesService (Email, Name) VALUES ('jin.park@dummy.com', 'RapidX');
INSERT INTO CustomerUsesService (Email, Name) VALUES ('jane.doe@dummy.com', 'cSQL');

INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'gamma');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'authIt');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'GPUb');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'cSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'dSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'veryFy');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'gigaGPU');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'mlGPU');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'aSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'bSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'eSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'RapidZ');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'beta');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (1, 'veryFyIt');

INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (2, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (3, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (4, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (5, 'RapidX');

INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'gamma');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'authIt');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'GPUb');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'cSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'dSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'veryFy');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'gigaGPU');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'mlGPU');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'aSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'bSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'eSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'RapidZ');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'beta');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (6, 'veryFyIt');

INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'gamma');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'authIt');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'GPUb');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'RapidX');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'cSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'dSQL');
INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (7, 'mlGPU');

INSERT INTO ProjectUsesService(ProjectID, Name) VALUES (8, 'RapidX');

INSERT INTO Storage(Name, Capacity, Latency) VALUES ('cSQL', 300, 7);
INSERT INTO Storage(Name, Capacity, Latency) VALUES ('dSQL', 200, 9);
INSERT INTO Storage(Name, Capacity, Latency) VALUES ('aSQL', 100, 7);
INSERT INTO Storage(Name, Capacity, Latency) VALUES ('bSQL', 200, 7);
INSERT INTO Storage(Name, Capacity, Latency) VALUES ('eSQL', 500, 7);

INSERT INTO Compute(Name, CPUCores, MaxMemory) VALUES ('GPUb', 32, 128);
INSERT INTO Compute(Name, CPUCores, MaxMemory) VALUES ('gigaGPU', 8, 128);
INSERT INTO Compute(Name, CPUCores, MaxMemory) VALUES ('mlGPU', 32, 1024);
INSERT INTO Compute(Name, CPUCores, MaxMemory) VALUES ('RapidX', 16, 64);
INSERT INTO Compute(Name, CPUCores, MaxMemory) VALUES ('RapidZ', 16, 64);

INSERT INTO Functional(Name, Timeout, ConcurrencyLimit) VALUES ('gamma', 300, 10);
INSERT INTO Functional(Name, Timeout, ConcurrencyLimit) VALUES ('authIt', 200, 20);
INSERT INTO Functional(Name, Timeout, ConcurrencyLimit) VALUES ('veryFy', 200, 40);
INSERT INTO Functional(Name, Timeout, ConcurrencyLimit) VALUES ('veryFyIt', 200, 40);
INSERT INTO Functional(Name, Timeout, ConcurrencyLimit) VALUES ('beta', 200, 70);

INSERT INTO Region(Name, Location, Capacity, Status)
VALUES ('us-east-1', 'Virginia', 500, 'Active');
INSERT INTO Region(Name, Location, Capacity, Status)
VALUES ('us-east-2', 'Oregon', 500, 'Active');
INSERT INTO Region(Name, Location, Capacity, Status)
VALUES ('eu-central-1', 'Frankfurt', 300, 'Active');
INSERT INTO Region(Name, Location, Capacity, Status)
VALUES ('eu-west-1', 'Ireland', 300, 'Active');
INSERT INTO Region(Name, Location, Capacity, Status)
VALUES ('sa-east-1', 'Caracas', 200, 'Active');

INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('gamma', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('authIt', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('GPUb', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('RapidX', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('cSQL', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('dSQL', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('veryFy', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('gigaGPU', 'us-east-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('mlGPU', 'us-east-1');

INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('authIt', 'us-east-2');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('GPUb', 'eu-central-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('RapidX', 'eu-west-1');
INSERT INTO AvailableIn(ServiceName, RegionName)
VALUES ('cSQL', 'sa-east-1');

INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('HTTP', 'TCP');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('HTTPS', 'UDP');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('FTP', 'SNMP');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('SMTP', 'DNS');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('IMAP', 'TLS');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('SSH', 'SSL');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('SFTP', 'FTP');
INSERT INTO SecurityProtocol(InboundProtocol, OutboundProtocol) VALUES ('ICMP', 'TCP');

INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (1, 'HyperText Transfer Protocol', 'HTTP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (2, 'HyperText Transfer Protocol Secure', 'HTTPS', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (3, 'File Transfer Protocol', 'FTP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (4, 'Simple Mail Transfer Protocol', 'SMTP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (5, 'Internet Message Access Protocol', 'IMAP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (6, 'Secure Shell', 'SSH', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (7, 'Secure File Transfer Protocol', 'SFTP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));
INSERT INTO SecurityInfo(ProjectID, Name, InboundProtocol, CreationDate)
VALUES (8, 'Internet Control Message Protocol', 'ICMP', TO_DATE('2024-07-21', 'YYYY-MM-DD'));

INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (1, 1);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (2, 2);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (3, 3);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (4, 4);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (5, 5);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (6, 6);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (7, 7);
INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID) VALUES (8, 8);

INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)
VALUES ('functional.micro', 1, 8, 'Linux', 1);
INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)
VALUES ('functional.large', 8, 32, 'Linux', 4);
INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)
VALUES ('compute.large', 8, 64, 'Linux', 16);
INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)
VALUES ('compute.xlarge', 16, 128, 'Linux', 32);
INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)
VALUES ('storage.large', 32, 1024, 'Windows', 8);

INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)
VALUES (101, 'us-east-1', 'functional.micro', 'Active', 1000, TO_DATE('2024-01-04', 'YYYY-MM-DD'), TO_DATE('2024-07-15', 'YYYY-MM-DD'));
INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)
VALUES (102, 'us-east-2', 'functional.large', 'Active', 800, TO_DATE('2024-01-05', 'YYYY-MM-DD'), TO_DATE('2024-07-16', 'YYYY-MM-DD'));
INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)
VALUES (103, 'eu-central-1', 'compute.large', 'Active', 600, TO_DATE('2024-02-01', 'YYYY-MM-DD'), TO_DATE('2024-07-16', 'YYYY-MM-DD'));
INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)
VALUES (104, 'eu-west-1', 'compute.xlarge', 'Active', 1200, TO_DATE('2024-07-11', 'YYYY-MM-DD'), TO_DATE('2024-07-16', 'YYYY-MM-DD'));
INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)
VALUES (105, 'sa-east-1', 'storage.large', 'Inactive', 300, TO_DATE('2024-07-16', 'YYYY-MM-DD'), TO_DATE('2024-07-16', 'YYYY-MM-DD'));

INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (1, 'gamma', 101, 1, 'micro', 100, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (2, 'authIt', 102, 2, 'large', 140, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (3, 'GPUb', 103, 3, 'large', 140, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (4, 'RapidX', 104, 4, 'xlarge', 200, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (5, 'cSQL', 105, 2, 'large', 130, 'Running', TO_DATE('2024-07-16', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (15, 'cSQL', 105, 2, 'xlarge', 130, 'Running', TO_DATE('2024-07-16', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (16, 'cSQL', 105, 2, 'xlarge', 170, 'Running', TO_DATE('2024-07-16', 'YYYY-MM-DD'), NULL);

INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (6, 'gamma', 101, 1, 'micro', 100, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (7, 'gamma', 101, 1, 'micro', 90, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (8, 'gamma', 101, 1, 'large', 120, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (9, 'gamma', 101, 1, 'large', 130, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (10, 'gamma', 101, 1, 'large', 120, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (11, 'gamma', 101, 1, 'xlarge', 180, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (12, 'gamma', 101, 1, 'xlarge', 170, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (13, 'gamma', 101, 1, 'xlarge', 200, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);
INSERT INTO Instance(InstanceID, Name, ServerID, ProjectID, Type, TotalCost, Status, LaunchDate, StopDate)
VALUES (14, 'gamma', 101, 1, 'medium', 110, 'Running', TO_DATE('2024-07-20', 'YYYY-MM-DD'), NULL);

INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (1, 'john.doe@dummy.com', '4536123465366009', 500);
INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (2, 'james.w@dummy.com', '7878932100108375', 244);
INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (3, 'arjund122@dummy.com', '2233600070708181', 306);
INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (4, 'jin.park@dummy.com', '2378001083456789', 123);
INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (5, 'jane.doe@dummy.com', '0101999963531010', 890);
INSERT INTO Bills(InstanceID, Email, CardNumber, Cost)
VALUES (6, 'john.doe@dummy.com', '4536123465366009', 400);

COMMIT;