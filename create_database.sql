-- MAKE DATABASE WAY FASTER
-- PRAGMA schema.journal_mode = WAL;

-- TURN OFF FOREIGN KEY CHECKS TO DROP TABLES
PRAGMA foreign_keys = OFF;

-- DELETE ALL TABLES
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS userPrivacy;
DROP TABLE IF EXISTS userRelationship;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS eventImage;
DROP TABLE IF EXISTS eventPrivacy;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS eventQuestion;
DROP TABLE IF EXISTS eventTag;
DROP TABLE IF EXISTS relationshipEnum;
DROP TABLE IF EXISTS visibilityEnum;

-- TURN OFF FOREIGN KEY CHECKS TO DROP TABLES
PRAGMA foreign_keys = ON;

-- CREATE TABLES
-- NOTE: we need to create our own primary key because you have to explicitly declare it in
-- in order to reference it with a foreign key in another table
CREATE TABLE `user`
(
`username` varchar(255) UNIQUE NOT NULL,
`email` varchar(255) UNIQUE NOT NULL,
`password` varchar(255) NOT NULL,
`inviteKey` varchar(8) UNIQUE NOT NULL,
`displayName` varchar(255),
`phoneNumber` varchar(255),
`address` varchar(255),
`avatarUrl` varchar(255) DEFAULT 'https://res.cloudinary.com/deiup0tup/image/upload/v1566969522/generic-user_inzqg2.jpg',
`bio` varchar(255),
`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`id` INTEGER PRIMARY KEY
);

CREATE TABLE `userPrivacy`
(
  `userId` int NOT NULL UNIQUE,
  `subscribedEventsVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `addressVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `nameVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `emailVisibility` varchar(255) NOT NULL  DEFAULT 'private',
  `phoneNumberVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userId`) REFERENCES `user` (`Id`),
  FOREIGN KEY (`subscribedEventsVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`addressVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`nameVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`emailVisibility`) REFERENCES `visibilityEnum` (`title`),
  FOREIGN KEY (`phoneNumberVisibility`) REFERENCES `visibilityEnum` (`title`)
);

CREATE TABLE `userRelationship`
(
  `initialUserId` int,
  `targetUserId` int,
  `relationship` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`initialUserId`) REFERENCES `user` (`Id`),
  FOREIGN KEY (`targetUserId`) REFERENCES `user` (`Id`),
  FOREIGN KEY (`relationship`) REFERENCES `relationshipEnum` (`title`)
);

CREATE TABLE `event`
(
  `userId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `urlKey` varchar(8) UNIQUE NOT NULL,
  `dateStart` datetime,
  `dateEnd` datetime,
  `address` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userId`) REFERENCES `user` (`Id`)
);

CREATE TABLE `eventImage`
(
  `eventId` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `order` INTEGER NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventId`) REFERENCES `event` (`Id`)
);

CREATE TABLE `eventPrivacy`
(
  `eventId` int NOT NULL UNIQUE,
  `displayAddress` datetime DEFAULT CURRENT_TIMESTAMP,
  `displayDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `visibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventId`) REFERENCES `event` (`Id`),
  FOREIGN KEY (`visibility`) REFERENCES `visibilityEnum` (`title`)
);

CREATE TABLE `attendance`
(
  `eventId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventId`) REFERENCES `event` (`Id`),
  FOREIGN KEY (`userId`) REFERENCES `user` (`Id`)
);

CREATE TABLE `eventQuestion`
(
  `eventId` int NOT NULL,
  `userId` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255),
  `visible` boolean NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventId`) REFERENCES `event` (`Id`),
  FOREIGN KEY (`userId`) REFERENCES `user` (`Id`)
);

CREATE TABLE `eventTag`
(
  `eventId` int NOT NULL,
  `tagName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventId`) REFERENCES `event` (`Id`)
);

-- ENUM TABLES
CREATE TABLE `relationshipEnum`(`title` varchar(255) UNIQUE);
CREATE TABLE `visibilityEnum`(`title` varchar(255) UNIQUE);

-- FILL ENUM TABLES
INSERT INTO visibilityEnum (title) VALUES ('public'), ('listeners'), ('mutuals'), ('private');
INSERT INTO relationshipEnum (title) VALUES ('listen'), ('block');
