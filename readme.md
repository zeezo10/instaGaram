# InstaGaram App

A social media application built with Apollo GraphQL Server, MongoDB, and React Native (Expo).

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Redis Cloud account
- Expo Go app (for mobile testing)

## Server Setup

1. Navigate to server directory:
``` bash
cd server
```
2. Install dependencies:
``` bash
npm install
```
3. Create `.env` file in the server directory with the following variables:
``` 
PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_PASS=your_redis_password
```
4. Start the server:
```
 bash
npm start
```
The GraphQL server will run on `http://localhost:3000`

## Client Setup

1. Navigate to client directory: 
bash
```
cd client/Instagram
```
2. Install dependencies: 
```bash
npm install
```

3. Update Apollo Client configuration:
In `config/apolloClient.js`, update the URI to point to your GraphQL server:
```

const httpLink = createHttpLink({
uri: "http://your_server_ip:3000",
});
```
4. Start the Expo development server: 

```bash
npm start
````

5. Running the app:
   - Install Expo Go on your mobile device
   - Scan the QR code shown in the terminal with:
     - iOS: Camera app
     - Android: Expo Go app
   - Or press 'i' for iOS simulator or 'a' for Android emulator

## Features

- User Authentication (Login/Register)
- Create Posts with Images
- Like Posts
- Comment on Posts
- Follow/Unfollow Users
- View User Profiles
- Search Users
- View Feed

## Tech Stack

### Server
- Apollo Server
- GraphQL
- MongoDB
- Redis (for caching)
- JSON Web Tokens
- bcryptjs

### Client
- React Native (Expo)
- Apollo Client
- React Navigation
- Expo Secure Store
- Native Wind
- React Native Paper

## Testing Credentials

You can use these test accounts: 
```
Username: user1
Password: 123456
Username: user2
Password: 123456
```
```

This README provides a clear guide for setting up and running both the server and client applications. The code references show that the server uses Apollo Server with MongoDB and Redis for caching, while the client is built with React Native and Expo.

```