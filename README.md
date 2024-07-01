# MERN Stack Project

## Description
This project is built using the MERN stack, which includes MongoDB, Express.js, React, and Node.js. The project includes features such as user creation, faculty creation, and test management with specific rules.

## Prerequisites
Ensure you have the following installed:
- Node.js (version 20.13.1 or later)
- npm (Node Package Manager)
- MongoDB

## Installation

### Backend

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install the backend dependencies:

   ```sh
   npm install
   ```

3. Set up your MongoDB connection string in a `.env` file. Create a `.env` file in the `backend` directory with the following content:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the backend server:

   ```sh
   npm start
   ```

### Frontend

1. Open a new terminal and navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install the frontend dependencies:

   ```sh
   npm install
   ```

3. Start the frontend development server:

   ```sh
   npm start
   ```

## Running the Application
After completing the installation steps for both the backend and frontend, you can run the application as follows:

1. Start the backend server:

   ```sh
   cd backend
   npm start
   ```

2. Start the frontend server in a separate terminal:

   ```sh
   cd frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:3000` to see the application running.

## Project Structure

- `backend`: Contains the server-side code using Node.js, Express, and MongoDB.
- `frontend`: Contains the client-side code using React.

## Libraries Used

### Backend
- express
- mongoose
- dotenv
- cors
- axios

### Frontend
- react
- axios
- react-router-dom
- react-webcam

## Additional Information
- Ensure MongoDB is running locally or provide the correct connection string in the `.env` file.
- The backend server runs on `http://localhost:5000`.
- The frontend development server runs on `http://localhost:3000`.

## License
This project is licensed under the MIT License.
