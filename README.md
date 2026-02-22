# BugTracker

Full-stack bug tracking application with Spring Boot backend and React frontend.

## Prerequisites

- **Java 17+** (for backend)
- **Maven** (for backend)
- **Node.js 18+** (for frontend)

## Quick Start

### Option 1: Start both (recommended)

From the project root:

```bash
npm install
npm start
```

Or on Windows, double-click `start.bat`.

This starts:
- **Backend** at http://localhost:8080
- **Frontend** at http://localhost:5173

### Option 2: Start manually

**Backend:**
```bash
mvn spring-boot:run
```

**Frontend** (in a separate terminal):
```bash
cd bugtracker-frontend
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both backend and frontend |
| `npm run start:backend` | Start only the Spring Boot backend |
| `npm run start:frontend` | Start only the Vite frontend |

## Project Structure

```
bugtracker/
├── pom.xml              # Maven / Spring Boot backend
├── src/                 # Java source
├── bugtracker-frontend/ # React + Vite frontend
├── package.json         # Root scripts for concurrent start
├── start.bat            # Windows startup script
└── start.sh             # Unix/Mac startup script
```
