-- delete all tables. start from scratch
DROP TABLE IF EXISTS relationship_enum;
DROP TABLE IF EXISTS visibility_enum;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS user_privacy;
DROP TABLE IF EXISTS user_relationship;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS event_picture;
DROP TABLE IF EXISTS event_privacy;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS event_question;
DROP TABLE IF EXISTS event_tag;

-- turn on foreign key checks
PRAGMA foreign_keys = ON;

-- NOTE: we need to create our own primary key because you have to explicitly declare it in
-- in order to reference it with a foreign key in another table
CREATE TABLE `user`
(
`username` varchar(255) UNIQUE NOT NULL,
`email` varchar(255) UNIQUE NOT NULL,
`password` varchar(255) NOT NULL,
`key` varchar(8) UNIQUE NOT NULL,
`display_name` varchar(255),
`phone_number` varchar(255),
`address` varchar(255),
`avatar_url` varchar(255),
`bio` varchar(255),
`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`rowid` INTEGER PRIMARY KEY
);

CREATE TABLE `user_privacy`
(
  `user_id` int NOT NULL,
  `subscribed_events_visiblity` varchar(255) NOT NULL DEFAULT 'private',
  `address_visibility` varchar(255) NOT NULL DEFAULT 'private',
  `name_visibility` varchar(255) NOT NULL DEFAULT 'private',
  `email_visibility` varchar(255) NOT NULL  DEFAULT 'private',
  `phone_number_visibility` varchar(255) NOT NULL DEFAULT 'private',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`subscribed_events_visiblity`) REFERENCES `visibility_enum` (`title`),
  FOREIGN KEY (`address_visibility`) REFERENCES `visibility_enum` (`title`),
  FOREIGN KEY (`name_visibility`) REFERENCES `visibility_enum` (`title`),
  FOREIGN KEY (`email_visibility`) REFERENCES `visibility_enum` (`title`),
  FOREIGN KEY (`phone_number_visibility`) REFERENCES `visibility_enum` (`title`)
);

CREATE TABLE `user_relationship`
(
  `initating_user` int,
  `target_user` int,
  `relationship` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`initating_user`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`target_user`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`relationship`) REFERENCES `relationship_enum` (`title`)
);

CREATE TABLE `event`
(
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(8) UNIQUE NOT NULL,
  `date_of` datetime,
  `address` varchar(255),
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `event_picture`
(
  `event_id` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `event_privacy`
(
  `event_id` int NOT NULL,
  `display_address` datetime,
  `display_date` datetime,
  `visibility` varchar(255) NOT NULL DEFAULT 'private',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`visibility`) REFERENCES `visibility_enum` (`title`)
);

CREATE TABLE `attendance`
(
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `event_question`
(
  `event_id` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `visible` boolean NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `event_tag`
(
  `event_id` int NOT NULL,
  `tag_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

-- create enum tables
CREATE TABLE `relationship_enum`(`title` varchar(255) UNIQUE);
CREATE TABLE `visibility_enum`(`title` varchar(255) UNIQUE);
-- fill enum tables
INSERT INTO visibility_enum (title) VALUES ('public'), ('trusted'), ('private');
INSERT INTO relationship_enum (title) VALUES ('trust'), ('block');

-- DUMMY DATA
-- USERS
INSERT INTO user (username, email, password, key) VALUES ('stelabrego', 'stelabrego@icloud.com', 'password123', 'abcdefgh');
INSERT INTO user (username, email, password, key) VALUES ('bobishere', 'bob@gmail.com', 'password123', 'bcdefghi');
INSERT INTO user (username, email, password, key) VALUES ('indicasmoke', 'indicaabrego@gmail.com','password123', 'cdefghij');
-- EVENTS
INSERT INTO event (user_id, name, key) SELECT user.ROWID, 'Stel Bday Party', '12345678' FROM user WHERE user.username = 'stelabrego';
INSERT INTO event (user_id, name, key) SELECT user.ROWID, 'Solstice Party', '23456789' FROM user WHERE user.username = 'stelabrego';