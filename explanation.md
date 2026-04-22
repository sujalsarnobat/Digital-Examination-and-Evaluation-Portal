# Digital Examination and Evaluation Portal - Code and Design Explanation

## 1) What this project does

This project is a role-based online examination platform with three user roles:

- Admin: manage users, create exams, publish results
- Faculty: create exams, add questions, evaluate answers
- Student: view exams, attempt exams, view results

It is implemented as:

- Backend: Spring Boot REST API
- Frontend: React + Vite
- Database: MySQL (primary) and H2 local profile for development

The architecture follows a layered MVC style with clear separation of concerns.

---

## 2) Repository structure and purpose

- backend/: Spring Boot application with API, business logic, persistence, security
- frontend/: React application with role-based navigation and screens
- database/: SQL schema and seed scripts
- docs/: SRS and diagrams
- tools/: local Maven distribution used to build/run backend

---

## 3) Backend code explanation

## 3.1 Entry point

- backend/src/main/java/com/exam/ExamPortalApplication.java
  - Bootstraps the Spring Boot app.

## 3.2 Configuration

- backend/src/main/java/com/exam/config/SecurityConfig.java
  - Configures stateless HTTP Basic authentication.
  - Enables method-level authorization via @EnableMethodSecurity.
  - Declares security beans (PasswordEncoder, AuthenticationProvider, AuthenticationManager).
- backend/src/main/java/com/exam/config/CorsConfig.java
  - Allows frontend origin (localhost:5173) and required headers/methods.

## 3.3 Controllers (API layer)

- backend/src/main/java/com/exam/controller/AuthController.java
  - /api/auth/register and /api/auth/login
- backend/src/main/java/com/exam/controller/ExamController.java
  - Exam creation, status updates, list, live exams
- backend/src/main/java/com/exam/controller/QuestionController.java
  - Add/list questions for exam
- backend/src/main/java/com/exam/controller/AnswerController.java
  - Submit student answers
  - Faculty manual evaluation
  - Faculty answer listing by exam+question for evaluation workflow
- backend/src/main/java/com/exam/controller/ResultController.java
  - Publish results, student result retrieval
- backend/src/main/java/com/exam/controller/UserController.java
  - Admin-only user listing
- backend/src/main/java/com/exam/controller/HomeController.java
  - Health/root response endpoint

Controllers are intentionally thin and delegate business logic to services.

## 3.4 Services (business logic layer)

- backend/src/main/java/com/exam/service/UserService.java
  - Registration, user lookup, user list
- backend/src/main/java/com/exam/service/ExamService.java
  - Exam creation rules, schedule validation, status update, listing
- backend/src/main/java/com/exam/service/QuestionService.java
  - Question creation rules and retrieval by exam
- backend/src/main/java/com/exam/service/EvaluationService.java
  - Student answer submission logic
  - MCQ auto-evaluation
  - Descriptive evaluation by faculty
  - Retrieval of answers for selected exam+question
- backend/src/main/java/com/exam/service/ResultService.java
  - Aggregates answer marks
  - Ensures no pending evaluations before publish
  - Grade computation and result publication

Services hold most domain rules and validations.

## 3.5 Repositories (data access layer)

- backend/src/main/java/com/exam/repository/UserRepository.java
- backend/src/main/java/com/exam/repository/ExamRepository.java
- backend/src/main/java/com/exam/repository/QuestionRepository.java
- backend/src/main/java/com/exam/repository/AnswerRepository.java
- backend/src/main/java/com/exam/repository/ResultRepository.java

These interfaces extend JpaRepository and use query-method naming conventions.

## 3.6 Domain models and enums

- backend/src/main/java/com/exam/model/User.java
- backend/src/main/java/com/exam/model/Exam.java
- backend/src/main/java/com/exam/model/Question.java
- backend/src/main/java/com/exam/model/Answer.java
- backend/src/main/java/com/exam/model/Result.java

Enums model finite state and type sets:

- Role.java
- ExamStatus.java
- QuestionType.java
- EvaluationStatus.java

## 3.7 DTOs and validation

DTOs isolate API contract from entity internals:

- backend/src/main/java/com/exam/dto/RegisterDTO.java
- backend/src/main/java/com/exam/dto/LoginDTO.java
- backend/src/main/java/com/exam/dto/ExamDTO.java
- backend/src/main/java/com/exam/dto/QuestionDTO.java
- backend/src/main/java/com/exam/dto/AnswerDTO.java
- backend/src/main/java/com/exam/dto/ManualEvaluationDTO.java

