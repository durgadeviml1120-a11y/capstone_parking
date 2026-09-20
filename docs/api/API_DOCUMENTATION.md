# Smart Parking API Documentation

## 1. Overview

The Smart Parking Management System provides a RESTful API for:

- User registration and authentication
- JWT token management
- Parking lot management
- Parking slot management
- Slot booking
- Payment processing
- Booking cancellation
- Current-user information
- Health monitoring
- Audit logging

### Base URL

For local development:

```text
http://127.0.0.1:8000/api/auth/

Swagger UI

Interactive API documentation is available at:

http://127.0.0.1:8000/api/docs/
OpenAPI Schema

The OpenAPI schema is available at:

http://127.0.0.1:8000/api/schema/

## 2.Authentication

The API uses JWT (JSON Web Token) authentication.

After successful login, the API returns:

Access token
Refresh token

The access token must be included in the request header for protected endpoints.

Authorization Header
Authorization: Bearer <access_token>

In Swagger UI, click Authorize and enter the access token.

## 3. User Authentication APIs
### 3.1 User Signup

Creates a new user account.

Endpoint
POST /api/auth/signup/
Authentication

Not required.

Request Body
{
    "username": "demo_user",
    "email": "demo@example.com",
    "password": "password123"
}
Validation
Username is required.
Email is required.
Password must contain at least 8 characters.
Successful Response
201 Created

Example:

{
    "username": "demo_user",
    "email": "demo@example.com"
}
### 3.2 User Login

Authenticates an existing user and returns JWT tokens.

Endpoint
POST /api/auth/login/
Authentication

Not required.

Request Body
{
    "username": "demo_user",
    "password": "password123"
}
Successful Response
200 OK

Example:

{
    "refresh": "<refresh_token>",
    "access": "<access_token>"
}

The access token is used for authenticated API requests.

### 3.3 Refresh Access Token

Generates a new access token using a valid refresh token.

Endpoint
POST /api/auth/token/refresh/
Authentication

Not required.

Request Body
{
    "refresh": "<refresh_token>"
}
Successful Response
200 OK

Example:

{
    "access": "<new_access_token>"
}
## 4. Health Monitoring API
### 4.1 Health Check

Checks whether the Smart Parking API is running.

Endpoint
GET /api/auth/health/
Authentication

Not required.

Successful Response
200 OK

Example:

{
    "status": "healthy",
    "service": "Smart Parking API"
}

This endpoint can be used for basic service monitoring and deployment health checks.

## 5. Parking Lot APIs
### 5.1 Get Parking Lots

Returns the available parking lots.

Endpoint
GET /api/auth/parking-lots/
Authentication

Required.

Header
Authorization: Bearer <access_token>
Successful Response
200 OK

Example:

[
    {
        "id": 1,
        "name": "City Care Hospital Parking",
        "location": "Chennai",
        "total_slots": 40,
        "is_active": true
    }
]
### 5.2 Create Parking Lot

Creates a new parking lot.

Endpoint
POST /api/auth/parking-lots/
Authentication

Required.

Permission

Only an administrator/staff user can create a parking lot.

Request Body
{
    "name": "City Mall Parking",
    "location": "Chennai",
    "total_slots": 50,
    "is_active": true
}
Successful Response
201 Created

Example:

{
    "id": 2,
    "name": "City Mall Parking",
    "location": "Chennai",
    "total_slots": 50,
    "is_active": true
}
Permission Error

A normal user cannot create a parking lot.

## 6. Parking Slot APIs
### 6.1 Get Parking Slots

Returns parking slots.

Endpoint
GET /api/auth/slots/
Authentication

Required.

Header
Authorization: Bearer <access_token>
Successful Response
200 OK

Example:

[
    {
        "id": 1,
        "parking_lot": 1,
        "slot_number": 1,
        "vehicle_type": "BIKE",
        "is_available": true
    }
]
Vehicle Types

The supported vehicle types are:

BIKE
CAR
TRUCK
### 6.2 Create Parking Slot

Creates a new parking slot.

Endpoint
POST /api/auth/slots/
Authentication

Required.

Permission

Only an administrator/staff user can create parking slots.

Request Body
{
    "parking_lot": 1,
    "slot_number": 41,
    "vehicle_type": "CAR",
    "is_available": true
}
Successful Response
201 Created

Example:

{
    "id": 41,
    "parking_lot": 1,
    "slot_number": 41,
    "vehicle_type": "CAR",
    "is_available": true
}
Slot Constraint

A parking slot number must be unique within its parking lot.

The database enforces this using:

unique_slot_per_parking_lot
## 7. Booking APIs
### 7.1 Get Bookings

Returns bookings.

Endpoint
GET /api/auth/bookings/
Authentication

Required.

Normal User

A normal user can view only their own bookings.

Administrator

An administrator/staff user can view all bookings.

Successful Response
200 OK

Example:

[
    {
        "id": 6,
        "user": 20,
        "username": "jack",
        "slot": 5,
        "slot_number": 5,
        "vehicle_type": "BIKE",
        "parking_location": "Chennai",
        "start_time": "2026-09-15T10:00:00Z",
        "end_time": "2026-09-15T12:00:00Z",
        "amount": "100.00",
        "status": "CONFIRMED",
        "created_at": "2026-09-15T09:30:00Z"
    }
]
### 7.2 Create Booking

Creates a new parking booking.

Endpoint
POST /api/auth/bookings/
Authentication

Required.

Request Body
{
    "slot": 5,
    "start_time": "2026-09-15T10:00:00Z",
    "end_time": "2026-09-15T12:00:00Z",
    "amount": "100.00"
}
Successful Response
201 Created

Example:

{
    "id": 7,
    "user": 20,
    "username": "demo_user",
    "slot": 5,
    "slot_number": 5,
    "vehicle_type": "BIKE",
    "parking_location": "Chennai",
    "start_time": "2026-09-15T10:00:00Z",
    "end_time": "2026-09-15T12:00:00Z",
    "amount": "100.00",
    "status": "PENDING",
    "created_at": "2026-09-15T09:30:00Z"
}
Booking Validation

The API validates that:

The selected slot exists.
The slot is available.
The end time is after the start time.
A booking amount is provided.
Booking Status

Bookings support the following statuses:

PENDING
CONFIRMED
CANCELLED
COMPLETED
## 8. Concurrent Booking Protection

The booking API protects against concurrent booking attempts.

The selected slot is locked inside a database transaction using:

transaction.atomic()

and:

Slot.objects.select_for_update()

The availability of the slot is checked after the database lock is acquired.

This prevents two concurrent requests from successfully booking the same currently available slot.

If the slot is already unavailable, the API returns an error such as:

{
    "non_field_errors": [
        "This parking slot is already booked."
    ]
}

This mechanism is used to address the double-booking problem in the Smart Parking system.

## 9. Payment APIs
### 9.1 Create Payment

Creates a payment record for a booking.

Endpoint
POST /api/auth/payments/
Authentication

Required.

Request Body
{
    "booking": 7
}
Successful Response
201 Created

Example:

{
    "id": 1,
    "booking": 7,
    "amount": "100.00",
    "transaction_id": "TXN-7-...",
    "status": "SUCCESS",
    "payment_method": "UPI",
    "paid_at": "2026-09-15T10:05:00Z"
}
Payment Processing

The current implementation performs a simulated payment-success flow.

When payment is created:

The booking is locked using a database transaction.
The booking owner is verified.
The booking must have PENDING status.
A Payment record is created.
The payment status is set to SUCCESS.
The payment method is set to UPI.
The booking status is changed to CONFIRMED.
The parking slot is marked unavailable.
An audit log entry is created.
Important

The current implementation does not connect to a real external payment gateway.

The payment success is currently simulated by the backend.

## 10. Current User API
### 10.1 Get Current User

Returns information about the currently authenticated user.

Endpoint
GET /api/auth/me/
Authentication

Required.

Header
Authorization: Bearer <access_token>
Successful Response
200 OK

Example:

{
    "id": 20,
    "username": "demo_user",
    "email": "demo@example.com",
    "role": "user"
}
Role

The API returns:

admin

when the Django user has is_staff=True.

Otherwise:

user

is returned.

## 11. Booking Cancellation API
### 11.1 Cancel Booking

Cancels a confirmed booking and releases the associated parking slot.

Endpoint
PUT /api/auth/bookings/<booking_id>/cancel/

Example:

PUT /api/auth/bookings/7/cancel/
Authentication

Required.

Permission

A user can cancel only their own booking.

Booking Requirement

Only a booking with:

CONFIRMED

status can be cancelled.

Successful Response
200 OK

Example:

{
    "message": "Booking cancelled successfully.",
    "booking": {
        "id": 7,
        "user": 20,
        "username": "demo_user",
        "slot": 5,
        "slot_number": 5,
        "vehicle_type": "BIKE",
        "parking_location": "Chennai",
        "start_time": "2026-09-15T10:00:00Z",
        "end_time": "2026-09-15T12:00:00Z",
        "amount": "100.00",
        "status": "CANCELLED",
        "created_at": "2026-09-15T09:30:00Z"
    }
}
Cancellation Process

When a booking is cancelled:

Booking status changes to CANCELLED.
The associated parking slot becomes available.
An audit log entry is created.
## 12. Audit Logging

The system maintains an audit trail for important booking and payment operations.

Audit log records contain:

User
Action
Details
Timestamp
Logged Actions

The current implementation records the following actions:

BOOKING_CREATED
PAYMENT_SUCCESS
BOOKING_CANCELLED
Booking Created

Example audit details:

Booking #7 created for Slot 5
Payment Success

Example audit details:

Payment successful for Booking #7, Amount Rs.100.00
Booking Cancelled

Example audit details:

Booking #7 cancelled. Slot 5 released.

Audit logging provides traceability for important system operations.

## 13. Error Handling

The API uses standard HTTP status codes.

Status Code	Meaning
200	Request successful
201	Resource created successfully
400	Invalid request or business validation error
401	Authentication required or invalid token
404	Resource not found
500	Internal server error
Example: Invalid Booking Time
{
    "non_field_errors": [
        "End time must be after start time."
    ]
}
Example: Unavailable Slot
{
    "non_field_errors": [
        "This parking slot is not available."
    ]
}
Example: Missing Booking Amount
{
    "detail": "Booking amount is required."
}
Example: Unauthorized Payment
{
    "detail": "You cannot pay for another user's booking."
}
Example: Invalid Payment Booking Status
{
    "detail": "This booking is not available for payment."
}
14. Security

The backend implements several basic security mechanisms.

14.1 JWT Authentication

Protected API endpoints require a valid JWT access token.

Authorization: Bearer <access_token>
14.2 Password Hashing

User passwords are stored using Django's built-in password hashing through:

User.objects.create_user()

Plain-text passwords are not stored in the database.

14.3 Role-Based Access

Administrator-only operations include:

Creating parking lots
Creating parking slots
Viewing all bookings

Normal users are restricted from performing administrator-only operations.

14.4 User Ownership Validation

The API verifies ownership before:

Making a payment
Cancelling a booking

A user cannot pay for another user's booking or cancel another user's booking.

14.5 Database Transaction Protection

Booking and payment operations use database transactions.

Booking creation uses:

transaction.atomic()

with:

select_for_update()

to protect the selected slot during concurrent booking requests.

## 15. Testing

The backend contains automated API and business-logic tests using pytest and Django REST Framework testing utilities.

The current test suite contains:

15 tests

The tests cover:

User signup
User login
Parking lot and slot operations
Booking creation
Payment confirmation
Booking cancellation
Administrator access to bookings
Booking audit logging
Payment audit logging
Cancellation audit logging
Preventing users from cancelling another user's booking
Preventing users from paying for another user's booking
Preventing normal users from creating slots
Preventing booking of unavailable slots
Preventing normal users from creating parking lots

Current test result:

15 passed
## 16. Swagger and OpenAPI Documentation

The project uses drf-spectacular for API schema generation and Swagger UI.

Swagger UI
http://127.0.0.1:8000/api/docs/
OpenAPI Schema
http://127.0.0.1:8000/api/schema/

Swagger provides an interactive interface for:

Viewing API endpoints
Viewing request methods
Viewing request parameters
Viewing request bodies
Viewing response structures
Testing authenticated APIs
Testing JWT authentication
## 17. API Endpoint Summary
Method	Endpoint	Authentication	Purpose
POST	/api/auth/signup/	No	Register user
POST	/api/auth/login/	No	Login and obtain JWT
POST	/api/auth/token/refresh/	No	Refresh access token
GET	/api/auth/health/	No	API health check
GET	/api/auth/parking-lots/	Yes	List parking lots
POST	/api/auth/parking-lots/	Admin	Create parking lot
GET	/api/auth/slots/	Yes	List parking slots
POST	/api/auth/slots/	Admin	Create parking slot
GET	/api/auth/bookings/	Yes	View bookings
POST	/api/auth/bookings/	Yes	Create booking
PUT	/api/auth/bookings/<id>/cancel/	Yes	Cancel own confirmed booking
POST	/api/auth/payments/	Yes	Create payment
GET	/api/auth/me/	Yes	Get current user
## 18. Local Development

Start the Django backend from the backend directory.

Activate the virtual environment:

.\venv\Scripts\Activate.ps1

Move into the backend directory:

cd backend

Run the development server:

python manage.py runserver

The backend will be available at:

http://127.0.0.1:8000/

Swagger UI:

http://127.0.0.1:8000/api/docs/

Health check:

http://127.0.0.1:8000/api/auth/health/
## 19. Database and Environment Configuration

The Django backend reads database and secret-key configuration from environment variables.

Example .env configuration:

DB_NAME=smart_parking
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your_django_secret_key

The actual .env file should not be committed to GitHub.

The project uses .env.example to document the required environment variables.

## 20. Architecture

The API follows a layered web application architecture:

React Frontend
      |
      | HTTP / REST API
      v
Django REST Framework
      |
      +---- Authentication / JWT
      |
      +---- API Views
      |
      +---- Serializers
      |
      +---- Business Logic
      |
      v
MySQL Database

The frontend communicates with the Django backend through REST API endpoints.

The backend handles:

Authentication
Authorization
Validation
Booking logic
Payment processing
Audit logging
Database transactions
## 21. Core Business Flow

The main parking booking flow is:

User Signup
     |
     v
User Login
     |
     v
Receive JWT Access Token
     |
     v
View Parking Lots
     |
     v
View Available Slots
     |
     v
Create Booking
     |
     v
Booking Status = PENDING
     |
     v
Create Payment
     |
     v
Payment Status = SUCCESS
     |
     v
Booking Status = CONFIRMED
     |
     v
Slot Status = Unavailable

If the user cancels a confirmed booking:

CONFIRMED Booking
       |
       v
Cancel Booking
       |
       v
Booking Status = CANCELLED
       |
       v
Slot Status = Available
       |
       v
Audit Log Created
## 22. Concurrency and Double-Booking Prevention

A key requirement of the Smart Parking system is preventing two users from booking the same parking slot simultaneously.

The backend addresses this using database-level row locking.

The booking process uses:

@transaction.atomic

and:

Slot.objects.select_for_update().get(id=slot_id)

The selected slot is locked while the booking transaction is processed.

The system then checks:

if not slot.is_available:

If the slot is already unavailable, the booking request is rejected.

This provides transaction-based protection against concurrent double booking.

## 23. Current Implementation Notes
Payment

The current payment implementation is a simulated successful UPI payment flow.

No external payment gateway is currently connected.

Availability

The current slot availability is represented using the:

is_available

field on the Slot model.

Booking Amount

The booking amount is supplied during booking creation and stored in the Booking.amount field.

User Roles

The current backend determines administrator access using Django's:

is_staff

property.

The /me/ endpoint exposes this as:

admin

or:

user
## 24. Future API Enhancements

Potential future enhancements include:

Real Razorpay payment integration
Payment verification using gateway signatures
Refund API
Booking history filtering
Date and time based slot availability
Parking lot update and delete APIs
Slot update and delete APIs
Admin revenue APIs
Advanced audit log APIs
Notification APIs
Email confirmation
Rate limiting
Production monitoring
Cloud deployment
API versioning
## 25. Production Base URL

The production API URL will be added after cloud deployment.

Current production URL:

Not deployed yet

The local development API remains:

http://127.0.0.1:8000/api/auth/
## 26. Conclusion

The Smart Parking API provides the backend services required for the Smart Parking & Slot Booking Platform.

The API supports:

JWT authentication
User registration and login
Parking lot management
Parking slot management
Booking management
Concurrent booking protection
Payment processing
Booking cancellation
Role-based permissions
Audit logging
Health monitoring
Automated testing
Swagger/OpenAPI documentation

The API is designed to provide a secure and transaction-aware backend for the Smart Parking Management System.