-- Posts
CREATE TABLE posts (
    id              BIGSERIAL       PRIMARY KEY,
    author_id       BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag             VARCHAR(20)     NOT NULL,
    title           VARCHAR(200)    NOT NULL,
    content         TEXT            NOT NULL,
    like_count      INTEGER         NOT NULL DEFAULT 0,
    report_count    INTEGER         NOT NULL DEFAULT 0,
    blinded         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_tag ON posts (tag);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);

-- Comments (2-level threading: parent_id is NULL for top-level, set for replies)
CREATE TABLE comments (
    id              BIGSERIAL       PRIMARY KEY,
    post_id         BIGINT          NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       BIGINT          REFERENCES comments(id) ON DELETE CASCADE,
    content         TEXT            NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments (post_id);

-- Post Likes
CREATE TABLE post_likes (
    id              BIGSERIAL       PRIMARY KEY,
    post_id         BIGINT          NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes (post_id);

-- Reports
CREATE TABLE reports (
    id              BIGSERIAL       PRIMARY KEY,
    reporter_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id         BIGINT          NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reason          VARCHAR(500)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (reporter_id, post_id)
);

CREATE INDEX idx_reports_post_id ON reports (post_id);
