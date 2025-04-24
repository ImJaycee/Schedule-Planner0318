# FlexiSched API and Frontend

This project is a **FlexiSched** application designed to streamline employee management and scheduling processes for organizations. It provides a comprehensive solution for managing employee profiles, schedules, and shift requests, while also enabling administrators to oversee announcements, user management, and schedule creation. 

The backend API is built with **Node.js** and **Express**, offering robust functionality for authentication, data management, and task automation. The frontend, developed using **React**, provides an intuitive and user-friendly interface for both administrators and employees, ensuring seamless interaction with the system.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Troubleshooting](#troubleshooting)
- [Authors](#Authors)

---

## Features
- **User Authentication**: Secure login and session management for both employees and administrators.
- **Profile Management**: Employees can update their personal details and upload profile pictures.
- **Schedule Management**: Administrators can create, update, and manage employee schedules, while employees can view their schedules in a calendar format.
- **Shift Requests**: Employees can request shift changes or swaps, with approval workflows.
- **Announcements**: Administrators can create and manage announcements visible to employees.
- **Cloudinary Integration**: Efficient image storage and management for profile pictures and other assets.
- **Email Notifications**: Automated email notifications for important updates, powered by Gmail SMTP.

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
   cd schedule-planner-app
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


## API Endpoints

### Admin Endpoints
- **Admin Profile Edit API**
  - **Get Specific User**  
    `GET /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token.
  - **Update User Details**  
    `PUT /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token and `multipart/form-data` body.

- **Announcements API**
  - **Create Announcement**  
    `POST /api/announcements`  
    Requires `Authorization` header with Bearer token and `application/json` body.
  - **Get All Announcements**  
    `GET /api/announcements`  
    Requires `Authorization` header with Bearer token.
  - **Get Active Announcements**  
    `GET /api/announcements/active/announcement`  
    Requires `Authorization` header with Bearer token.
  - **Update Announcement**  
    `PUT /api/announcements/{{announcementId}}`  
    Requires `Authorization` header with Bearer token and `application/json` body.
  - **Delete Announcement**  
    `DELETE /api/announcements/{{announcementId}}`  
    Requires `Authorization` header with Bearer token.

- **User Management API**
  - **Get All Users by Department**  
    `GET /api/user-manage/users?department={{department}}`  
    Requires `Authorization` header with Bearer token.
  - **Create User**  
    `POST /api/user-manage/create`  
    Requires `Authorization` header with Bearer token and `application/json` body.
  - **Update User**  
    `PUT /api/user-manage/update/{{userId}}`  
    Requires `Authorization` header with Bearer token and `application/json` body.
  - **Deactivate User**  
    `PUT /api/user-manage/deactivate/{{userId}}`  
    Requires `Authorization` header with Bearer token.
  - **Activate User**  
    `PUT /api/user-manage/activate/{{userId}}`  
    Requires `Authorization` header with Bearer token.

### Employee Endpoints
- **Employee Profile Edit API**
  - **Get Specific User**  
    `GET /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token.
  - **Update User Details**  
    `PUT /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token and `multipart/form-data` body.

- **Request Shift**
  - **Create Request**  
    `POST /api/request-shift/create-request`  
    Requires `application/json` body.
  - **Get User Requests**  
    `GET /api/request-shift/{{userId}}`

- **Request Swap**
  - **Create Swap Request**  
    `POST /api/request-shift/create-request/swap`  
    Requires `application/json` body.
  - **Get Sent Requests**  
    `GET /api/request-shift/swap-shift/{{userId}}`
  - **Accept Request**  
    `PUT /api/request-shift/swap-shift/accept`  
    Requires `application/json` body.
  - **Decline Request**  
    `PUT /api/request-shift/swap-shift/decline`  
    Requires `application/json` body.
  - **Get Received Requests**  
    `GET /api/request-shift/swap-shift/to-me/{{userId}}`
  - **Get Users by Department**  
    `GET /api/request-shift/get-user/all/{{department}}`

### Schedule Management
- **Create Schedule**  
  `POST /api/shift/create`  
  Requires `application/json` body.
- **Delete Schedule**  
  `DELETE /api/shift/{{scheduleId}}`
- **Update Schedule**  
  `PUT /api/shift/{{scheduleId}}`  
  Requires `application/json` body.
- **Get Schedule by Department**  
  `GET /api/shift/manage/{{department}}`
- **View All Schedules**  
  `GET /api/shift/`
- **View Specific Schedule**  
  `GET /api/shift/{{scheduleId}}`

### Authentication
- **Login**  
  `POST /api/auth/login`  
  Requires `application/json` body with `email` and `password`.
- **Admin Login**  
  `POST /api/auth/admin/login`  
  Requires `application/json` body with `email` and `password`.
- **Register User**  
  `POST /api/auth/register`  
  Requires `application/json` body with user details.
- **Register Admin**  
  `POST /api/auth/admin/register`  
  Requires `application/json` body with admin details.
- **Forgot Password**  
  `POST /api/auth/forgetPassword`  
  Requires `application/json` body with `email`.
- **Change Password**  
  `POST /api/edit/{{userId}}/password`  
  Requires `application/json` body with `password` and `confirmPassword`.

---



## Frontend Pages

### Authentication Pages
- **Login Page**: Allows users to log in to their accounts.
- **Register Page**: Enables new users to create an account.
- **Forgot Password Page**: Allows users to reset their password via email.

### Dashboard
- **Admin Dashboard**: Displays an overview of announcements, schedules, and user management tools for administrators.
- **Employee Dashboard**: Provides employees with access to their schedules, announcements, and profile management.

### Profile Management
- **Profile Page**: Allows users to view and update their profile information, including uploading profile pictures.

### Announcements
- **Announcements Page**: Displays all announcements for employees.
- **Create Announcement Page**: Allows administrators to create new announcements.
- **Edit Announcement Page**: Enables administrators to update existing announcements.

### Schedule Management
- **Schedule Page**: Displays the user's schedule in a calendar view.
- **Create Schedule Page**: Allows administrators to create new schedules.
- **Edit Schedule Page**: Enables administrators to update existing schedules.

### Shift Requests
- **Request Shift Page**: Allows employees to request shift changes.
- **Swap Shift Page**: Enables employees to request shift swaps with other employees.

### User Management (Admin Only)
- **User List Page**: Displays a list of all users, filtered by department.
- **Create User Page**: Allows administrators to add new users.
- **Edit User Page**: Enables administrators to update user details.

---


## Troubleshooting

### Common Issues and Solutions

1. **MongoDB Connection Error**
   - **Error**: `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster.`
   - **Solution**: 
     - Ensure your MongoDB connection string in the `.env` file is correct.
     - Verify that your IP address is whitelisted in the MongoDB Atlas network settings.
     - Check if your MongoDB Atlas cluster is running.

2. **Environment Variables Not Loaded**
   - **Error**: `Error: Missing required environment variables.`
   - **Solution**: 
     - Ensure you have created a `.env` file in the `API` directory with all required variables.
     - Verify that the `dotenv` package is installed and properly configured in your project.

3. **Port Already in Use**
   - **Error**: `Error: listen EADDRINUSE: address already in use :::4000`
   - **Solution**: 
     - Check if another application is using the same port (e.g., `4000`) and stop it.
     - Change the `PORT` value in your `.env` file to a different port and restart the server.

4. **Frontend Not Loading**
   - **Error**: `Failed to load resource: the server responded with a status of 404 (Not Found)`
   - **Solution**: 
     - Ensure the backend server is running and accessible at the correct URL.
     - Verify that the frontend is configured to use the correct API base URL.

5. **CORS Issues**
   - **Error**: `Access to fetch at 'http://localhost:4000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy.`
   - **Solution**: 
     - Ensure the `cors` middleware is properly configured in the backend to allow requests from the frontend's origin.

6. **Cloudinary Upload Issues**
   - **Error**: `Error: Invalid Cloudinary credentials.`
   - **Solution**: 
     - Verify that your Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are correct in the `.env` file.

7. **Email Sending Issues**
   - **Error**: `Error: Invalid login: 535-5.7.8 Username and Password not accepted.`
   - **Solution**: 
     - Ensure you are using the correct Gmail credentials in the `.env` file (`EMAIL_USER` and `EMAIL_PASS`).
     - If using Gmail, ensure you have enabled "App Passwords" and are using the generated app password.

8. **Build or Deployment Issues**
   - **Error**: `Module not found: Error: Can't resolve '...'`
   - **Solution**: 
     - Run `npm install` in both the backend and frontend directories to ensure all dependencies are installed.
     - Check for typos or incorrect imports in your code.

9. **API Authentication Errors**
   - **Error**: `401 Unauthorized`
   - **Solution**: 
     - Ensure you are including the correct Bearer token in the `Authorization` header for protected API endpoints.
     - Verify that the token is not expired and is generated using the correct secret.

10. **Frontend Styling Issues**
    - **Error**: Styles not applied correctly.
    - **Solution**: 
      - Ensure Tailwind CSS is properly configured in your project.
      - Verify that the `postcss.config.js` and `tailwind.config.js` files are correctly set up.

---

## Authors

- **[Jay Cee R. Cruz]**  
  Email: [jayceecruz131@gmail.com]  
  Role: [Back-end Developer and Front-end Developer]

- **[Salmer S. Castro]**  
  Email: [castrosalmer0604@gmail.com]  
  Role: [Back-end Developer and Front-end Developer]

---
