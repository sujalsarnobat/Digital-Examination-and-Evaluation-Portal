USE digital_exam_portal;

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at)
VALUES
('Admin User', 'admin@pes.edu', '$2a$10$examplehashforadmin', 'ADMIN', 'ACTIVE', NOW()),
('Faculty User', 'faculty@pes.edu', '$2a$10$examplehashforfaculty', 'FACULTY', 'ACTIVE', NOW()),
('Student User', 'student@pes.edu', '$2a$10$examplehashforstudent', 'STUDENT', 'ACTIVE', NOW());

INSERT INTO exams (created_by, title, description, start_time, end_time, duration_minutes, total_marks, exam_status)
VALUES
(2, 'OOAD Midterm', 'Midterm exam for OOAD', NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 60, 100, 'LIVE');

INSERT INTO questions (exam_id, question_text, question_type, options_data, answer_key, marks)
VALUES
(1, 'Which principle states classes should have one responsibility?', 'MCQ', 'SRP|OCP|LSP|DIP', 'SRP', 5),
(1, 'Explain MVC architecture in brief.', 'DESCRIPTIVE', NULL, NULL, 10);
