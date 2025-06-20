# Economic Development Management System

## Overview

This project is a full-stack web application for managing economic development programs and projects. The system allows users to create, track, and manage development initiatives with comprehensive details about budgets, partnerships, progress status, and implementation metrics.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with connection pooling
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot module replacement with Vite integration

## Key Components

### Data Models
- **Programmes**: Top-level development programs with global objectives, budgets, and partnerships
- **Projets**: Individual projects linked to programs with detailed tracking metrics including:
  - Financial information (global budget, regional participation)
  - Geographic scope (provinces, communes)
  - Progress indicators (qualitative and quantitative)
  - Implementation status and remarks

### Frontend Components
- **Dashboard**: Overview with statistics cards showing program/project counts and financial summaries
- **Programme Management**: CRUD operations with filtering by sector
- **Project Management**: CRUD operations with filtering by program and status
- **Responsive Layout**: Sidebar navigation with mobile-responsive design

### Backend Services
- **Storage Layer**: Database abstraction with interface pattern for future extensibility
- **API Routes**: RESTful endpoints for programmes and projects
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Request Logging**: Development-friendly API request logging

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query for caching and state management
2. **API Processing**: Express routes validate requests using Zod schemas
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: Data flows back through the API layer with proper error handling
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection handling
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state and validation
- **@hookform/resolvers**: Zod integration for forms
- **wouter**: Lightweight routing
- **lucide-react**: Icon library

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant utilities
- **cmdk**: Command palette functionality

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR on port 5000
- **Database**: Local PostgreSQL instance
- **Environment Variables**: `.env` file with database connection string

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite builds frontend assets, esbuild bundles server
- **Server**: Express serves both API and static files
- **Database**: PostgreSQL with connection pooling for scalability

### Build Configuration
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js`
- **Static Assets**: Express serves built frontend from public directory

## Changelog
```
Changelog:
- June 17, 2025. Initial setup
- June 17, 2025. Migration to Replit completed - Fixed date validation in forms, configured PostgreSQL database, all API endpoints working correctly
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```