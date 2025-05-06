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
  - [Get Specific User for Employee](#get-specific-user-for-employee)
  - [Update User Details for Employee](#update-user-details-for-employee)

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

### Get Specific User 
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
  ### Get All Announcements
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



  ### Get Active Announcements
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





### Update Announcement
**Endpoint**:  
`PUT /api/announcements/{{announcementId}}`  
**Description**:  
Updates an existing announcement.  
**Headers**:  
- `Authorization`: Bearer token  
**Request Body**:
```json
{
  "title": "Updated Announcement Title",
  "content": "Updated content of the announcement.",
  "expiresAt": "2025-05-15"
}
```
**Response Example**:  
**Success**:
```json
{
  "success": true,
  "message": "Announcement updated successfully",
  "data": {
    "_id": "6819aa98f3204de01b559ebb",
    "title": "Updated Announcement Title",
    "content": "Updated content of the announcement.",
    "expiresAt": "2025-05-15T00:00:00.000Z",
    "updatedAt": "2025-05-06T08:00:00.000Z"
  }
}
```
**Failure**:
```json
{
  "success": false,
  "status": 404,
  "message": "Announcement not found"
}
```

---

### Delete Announcement
**Endpoint**:  
`DELETE /api/announcements/{{announcementId}}`  
**Description**:  
Deletes an existing announcement.  
**Headers**:  
- `Authorization`: Bearer token  
**Response Example**:  
**Success**:
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```
**Failure**:
```json
{
  "success": false,
  "status": 404,
  "message": "Announcement not found"
}
```

---

### User Management API

#### Get All Users by Department
**Endpoint**:  
`GET /api/user-manage/users?department={{department}}`  
**Description**:  
Fetches all users belonging to a specific department.  
**Headers**:  
- `Authorization`: Bearer token  
**Response Example**:  
**Success**:
```json
[
  {
    "_id": "60d5f9e813b5c70017e6e5b1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "department": "IT",
    "isAdmin": false,
    "isVerified": true,
    "isDeactivated": false
  },
  {
    "_id": "60d5f9e813b5c70017e6e5b2",
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "janesmith@example.com",
    "department": "IT",
    "isAdmin": false,
    "isVerified": true,
    "isDeactivated": false
  }
]
```

---

#### Create User
**Endpoint**:  
`POST /api/user-manage/create`  
**Description**:  
Creates a new user.  
**Headers**:  
- `Authorization`: Bearer token  
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
**Success**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "60d5f9e813b5c70017e6e5b1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "department": "IT",
    "isAdmin": false,
    "isVerified": false,
    "isDeactivated": false,
    "createdAt": "2025-05-06T08:00:00.000Z"
  }
}
```

---

#### Update User
**Endpoint**:  
`PUT /api/user-manage/update/{{userId}}`  
**Description**:  
Updates the details of an existing user.  
**Headers**:  
- `Authorization`: Bearer token  
**Request Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com",
  "department": "IT"
}
```
**Response Example**:  
**Success**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "60d5f9e813b5c70017e6e5b1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@example.com",
    "department": "IT",
    "isAdmin": false,
    "isVerified": true,
    "isDeactivated": false,
    "updatedAt": "2025-05-06T08:00:00.000Z"
  }
}
```

---

#### Deactivate User
**Endpoint**:  
`PUT /api/user-manage/deactivate/{{userId}}`  
**Description**:  
Deactivates a user account.  
**Headers**:  
- `Authorization`: Bearer token  
**Response Example**:  
**Success**:
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```
**Failure**:
```json
{
  "success": false,
  "status": 404,
  "message": "User not found"
}
```

---

#### Activate User
**Endpoint**:  
`PUT /api/user-manage/activate/{{userId}}`  
**Description**:  
Activates a previously deactivated user account.  
**Headers**:  
- `Authorization`: Bearer token  
**Response Example**:  
**Success**:
```json
{
  "success": true,
  "message": "User activated successfully"
}
```
**Failure**:
```json
{
  "success": false,
  "status": 404,
  "message": "User not found"
}
```

### Employee Endpoints

### Employee Profile Edit API

### Get Specific User for Employee
  **Endpoint**:  
  `GET /api/edit/{{userId}}`  
  **Description**:  
  Fetches the details of a specific employee.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "department": "IT",
      "isAdmin": false,
      "isVerified": true,
      "isDeactivated": false,
      "createdAt": "2025-05-06T08:00:00.000Z",
      "updatedAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "User not found"
  }
  ```

### Update User Details for Employee
  **Endpoint**:  
  `PUT /api/edit/{{userId}}`  
  **Description**:  
  Updates the details of a specific employee.  
  **Headers**:  
  - `Authorization`: Bearer token  
  **Request Body**:  
  Requires `multipart/form-data` body with fields such as `firstname`, `lastname`, `email`, and optionally `image`.  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "firstname": "John",
      "lastname": "Doe",
      "email": "johndoe@example.com",
      "department": "IT",
      "image": "https://example.com/profile.jpg",
      "updatedAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Invalid request data"
  }
  ```

---

#### Request Shift

- **Create Request**  
  **Endpoint**:  
  `POST /api/request-shift/create-request`  
  **Description**:  
  Creates a new shift request.  
  **Headers**:  
  - `Authorization`: Bearer token  
  **Request Body**:
  ```json
  {
    "shiftDate": "2025-05-10",
    "shiftTime": "09:00-17:00",
    "reason": "Personal reasons"
  }
  ```
  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "Shift request created successfully",
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "shiftDate": "2025-05-10",
      "shiftTime": "09:00-17:00",
      "reason": "Personal reasons",
      "status": "Pending",
      "createdAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Invalid request data"
  }
  ```

