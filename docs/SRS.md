# Software Requirements Specification (SRS)
## Digital Examination and Evaluation Portal

Prepared for: Object Oriented Analysis and Design (OOAD) Mini Project  
University: PES University  
Semester: VI Semester, B.Tech (Academic Year 2025-2026)  
Date: 20 April 2026  

---

## 1. Title Page

### Project Title
Digital Examination and Evaluation Portal

### Team Members
1. Sujal Sarnobat
2. Shrishail Sudhakar Kone
3. Sumit Gouda D Patil
4. Siddhant D J

### Course
Object Oriented Analysis and Design (OOAD)

### University
PES University

### Semester Details
VI Semester, B.Tech, Academic Year 2025-2026

---

## 2. Introduction

### 2.1 Purpose of the System
The Digital Examination and Evaluation Portal is a web-based academic platform designed to automate and streamline examination-related activities in higher education institutions. The system enables online exam conduction, digital evaluation, and timely result publication with role-based workflows for students, faculty, and administrators. The purpose of this system is to improve transparency, reduce manual effort, ensure consistency in evaluation, and provide a secure environment for digital assessments.

### 2.2 Scope
This project covers the complete lifecycle of examination management in a university setting. It includes user authentication, exam creation and scheduling, question bank management, exam attempt by students, answer submission, mixed-mode evaluation (automatic and manual), and result publication. The system is implemented using Java, Spring Boot, and MySQL, and follows OOAD principles for maintainability and extensibility.

In scope:
1. Student-facing workflows for exam participation and result viewing.
2. Faculty workflows for exam setup, question handling, and evaluation.
3. Admin workflows for user management, policy definition, and final publication control.

Out of scope:
1. Integration with external ERP or LMS platforms.
2. AI proctoring implementation in the current release.
3. Native mobile application development.

### 2.3 Definitions and Abbreviations
1. SRS: Software Requirements Specification
2. OOAD: Object Oriented Analysis and Design
3. Admin: System administrator with governance privileges
4. Faculty: User responsible for creating and evaluating exams
5. Student: User who attempts exams and views results
6. MVC: Model View Controller
7. REST: Representational State Transfer
8. API: Application Programming Interface
9. JPA: Java Persistence API
10. ORM: Object Relational Mapping
11. RBAC: Role Based Access Control
12. MCQ: Multiple Choice Question

### 2.4 Overview of Document
This SRS document is organized according to IEEE-style structure. It first explains system purpose and scope, then describes product environment and user classes. It details system features with preconditions and postconditions, formal functional and non-functional requirements, UML model explanations, architecture decisions, design principles, design patterns, database design, future enhancements, and individual team contributions.

---

## 3. Overall Description

### 3.1 Product Perspective
The Digital Examination and Evaluation Portal is a standalone, role-driven web application. It uses Spring Boot as the backend framework and MySQL as the persistence layer. The system can be deployed on institutional infrastructure or cloud-hosted servers. Frontend interfaces communicate with backend services through REST APIs.

This product replaces conventional paper-based and spreadsheet-assisted exam workflows with a centralized digital platform that ensures consistency, reliability, and auditability.

### 3.2 Product Functions
Major product functions include:
1. User login, logout, and role-specific access.
2. Exam creation, scheduling, and status management.
3. Question bank maintenance and mapping to exams.
4. Timed exam participation for students.
5. Secure answer submission and attempt tracking.
6. Auto-evaluation for objective questions.
7. Manual evaluation support for descriptive responses.
8. Score aggregation, grade assignment, and result publication.
9. Administrative control over users and exam policies.

### 3.3 User Classes and Characteristics
1. Admin:
   Responsible for creating and managing users, defining exam rules, and publishing final results. Requires complete access to administrative modules.
2. Faculty:
   Responsible for creating exams, maintaining question banks, evaluating submissions, and reviewing performance data. Requires domain expertise and operational access to academic modules.
3. Student:
   Responsible for attempting assigned exams and reviewing published results. Requires a simple, clear, and guided user interface.

### 3.4 Operating Environment
1. Server-side:
   Java 17 or higher, Spring Boot runtime, MySQL 8.0 or higher.
2. Client-side:
   Modern browsers such as Chrome, Firefox, Edge, and Safari.
3. Deployment environment:
   Windows/Linux server, institutional LAN or internet connectivity, HTTPS recommended.

