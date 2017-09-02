
use project2_db;

delete from users;
insert into users (fname,lname,username,password,is_admin) values ('Jenny','Admin','jadmin','admin','Yes');
select * from users;
select * from products limit 10;

desc users;
desc products;

CREATE TABLE `users` (
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `is_admin` enum('Yes','No') DEFAULT 'No',
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `orderDetails` (
  `orderID` bigint(20) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) DEFAULT NULL,
  `purchaseTime` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`orderID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `purchaseHistory` (
  `user` varchar(100) DEFAULT NULL,
  `asin` varchar(500) DEFAULT NULL,
  `orderID` bigint(20) DEFAULT NULL,
  KEY `asin` (`asin`),
  CONSTRAINT `purchaseHistory_ibfk_1` FOREIGN KEY (`asin`) REFERENCES `products` (`asin`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `products` (
  `asin` varchar(500) DEFAULT NULL,
  `productName` varchar(6000) DEFAULT NULL,
  `productDescription` varchar(6000) DEFAULT NULL,
  `groups` varchar(6000) DEFAULT NULL,
  UNIQUE KEY `asin` (`asin`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `products_read` (
  `asin` varchar(250) DEFAULT NULL,
  `productName` varchar(6000) DEFAULT]U7--=[F[F NULL,
  `productDescription` varchar(6000) DEFAULT NULL,
  `groups` varchar(6000) DEFAULT NULL,
  UNIQUE KEY `asin` (`asin`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

select count(*) from products_read;
delete from products_read where asin = "aishu101";

select count(*) from products;

alter table products modify asin varchar(500);
alter table products modify productName varchar(6000);
alter table products modify productDescription varchar(6000);
alter table products modify groups varchar(6000);

create table orderDetails (orderID bigint not null auto_increment ,user varchar(100), purchaseTime varchar(1000), primary key (orderID));
desc orderDetails;
select * from orderDetails;

show tables;
create table purchaseHistory (user varchar(100), asin varchar(500), orderID bigint);
desc purchaseHistory;
select * from purchaseHistory;
alter table purchaseHistory add foreign key (asin) references products(asin);

delete from products_read;

alter table products_read add FULLTEXT INDEX productIndex (productName, productDescription);

SELECT COUNT(*) FROM products_read WHERE MATCH(productName, productDescription) AGAINST ("%%") and groups LIKE "%%";
SELECT asin,productName FROM products_read WHERE (productName like "%bikini%" or productDescription like "%bikini%") and groups = "books";

SELECT asin,productName FROM products_read WHERE MATCH(productName, productDescription) AGAINST ('"The Secret Lives of Adult Stars"' IN BOOLEAN MODE) and groups like "%%";

delete from purchaseHistory;
select * from purchaseHistory;
delete from orderDetails;
select * from orderDetails;
delete from users;
insert into users (fname,lname,username,password,is_admin) values ('Jenny','Admin','jadmin','admin','Yes');
select * from users;

