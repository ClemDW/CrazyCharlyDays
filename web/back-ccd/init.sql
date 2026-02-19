drop table Campaign cascade constraints;
drop table User cascade constraints;
drop table UserToChild cascade constraints;
drop table Box cascade constraints;
drop table Article cascade constraints;

-- Types ENUM
CREATE TYPE age_range_enum AS ENUM ('BB', 'PE', 'EN', 'AD');
CREATE TYPE category_enum AS ENUM ('SOC', 'FIG', 'CON', 'EXT', 'EVL', 'LIV');
CREATE TYPE state_enum AS ENUM ('N', 'TB', 'B');
CREATE TYPE role_enum AS ENUM ('admin', 'user');
CREATE TYPE status_enum AS ENUM ('en cours', 'validé', 'terminé');

-- Table Campaign
CREATE TABLE Campaign (
                          id_camp UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          date TIMESTAMP NOT NULL,
                          max_weight FLOAT NOT NULL,
                          min_price DECIMAL(10, 2) DEFAULT 0.00,
                          max_price DECIMAL(10, 2),
                          status status_enum NOT NULL,
                          CONSTRAINT check_price_range CHECK (max_price >= min_price)
);

-- Table User
CREATE TABLE User (
                        id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name VARCHAR(255) NOT NULL,
                        family_name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        role role_enum NOT NULL
);

-- Table UserToChild
CREATE TABLE UserToChild (
                             id_user UUID REFERENCES User(id_user),
                             age_range age_range_enum NOT NULL,
                             preference TEXT[]
);

-- Table Box
CREATE TABLE Box (
                     id_box UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                     id_camp UUID REFERENCES Campaign(id_camp),
                     id_user UUID REFERENCES User(id_user),
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