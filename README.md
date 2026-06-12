# Docker Compose Demo - Angular 22 + ASP.NET Core (.NET 10) + PostgreSQL

A complete Docker Compose setup with Angular 22 frontend, ASP.NET Core API, and PostgreSQL database.

## Project Structure

```
.
├── docker-compose.yml       # Main Docker Compose configuration
├── backend/                 # ASP.NET Core API
│   ├── Dockerfile
│   ├── backend.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/
│   │   └── ItemsController.cs
│   ├── Models/
│   │   └── Item.cs
│   └── Data/
│       └── ApplicationDbContext.cs
├── frontend/                # Angular 22 App
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── angular.json
│   ├── nginx.conf
│   └── src/
│       ├── main.ts
│       ├── index.html
│       ├── styles.css
│       └── app/
│           ├── app.component.ts
│           ├── app.component.html
│           ├── app.component.css
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── services/
│           │   └── item.service.ts
│           └── components/
│               └── items/
│                   ├── items.component.ts
│                   ├── items.component.html
│                   └── items.component.css
└── README.md
```

## Services

### Database (PostgreSQL)
- **Container**: demo-db
- **Port**: 5432
- **Username**: sa
- **Password**: Password123!
- **Database**: demo

### API (ASP.NET Core)
- **Container**: demo-api
- **Port**: 5000
- **Base URL**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

### Frontend (Angular)
- **Container**: demo-frontend
- **Port**: 4200
- **URL**: http://localhost:4200

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### 1. Clone or Download the Project

```bash
cd demo
```

### 2. Build and Start the Containers

```bash
docker-compose up --build
```

### 3. Access the Application

- **Frontend**: http://localhost:4200
- **API Swagger**: http://localhost:5000/swagger
- **Database**: localhost:5432

### 4. Stop the Containers

```bash
docker-compose down
```

## Features

### Backend API
- RESTful API endpoints for items management
- CRUD operations (Create, Read, Update, Delete)
- Entity Framework Core with PostgreSQL
- Swagger/OpenAPI documentation
- CORS enabled for frontend communication

### Frontend Application
- Angular 22 standalone components
- Responsive design with CSS styling
- Items management interface
- Add, edit, delete items
- Real-time updates from API
- HttpClient for API calls

### Database
- PostgreSQL 16 Alpine
- Automatic table creation
- Health checks enabled
- Persistent volume for data

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

## Environment Variables

Database credentials are configured in `docker-compose.yml`:
- `POSTGRES_USER`: sa
- `POSTGRES_PASSWORD`: Password123!
- `POSTGRES_DB`: demo

API connection string in `backend/appsettings.json`:
```
Host=postgres;Port=5432;Database=demo;Username=sa;Password=Password123!
```

## Troubleshooting

### Database Connection Issues
```bash
# Check database container logs
docker-compose logs postgres

# Check API container logs
docker-compose logs api
```

### Frontend Not Loading
```bash
# Clear browser cache and hard refresh
Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Rebuild Containers
```bash
docker-compose down
docker-compose up --build
```

## Development

### Modify Backend Code
Edit files in `./backend/` and rebuild:
```bash
docker-compose up --build api
```

### Modify Frontend Code
The frontend is set up to rebuild on file changes. Simply modify files in `./frontend/src/` and refresh the browser.

## Production Considerations

- Change database credentials
- Use environment-specific configuration files
- Enable HTTPS
- Set proper CORS policies
- Implement authentication and authorization
- Add request logging and monitoring
- Use production-grade database backups

## License

MIT
