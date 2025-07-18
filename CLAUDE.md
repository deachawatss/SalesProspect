# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProspectSync is a full-stack web application designed for sales staff to transfer newly-created prospects from the production database (TFCLIVE) to the reporting database (SR). The application features role-based access control, search functionality, and secure data transfer operations.

## Architecture

### Backend (.NET 8 / ASP.NET Core Web API)
- **Controllers**: RESTful API endpoints in `backend/Controllers/`
- **Services**: Business logic in `backend/Services/ProspectService.cs`
- **Models**: Data models in `backend/Models/`
- **Configuration**: JWT settings, database connections, rate limiting in `backend/Configuration/`

### Frontend (React 18 + TypeScript)
- **Components**: Reusable UI components in `frontend/src/components/`
- **Pages**: Main application pages in `frontend/src/pages/`
- **Services**: API client in `frontend/src/services/api.ts`
- **Types**: TypeScript definitions in `frontend/src/types/`

### Database Integration
- **TFCLIVE**: Production database (source)
- **SR (srm_db)**: Reporting database (destination)
- **Dapper**: ORM for SQL operations with parameterized queries

## Development Commands

### Backend Development
```bash
cd backend
dotnet restore                    # Restore NuGet packages
dotnet run                       # Run backend API (http://localhost:5102)
dotnet test                      # Run backend tests
```

### Frontend Development
```bash
cd frontend
npm install                      # Install dependencies
npm run dev                      # Run development server (http://localhost:3000)
npm run build                    # Build for production
npm run lint                     # Run ESLint
npm test                         # Run tests with Vitest
```

### Docker Development
```bash
docker-compose up --build        # Build and run full stack
```

## Key Configuration Files

### Backend Configuration
- `backend/appsettings.json`: Database connection strings, JWT settings, rate limiting
- `backend/appsettings.Development.json`: Development-specific settings
- `backend/Program.cs`: Application startup, middleware configuration

### Frontend Configuration
- `frontend/vite.config.ts`: Vite configuration with proxy setup
- `frontend/package.json`: Dependencies and scripts
- `frontend/tsconfig.json`: TypeScript configuration

## API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login and get JWT token | None |
| GET | `/api/prospects/search?q={query}` | Search prospects | JWT Required |
| GET | `/api/prospects/{key}/status` | Get prospect status | JWT Required |
| POST | `/api/prospects/{key}/transfer` | Transfer prospect | JWT Required |

## Security Features

- **JWT Authentication**: Role-based access control (Sales, Admin)
- **Input Validation**: Prospect keys limited to ASCII varchar(20)
- **Rate Limiting**: Transfer operations limited to 10 per minute
- **SQL Injection Prevention**: Parameterized queries throughout
- **CORS**: Configured for frontend origins

## Database Operations

The application performs cross-database operations between TFCLIVE and SR databases:
- **Search**: Query TFCLIVE for prospect autocomplete
- **Status Check**: Verify existence in both databases
- **Transfer**: Transactional copy from TFCLIVE to SR with rollback on failure

## Authentication & Security

### Active Directory Integration
- **Login System**: Full Active Directory authentication with 1-week JWT token expiration
- **LDAP Support**: Primary authentication via LDAP binding (ldap://192.168.0.1)
- **Fallback Authentication**: PrincipalContext and test users for development
- **Token Management**: Automatic token validation and refresh with 1-week expiration
- **Protected Routes**: All application routes require authentication
- **User Management**: Role-based access (Sales, Admin) based on AD group membership
- **Domain**: NWFTH.com with service account authentication

### Security Features
- **JWT Authentication**: 1-week token expiration (10,080 minutes)
- **Rate Limiting**: Transfer operations limited to 10 per minute, general API calls to 100 per minute
- **SQL Injection Prevention**: Parameterized queries throughout
- **CORS**: Configured for frontend origins
- **Protected API**: All prospect operations require valid JWT token

### Login Implementation
- **Frontend**: React login page with company logo and clean interface
- **Backend**: LDAP-first authentication with Active Directory service fallback
- **Token Storage**: LocalStorage with automatic expiration handling
- **Auto-Logout**: Automatic logout on token expiration or invalid responses
- **UI**: Company logo integration with professional styling
- **Labels**: Simplified username/password labels (removed "Domain" prefix)

## Important Notes

- Authentication is now enabled in Program.cs
- LDAP configuration points to ldap://192.168.0.1 with NWFTH.com domain
- Database connection strings contain hardcoded credentials in configuration files
- Rate limiting is configured for transfer operations to prevent abuse
- All database operations use transactions for data consistency
- Frontend uses Ant Design for UI components and TanStack Query for state management
- Active Directory service includes Windows-only functionality warnings (expected for Linux development)
- Application header displays "Sales Prospect Management System"
- Login page includes company logo and simplified interface

## Testing

- Backend tests should be placed in `backend/ProspectSync.Api.Tests/`
- Frontend tests use Vitest and React Testing Library
- Test files follow the pattern `*.test.ts` or `*.test.tsx`

## Environment Variables

For production deployment, configure these environment variables:
- `ConnectionStrings__Tfclive`: TFCLIVE database connection
- `ConnectionStrings__Sr`: SR database connection
- `Jwt__Secret`: JWT signing secret (minimum 32 characters)
- `ASPNETCORE_ENVIRONMENT`: Environment setting

## Ant Design v5 Migration

### React 19 Compatibility
- **Current React Version**: 19.1.0
- **Current Ant Design Version**: v5.26.4
- **Solution**: Using official `@ant-design/v5-patch-for-react-19` package (v1.0.3)

The project uses React 19 with Ant Design v5, which officially supports React 16-18. To resolve compatibility warnings, we've installed the official patch package provided by the Ant Design team.

**Package**: `@ant-design/v5-patch-for-react-19`
- Provides compatibility patches for React 19
- Official solution from Ant Design team
- Allows using React 19 features while maintaining Ant Design v5 compatibility

### Recent Deprecation Fixes Applied
- **Card component**: Replaced `bodyStyle` prop with `styles.body` (v5.14.0+)
- **AutoComplete component**: Replaced `popupClassName` prop with `classNames.popup.root` (v5.0.0+)

### Common Deprecation Patterns
```typescript
// Card component - OLD vs NEW
// OLD (deprecated)
<Card bodyStyle={{ padding: '32px' }} />
// NEW (recommended)
<Card styles={{ body: { padding: '32px' } }} />

// AutoComplete component - OLD vs NEW  
// OLD (deprecated)
<AutoComplete popupClassName="custom-popup" />
// NEW (recommended)
<AutoComplete classNames={{ popup: { root: 'custom-popup' } }} />
```

### Commands for Checking Deprecation Warnings
```bash
# Check for console warnings during development
npm run dev

# Run build to catch any remaining issues
npm run build

# Run linter to check for potential issues
npm run lint
```