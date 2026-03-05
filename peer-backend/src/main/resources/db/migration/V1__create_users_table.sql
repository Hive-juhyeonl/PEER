CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    name            VARCHAR(100)    NOT NULL,
    profile_image_url VARCHAR(500),
    google_id       VARCHAR(255)    NOT NULL UNIQUE,
    role            VARCHAR(20)     NOT NULL DEFAULT 'USER',
    total_xp        BIGINT          NOT NULL DEFAULT 0,
    level           INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_google_id ON users (google_id);
