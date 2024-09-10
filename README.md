# MERN Stack Form Submission Project

## Overview

This is a MERN stack application that handles form submission with functionalities to create, edit, and delete entries. The frontend is built with React and Chakra UI, while the backend is powered by Node.js and Express.js, with MongoDB as the database.

## Features

- **Form Submission:** Submit user data via a form.
- **Edit Entries:** Update existing form data.
- **Delete Entries:** Remove specific entries from the database.
- **Responsive UI:** Built with Chakra UI for a modern look and feel.
- **HTTP Requests:** Utilizes Axios for API requests to the backend.

## Technologies Used

- **Frontend:**
  - React
  - Chakra UI
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB

## Setup Instructions

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
2.cd backend
3.npm install
4.MONGO_URI=<your-mongodb-connection-string>
PORT=5000
5.npm start

### Frontend Setup

1.cd frontend
2.npm install
3.npm start

POST /api/users/save: Create a new user.
GET /api/users: Retrieve all users.
PUT /api/users/update/:id: Update a user by ID.
DELETE /api/users/delete:id: Delete a user by ID.

