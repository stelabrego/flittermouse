CREATE TABLE `relationship_enum`(`title` varchar(255) UNIQUE);
CREATE TABLE `visibility_enum`(`title` varchar(255) UNIQUE);

CREATE TABLE `user`
(
`display_name` varchar(255) UNIQUE NOT NULL,
`email` varchar(255) UNIQUE,
`username` varchar(255) UNIQUE NOT NULL,
`password` varchar(255) UNIQUE NOT NULL,
`phone_number` varchar(255),
`address` varchar(255),
`created_at` datetime NOT NULL,
`avatar_url` varchar(255),
`bio` varchar(255)
);

CREATE TABLE `user_privacy`
(
  `user_id` int NOT NULL,
  `subscribed_events_visiblity` varchar(255) NOT NULL,
  `address_visibility` varchar(255) NOT NULL,
  `name_visibility` varchar(255) NOT NULL,
  `email_visibility` varchar(255) NOT NULL,
  `phone_number_visibility` varchar(255) NOT NULL,
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
  `relationship` varchar(255),
  FOREIGN KEY (`initating_user`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`target_user`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`relationship`) REFERENCES `relationship_enum` (`title`)
);

CREATE TABLE `event`
(
  `user_id` int,
  `created_at` datetime NOT NULL,
  `date_of` datetime NOT NULL,
  `address` varchar(255) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `event_picture`
(
  `event_id` int,
  `url` varchar(255) NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `event_privacy`
(
  `event_id` int,
  `display_address` datetime,
  `display_date` datetime,
  `visibility` varchar(255),
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`visibility`) REFERENCES `visibility_enum` (`title`)
);

CREATE TABLE `attendance`
(
  `event_id` int,
  `user_id` int,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `event_question`
(
  `event_id` int,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL DEFAULT '',
  `visible` boolean NOT NULL DEFAULT false,
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `event_tag`
(
  `event_id` int,
  `tag_name` varchar(255),
  FOREIGN KEY (`event_id`) REFERENCES `event` (`ROWID`)
);

INSERT INTO visibility_enum (title) VALUES ('public'), ('trusted'), ('private');
INSERT INTO relationship_enum (title) VALUES ('trust'), ('block');