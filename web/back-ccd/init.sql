drop table IF EXISTS Campaign cascade;
drop table IF EXISTS "user" cascade;
drop table IF EXISTS UserToChild cascade;
drop table IF EXISTS Box cascade;
drop table IF EXISTS Article cascade;

drop TYPE IF EXISTS age_range_enum;
drop TYPE IF EXISTS category_enum;
drop TYPE IF EXISTS state_enum;
drop TYPE IF EXISTS status_enum;
drop TYPE IF EXISTS role_enum;

-- Types ENUM
CREATE TYPE age_range_enum AS ENUM ('BB', 'PE', 'EN', 'AD');
CREATE TYPE category_enum AS ENUM ('SOC', 'FIG', 'CON', 'EXT', 'EVL', 'LIV');
CREATE TYPE state_enum AS ENUM ('N', 'TB', 'B');
CREATE TYPE role_enum AS ENUM ('ADMIN', 'USER');
CREATE TYPE status_enum AS ENUM ('IN_PROGRESS', 'VALIDATED', 'FINISHED');

-- Table Campaign
CREATE TABLE Campaign (
                          id_camp UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          date TIMESTAMP,
                          max_weight FLOAT,
                          total_weight FLOAT,
                          min_price DECIMAL(10, 2) DEFAULT 0.00,
                          max_price DECIMAL(10, 2) DEFAULT 0.00,
                          total_price DECIMAL(10, 2) DEFAULT 0.00,
                          status status_enum NOT NULL,
                          CONSTRAINT check_price_range CHECK (max_price >= min_price)
);

-- Table User
CREATE TABLE "user" (
                        id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name VARCHAR(255) NOT NULL,
                        family_name VARCHAR(255),
                        email VARCHAR(255) UNIQUE,
                        role role_enum NOT NULL
);

-- Table UserToChild
CREATE TABLE UserToChild (
                             id_user UUID REFERENCES "user"(id_user),
                             age_range age_range_enum NOT NULL,
                             preference TEXT[]
);

-- Table Box
CREATE TABLE Box (
                     id_box UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                     id_camp UUID REFERENCES Campaign(id_camp),
                     id_user UUID REFERENCES "user"(id_user),
                     score_box INTEGER,
                     total_weight FLOAT,
                     total_price DECIMAL(10, 2),
                     validated BOOLEAN DEFAULT FALSE
);

-- Table Article
CREATE TABLE Article (
                         id_article UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         description TEXT,
                         category category_enum NOT NULL,
                         age_range age_range_enum NOT NULL,
                         state state_enum NOT NULL,
                         price DECIMAL(10, 2),
                         weight FLOAT,
                         id_box UUID REFERENCES Box(id_box)
);