## 3.8 Security user details

- backend/src/main/java/com/exam/security/CustomUserDetailsService.java
  - Maps User entity to Spring Security UserDetails + ROLE_ authority.

## 3.9 Exception handling

- backend/src/main/java/com/exam/exception/BadRequestException.java
- backend/src/main/java/com/exam/exception/ResourceNotFoundException.java
- backend/src/main/java/com/exam/exception/GlobalExceptionHandler.java

GlobalExceptionHandler centralizes HTTP error responses.

## 3.10 Runtime config

- backend/src/main/resources/application.properties
  - MySQL profile (default)
- backend/src/main/resources/application-local.properties
  - H2 in-memory profile for local testing

---

## 4) Frontend code explanation

## 4.1 Entry and routing

- frontend/src/main.jsx
  - React app bootstrap + BrowserRouter
- frontend/src/App.jsx
  - Route definitions, protected route usage, role-aware route restrictions

## 4.2 Auth, role access, and navigation

- frontend/src/services/api.js
  - Axios client and Basic Auth header setup
- frontend/src/config/roleAccess.js
  - Role constants and route mapping by role
- frontend/src/components/ProtectedRoute.jsx
  - Route guarding with role checks and redirects
- frontend/src/components/Navbar.jsx
  - Role-specific navigation and role badge

## 4.3 Pages

- frontend/src/pages/Landing.jsx
  - Public landing page (PES University branding + entry points)
- frontend/src/pages/Login.jsx
- frontend/src/pages/Register.jsx
- frontend/src/pages/Dashboard.jsx
- frontend/src/pages/ManageUsers.jsx
- frontend/src/pages/CreateExam.jsx
- frontend/src/pages/AddQuestion.jsx
  - Includes exam dropdown selection for adding question to a specific exam
- frontend/src/pages/EvaluateAnswers.jsx
  - Includes exam selector, question selector, answer selector for targeted evaluation
- frontend/src/pages/ViewExams.jsx
  - Shows exam schedule data (start/end date-time)
- frontend/src/pages/AttemptExam.jsx
- frontend/src/pages/Result.jsx
- frontend/src/pages/PublishResults.jsx

## 4.4 Styling

- frontend/src/styles.css
  - Design system, layout, cards, role-badges, interactions, responsive behavior

---

## 5) Database layer

- database/schema.sql
  - Defines users, exams, questions, answers, results and relationships
- database/sample-data.sql
  - Seed/test data

Core relational design:

- One user can create many exams
- One exam has many questions
- Answers reference exam + question + student
- Results are unique per (exam, student)

---

## 6) End-to-end workflow in code

1. Register/Login
   - AuthController -> UserService / AuthenticationManager
2. Role assignment
   - User role stored in User entity; returned during login
3. UI gating
   - roleAccess.js + ProtectedRoute.jsx + Navbar.jsx
4. Exam lifecycle
   - Faculty/Admin creates exam -> Faculty adds questions -> Student submits answers
5. Evaluation
   - MCQ auto-evaluated in EvaluationService
   - Descriptive evaluated manually by faculty
6. Result publication
   - Admin publishes only when no MANUAL_REVIEW_PENDING answers remain
7. Student consumes results
   - ResultController /results/me

---

## 7) OOP concepts used

## 7.1 Encapsulation

- Entities keep fields private and expose behavior through getters/setters.
- Business rules are encapsulated in services (e.g., score/grade logic in ResultService).

## 7.2 Abstraction

- Controllers abstract HTTP handling.
- Services abstract domain logic.
- Repository interfaces abstract database interaction.

## 7.3 Inheritance

- Custom exceptions inherit from RuntimeException.
- Spring Security classes/interfaces are implemented/extended through framework contracts.

## 7.4 Polymorphism

- UserDetailsService contract implemented by CustomUserDetailsService.
- JpaRepository interface methods are polymorphically backed by generated Spring Data proxies.

---

## 8) SOLID principles in this project

## 8.1 Single Responsibility Principle (SRP)

- Controllers handle request/response only.
- Services handle domain logic.
- Repositories handle persistence.
- Exception handler centralizes error mapping.

## 8.2 Open/Closed Principle (OCP)

- Role checks are declarative via @PreAuthorize expressions; behavior is extendable by adding roles/rules.
- Query methods in repositories can be expanded without rewriting data layer architecture.