### Get User Requests 
  **Endpoint**:  
  `GET /api/request-shift/{{userId}}`  
  **Description**:  
  Fetches all shift requests for a specific user.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d5f9e813b5c70017e6e5b1",
        "shiftDate": "2025-05-10",
        "shiftTime": "09:00-17:00",
        "reason": "Personal reasons",
        "status": "Pending",
        "createdAt": "2025-05-06T08:00:00.000Z"
      },
      {
        "_id": "60d5f9e813b5c70017e6e5b2",
        "shiftDate": "2025-05-12",
        "shiftTime": "13:00-21:00",
        "reason": "Medical appointment",
        "status": "Approved",
        "createdAt": "2025-05-06T08:00:00.000Z"
      }
    ]
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "No shift requests found"
  }
  ```

---

#### Request Swap

### Create Swap Request  
  **Endpoint**:  
  `POST /api/request-shift/create-request/swap`  
  **Description**:  
  Creates a new shift swap request.  
  **Headers**:  
  - `Authorization`: Bearer token  
  **Request Body**:
  ```json
  {
    "currentShiftId": "60d5f9e813b5c70017e6e5b1",
    "requestedShiftId": "60d5f9e813b5c70017e6e5b2",
    "reason": "Need to swap due to personal reasons"
  }
  ```
  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "Swap request created successfully",
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b3",
      "currentShiftId": "60d5f9e813b5c70017e6e5b1",
      "requestedShiftId": "60d5f9e813b5c70017e6e5b2",
      "reason": "Need to swap due to personal reasons",
      "status": "Pending",
      "createdAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Invalid request data"
  }
  ```

### Get Sent Requests  
  **Endpoint**:  
  `GET /api/request-shift/swap-shift/{{userId}}`  
  **Description**:  
  Fetches all swap requests sent by a specific user.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d5f9e813b5c70017e6e5b3",
        "currentShiftId": "60d5f9e813b5c70017e6e5b1",
        "requestedShiftId": "60d5f9e813b5c70017e6e5b2",
        "reason": "Need to swap due to personal reasons",
        "status": "Pending",
        "createdAt": "2025-05-06T08:00:00.000Z"
      }
    ]
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "No swap requests found"
  }
  ```

---

#### Schedule Management

### Create Schedule  
  **Endpoint**:  
  `POST /api/shift/create`  
  **Description**:  
  Creates a new schedule.  
  **Headers**:  
  - `Authorization`: Bearer token  
  **Request Body**:
  ```json
  {
    "shiftDate": "2025-05-10",
    "shiftTime": "09:00-17:00",
    "department": "IT"
  }
  ```
  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "Schedule created successfully",
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "shiftDate": "2025-05-10",
      "shiftTime": "09:00-17:00",
      "department": "IT",
      "createdAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Invalid request data"
  }
  ```

### Delete Schedule 
  **Endpoint**:  
  `DELETE /api/shift/{{scheduleId}}`  
  **Description**:  
  Deletes an existing schedule.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "Schedule deleted successfully"
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "Schedule not found"
  }
  ```

### Update Schedule 
  **Endpoint**:  
  `PUT /api/shift/{{scheduleId}}`  
  **Description**:  
  Updates an existing schedule.  
  **Headers**:  
  - `Authorization`: Bearer token  
  **Request Body**:
  ```json
  {
    "shiftDate": "2025-05-12",
    "shiftTime": "13:00-21:00",
    "department": "IT"
  }
  ```
  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "message": "Schedule updated successfully",
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "shiftDate": "2025-05-12",
      "shiftTime": "13:00-21:00",
      "department": "IT",
      "updatedAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "Schedule not found"
  }
  ```

### Get Schedule by Department  
  **Endpoint**:  
  `GET /api/shift/manage/{{department}}`  
  **Description**:  
  Fetches all schedules for a specific department.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d5f9e813b5c70017e6e5b1",
        "shiftDate": "2025-05-10",
        "shiftTime": "09:00-17:00",
        "department": "IT",
        "createdAt": "2025-05-06T08:00:00.000Z"
      }
    ]
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "No schedules found"
  }
  ```

### View All Schedules 
  **Endpoint**:  
  `GET /api/shift/`  
  **Description**:  
  Fetches all schedules.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "60d5f9e813b5c70017e6e5b1",
        "shiftDate": "2025-05-10",
        "shiftTime": "09:00-17:00",
        "department": "IT",
        "createdAt": "2025-05-06T08:00:00.000Z"
      }
    ]
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "No schedules found"
  }
  ```

- **View Specific Schedule**  
  **Endpoint**:  
  `GET /api/shift/{{scheduleId}}`  
  **Description**:  
  Fetches details of a specific schedule.  
  **Headers**:  
  - `Authorization`: Bearer token  

  **Response Example**:  
  **Success**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d5f9e813b5c70017e6e5b1",
      "shiftDate": "2025-05-10",
      "shiftTime": "09:00-17:00",
      "department": "IT",
      "createdAt": "2025-05-06T08:00:00.000Z"
    }
  }
  ```
  **Failure**:
  ```json
  {
    "success": false,
    "status": 404,
    "message": "Schedule not found"
  }
  ```







