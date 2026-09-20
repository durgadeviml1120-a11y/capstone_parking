# Smart Parking Management System

A web-based Smart Parking Management System that allows users to view available parking slots, book parking spaces, make payments, and manage their bookings. Administrators can manage parking lots and slots and monitor bookings.

The system uses database transactions and row-level locking to prevent concurrent users from booking the same parking slot.

---

## Project Overview

### Problem

Traditional parking management can lead to:

- Difficulty finding available parking spaces
- Manual booking and tracking
- Double booking of the same slot
- Lack of booking history and audit information
- Difficulty monitoring parking usage

### Solution

The Smart Parking Management System provides a centralized web platform for parking slot management and booking.

The system supports:

- User registration and JWT authentication
- Parking lot and slot management
- Real-time availability information
- Secure slot booking
- Payment processing
- Booking cancellation
- Booking history
- Audit logging
- Role-based administrative access

---

## User Roles

### Driver / User

- Register and log in
- View parking lots
- View available slots
- Book a parking slot
- Make payment
- View booking history
- Cancel confirmed bookings

### Administrator

- View parking lots
- Create parking lots
- Create parking slots
- View all bookings
- Monitor parking availability
- View booking and payment activity

---

## Key Features

- JWT-based authentication
- Role-based access control
- Parking lot management
- Parking slot management
- Vehicle type classification
- Slot availability tracking
- Atomic booking transactions
- Concurrent booking protection
- Payment management
- Booking cancellation
- Audit logging
- API documentation with Swagger
- Automated backend testing
- GitHub Actions CI
- Health monitoring endpoint
- Basic application logging

---

## Technology Stack

### Frontend

- React.js
- Vite
- React Router
- JavaScript
- Lucide React

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- drf-spectacular

### Database

- MySQL

### Testing

- pytest
- pytest-django

### DevOps

- Git
- GitHub
- GitHub Actions

### Development Tools

- Visual Studio Code
- PowerShell
- DBeaver

---

## System Architecture

The application follows a client-server architecture.

```text
+----------------------+
|   React Frontend     |
|      (Vite)          |
+----------+-----------+
           |
           | REST API / JWT
           v
+----------------------+
|   Django Backend     |
| Django REST Framework|
+----------+-----------+
           |
           v
+----------------------+
|       MySQL          |
|      Database        |
+----------------------+