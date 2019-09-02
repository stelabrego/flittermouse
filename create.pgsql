-- IF EXISTS is not necessary https://www.postgresql.org/docs/11/ddl-basics.html
DROP TABLE users CASCADE;
DROP TABLE events CASCADE;
DROP TYPE RELATIONSHIP CASCADE;
DROP TYPE VISIBILITY CASCADE;
DROP TABLE userSettings CASCADE;
DROP TABLE userRelationship CASCADE;
DROP TABLE eventImages CASCADE;
DROP TABLE eventSettings CASCADE;
DROP TABLE attendance CASCADE;
DROP TABLE eventQuestions CASCADE;
DROP TABLE eventTags CASCADE;


-- ENUM's (case sensitive names)
CREATE TYPE RELATIONSHIP AS ENUM ('listen', 'block');
CREATE TYPE VISIBILITY AS ENUM ('public', 'listeningTo', 'private');

-- pg will retrieve 'timestamp with time zone' types as 1997-12-17 07:37:16-08 (ISO 8601)
-- NULLIF() for empty strings
CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) > 2),
  email TEXT UNIQUE NOT NULL CHECK (LENGTH(email) > 5),
  password TEXT NOT NULL CHECK (LENGTH(password) > 5),
  inviteKey TEXT UNIQUE NOT NULL,
  displayName TEXT, -- if '' set NULL
  avatarUrl TEXT DEFAULT 'https://res.cloudinary.com/deiup0tup/image/upload/v1566969522/generic-user_inzqg2.jpg',
  bio TEXT, -- if '' set NULL
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE userSettings (
  userId INTEGER PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  attendingVisibility VISIBILITY DEFAULT 'listeningTo',
  listeningVisibility VISIBILITY DEFAULT 'listeningTo',
  listenersVisibility VISIBILITY DEFAULT 'listeningTo',
  avatarVisibility VISIBILITY DEFAULT 'listeningTo',
  bioVisibility VISIBILITY DEFAULT 'listeningTo',
  nameVisibility VISIBILITY DEFAULT 'listeningTo',
  emailVisibility VISIBILITY DEFAULT 'listeningTo',
  displayNameVisbility VISIBILITY DEFAULT 'listeningTo',
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE userRelationship (
  initialUserId INTEGER REFERENCES users (userId) ON DELETE CASCADE,
  targetUserId INTEGER REFERENCES users (userId) ON DELETE CASCADE,
  relationship RELATIONSHIP,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (initialUserId, targetUserId)
);

CREATE TABLE events (
  eventId SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (LENGTH(name) > 0), -- check not ''
  urlKey TEXT UNIQUE NOT NULL,
  description TEXT,
  dateStart TIMESTAMP WITH TIME ZONE,
  dateEnd TIMESTAMP WITH TIME ZONE,
  location TEXT,
  lat NUMERIC,
  lon NUMERIC,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventImages (
  eventId INTEGER PRIMARY KEY REFERENCES events ON DELETE CASCADE,
  url TEXT NOT NULL CHECK(LENGTH(url) > 0),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE eventSettings (
  eventId INTEGER PRIMARY KEY REFERENCES events ON DELETE CASCADE,
  displayLocation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visibility VISIBILITY DEFAULT 'listeningTo',
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  eventId INTEGER REFERENCES events ON DELETE CASCADE,
  userId INTEGER REFERENCES users ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (eventId, userId)
);

CREATE TABLE eventQuestions (
  questionId SERIAL PRIMARY KEY,
  eventId INTEGER REFERENCES events ON DELETE CASCADE,
  userId INTEGER REFERENCES users ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  visible BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventTags (
  eventId INTEGER REFERENCES events ON DELETE CASCADE,
  name TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (eventId, name)
);
