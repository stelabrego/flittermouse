-- IF EXISTS is not necessary https://www.postgresql.org/docs/11/ddl-basics.html
-- DROP TABLE users CASCADE;
-- DROP TABLE events CASCADE;
-- DROP TYPE RELATIONSHIP CASCADE;
-- DROP TYPE VISIBILITY CASCADE;
-- DROP TABLE user_settings CASCADE;
-- DROP TABLE user_relationship CASCADE;
-- DROP TABLE event_images CASCADE;
-- DROP TABLE event_settings CASCADE;
-- DROP TABLE attendance CASCADE;
-- DROP TABLE event_questions CASCADE;
-- DROP TABLE event_tags CASCADE;


-- ENUM's (case sensitive names)
CREATE TYPE RELATIONSHIP AS ENUM ('listen', 'block');
CREATE TYPE VISIBILITY AS ENUM ('public', 'listening_to', 'private');

-- pg will retrieve 'timestamp with time zone' types as 1997-12-17 07:37:16-08 (ISO 8601)
-- NULLIF() for empty strings
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) > 2) CHECK (username ~ '^[a-zA-Z0-9_]*$') CHECK (LOWER(username) NOT IN ('home', 'setting', 'settings', 'event', 'events', 'about', 'blog', 'help', 'team', 'login', 'logout', 'register', 'index', 'signup', 'users', 'user')),
  email TEXT UNIQUE NOT NULL CHECK (LENGTH(email) > 5),
  password TEXT NOT NULL CHECK (LENGTH(password) > 5),
  invite_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/deiup0tup/image/upload/v1566969522/generic-user_inzqg2.jpg',
  bio TEXT NOT NULL DEFAULT '', -- if '' set NULL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  attending_visibility VISIBILITY DEFAULT 'listening_to',
  listening_to_visibility VISIBILITY DEFAULT 'listening_to',
  avatar_visibility VISIBILITY DEFAULT 'listening_to',
  bio_visibility VISIBILITY DEFAULT 'listening_to',
  name_visibility VISIBILITY DEFAULT 'listening_to',
  email_visibility VISIBILITY DEFAULT 'listening_to',
  display_name_visibility VISIBILITY DEFAULT 'listening_to',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_relationship (
  initial_user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
  target_user_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE,
  relationship RELATIONSHIP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (initial_user_id, target_user_id)
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (LENGTH(name) > 0), -- check not ''
  url_key TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date_start TIMESTAMP WITH TIME ZONE,
  date_end TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL DEFAULT '',
  lat NUMERIC,
  lon NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_images (
  event_id INTEGER PRIMARY KEY REFERENCES events ON DELETE CASCADE,
  url TEXT NOT NULL CHECK(LENGTH(url) > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE event_settings (
  event_id INTEGER PRIMARY KEY REFERENCES events ON DELETE CASCADE,
  display_location TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visibility VISIBILITY DEFAULT 'listening_to',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  event_id INTEGER REFERENCES events ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE event_questions (
  question_id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events ON DELETE CASCADE,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_tags (
  event_id INTEGER REFERENCES events ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (LENGTH(name) > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, name)
);
