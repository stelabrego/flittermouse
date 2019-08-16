-- DELETE ALL TABLES
-- start from scratch
DROP TABLE IF EXISTS relationshipEnum;
DROP TABLE IF EXISTS visibilityEnum;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS userPrivacy;
DROP TABLE IF EXISTS userRelationship;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS eventPicture;
DROP TABLE IF EXISTS eventPrivacy;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS eventQuestion;
DROP TABLE IF EXISTS eventTag;

-- TURN ON FOREIGN KEY CHECKS
PRAGMA foreignKeys = ON;

-- CREATE TABLES
-- NOTE: we need to create our own primary key because you have to explicitly declare it in
-- in order to reference it with a foreign key in another table
CREATE TABLE `user`
(
`username` varchar(255) UNIQUE NOT NULL,
`email` varchar(255) UNIQUE NOT NULL,
`password` varchar(255) NOT NULL,
`key` varchar(8) UNIQUE NOT NULL,
`displayName` varchar(255),
`phoneNumber` varchar(255),
`address` varchar(255),
`avatarUrl` varchar(255),
`bio` varchar(255),
`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`rowid` INTEGER PRIMARY KEY
);

CREATE TABLE `userPrivacy`
(
  `userID` int NOT NULL,
  `subscribedEventsVisiblity` varchar(255) NOT NULL DEFAULT 'private',
  `addressVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `nameVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `emailVisibility` varchar(255) NOT NULL  DEFAULT 'private',
  `phoneNumberVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userID`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`subscribedEventsVisiblity`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`addressVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`nameVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`emailVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`phoneNumberVisibility`) REFERENCES `visibilityEnum` (`title`)
);

CREATE TABLE `userRelationship`
(
  `initatingUser` int,
  `targetUser` int,
  `relationship` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`initatingUser`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`targetUser`) REFERENCES `user` (`ROWID`),
  FOREIGN KEY (`relationship`) REFERENCES `relationshipEnum` (`title`)
);

CREATE TABLE `event`
(
  `userID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(8) UNIQUE NOT NULL,
  `dateOf` datetime,
  `address` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userID`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `eventPicture`
(
  `eventID` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `eventPrivacy`
(
  `eventID` int NOT NULL,
  `displayAddress` datetime,
  `displayDate` datetime,
  `visibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`visibility`) REFERENCES `visibilityEnum` (`title`)
);

CREATE TABLE `attendance`
(
  `eventID` int NOT NULL,
  `userID` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ROWID`),
  FOREIGN KEY (`userID`) REFERENCES `user` (`ROWID`)
);

CREATE TABLE `eventQuestion`
(
  `eventID` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `visible` boolean NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ROWID`)
);

CREATE TABLE `eventTag`
(
  `eventID` int NOT NULL,
  `tagName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rowid` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ROWID`)
);

-- ENUM TABLES
CREATE TABLE `relationshipEnum`(`title` varchar(255) UNIQUE);
CREATE TABLE `visibilityEnum`(`title` varchar(255) UNIQUE);

-- FILL ENUM TABLES
INSERT INTO visibilityEnum (title) VALUES ('public'), ('trusted'), ('private');
INSERT INTO relationshipEnum (title) VALUES ('trust'), ('block');

-- FILL DATABASE WITH DUMMY DATA
-- USERS
INSERT INTO user (username, email, password, key) VALUES ('stelabrego', 'stelabrego@icloud.com', 'password123', 'abcdefgh');
INSERT INTO user (username, email, password, key) VALUES ('bobishere', 'bob@gmail.com', 'password123', 'bcdefghi');
INSERT INTO user (username, email, password, key) VALUES ('indicasmoke', 'indicaabrego@gmail.com','password123', 'cdefghij');
-- EVENTS
INSERT INTO event (userID, name, key) SELECT user.ROWID, 'Stel Bday Party', '12345678' FROM user WHERE user.username = 'stelabrego';
INSERT INTO event (userID, name, key) SELECT user.ROWID, 'Solstice Party', '23456789' FROM user WHERE user.username = 'stelabrego';