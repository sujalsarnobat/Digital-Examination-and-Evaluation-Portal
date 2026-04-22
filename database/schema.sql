CREATE DATABASE IF NOT EXISTS digital_exam_portal;
USE digital_exam_portal;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS exams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_by BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    total_marks INT NOT NULL,
    exam_status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_exam_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL,
    options_data TEXT,
    answer_key TEXT,
    marks INT NOT NULL,
    CONSTRAINT fk_question_exam FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE IF NOT EXISTS answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    response_text TEXT,
    selected_option VARCHAR(255),
    awarded_marks INT,
    evaluated_by BIGINT,
    evaluation_status VARCHAR(30) NOT NULL,
    submitted_at DATETIME NOT NULL,
    CONSTRAINT fk_answer_exam FOREIGN KEY (exam_id) REFERENCES exams(id),
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT fk_answer_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_answer_evaluator FOREIGN KEY (evaluated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    total_score INT NOT NULL,
    percentage DOUBLE NOT NULL,
    grade VARCHAR(10) NOT NULL,
    publish_status VARCHAR(20) NOT NULL,
    published_at DATETIME,
    CONSTRAINT fk_result_exam FOREIGN KEY (exam_id) REFERENCES exams(id),
    CONSTRAINT fk_result_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT uk_result_exam_student UNIQUE (exam_id, student_id)
);
