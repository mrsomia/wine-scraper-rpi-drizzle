CREATE TABLE items (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);

CREATE TABLE links (
	`id` integer PRIMARY KEY NOT NULL,
	`store_name` text NOT NULL,
	`link` text NOT NULL,
	`item_id` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES items(`id`)
);

CREATE TABLE prices (
	`id` integer PRIMARY KEY NOT NULL,
	`price` integer NOT NULL,
	`store_name` text NOT NULL,
	`date` integer NOT NULL,
	`item_id` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES items(`id`)
);
