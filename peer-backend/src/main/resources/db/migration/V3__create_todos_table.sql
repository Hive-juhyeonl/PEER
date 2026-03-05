CREATE TABLE todos (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       BIGINT          REFERENCES todos(id) ON DELETE CASCADE,
    title           VARCHAR(300)    NOT NULL,
    completed       BOOLEAN         NOT NULL DEFAULT FALSE,
    priority        VARCHAR(10)     NOT NULL DEFAULT 'MEDIUM',
    due_date        TIMESTAMP,
    sort_order      INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos (user_id);
CREATE INDEX idx_todos_parent_id ON todos (parent_id);
