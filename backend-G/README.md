# WebGen Backend

This directory contains the backend services for the WebProducer/WebGen platform. The backend provides APIs and server-side logic to support content management, user authentication, and integration with external services.

## Usage
To run the backend, ensure you have a valid `.env` file with required environment variables. You can load them with:
```bash
export $(cat .env | xargs)
```
Then start the backend service: (`python3 serve.go`, etc.).

## Features
- RESTful API endpoints
- Content storage and retrieval
- User authentication
- Integration with frontend and external APIs

## Configuration
Edit the `.env` file to set environment variables for database connections, API keys, and other settings.

## License
This project is licensed under the MIT License.
