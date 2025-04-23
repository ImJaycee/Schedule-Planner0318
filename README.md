# FlexiSched API and Frontend

This project is a **FlexiSched** application that allows employees to manage their profiles, schedules, and other related tasks. It includes a backend API built with **Node.js** and **Express**, and a frontend built with **React**.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Troubleshooting](#troubleshooting)

---

## Features
- **User Authentication**: Login and manage user sessions.
- **Profile Management**: Employees can update their profile details and upload profile pictures.
- **Cloudinary Integration**: Images are uploaded and stored using Cloudinary.
- **Email Notifications**: Email functionality using Gmail SMTP.
- **Schedule Management**: Manage employee schedules and shifts.

---

## Technologies Used
### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: Database for storing user and schedule data.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: Image storage and management.
- **Multer**: Middleware for handling file uploads.
- **Multer-Storage-Cloudinary**: Cloudinary storage engine for Multer.
- **bcrypt**: Password hashing library.
- **bcryptjs**: Alternative password hashing library.
- **jsonwebtoken**: For generating and verifying JWT tokens.
- **dotenv**: Environment variable management.
- **cors**: Middleware for enabling CORS.
- **cookie-parser**: Middleware for parsing cookies.
- **compression**: Middleware for compressing HTTP responses.
- **express-rate-limit**: Middleware for rate limiting.
- **node-cron**: Task scheduling library.
- **nodemailer**: Email sending library.
- **winston**: Logging library.
- **winston-daily-rotate-file**: Daily log rotation for Winston.

### Frontend
- **React.js**: Frontend framework.
- **React DOM**: Rendering React components in the DOM.
- **React Router DOM**: Routing library for React.
- **Axios**: HTTP client for API requests.
- **React Toastify**: Notifications for user feedback.
- **SweetAlert2**: Beautiful alert popups.
- **React Big Calendar**: Calendar component for scheduling.
- **React DnD**: Drag-and-drop library for React.
- **React DnD HTML5 Backend**: HTML5 backend for React DnD.
- **React Time Picker**: Time picker component.
- **Lucide React**: Icon library for React.
- **Moment.js**: Date and time manipulation library.
- **Date-fns**: Modern date utility library.
- **FullCalendar**: Calendar library with plugins:
  - **@fullcalendar/react**
  - **@fullcalendar/daygrid**
  - **@fullcalendar/timegrid**
  - **@fullcalendar/list**
  - **@fullcalendar/interaction**
- **Tailwind CSS**: Utility-first CSS framework.
- **Vite**: Build tool for fast development.
- **PostCSS**: CSS processing tool.
- **Autoprefixer**: Adds vendor prefixes to CSS.
- **ESLint**: Linting tool for JavaScript and React.
- **ESLint React Hooks Plugin**: Ensures proper usage of React hooks.
- **ESLint React Refresh Plugin**: Enables React Fast Refresh.

---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB Atlas** or a local MongoDB instance
- **Cloudinary Account**
- **Gmail Account** for email notifications

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ImJaycee/Schedule-Planner0318
   cd Schedule-Planner0318
   ```

2. Install dependencies for both backend and frontend:

   #### Backend
   ```bash
   cd API
   npm install
   ```

   #### Frontend
   ```bash
   cd schedule-planner-app
   npm install
   ```

3. Create a `.env` file in the API directory and add the following:

   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   PORT=4000
   JWT_SECRET=your_jwt_secret

   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend and frontend servers:

   #### Backend
   ```bash
   cd API
   npm run start
   ```

   #### Frontend
   ```bash
   cd ../schedule-planner-app
   npm start
   ```

5. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

---

## Environment Variables

The following environment variables are required for the project:

| Variable                  | Description                          |
|---------------------------|--------------------------------------|
| `MONGO_URL`               | MongoDB connection string           |
| `PORT`                    | Port for the backend server         |
| `JWT_SECRET`              | Secret key for JWT authentication   |
| `EMAIL_USER`              | Gmail account for sending emails    |
| `EMAIL_PASS`              | App password for the Gmail account  |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name               |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                  |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret               |
