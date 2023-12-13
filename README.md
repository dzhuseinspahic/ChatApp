# Chat App

## Overview

ChatApp is real-time chat application that allows users to register, log in, and engage in conversations with other users. 

## Features

- **User Registration**
   - Users can register with the app, providing name, email and password.
   - Upon registration, users receive a random username and are added to the global chat.

- **Global Chat**
   - Users can send and receive messages in the global chat room.
     
- **Active Users Sidebar**
  - The sidebar displays a list of active users in real-time.
  - Users can easily see who else is online and active.

- **Real-time Updates**
  - Users receive notifications when new users join the global chat.
  - Messages are delivered instantly to all connected users.
 
- **Message History**
  - Access to old messages allows users to catch up on previous conversations.

## Technologies Used

- Node.js
- Socket.IO
- Mustache for templating
- CSS and Bootstrap for styling

## Prerequisites

Before running the application, ensure that you have Node.js installed on your machine.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dzhuseinspahic/ChatApp.git

2. **Install dependencies**

    ```bash
    npm install

3. **Create .env file**
   Create **.env** file in the root directory. Replace placeholder values with your actual configuration details.
   ```bash
   MONGO_URI = "mongodb+srv://user:password@chatapp.91eim9s.mongodb.net/ChatApplication"
   PORT = 3000
   JWT_SECRET_KEY = secret

5. **Run the application**

   ```bash
   npm start

6. **Access the App**
   Open your browser and visit http://localhost:3000 to access the application.
