CREATE TABLE events (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    start_time      TIMESTAMP       NOT NULL,
    end_time        TIMESTAMP       NOT NULL,
    all_day         BOOLEAN         NOT NULL DEFAULT FALSE,
    color           VARCHAR(20)     NOT NULL DEFAULT '#3B82F6',
    repeat_rule     VARCHAR(50),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events (user_id);
CREATE INDEX idx_events_user_start ON events (user_id, start_time);
