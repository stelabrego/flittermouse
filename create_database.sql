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
  `userID` int NOT NULL UNIQUE,
  `subscribedEventsVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `addressVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `nameVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `emailVisibility` varchar(255) NOT NULL  DEFAULT 'private',
  `phoneNumberVisibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userID`) REFERENCES `user` (`ID`),
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
  FOREIGN KEY (`initialUserId`) REFERENCES `user` (`ID`),
  FOREIGN KEY (`targetUserId`) REFERENCES `user` (`ID`),
  FOREIGN KEY (`relationship`) REFERENCES `relationshipEnum` (`title`)
);

CREATE TABLE `event`
(
  `userID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `UrlKey` varchar(8) UNIQUE NOT NULL,
  `dateStart` datetime,
  `dateEnd` datetime,
  `address` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
);

CREATE TABLE `eventImage`
(
  `eventID` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `order` INTEGER NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`)
);

CREATE TABLE `eventPrivacy`
(
  `eventID` int NOT NULL UNIQUE,
  `displayAddress` datetime DEFAULT CURRENT_TIMESTAMP,
  `displayDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `visibility` varchar(255) NOT NULL DEFAULT 'private',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`),
  FOREIGN KEY (`visibility`) REFERENCES `visibilityEnum` (`title`)
);

CREATE TABLE `attendance`
(
  `eventID` int NOT NULL,
  `userID` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`),
  FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
);

CREATE TABLE `eventQuestion`
(
  `eventID` int NOT NULL,
  `userID` int NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255),
  `visible` boolean NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`),
  FOREIGN KEY (`userID`) REFERENCES `user` (`ID`)
);

CREATE TABLE `eventTag`
(
  `eventID` int NOT NULL,
  `tagName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` INTEGER PRIMARY KEY,
  FOREIGN KEY (`eventID`) REFERENCES `event` (`ID`)
);

-- ENUM TABLES
CREATE TABLE `relationshipEnum`(`title` varchar(255) UNIQUE);
CREATE TABLE `visibilityEnum`(`title` varchar(255) UNIQUE);

-- FILL ENUM TABLES
INSERT INTO visibilityEnum (title) VALUES ('public'), ('listeners'), ('mutuals'), ('private');
INSERT INTO relationshipEnum (title) VALUES ('listen'), ('block');

-- FILL DATABASE WITH DUMMY DATA
-- USERS
-- INSERT INTO user (username, email, password, inviteKey) VALUES ('stelabrego', 'stelabrego@icloud.com', 'password123', 'validInviteKey');
-- INSERT INTO user (username, email, password, inviteKey) VALUES ('bobishere', 'bob@gmail.com', 'password123', 'validInviteKey2');
-- INSERT INTO user (username, email, password, inviteKey) VALUES ('indicasmoke', 'indicaabrego@gmail.com','password123', 'validInviteKey3');
-- USER PRIVACY
-- INSERT INTO userPrivacy (userID, subscribedEventsVisibility, addressVisibility, nameVisibility, emailVisibility, phoneNumberVisibility) SELECT user.ID, 'public', 'private', 'listeners', 'listeners', 'private' FROM user WHERE user.username = 'stelabrego';
-- INSERT INTO userPrivacy (userID, subscribedEventsVisibility, addressVisibility, nameVisibility, emailVisibility, phoneNumberVisibility) SELECT user.ID, 'public', 'public', 'public', 'listeners', 'listeners' FROM user WHERE user.username = 'bobishere';
-- INSERT INTO userPrivacy (userID, subscribedEventsVisibility, addressVisibility, nameVisibility, emailVisibility, phoneNumberVisibility) SELECT user.ID, 'public', 'public', 'public', 'public', 'public' FROM user WHERE user.username = 'indicasmoke';
-- USER RELATIONSHIP
-- INSERT INTO userRelationship (initialUserId, targetUserId, relationship) SELECT user.ID, (SELECT user.ID FROM user WHERE user.username = 'stelabrego'), 'listen' FROM user WHERE user.username = 'bobishere';
-- EVENTS
-- INSERT INTO event (userID, name, urlKey) SELECT user.ID, 'Stel Bday Party', 'validEventKey' FROM user WHERE user.username = 'stelabrego';
-- INSERT INTO event (userID, name, urlKey) SELECT user.ID, 'Solstice Party', 'validEventKey2' FROM user WHERE user.username = 'stelabrego';
-- EVENT PRIVACY
-- INSERT INTO eventPrivacy (eventID, displayAddress, displayDate, visibility) SELECT event.ID, '10/20/19', '10/15/19', 'listeners' FROM event WHERE event.key = 'validEventKey';
-- INSERT INTO eventPrivacy (eventID) SELECT event.ROWID FROM event WHERE event.key = 'validEventKey2';
-- EVENT PICTURE
-- INSERT INTO eventImage (eventID, url) SELECT event.id, 'https://cdn.pixabay.com/photo/2017/12/08/11/53/event-party-3005668_960_720.jpg' FROM event WHERE event.key = 'validEventKey';
-- ATTENDANCE
-- INSERT INTO attendance (eventID, userID) SELECT event.ROWID, (SELECT user.ROWID FROM user WHERE user.username = 'bobishere') FROM event WHERE event.key = 'validEventKey';
-- EVENT QUESTION
-- INSERT INTO eventQuestion (eventID, userID, question) SELECT event.ROWID, (SELECT user.ROWID FROM user WHERE user.username = 'indicasmoke'), "Will this event be rad?" FROM event WHERE event.key = 'validEventKey';
-- EVENT TAG
-- INSERT INTO eventTag (eventID, tagName) SELECT event.ROWID, "cool" FROM event WHERE event.key = 'validEventKey';
-- INSERT INTO eventTag (eventID, tagName) SELECT event.ROWID, "amazing" FROM event WHERE event.key = 'validEventKey';