### 3.5 Assumptions and Dependencies
1. Users have valid institutional credentials.
2. Stable internet is available during exam sessions.
3. Server clock is synchronized for accurate schedule enforcement.
4. MySQL service is continuously available during operations.
5. Institutional policy defines grading rules and publication approval process.
6. Browser compatibility and JavaScript support are available on user devices.

---

## 4. System Features (Detailed)

### 4.1 User Authentication
Description:  
The system authenticates users through secure credentials and grants role-based access to Admin, Faculty, and Student dashboards.

Actors Involved:
1. Admin
2. Faculty
3. Student

Preconditions:
1. User account exists and is active.
2. User provides valid credentials.

Postconditions:
1. User session is initiated.
2. Access is granted according to assigned role.
3. Unauthorized actions are restricted.

### 4.2 Exam Creation and Scheduling
Description:  
Faculty users can create exams by defining title, instructions, marks, duration, and schedule window. Exams transition through lifecycle states.

Actors Involved:
1. Faculty
2. Admin (oversight)

Preconditions:
1. Faculty user is authenticated.
2. Faculty has permission to create exams.

Postconditions:
1. Exam is saved in Draft or Scheduled state.
2. Exam metadata is available for further configuration.

### 4.3 Question Bank Management
Description:  
Faculty can create and manage question repositories, including MCQ and descriptive questions, and assign them to specific exams.

Actors Involved:
1. Faculty

Preconditions:
1. Faculty is authenticated.
2. Exam exists and is editable.

Postconditions:
1. Question records are stored/updated/deleted successfully.
2. Questions are linked to selected exam.

### 4.4 Exam Attempt
Description:  
Students can attempt live exams through a timed interface, navigate questions, and save responses during the session.

Actors Involved:
1. Student

Preconditions:
1. Student is authenticated.
2. Exam is in Live state.
3. Student is eligible to attempt the exam.

Postconditions:
1. Responses are captured for all attempted questions.
2. Attempt is closed after submission or timer expiry.

### 4.5 Answer Submission
Description:  
The system securely stores final submitted answers and marks the attempt as submitted for evaluation.

Actors Involved:
1. Student
2. System

Preconditions:
1. Student is in an active exam session.
2. Submission window is still valid.

Postconditions:
1. Answers are persisted in the database.
2. Attempt status changes to Submitted.
3. Evaluation workflow is triggered.

### 4.6 Evaluation System (Auto + Manual)
Description:  
Objective questions are evaluated automatically using answer keys, while descriptive answers are assessed manually by faculty.

Actors Involved:
1. System
2. Faculty

Preconditions:
1. Student submission is available.
2. Evaluation rules are defined.

Postconditions:
1. Objective scores are computed automatically.
2. Descriptive answers receive faculty marks.
3. Final marks are consolidated.

### 4.7 Result Generation and Publishing
Description:  
After evaluation, the system computes total score, percentage, and grade, and publishes results to students.

Actors Involved:
1. Faculty
2. Admin
3. Student

Preconditions:
1. Required evaluation is completed.
2. Publication approval conditions are met.

Postconditions:
1. Result status changes to Published.
2. Students can view exam-wise results.

---

## 5. Functional Requirements

FR1: User login/logout
1. The system shall allow users to log in with valid credentials.
2. The system shall establish role-based sessions after authentication.
3. The system shall support secure logout and session termination.

FR2: Create exam
1. The system shall allow faculty to create exams with title, duration, and schedule.
2. The system shall save exam lifecycle status (Draft, Scheduled, Live, Completed).

FR3: Manage questions
1. The system shall allow faculty to create, edit, and delete questions.
2. The system shall support MCQ and descriptive question types.
3. The system shall map questions to designated exams.

FR4: Attempt exam
1. The system shall allow students to attempt only eligible and live exams.
2. The system shall enforce exam timer and submission deadline.
3. The system shall capture and store student responses.

FR5: Evaluate answers
1. The system shall auto-evaluate objective answers.
2. The system shall allow faculty to manually evaluate descriptive answers.
3. The system shall store question-wise and total marks.

FR6: Generate result
1. The system shall generate results after evaluation completion.
2. The system shall compute percentage and grade.
3. The system shall publish results for student viewing.

---

## 6. Non-Functional Requirements

### 6.1 Performance
1. The system shall support concurrent access during peak exam periods.
2. The system shall provide acceptable API response times for key operations.
3. Submission operations shall be optimized to prevent timeout-related failures.

### 6.2 Security (Role-Based Access)
1. The system shall enforce RBAC for all protected resources.
2. Passwords shall be stored in encrypted/hashed form.
3. Sensitive operations shall require authenticated and authorized sessions.
4. Input validation shall be applied to prevent injection and malformed requests.

