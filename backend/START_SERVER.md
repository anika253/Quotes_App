# How to Start the Backend Server

## Quick Start

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Make sure your .env file exists with:**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   node index.js
   ```

5. **Verify the server is running:**
   - You should see: `✅ Server is running on port 5000`
   - Open http://localhost:5000/health in your browser
   - You should see: `{"status":"ok","message":"Server is running"}`

## Troubleshooting

### Port 5000 already in use?
- Change the PORT in your .env file
- Or stop the process using port 5000

### MongoDB connection issues?
- The server will still start, but database operations won't work
- Check your MONGO_URI in the .env file

### Routes not working?
- Make sure the server started successfully
- Check that you see the startup messages in the console
- Verify the API base URL matches your frontend config (http://localhost:5000/api)

