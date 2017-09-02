show databases;
use ediss;
show tables;
select * from products limit 50;
SELECT asin,productName FROM products WHERE (productName like "%%" or productDescription like "%%") and groups like "%books%";
select * from users;

CREATE TABLE products (
    asin varchar(255) NOT NULL,
    productName varchar(4000),
	   productDescription varchar(4000),
	   groups varchar(2000),
       UNIQUE (asin)
);

delete from products;

select * from purchaseHistory;
insert into purchaseHistory values ('jadmin','976','79'),('jadmin','353','242');

delete from users;


insert into users (fname,lname,username,password,is_admin) values ('Jenny','Admin','jadmin','admin','Yes');
insert into users values ('Jocelyn','Davidson','403-435 Dui. Rd.','Dublin','Leinster','30992','lobortis@nunc.net','PJD13KJB6QO','TDT12VLB3JUPSV','No');
select count(*) from users;

desc users;
desc products;
desc orderdetails;
select count(*) from products;

drop table products;

create table orderDetails (orderID bigint not null auto_increment ,user varchar(100), purchaseTime varchar(1000), primary key (orderID));
desc orderDetails;

delete from orderDetails;
select * from orderDetails;


create table purchaseHistory (user varchar(100), asin varchar(500), orderID bigint);
desc purchaseHistory;



SELECT asin as quantity from (select asin from purchaseHistory where orderID in (select DISTINCT orderID from purchaseHistory where asin="678") and asin!="678") as temp group by asin order by count(asin) desc limit 5;
select b.productName as pname, count(a.asin) as quantity from purchaseHistory a, products b where a.user="jadmin" and a.asin=b.asin group by a.asin;

alter table purchaseHistory add foreign key (asin) references products(asin);


delete from purchaseHistory;
select * from purchaseHistory;
delete from orderDetails;
select * from orderDetails;
delete from users;
insert into users (fname,lname,username,password,is_admin) values ('Jenny','Admin','jadmin','admin','Yes');
select * from users;