### 6.3 Scalability
1. The system shall support increasing numbers of users, exams, and submissions.
2. The architecture shall allow future horizontal scaling of backend services.
3. Database design shall support growth through indexing and normalized tables.

### 6.4 Maintainability
1. The system shall follow layered architecture and OOAD practices.
2. Modules shall remain loosely coupled and highly cohesive.
3. Documentation and coding conventions shall support long-term maintenance.

### 6.5 Reliability
1. The system shall ensure durable answer storage and transaction safety.
2. Failures during submission shall be recoverable with minimal data loss.
3. Core workflows shall be consistently available in scheduled exam windows.

### 6.6 Usability
1. The user interface shall be simple and task-oriented for each role.
2. Exam attempt screens shall be clear, responsive, and low-distraction.
3. Students shall be able to locate results and exam status without ambiguity.

---

## 7. UML Models Explanation

### 7.1 Use Case Diagram
The Use Case Diagram models interactions among three actors: Student, Faculty, and Admin.

1. Student use cases include login, view exams, attempt exam, submit answers, and view results.
2. Faculty use cases include create exam, schedule exam, manage question bank, evaluate answers, and review outcomes.
3. Admin use cases include user management, policy management, and result publishing.

The diagram highlights separation of responsibilities while maintaining coordinated workflows through a centralized system.

### 7.2 Class Diagram
The Class Diagram represents core domain classes:
1. User (base class)
2. Admin, Faculty, Student (specialized classes)
3. Exam
4. Question
5. Answer
6. Evaluation
7. Result

Explanation:
1. User is generalized and role-specific users inherit common credentials and profile properties.
2. Faculty is associated with multiple Exam objects.
3. Exam is associated with multiple Question objects.
4. Student responses are represented through Answer objects linked to Question and Exam contexts.
5. Evaluation tracks marking state and reviewer actions.
6. Result stores final scores and publication details.

This model supports object-oriented extensibility and aligns with service and repository abstractions.

### 7.3 Activity Diagrams

Create Exam Activity:
1. Faculty logs in.
2. Faculty enters exam details.
3. Faculty adds questions.
4. System validates exam structure.
5. Exam is saved and scheduled.

Register Exam Activity:
1. Student logs in.
2. Student views available exams.
3. Student selects exam.
4. System checks eligibility and schedule.
5. Registration/attempt access is granted.

Attempt Exam Activity:
1. Student starts exam.
2. Timer starts.
3. Questions are answered and navigated.
4. Student submits or timer expires.
5. System stores final responses.

Evaluate and Publish Result Activity:
1. System auto-evaluates objective answers.
2. Faculty evaluates descriptive answers.
3. System computes total marks and grade.
4. Admin/faculty verifies result integrity.
5. Result is published.

### 7.4 State Diagrams

Exam Lifecycle State Diagram:
Draft -> Scheduled -> Live -> Completed

State meanings:
1. Draft: Exam is under preparation.
2. Scheduled: Time window is finalized.
3. Live: Exam is currently open.
4. Completed: Exam window has ended.

Evaluation Lifecycle State Diagram:
Submitted -> Auto Evaluated -> Manual Review Pending -> Finalized -> Published

State meanings:
1. Submitted: Student attempt is completed.
2. Auto Evaluated: Objective scoring completed.
3. Manual Review Pending: Descriptive grading pending.
4. Finalized: Total score and grade computed.
5. Published: Result visible to student.

---

## 8. System Architecture

### 8.1 MVC Architecture (Model, View, Controller)
The project follows MVC principles:
1. Model layer represents entities such as User, Exam, Question, Answer, and Result.
2. View layer provides role-based interfaces for student, faculty, and admin workflows.
3. Controller layer receives requests, validates input, and delegates processing to services.

This separation improves maintainability, testing, and modular development.

### 8.2 REST API-Based Backend
1. Spring Boot exposes RESTful endpoints for authentication, exam operations, evaluation, and result management.
2. APIs use structured request-response patterns for interoperability.
3. Stateless communication supports scalability and distributed deployment.

### 8.3 Database Interaction Using JPA/Hibernate
1. JPA entities map object models to relational tables in MySQL.
2. Hibernate manages ORM, reducing boilerplate SQL and ensuring consistency.
3. Repository interfaces support CRUD and query operations.
4. Transaction management ensures integrity in critical operations such as answer submission and result generation.

