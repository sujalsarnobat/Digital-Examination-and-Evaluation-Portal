# Backend - Digital Examination and Evaluation Portal

Spring Boot backend implementing REST APIs for authentication, exam management, question bank, evaluation, and result publishing.

## Run

1. Configure MySQL credentials in src/main/resources/application.properties
2. Run:

```bash
mvn spring-boot:run
```

## Packages

- controller: REST endpoints
- service: business logic
- repository: JPA data access
- model: entities
- dto: API request models
- config: CORS and security configuration
