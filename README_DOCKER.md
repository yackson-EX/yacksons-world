# Yackson's World - Containerized Application

A containerized Astro web application with MySQL database backend, featuring blogs, messages, reviews, and image management.

## Architecture

This application consists of three main services:

1. **Frontend** - Astro-based static site served by Nginx with HTTPS support
2. **Backend** - Node.js/Express API server handling database operations
3. **Database** - MySQL 8.0 for data persistence

## Prerequisites

- Docker
- Docker Compose
- SSL certificates (for HTTPS)

## Quick Start

### 1. Clone and Setup

```bash
cd yacksons-world
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your settings:
- Database credentials
- Backend URL
- SSL certificate paths

### 3. SSL Certificates

Place your SSL certificates in the `ssl/` directory:
- `ssl/fullchain.pem` - Full certificate chain
- `ssl/privkey.pem` - Private key

For development, you can generate self-signed certificates:

```bash
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem \
  -out ssl/fullchain.pem \
  -subj "/CN=localhost"
```

### 4. Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## Service Ports

- **Frontend (Nginx)**: 
  - HTTP: `80`
  - HTTPS: `443`
- **Backend API**: `3001`
- **MySQL Database**: `3306`

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:slug` - Get single blog post
- `POST /api/blogs` - Create new blog post
- `PUT /api/blogs/:slug` - Update blog post
- `DELETE /api/blogs/:slug` - Delete blog post

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message
- `DELETE /api/messages` - Delete all messages
- `DELETE /api/messages/:id` - Delete single message

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review
- `DELETE /api/reviews/:id` - Delete review

### Images
- `GET /api/images` - Get all images
- `POST /api/images` - Upload image (multipart/form-data)
- `DELETE /api/images/:id` - Delete image

## Database Schema

### Blogs Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
title VARCHAR(255)
slug VARCHAR(255) UNIQUE
content TEXT
pub_date DATETIME
category VARCHAR(100)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Messages Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
text TEXT
timestamp DATETIME
sender ENUM('user', 'other')
created_at TIMESTAMP
```

### Reviews Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
title VARCHAR(255)
content TEXT
rating INT (1-5)
author VARCHAR(100)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Images Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
filename VARCHAR(255)
original_name VARCHAR(255)
mime_type VARCHAR(100)
size INT
url VARCHAR(500)
alt_text VARCHAR(255)
created_at TIMESTAMP
```

## Development

### Local Development (without Docker)

1. **Start MySQL**
```bash
# Run MySQL locally or use Docker
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=yacksons_world \
  -e MYSQL_USER=yackson \
  -e MYSQL_PASSWORD=yackson123 \
  mysql:8.0
```

2. **Initialize Database**
```bash
mysql -h localhost -u yackson -p yacksons_world < database/init.sql
```

3. **Start Backend**
```bash
cd backend
npm install
npm run dev
```

4. **Start Frontend**
```bash
npm install
npm run dev
```

### Building for Production

```bash
# Build all services
docker-compose build

# Push to registry (if needed)
docker tag yacksons-world-frontend:latest your-registry/yacksons-frontend:latest
docker push your-registry/yacksons-frontend:latest
```

## Cloud Deployment

### Custom Domain Setup

1. Point your domain's DNS A record to your server's IP address
2. Update `nginx.conf` to use your domain:
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```
3. Obtain SSL certificates (Let's Encrypt recommended):
   ```bash
   # Using certbot
   certbot certonly --webroot -w /var/www/certbot -d yourdomain.com
   ```

### Environment Variables for Production

Update `.env` with production values:
```env
DB_PASSWORD=<strong-password>
DB_ROOT_PASSWORD=<strong-root-password>
PUBLIC_BACKEND_URL=https://yourdomain.com
```

## Maintenance

### Backup Database
```bash
docker exec yacksons-db mysqldump -u root -p yacksons_world > backup.sql
```

### Restore Database
```bash
docker exec -i yacksons-db mysql -u root -p yacksons_world < backup.sql
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting

### Database Connection Issues
- Verify database container is running: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Ensure database is healthy: `docker-compose ps` (should show "healthy")

### Backend API Not Responding
- Check backend logs: `docker-compose logs backend`
- Verify backend can connect to database
- Ensure port 3001 is not blocked

### Frontend Not Loading
- Check nginx logs: `docker-compose logs frontend`
- Verify SSL certificates are mounted correctly
- Check browser console for API errors

### SSL Certificate Issues
- Ensure certificates are in PEM format
- Verify file permissions allow nginx to read certificates
- Check certificate paths in `nginx.conf`

## Security Notes

- Change default database passwords in production
- Use strong passwords for all credentials
- Keep SSL certificates private and secure
- Regularly update Docker images
- Consider using Docker secrets for sensitive data
- Implement rate limiting for API endpoints
- Add authentication for admin endpoints

## License

MIT