### 8.4 Frontend (React or Basic UI)
1. The frontend can be developed in React for component-based dynamic interfaces.
2. A basic server-rendered UI can also be used for lightweight deployment.
3. The frontend consumes backend REST APIs for all key operations.
4. Interfaces are role-specific and responsive for desktop and mobile browsers.

---

## 9. Design Principles Used

### 9.1 Single Responsibility Principle (SRP)
Each class/module has a focused responsibility, such as authentication, exam management, or result processing.

### 9.2 Open Closed Principle (OCP)
The system allows extension (for example, adding new question types) without modifying stable core modules.

### 9.3 Liskov Substitution Principle (LSP)
Role-specific user objects (Admin, Faculty, Student) can substitute the general User abstraction in common workflows.

### 9.4 Interface Segregation Principle (ISP)
Service and repository interfaces are narrowly scoped so clients depend only on relevant methods.

### 9.5 Dependency Inversion Principle (DIP)
High-level modules (controllers/services) depend on abstractions rather than concrete persistence implementations.

### 9.6 Modularity
The application is divided into independent modules such as authentication, exam handling, evaluation, and publication.

### 9.7 Reusability
Shared business logic and validation components are designed for reuse across multiple workflows.

### 9.8 Scalability
Layered and stateless architecture supports future expansion in users, departments, and examination volume.

### 9.9 Security
Security is enforced through RBAC, secure credential handling, input validation, and controlled endpoint access.

---

## 10. Design Patterns Used

### 10.1 MVC Pattern
Used to separate data model, request handling, and user interface responsibilities for cleaner architecture.

### 10.2 DAO Pattern
Implemented through repository/data access classes to isolate persistence logic from business logic.

### 10.3 Service Layer Pattern
Business rules are centralized in service classes, enabling thin controllers and reusable domain operations.

---

## 11. Database Design

### 11.1 User Table
Attributes:
1. user_id (PK)
2. full_name
3. email (unique)
4. password_hash
5. role (Admin/Faculty/Student)
6. account_status
7. created_at
8. updated_at

### 11.2 Exam Table
Attributes:
1. exam_id (PK)
2. title
3. description
4. created_by (FK -> User.user_id)
5. start_time
6. end_time
7. duration_minutes
8. total_marks
9. exam_status
10. created_at
11. updated_at

### 11.3 Question Table
Attributes:
1. question_id (PK)
2. exam_id (FK -> Exam.exam_id)
3. question_text
4. question_type (MCQ/Descriptive)
5. options_data
6. answer_key
7. marks
8. difficulty_level

### 11.4 Answer Table
Attributes:
1. answer_id (PK)
2. exam_id (FK -> Exam.exam_id)
3. question_id (FK -> Question.question_id)
4. student_id (FK -> User.user_id)
5. response_text
6. selected_option
7. awarded_marks
8. evaluated_by (FK -> User.user_id, nullable)
9. evaluation_status
10. submitted_at

### 11.5 Result Table
Attributes:
1. result_id (PK)
2. exam_id (FK -> Exam.exam_id)
3. student_id (FK -> User.user_id)
4. total_score
5. percentage
6. grade
7. publish_status
8. published_at

### 11.6 Relationships
1. One faculty can create many exams.
2. One exam can contain many questions.
3. One student can submit many answers.
4. One question can have many student answers.
5. One student has one result per exam.
6. Result is derived from evaluated answers.

---

## 12. Future Enhancements

### 12.1 AI-Based Evaluation
Integrate AI-assisted semantic scoring for descriptive responses to support faster and more consistent evaluation.

### 12.2 Online Proctoring
Introduce webcam-based monitoring, behavior tracking, and anti-cheating controls during live exams.

### 12.3 Analytics Dashboard
Provide visual analytics for student performance trends, question quality analysis, and faculty-level academic insights.

---

## 13. Conclusion
The Digital Examination and Evaluation Portal provides a robust foundation for modern digital assessments in academic institutions. By combining OOAD-driven design, Spring Boot services, and MySQL persistence, the system delivers structured workflows for exam management, evaluation, and result publication. The proposed architecture and requirements support maintainability, scalability, and secure operation, making the solution suitable for university-level deployment and future enhancement.

---

## 14. Github Link Section
https://github.com/your-repo-link

---

## 15. Individual Contributions

| Name | Module Worked |
|---|---|
| Sujal Sarnobat | User Management |
| Shrishail Sudhakar Kone | Exam Management |
| Sumit Gouda D Patil | Evaluation |
| Siddhant D J | Result Processing |
