use factory;

drop table if exists parts_ordered;
drop table if exists orders;
drop table if exists people;
drop table if exists parts;
drop table if exists categories;

create table categories (
  id integer not null auto_increment,
  name varchar(100) character set utf8 not null unique comment 'category name',
  primary key (id)
);

create table parts (
  id integer not null auto_increment,
  category_id integer not null,
  part_number varchar(50) character set utf8 not null unique,
  stock_count integer signed not null default 0,
  cost decimal(15,2) unsigned not null,
  retail_price decimal(15,2) unsigned not null,
  original_part_number varchar(50) character set utf8 default null comment 'if part_number is changed to ensure uniqueness, the original part number is stored here.',
  description text character set utf8 default null,
  primary key (id),
  foreign key (category_id) references categories(id)
);

create table people (
  id integer not null auto_increment,
  name varchar(100) character set utf8 not null unique,
  street varchar(100) character set utf8,
  city varchar(50) character set utf8,
  zip varchar(10) character set utf8,
  state_or_province varchar(40) character set utf8,
  phone varchar(30) character set utf8,
  email varchar(100) character set utf8 not null unique,
  primary key (id)
);

create table orders (
  id integer not null auto_increment,
  customer_id integer not null,
  order_number varchar(50) character set utf8 not null unique,
  date_ordered datetime not null default now(),
  primary key (id),
  foreign key (customer_id) references people(id)
);

create table parts_ordered (
  part_id integer not null,
  order_id integer not null,
  quantity integer unsigned not null default '0',
  primary key(part_id, order_id),
  foreign key(part_id) references parts(id),
  foreign key(order_id) references orders(id) on delete cascade
);