## 8.3 Liskov Substitution Principle (LSP)

- Custom exceptions can be treated as RuntimeException in common error handling.
- Interface implementations (UserDetailsService, repository proxies) substitute seamlessly.

## 8.4 Interface Segregation Principle (ISP)

- Repositories are role-focused interfaces with only needed query methods.
- DTOs are endpoint-specific and avoid oversized contracts.

## 8.5 Dependency Inversion Principle (DIP)

- High-level modules rely on injected dependencies managed by Spring IoC.
- Data access depends on repository abstractions rather than SQL code in services.

---

## 9) Design principles and patterns used

## 9.1 Layered Architecture (Controller-Service-Repository)

Why used:
- Keeps code maintainable and testable.
- Separates API concerns, business rules, and persistence concerns.

Where used:
- All backend modules under controller/, service/, repository/.

## 9.2 MVC style separation

Why used:
- Clean mapping between user interaction (frontend), controller endpoints, and model entities.

Where used:
- Frontend views/pages + backend controllers + backend model entities.

## 9.3 Repository Pattern

Why used:
- Hides low-level data access and lets business code stay database-agnostic.

Where used:
- UserRepository, ExamRepository, QuestionRepository, AnswerRepository, ResultRepository.

## 9.4 DTO Pattern

Why used:
- Prevents exposing entity internals directly to external API callers.
- Supports input validation and clear request contracts.

Where used:
- dto/ package across auth, exam, question, answer, evaluation flows.

## 9.5 Exception Handling Pattern (centralized)

Why used:
- Uniform and predictable API error responses.

Where used:
- GlobalExceptionHandler with specific exception classes.

## 9.6 RBAC as policy-driven design

Why used:
- Security and role correctness at both UI and API levels.

Where used:
- Backend: @PreAuthorize annotations in controllers.
- Frontend: roleAccess.js and ProtectedRoute.jsx.

---

## 10) Creational patterns used (where and why)

Important: In this project, most creational behavior is framework-driven by Spring.

## 10.1 Singleton Pattern (Spring bean scope)

Where:
- Controllers, services, repositories, and config beans are singleton by default.

Why:
- Shared stateless services reduce object churn and improve consistency.

## 10.2 Factory Method Pattern

Where:
- SecurityConfig @Bean methods create PasswordEncoder, AuthenticationProvider, AuthenticationManager.

Why:
- Object creation is centralized and controlled in configuration rather than scattered in business code.

## 10.3 Abstract Factory / IoC Container (BeanFactory/ApplicationContext)

Where:
- Spring container instantiates and wires @Service, @Repository, @RestController classes.

Why:
- Decouples object creation and dependency wiring from application logic.

## 10.4 Notes on patterns not explicitly custom-implemented

- No explicit custom Builder class pattern in domain code.
- No explicit custom Abstract Factory classes in project code.
- These can be introduced in future for complex object construction (e.g., exam templates).

---

## 11) Additional structural/behavioral patterns leveraged via framework

- Proxy Pattern:
  - Spring Data repositories are runtime-generated proxies.
  - Security filters/proxies intercept requests for authentication/authorization.
- Strategy-like behavior:
  - Security uses pluggable authentication providers and authorization expressions.

---

## 12) Strengths for presentation/demo

- Strong role-based separation at both frontend and backend
- Clear layered architecture suitable for OOAD expectations
- Hybrid evaluation flow (auto + manual)
- Centralized error handling and validation
- Clean extension points for future features

---

## 13) Suggested talking points in viva/presentation

Use this sequence:

1. Problem statement and why RBAC is critical in exams.
2. Architecture in one slide: React -> REST API -> MySQL.
3. Show layered backend package structure.
4. Show one end-to-end use case:
   - Faculty create exam -> add question -> student attempt -> faculty evaluate -> admin publish.
5. Explain OOP and SOLID with concrete file examples.
6. Explain creational patterns mostly handled by Spring container.
7. Close with improvements:
   - JWT auth, analytics, proctoring, audit trail, notifications.

---

## 14) Future improvements (technical)

- Replace Basic Auth with JWT + refresh token
- Add pagination/filtering on large lists
- Add unit/integration tests per service/controller
- Add audit logs for evaluation and publish actions
- Add richer domain projections/DTO mapping to avoid overfetching

---

This explanation is aligned to the current codebase in this repository and can be used directly for project demo and documentation.
