# eKYC Risk Intelligence Platform - Backend Foundation

Backend foundation for the AI-Powered eKYC & Risk Intelligence Platform built on MOSIP.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Module System**: ES Modules
- **Environment Management**: dotenv
- **CORS**: cors middleware

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express application configuration
│   ├── routes/
│   │   └── auth.routes.js     # Authentication route definitions
│   └── controllers/
│       └── auth.controller.js # Authentication business logic
│
├── .env                       # Environment variables (gitignored)
├── .env.example               # Example environment configuration
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies and scripts
└── README.md                  # This file
```

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
PORT=5000
REVIEWER_ESIGNET_SUBJECTS=comma-separated-esignet-subject-ids
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Reviewer Workflow

Users are created with the `user` role by default. To explicitly identify an internal reviewer, add one or more eSignet subject IDs to `REVIEWER_ESIGNET_SUBJECTS`, separated by commas, and sign in again. Reviewer access is available at `/reviewer/reviews` and is protected by the persisted user role.

The reviewer API is mounted under `/api/reviews`. It provides a pending queue, authenticated evidence/document access, and decisions for `APPROVE`, `REJECT`, and `REQUEST_MORE_INFORMATION`.

## API Endpoints

### Health Check
**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "message": "Authentication backend is running"
}
```

### eSignet Authentication (Placeholder)
**GET** `/api/auth/esignet`

**Response:**
```json
{
  "success": true,
  "message": "eSignet authentication endpoint will be implemented in the next step"
}
```

### eSignet Callback (Placeholder)
**GET** `/api/auth/esignet/callback`

**Response:**
```json
{
  "success": true,
  "message": "eSignet callback endpoint will be implemented later"
}
```

## Testing Endpoints

You can test the endpoints using curl or any HTTP client:

```bash
# Health check
curl http://localhost:5000/api/health

# eSignet authentication
curl http://localhost:5000/api/auth/esignet

# eSignet callback
curl http://localhost:5000/api/auth/esignet/callback
```

Or using PowerShell:

```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri http://localhost:5000/api/auth/esignet | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri http://localhost:5000/api/auth/esignet/callback | Select-Object -ExpandProperty Content
```

## Architecture

### Why are app.js and server.js separate?

**app.js** exports the configured Express application without starting a server. This allows:
- Testing the Express app without starting an HTTP server
- Running multiple instances with different configurations
- Better separation of concerns (configuration vs execution)

**server.js** imports the app and starts the HTTP server. This is the entry point for production and development.

### Routes vs Controllers

**Routes** (`auth.routes.js`):
- Define URL structure and HTTP methods
- Map URLs to controller functions
- Handle routing-level middleware
- Keep the application's API contract clear

**Controllers** (`auth.controller.js`):
- Contain business logic
- Process requests and prepare responses
- Handle data validation and transformation
- Easier to test in isolation

This separation follows the MVC (Model-View-Controller) pattern and makes the codebase more maintainable.

## Next Steps

### Step 3: eSignet OAuth/OIDC Integration
- Implement PKCE (Proof Key for Code Exchange) flow
- Add code_challenge generation
- Implement authorization redirect
- Add token exchange logic
- Verify ID tokens

### Step 4: Session Management
- Add JWT-based sessions
- Implement token refresh logic
- Add authentication middleware

### Step 5: Database Integration
- Connect MongoDB
- Create user schema
- Store authenticated user data

### Step 6: Frontend Integration
- Connect React frontend to backend endpoints
- Implement OAuth flow on the frontend
- Handle authentication state

## Why Create eSignet Endpoints Now?

Even though eSignet integration isn't implemented yet, creating the endpoints now:

1. **Establishes the API contract** - Frontend developers can start building against these endpoints
2. **Documents the authentication flow** - Makes it clear what endpoints will be available
3. **Allows parallel development** - Backend and frontend can progress simultaneously
4. **Smooth transition** - When we implement the real OAuth flow, we just update the controller logic

## Dependencies

- **express** (^4.18.2): Fast, unopinionated web framework for Node.js
- **dotenv** (^16.3.1): Loads environment variables from .env file
- **cors** (^2.8.5): Enables Cross-Origin Resource Sharing for React frontend
- **nodemon** (^3.0.1): Development tool that auto-restarts server on file changes

## License

ISC
