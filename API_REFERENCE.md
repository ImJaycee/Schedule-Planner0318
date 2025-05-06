# FlexiSched

## Overview

FlexiSched offers a robust set of APIs to simplify and enhance internship management within our platform. These APIs support seamless integration, empowering you to customize workflows, automate processes, and extend system functionality to meet the unique needs of your organization.

### Base URL

```text
http://localhost:5173
```

### HTTP Status Codes

The following table outlines common HTTP status codes used in the **FlexiSched/Schedular App**:

| Status Code       | Message                  | Description                                                                 |
|-------------------|--------------------------|-----------------------------------------------------------------------------|
| `200 OK`          | Request succeeded.       | The request was successfully processed.                                     |
| `201 Created`     | Resource created.        | A new resource has been successfully created.                               |
| `400 Bad Request` | Invalid request.         | The server could not understand the request due to invalid syntax.          |
| `404 Not Found`   | Resource not found.      | The requested resource could not be found on the server.                    |
| `500 Internal Server Error` | Server error.  | The server encountered an unexpected condition that prevented it from fulfilling the request. |

---

## Table of Contents

### Authentication
- [Login](#login)
- [Admin Login](#admin-login)
- [Register User](#register-user)
- [Register Admin](#register-admin)
- [Forgot Password](#forgot-password)
- [Change Password](#change-password)

### Admin Endpoints
- [Admin Profile Edit API](#admin-profile-edit-api)
  - [Get Specific User](#get-specific-user)
  - [Update User Details](#update-user-details)
- [Announcements API](#announcements-api)
  - [Create Announcement](#create-announcement)
  - [Get All Announcements](#get-all-announcements)
  - [Get Active Announcements](#get-active-announcements)
  - [Update Announcement](#update-announcement)
  - [Delete Announcement](#delete-announcement)
- [User Management API](#user-management-api)
  - [Get All Users by Department](#get-all-users-by-department)
  - [Create User](#create-user)
  - [Update User](#update-user)
  - [Deactivate User](#deactivate-user)
  - [Activate User](#activate-user)

### Employee Endpoints
- [Employee Profile Edit API](#employee-profile-edit-api)
  - [Get Specific User](#get-specific-user-employee)
  - [Update User Details](#update-user-details-employee)

### Request Shift
- [Create Request](#create-request)
- [Get User Requests](#get-user-requests)

### Request Swap
- [Create Swap Request](#create-swap-request)
- [Get Sent Requests](#get-sent-requests)
- [Accept Request](#accept-request)
- [Decline Request](#decline-request)
- [Get Received Requests](#get-received-requests)
- [Get Users by Department](#get-users-by-department-for-swap)

### Schedule Management
- [Create Schedule](#create-schedule)
- [Delete Schedule](#delete-schedule)
- [Update Schedule](#update-schedule)
- [Get Schedule by Department](#get-schedule-by-department)
- [View All Schedules](#view-all-schedules)
- [View Specific Schedule](#view-specific-schedule)

---

## Authentication

### Login
**Endpoint**:  
`POST /api/auth/login`  
**Description**:  
Allows users to log in to their accounts.  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Admin Login
**Endpoint**:  
`POST /api/auth/admin/login`  
**Description**:  
Allows administrators to log in to their accounts.  
**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Register User
**Endpoint**:  
`POST /api/auth/register`  
**Description**:  
Registers a new user.  
**Request Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com",
  "password": "securePassword123",
  "department": "IT"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "60d5f9e813b5c70017e6e5b1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "department": "IT",
    "isAdmin": false,
    "isVerified": false,
    "isDeactivated": false,
    "createdAt": "2025-03-31T08:00:00.000Z",
    "updatedAt": "2025-03-31T08:00:00.000Z"
  }
}
```

---

### Register Admin
**Endpoint**:  
`POST /api/auth/admin/register`  
**Description**:  
Registers a new administrator.  
**Request Body**:
```json
{
  "firstname": "Admin",
  "lastname": "User",
  "email": "admin@example.com",
  "password": "securePassword123"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "_id": "60d5f9e813b5c70017e6e5b2",
    "firstname": "Admin",
    "lastname": "User",
    "email": "admin@example.com",
    "isAdmin": true,
    "isVerified": false,
    "isDeactivated": false,
    "createdAt": "2025-03-31T08:00:00.000Z",
    "updatedAt": "2025-03-31T08:00:00.000Z"
  }
}
```

---

### Forgot Password
**Endpoint**:  
`POST /api/auth/forgetPassword`  
**Description**:  
Sends a password reset email to the user.  
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

### Change Password
**Endpoint**:  
`POST /api/edit/{{userId}}/password`  
**Description**:  
Allows users to change their password.  
**Request Body**:
```json
{
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```
**Response Example**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Admin Endpoints

### Admin Profile Edit API

#### Get Specific User
**Endpoint**:  
`GET /api/edit/{{userId}}`  
**Description**:  
Fetches the details of a specific user.  

**Response Example**:  
**Success**:
```json
{
    "_id": "67d7cc0cb090fdc7dcdb3c00",
    "firstname": "tralalero",
    "lastname": "tralalala",
    "email": "castrosalmer0604@gmail.com",
    "department": "IT Support",
    "isAdmin": true,
    "isVerified": true,
    "createdAt": "2025-03-17T07:15:24.353Z",
    "updatedAt": "2025-04-29T02:38:02.241Z",
    "image": "https://res.cloudinary.com/dxofaxn5o/image/upload/v1745214285/user_profiles/guxcsixezglvrpus6bb1.jpg",
    "isDeactivated": false
}
```

**Failure**:
```json
{
    "message": "User not found"
}
```

---

#### Update User Details
**Endpoint**:  
`PUT /api/edit/{{userId}}`  
**Description**:  
Updates the details of a specific user.  

**Response Example**:  
**Success**:
```json
{
    "message": "User updated successfully",
    "imageUrl": "https://res.cloudinary.com/dxofaxn5o/image/upload/v1745214285/user_profiles/guxcsixezglvrpus6bb1.jpg"
}
```

**Failure**:  
**If no user found**:
```json
{
    "message": "User not found"
}
```

**If internal server error**:
```json
{
    "success": false,
    "status": 500,
    "message": "Multipart: Boundary not found",
    "stack": "Error: Multipart: Boundary not found\n    at new Multipart (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\busboy\\lib\\types\\multipart.js:233:13)\n    at getInstance (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\busboy\\lib\\index.js:33:12)\n    at module.exports (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\busboy\\lib\\index.js:56:10)\n    at multerMiddleware (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\multer\\lib\\make-middleware.js:28:16)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:284:15\n    at param (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:365:14)"
}
```

  #### Create Announcement
  **Endpoint**:  
    `GET /api/announcements`  
    Requires `Authorization` header with Bearer token.

  **Response Body**:  
  ```json
  {
    "title": "New Announcement",
    "content": "This is the content of the announcement.",
    "expiresAt": "2025-04-30"
  }
  ```

  **Response Example**:  
  **Success**:
```json
  {
    "title": "New Announcement",
    "content": "This is the content of the announcement.",
    "expiresAt": "2025-04-30T00:00:00.000Z",
    "AdminId": "67d7cc0cb090fdc7dcdb3c00",
    "_id": "6819aa98f3204de01b559ebb",
    "createdAt": "2025-05-06T06:22:16.929Z",
    "__v": 0
}
```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 401,
    "message": "Authentication required",
    "stack": "Error: Authentication required\n    at createError (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/error.js:2:15)\n    at verifyToken (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/verifyToken.js:9:17)\n    at verifyAdmin (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/verifyToken.js:32:3)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:280:10)"
}
```
  - **Get All Announcements**  
    `GET /api/announcements`  
    Requires `Authorization` header with Bearer token.
  **Response Example**:  
  **Success**:
```json
  [
    {
        "_id": "67d9790f13794e3b36f0a220",
        "title": "12321",
        "content": "gyjhgjh",
        "expiresAt": "2025-03-19T00:00:00.000Z",
        "AdminId": "67d7cc0cb090fdc7dcdb3c00",
        "createdAt": "2025-03-18T13:45:51.913Z",
        "__v": 0
    },
    {
        "_id": "67db6defa93db2b270c370b5",
        "title": "12312",
        "content": "12312",
        "expiresAt": "2025-03-08T00:00:00.000Z",
        "AdminId": "67d7cc0cb090fdc7dcdb3c00",
        "createdAt": "2025-03-20T01:22:55.805Z",
        "__v": 0
    },
    {
      etc.
    }
]
```
**Failure**:
```json
{
    "success": false,
    "status": 401,
    "message": "Authentication required",
    "stack": "Error: Authentication required\n    at createError (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/error.js:2:15)\n    at verifyToken (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/verifyToken.js:9:17)\n    at verifyAdmin (file:///C:/Users/castr/OneDrive/Desktop/4-23-25/API/utils/verifyToken.js:32:3)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\route.js:119:3)\n    at Layer.handle [as handle_request] (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (C:\\Users\\castr\\OneDrive\\Desktop\\4-23-25\\API\\node_modules\\express\\lib\\router\\index.js:280:10)"
}
```



  - **Get Active Announcements** 
  `GET /api/announcements/active/announcement`  
  
```json
 [
    {
        "_id": "67f892373399f3059d0fde94",
        "title": "i897867",
        "content": "876867jh",
        "expiresAt": "2025-05-10T00:00:00.000Z",
        "createdAt": "2025-04-11T03:53:27.055Z",
        "__v": 0
    },
    {
        "_id": "67f892463399f3059d0fde9d",
        "title": "popiopio",
        "content": "oipiopio",
        "expiresAt": "2025-05-10T00:00:00.000Z",
        "createdAt": "2025-04-11T03:53:42.939Z",
        "__v": 0
    }
  ]
```






  - **Update Announcement**  
    `PUT /api/announcements/{{announcementId}}`  
    Requires `Authorization` header with Bearer token and `application/json` body.

  - **Delete Announcement**  
    `DELETE /api/announcements/{{announcementId}}`  
    Requires `Authorization` header with Bearer token.

---

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

---

### Employee Endpoints

- **Employee Profile Edit API**
  - **Get Specific User**  
    `GET /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token.

  - **Update User Details**  
    `PUT /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token and `multipart/form-data` body.

---

- **Request Shift**
  - **Create Request**  
    `POST /api/request-shift/create-request`  
    Requires `application/json` body.

  - **Get User Requests**  
    `GET /api/request-shift/{{userId}}`

---

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

---

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

---

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






### Admin Endpoints

- **Admin Profile Edit API**
  - **Get Specific User**  
    `GET /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token.

  - **Update User Details**  
    `PUT /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token and `multipart/form-data` body.

---

- **Announcements API**
  - **Create Announcement**  
    `POST /api/announcements`  
    Requires `Authorization` header with Bearer token and `application/json` body.

    ### Response Example
    **If Success**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d5f9e813b5c70017e6e5b1",
        "firstname": "John",
        "lastname": "Doe",
        "email": "johndoe@example.com",
        "department": "IT",
        "isAdmin": true,
        "isVerified": true,
        "isDeactivated": false,
        "image": "https://cloudinary.com/johndoe.jpg",
        "createdAt": "2025-03-31T08:00:00.000Z",
        "updatedAt": "2025-04-01T12:00:00.000Z"
      }
    }
    ```

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

---

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

---

### Employee Endpoints

- **Employee Profile Edit API**
  - **Get Specific User**  
    `GET /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token.

  - **Update User Details**  
    `PUT /api/edit/{{userId}}`  
    Requires `Authorization` header with Bearer token and `multipart/form-data` body.

---

- **Request Shift**
  - **Create Request**  
    `POST /api/request-shift/create-request`  
    Requires `application/json` body.

  - **Get User Requests**  
    `GET /api/request-shift/{{userId}}`

---

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

---

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

---

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

