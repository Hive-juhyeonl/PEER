-- Problems
CREATE TABLE problems (
    id              BIGSERIAL       PRIMARY KEY,
    author_id       BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT            NOT NULL,
    difficulty      VARCHAR(10)     NOT NULL DEFAULT 'MEDIUM',
    tags            VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_problems_author_id ON problems (author_id);

-- Solutions
CREATE TABLE solutions (
    id                  BIGSERIAL       PRIMARY KEY,
    problem_id          BIGINT          NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    author_id           BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code                TEXT            NOT NULL,
    language            VARCHAR(30)     NOT NULL,
    time_complexity     VARCHAR(50),
    space_complexity    VARCHAR(50),
    explanation         TEXT,
    github_url          VARCHAR(500),
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (problem_id, author_id)
);

CREATE INDEX idx_solutions_problem_id ON solutions (problem_id);
CREATE INDEX idx_solutions_author_id ON solutions (author_id);

-- Evaluations
CREATE TABLE evaluations (
    id                      BIGSERIAL       PRIMARY KEY,
    solution_id             BIGINT          NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
    evaluator_id            BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    correctness             INTEGER         NOT NULL CHECK (correctness BETWEEN 1 AND 5),
    code_readability        INTEGER         NOT NULL CHECK (code_readability BETWEEN 1 AND 5),
    comments_clarity        INTEGER         NOT NULL CHECK (comments_clarity BETWEEN 1 AND 5),
    condition_satisfaction  INTEGER         NOT NULL CHECK (condition_satisfaction BETWEEN 1 AND 5),
    feedback                TEXT,
    created_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (solution_id, evaluator_id)
);

CREATE INDEX idx_evaluations_solution_id ON evaluations (solution_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations (evaluator_id);
