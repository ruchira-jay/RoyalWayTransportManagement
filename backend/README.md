# RoyalWay School Transportation System

Backend API for RoyalWay School Transportation System built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/royalway
```

3. Start MongoDB on your local machine

4. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
RoyalWay/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware functions
├── models/          # Mongoose schemas
├── routes/          # API routes
├── server.js        # Entry point
└── package.json     # Dependencies
```

## API Endpoints

- `GET /` - Welcome message
