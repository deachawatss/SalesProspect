# Prospect Sync

An internal web application for sales staff to transfer newly-created prospects from the production database (TFCLIVE) to the reporting database (SR).

## Features

- **Search Prospects**: Autocomplete search functionality to find prospects by key
- **View Status**: Check if a prospect exists in both TFCLIVE and SR databases
- **Transfer Prospects**: Admin users can transfer prospects from TFCLIVE to SR
- **Role-based Access**: Sales staff can search/view, Admins can transfer
- **Rate Limiting**: Transfer operations are rate-limited to prevent abuse

## Tech Stack

### Backend
- .NET 8 / ASP.NET Core Web API
- Dapper for SQL operations
- SQL Server
- JWT Authentication
- AspNetCoreRateLimit

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Ant Design for UI components
- Axios for HTTP requests
- TanStack Query for data fetching
- React Router for navigation

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- SQL Server (with TFCLIVE and srm_db databases)
- Docker (optional, for containerized deployment)

## Getting Started

### 1. Configure Database Connection

Update the connection strings in `backend/ProspectSync.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Tfclive": "Server=YOUR_SERVER;Database=TFCLIVE;Trusted_Connection=True;TrustServerCertificate=True;",
    "Sr": "Server=YOUR_SERVER;Database=srm_db;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 2. Run Backend

```bash
cd backend/ProspectSync.Api
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`

## Authentication

Default credentials for testing:

- **Sales User**: username: `sales`, password: `sales123`
- **Admin User**: username: `admin`, password: `admin123`

## API Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login and get JWT token | None |
| GET | `/api/prospects/search?q={query}` | Search prospects | Sales, Admin |
| GET | `/api/prospects/{key}/status` | Get prospect status | Sales, Admin |
| POST | `/api/prospects/{key}/transfer` | Transfer prospect | Admin |

## Docker Deployment

### Build and Run with Docker Compose

1. Update connection strings in `docker-compose.yml`
2. Run:

```bash
docker-compose up --build
```

Access the application at `http://localhost:3000`

## Testing

### Backend Tests

```bash
cd backend/ProspectSync.Api.Tests
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## CI/CD

The project includes GitHub Actions workflow for:
- Running tests on push/PR
- Building Docker images
- Pushing to Docker Hub (on main branch)

Required secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

## Security Features

- JWT authentication with role-based access
- Input sanitization for prospect keys (ASCII varchar(20))
- Rate limiting on transfer operations (10 per minute)
- CORS configured for frontend origin
- SQL injection prevention via parameterized queries

## Deployment Checklist

- [ ] Update database connection strings
- [ ] Configure JWT secret key
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx/IIS)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test disaster recovery procedures

## License

Internal use only 