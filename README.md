# Network Management Backend API

## Overview

This is a comprehensive backend API built with **NestJS** for network management operations. The application provides authentication, user management, IP address management, and subnet management capabilities. It features a **modular architecture** with **custom interceptors**, **rate-limiting**, **helmet** for security, and **exception filters** for error handling.

## Architecture

- **Backend**: NestJS (TypeScript), TypeORM, MySQL, JWT Authentication
- **Database**: MySQL with persistent volume storage
- **Security**: Helmet, Rate Limiting, JWT Guards, Exception Filters
- **Containerization**: Docker with Docker Compose for easy deployment

## Features

- **Authentication & Authorization**:
  - User registration and login with JWT tokens
  - Protected routes with authentication guards
  - Role-based access control

- **User Management**:
  - Complete CRUD operations for user accounts
  - User profile management
  - Secure password handling with bcrypt

- **IP Address Management**:
  - Create, read, update, and delete IP addresses
  - IP validation and conflict detection
  - Association with subnets

- **Subnet Management**:
  - Subnet creation and management
  - IP range validation
  - Bulk operations support
  - File upload for subnet data

- **Security Features**:
  - Rate limiting to prevent abuse
  - Helmet middleware for HTTP security headers
  - Global exception handling
  - Input validation with class-validator

## Backend Setup (NestJS)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abdelrahman-2513/subnet-assessment-node
   cd backend
   ```

2. Install dependencies:

    ```bash
    npm install
   ```

3. Environment Configuration:
   
   Create a `.env` file in the backend directory:
   
   ```bash
   # Database Configuration
   DB_SERVER=localhost
   DB_PORT=3306
   DB_NAME=cyshield
   DB_USER=cyshield_user
   DB_PASSWORD=cyshield_password
   MYSQL_ROOT_PASSWORD=your_secure_root_password
   
   # JWT Configuration
   JWT_KEY=YourSuperSecretJWTKeyThatIsAtLeast32CharactersLong!
   JWT_ISSUER=Cyshield
   JWT_AUDIENCE=CyshieldUsers
   JWT_EXPIRE_MINUTES=60
   
   # Application Configuration
   PORT=3000
   NODE_ENV=development
   WHITELIST=http://localhost:4200
   ```

4. Start Development Server:

    ```bash
    npm run start:dev
   ```

### Docker Setup (Recommended)

Using Docker Compose (includes MySQL):

   ```bash
   # Start the application with MySQL
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop the application
   docker-compose down
   ```

## Backend Structure

The backend follows a modular architecture with clear separation of concerns. Here's the overview of the key directories and modules:

### **`src/`** 
Contains the main backend application code.

### **`auth/`**
Authentication and authorization module:
- **Controllers**: Handle login and registration endpoints
- **Services**: JWT token generation and validation
- **Guards**: Authentication guards for protected routes
- **DTOs**: Data transfer objects for auth requests/responses

### **`user/`**
User management module for CRUD operations:
- **Create User**: User registration and profile creation
- **Read User**: Fetch user details and profiles
- **Update User**: Modify user information
- **Delete User**: Remove users from the system

### **`ip/`**
IP address management module:
- **Controllers**: Handle IP address CRUD operations
- **Services**: IP validation and conflict detection
- **Repositories**: Data access layer for IP entities
- **DTOs**: IP-related data transfer objects

### **`subnet/`**
Subnet management module:
- **Controllers**: Handle subnet operations and file uploads
- **Services**: Subnet validation and IP range management
- **Repositories**: Data access layer for subnet entities
- **Helpers**: Subnet calculation and validation utilities

### **`shared/`**
Common utilities and shared components:
- **Exception Filters**: Global error handling
- **Interceptors**: Response transformation and logging
- **Guards**: Authentication and authorization guards
- **DTOs**: Shared data transfer objects
- **Enums**: Application-wide enumerations

### **`config/`**
Configuration management:
- **Config Service**: Environment variable management
- **Database Configuration**: TypeORM setup and connection
- **JWT Configuration**: Token settings and validation

### **`main.ts`**
Application entry point that initializes the NestJS application with middleware and global configurations.

### **`app.module.ts`**
Root module that imports and configures all feature modules, middleware, and global providers.


## API Endpoints

### Authentication Endpoints

- **POST /auth/signup**: User registration with email and password
- **POST /auth/signin**: User login with JWT token response

### User Management (Protected Routes)

- **GET /user**: Fetch current user profile
- **PATCH /user**: Update user information
- **DELETE /user**: Delete user account

### IP Address Management (Protected Routes)

- **GET /ip**: List all IP addresses with pagination
- **POST /ip**: Create new IP address
- **GET /ip/:id**: Get specific IP address details
- **PATCH /ip/:id**: Update IP address information
- **DELETE /ip/:id**: Delete IP address

### Subnet Management (Protected Routes)

- **GET /subnet**: List all subnets with pagination
- **POST /subnet**: Create new subnet
- **GET /subnet/:id**: Get specific subnet details
- **PATCH /subnet/:id**: Update subnet information
- **DELETE /subnet/:id**: Delete subnet
- **POST /subnet/upload**: Upload subnet data from file

## Security Features

### 1. Authentication & Authorization

- JWT-based authentication with configurable expiration
- Protected routes with authentication guards
- Role-based access control (extensible)

### 2. Rate Limiting

- Multi-tier rate limiting using `@nestjs/throttler`:
  - Short-term: 10 requests per minute
  - Medium-term: 20 requests per 5 minutes
  - Long-term: 100 requests per 15 minutes

### 3. Security Headers

- Helmet middleware for HTTP security headers

### 4. Input Validation

- Class-validator for request validation
- Custom validation pipes for data integrity

### 5. Exception Handling

- Global exception filters for consistent error responses
- Structured error messages with proper HTTP status codes

## Development

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (optional but recommended)

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot reload
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

```

### Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **IP**: IP address records with validation
- **Subnet**: Subnet definitions with IP ranges

### Environment Variables

All configuration is managed through environment variables. See the installation section for the complete list of required variables.

## Docker Configuration

The application includes Docker support for easy deployment:

- **Dockerfile**: Multi-stage build for optimized production image
- **docker-compose.yml**: Complete stack with MySQL database
- **Persistent volumes**: Data persistence for MySQL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
