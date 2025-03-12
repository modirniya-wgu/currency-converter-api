# Currency Converter API

A production-ready currency converter API built with Node.js, Express, and TypeScript. This API provides real-time exchange rates and currency conversion capabilities using data from the Open Exchange Rates API.

## Features

- Real-time exchange rates from Open Exchange Rates
- Currency conversion between any supported currencies
- Automatic rate updates with configurable intervals
- Rate limiting and security features
- Comprehensive error handling
- Detailed logging with Winston
- Full test coverage with Jest
- API documentation with Swagger/OpenAPI
- TypeScript for type safety
- Docker support

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Open Exchange Rates API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter-api.git
   cd currency-converter-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   EXCHANGE_API_KEY=your_api_key_here
   EXCHANGE_API_BASE_URL=https://openexchangerates.org/api
   BASE_CURRENCY=USD
   CACHE_TTL=7200000
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## Deployment

This project is automatically deployed to Render.com through GitHub Actions. The deployment process includes:

1. Continuous Integration (CI) checks:
   - Linting
   - Testing across Node.js versions (16.x, 18.x, 20.x)
   - Code coverage reporting

2. Automatic deployment when CI passes:
   - Deploys to Render.com
   - Verifies deployment health
   - Monitors deployment status

### Environment Variables Required for Deployment

Set these secrets in your GitHub repository:

- `RENDER_API_KEY`: Your Render API key
- `RENDER_SERVICE_ID`: Your Render service ID
- `RENDER_DEPLOY_URL`: Your deployment URL
- `EXCHANGE_API_KEY`: Your Open Exchange Rates API key

### Manual Deployment

To deploy manually to Render:

1. Fork this repository
2. Create a new Web Service in Render
3. Connect your forked repository
4. Set the required environment variables
5. Deploy

The service will automatically deploy on every push to the main branch after passing CI checks.

### Deployment Status

- CI Status: ![CI](https://github.com/[username]/currency-converter-api/workflows/CI/badge.svg)
- Deployment Status: ![Deploy](https://github.com/[username]/currency-converter-api/workflows/Deploy/badge.svg)

## Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the server is running. It provides detailed information about all available endpoints, request/response formats, and examples.

### Available Endpoints

- `GET /api/health` - Check API health status
- `GET /api/rates` - Get all exchange rates
- `GET /api/rates/:base` - Get exchange rates for a specific base currency
- `GET /api/convert` - Convert between currencies
- `GET /api/currencies` - Get list of supported currencies

## Security Features

- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- Error handling
- Secure environment variables

## Logging

The API uses Winston for logging with the following features:
- Request logging
- Error logging
- Service operation logging
- Console and file transport
- Log rotation

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Rate limit errors
- API errors
- Server errors
- Custom error types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 