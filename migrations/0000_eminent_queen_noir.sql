CREATE TABLE items (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);

CREATE TABLE links (
	`id` integer PRIMARY KEY NOT NULL,
	`store_name` text NOT NULL,
	`link` text NOT NULL,
	`item_id` integer,
	FOREIGN KEY (`item_id`) REFERENCES items(`id`)
);

CREATE TABLE prices (
	`id` integer PRIMARY KEY NOT NULL,
	`price` integer NOT NULL,
	`store_name` text,
	`date` integer,
	`item_id` integer,
	FOREIGN KEY (`store_name`) REFERENCES links(`store_name`)
);
