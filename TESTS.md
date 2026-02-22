# Manual API test plan

This file documents quick steps to test the running Bugtracker app (Postman or curl). It follows the flow you requested: create a project, insert a user manually into the DB, create an issue, and update its status.

Prerequisites
- App running on http://localhost:8080 (run with `./mvnw.cmd spring-boot:run`)
- MySQL database `bugtracker_db` exists and app is connected (see `src/main/resources/application.properties`)

1) Create Project (POST)

Endpoint
POST http://localhost:8080/api/projects

Body (JSON)
```
{
  "name": "Bug Tracker System",
  "description": "Enterprise backend project"
}
```

curl (PowerShell)
```powershell
curl -Method POST -Uri "http://localhost:8080/api/projects" -ContentType "application/json" -Body '{"name":"Bug Tracker System","description":"Enterprise backend project"}'
```

Expected
- 200 OK with JSON body of created project (id assigned).

2) Create User (temporary via direct SQL)

Run this in your MySQL client (adjust credentials if needed):
```sql
INSERT INTO user (name, email, password, role)
VALUES ('Waseem', 'waseem@test.com', '123', 'DEVELOPER');

-- Then verify
SELECT id, name, email, role FROM user WHERE email = 'waseem@test.com';
```

Note: There's currently no REST endpoint for creating users in this project; if you want one I can add `UserController`.

3) Create Issue (POST)

Endpoint
POST http://localhost:8080/api/issues?projectId=1&userId=1

Body (JSON)
```
{
  "title": "Login not working",
  "description": "JWT token not generating",
  "priority": "HIGH"
}
```

curl (PowerShell)
```powershell
$body = '{"title":"Login not working","description":"JWT token not generating","priority":"HIGH"}'
curl -Method POST -Uri "http://localhost:8080/api/issues?projectId=1&userId=1" -ContentType "application/json" -Body $body
```

Expected
- 200 OK with JSON body of created issue (id, status = OPEN, createdAt, updatedAt, linked project and assigned user).

4) Update Issue Status (PUT)

Endpoint
PUT http://localhost:8080/api/issues/1?status=IN_PROGRESS

curl (PowerShell)
```powershell
curl -Method PUT -Uri "http://localhost:8080/api/issues/1?status=IN_PROGRESS"
```

Expected
- 200 OK with updated issue JSON (status = IN_PROGRESS, updatedAt changed).

Quick verification queries (MySQL)
```sql
USE bugtracker_db;
SELECT * FROM project LIMIT 10;
SELECT * FROM user LIMIT 10;
SELECT * FROM issue LIMIT 10;
```

Troubleshooting
- If you get a 500 on POST /api/issues, verify that the `user` and `project` rows exist and the `projectId` and `userId` passed in the request match the DB ids.
- If tables are missing, ensure the app started successfully and that `spring.jpa.hibernate.ddl-auto` is set (development: `update`). Check logs for `Hibernate: create table` lines.

Optional follow-ups I can implement
- Add `UserController` to create/list users via REST.
- Add a small `data.sql` to seed an initial user/project/issue on startup.
- Provide a Postman collection export (.json) for quick import.

----
Generated: Test plan for manual verification using Postman or curl.
