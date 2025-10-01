# Franchise Service Deployment Guide

## GCP Deployment Options

### Option 1: Cloud Run (Recommended)
```bash
# Build and deploy to Cloud Run
gcloud run deploy franchise-service \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

### Option 2: App Engine
```bash
# Deploy to App Engine
gcloud app deploy app.yaml
```

### Option 3: Cloud Build + Cloud Run (CI/CD)
```bash
# Enable Cloud Build API and set up trigger from GitHub
gcloud builds submit --config cloudbuild.yaml .
```

## Environment Variables for GCP

Set these in Cloud Run/App Engine:
- `NODE_ENV=production`
- `TMDB_API_KEY=your_tmdb_key`
- `FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}`

## Health Check Endpoints

- `GET /` - Service status
- `GET /api/franchises/search?q=test` - API functionality test

## Prerequisites

1. Enable required APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

2. Set up authentication:
   - Service account with appropriate permissions
   - Firebase credentials

## Monitoring

The service includes structured logging with Winston for GCP Cloud Logging integration.