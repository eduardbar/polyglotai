# 🚀 Deployment Guide - PolyglotAI

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- MySQL 8.0+ (or use Docker)

## Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/eduardbar/polyglotai.git
cd polyglotai
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Initialize database**
```bash
docker-compose exec api_service npx prisma db push
docker-compose exec api_service node prisma/seed.js
```

5. **Access the application**
- Frontend: http://localhost:3003
- API: http://localhost:3000
- NMT Service: http://localhost:8001

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI translation | Required |
| `DATABASE_URL` | MySQL connection string | See .env.example |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `CORS_ORIGIN` | Frontend URL for CORS | http://localhost:3003 |

## Production Deployment

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Railway/Heroku (Backend)
1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend services

### Docker Swarm/Kubernetes
Use the provided `docker-compose.yml` as a base for orchestration.

## Health Checks

- API Health: `GET /health`
- NMT Health: `GET /health`
- Frontend: Access root URL

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check MySQL container status
3. **API key issues**: Verify Gemini API key is valid
4. **CORS errors**: Update CORS_ORIGIN environment variable

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs api_service
docker-compose logs nmt_service
```
