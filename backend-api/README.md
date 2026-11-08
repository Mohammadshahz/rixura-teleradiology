# Radiology Service Application

## Overview
The Radiology Service is a comprehensive backend solution built on NestJS for managing radiology reports, patients, centers, and user workflows. It provides a robust API for radiology centers and radiologists to manage X-ray reports, patient information, and communication between different stakeholders in the radiology process.

## System Architecture

### Technology Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: AWS Cognito, JWT
- **API Documentation**: Swagger/OpenAPI
- **Email Service**: AWS SES

### Core Modules

#### User Module
Manages user accounts with different roles in the system:
- Super Admin
- Admin
- Moderator
- Radiologist
- Center

#### Patient Module
Handles patient data management, including:
- Patient registration
- Patient medical history
- Patient association with centers

#### Report Module
Manages radiology reports workflow:
- Report creation and submission
- Report assignment to radiologists
- Report types (Normal, Abnormal)
- X-ray type classification
- Report comments and collaboration

#### Center Module
Manages radiology centers:
- Center registration and profile management
- User-center associations
- Center-specific configurations

#### Feedback Module
Handles user feedback within the system:
- Feedback submission
- Feedback management



## API Endpoints

### User Management
- `POST /users` - Create a new user
- `GET /users` - Get all users (with filtering)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Patient Management
- `POST /patients` - Register a new patient
- `GET /patients` - List patients (with filtering)
- `GET /patients/:id` - Get patient details
- `PATCH /patients/:id` - Update patient information
- `DELETE /patients/:id` - Delete patient

### Report Management
- `POST /reports` - Create a new report
- `GET /reports` - List reports (with filtering)
- `GET /reports/:id` - Get report details
- `PATCH /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report
- `POST /reports/:id/comments` - Add comment to report
- `GET /reports/:id/comments` - Get report comments

### Center Management
- `POST /centers` - Create a new center
- `GET /centers` - List centers
- `GET /centers/:id` - Get center details
- `PATCH /centers/:id` - Update center
- `DELETE /centers/:id` - Delete center

### Feedback Management
- `POST /feedback` - Submit feedback
- `GET /feedback` - List feedback (with filtering)
- `GET /feedback/:id` - Get feedback details
- `PATCH /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback

## Application Features

### Authentication & Authorization
- AWS Cognito integration for secure user authentication
- Role-based access control (RBAC) for different user types
- JWT token verification for API access

### Report Workflow
1. Center creates a report with patient information and X-ray data
2. System assigns report to an available radiologist
3. Radiologist analyzes the report and provides diagnosis
4. Center receives the completed report
5. Communication between radiologist and center via report comments

### Database Design
- Uses PostgreSQL with TypeORM
- All database tables use snake_case naming convention
- UUID primary keys for all entities
- Timestamps for created_at and updated_at on all records
- Proper foreign key relationships between entities

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- AWS account (for Cognito and SES services)

### Environment Variables
```
DB_URL=postgresql://username:password@localhost:5432/radiology_db
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
JWT_SECRET=your-jwt-secret
```

### Installation Steps

```bash
# Clone the repository
$ git clone https://repository-url/radiology-service.git

# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your configuration

# Run database migrations
$ npm run migration:run

# Start the application
$ npm run start:dev
```

### API Documentation
Swagger UI documentation is available at `/api` endpoint when the application is running.

## Development

### Running Tests
```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

### Code Style and Formatting
```bash
# Lint code
$ npm run lint

# Format code with Prettier
$ npm run prettier:fix
```

## Deployment

### Production Deployment
```bash
# Build for production
$ npm run build

# Start production server
$ npm run start:prod
```

### Docker Deployment
A Dockerfile is provided for containerized deployment:
```bash
# Build Docker image
$ docker build -t radiology-service .

# Run container
$ docker run -p 3000:3000 --env-file .env radiology-service
```

## License
This project is licensed under the MIT License.

