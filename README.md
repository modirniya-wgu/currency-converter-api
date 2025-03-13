# Currency Converter API

A robust and scalable currency conversion API built with Node.js, TypeScript, and Express. This service provides real-time currency conversion using the Open Exchange Rates API.

## Features

- Real-time currency conversion
- Rate caching for improved performance
- Rate limiting for API protection
- Swagger documentation
- Docker support
- Health check endpoint
- Comprehensive error handling
- TypeScript for type safety

## Prerequisites

- Docker
- Open Exchange Rates API key

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/modirniya-wgu/currency-converter-api.git
cd currency-converter-api
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your Open Exchange Rates API key.

4. Build and run with Docker:
```bash
# Build the Docker image
docker build -t currency-converter-api .

# Run the container
docker run -p 3000:3000 --env-file .env currency-converter-api
```

The API will be available at `http://localhost:3000`.

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for the Swagger documentation.

### Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/rates` - Get all exchange rates
- `GET /api/rates/:base` - Get exchange rates for a specific base currency
- `GET /api/convert` - Convert between currencies
- `GET /api/currencies` - List available currencies

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `EXCHANGE_API_KEY` - Open Exchange Rates API key
- `EXCHANGE_API_BASE_URL` - Base URL for the exchange rate API
- `BASE_CURRENCY` - Default base currency (default: USD)
- `CACHE_TTL` - Cache time-to-live in milliseconds
- `RATE_LIMIT_WINDOW` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window

## Deployment

This project is containerized and can be deployed to any platform that supports Docker containers. We recommend using Render for easy deployment:

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Choose "Docker" as the environment
4. Set your environment variables
5. Deploy!

## Development

For local development without Docker:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build
npm run build

# Run in production mode
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.