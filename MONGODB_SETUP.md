# MongoDB Setup Guide

## Option 1: Install MongoDB Community Server (Local)

1. **Download MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, Version 7.0+, MSI package
   - Download and run installer

2. **Install**:
   - Run the .msi file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```cmd
   mongod --version
   mongo --version
   ```

4. **Start MongoDB**:
   - Service starts automatically, or run:
   ```cmd
   net start MongoDB
   ```

## Option 2: MongoDB Atlas (Cloud - Easier)

1. **Create Account**: https://www.mongodb.com/atlas
2. **Create Free Cluster**:
   - Choose M0 Sandbox (Free)
   - Select region closest to you
3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
4. **Update .env file** with your connection string

## Quick Test

After setup, run:
```cmd
npm run dev
```

Check browser console for connection status.