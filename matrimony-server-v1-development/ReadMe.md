# Matrimonial Website Backend API

A comprehensive backend API for a matrimonial website built with Node.js, Express.js, TypeScript, and MongoDB. This platform facilitates matchmaking by allowing users to create detailed biodata profiles, search for compatible matches, and manage subscriptions for premium features.

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Google OAuth integration
- Email verification with OTP
- Password reset functionality
- Role-based access control (Admin/User)

### User Management
- User profile creation and verification
- Admin user management
- Profile completion tracking

### Biodata Management
- Comprehensive biodata creation with multiple sections including personal information, address details, education history, family information, occupation details, and marriage preferences
- Biodata approval system by admin
- Advanced filtering and search capabilities
- Profile status tracking (pending/approved)

### Subscription & Payment System
- Multiple subscription tiers (Free, Premium, VIP)
- bKash payment integration
- Profile view limits based on subscription
- Subscription management and expiration handling

### Interest & Interaction System
- Send and cancel interest to other profiles
- Track sent and received interests
- Ignore and unignore user functionality
- Shortlist profiles for later review

### Profile Visit Tracking
- Track profile visits and contact info views
- Subscription-based view limits
- Visit history and analytics

### Review System
- User reviews with rating system
- Admin approval for reviews
- Complete review management (CRUD operations)

### Communication
- Admin email broadcast system
- Individual user email communication
- Newsletter subscription management
- Contact form for user inquiries

### Special Offers
- Admin-managed special offers
- Time-based offer validity
- Dynamic pricing and promotions

### Location Management
- Bangladesh administrative divisions integration
- Division, District, and Upazila data
- Location-based filtering

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Payment**: bKash Payment Gateway
- **Email**: Nodemailer
- **Validation**: Zod
- **Security**: bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/matrimony-backend.git
   cd matrimony-backend
Install dependencies

bash
Copy code
npm install
Setup environment variables
Create a .env file in the root directory and add the following:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the server

bash
Copy code
npm run dev   # For development (with nodemon)
npm start     # For production
📡 API Endpoints (Sample)
Authentication
POST /api/auth/register → Register new user

POST /api/auth/login → Login user

Users
GET /api/users/:id → Get user profile

PUT /api/users/:id → Update user profile

DELETE /api/users/:id → Delete account

Matches
GET /api/matches → Get suggested matches

POST /api/matches/send-interest → Send interest request

🔐 Security Features
Passwords encrypted with bcrypt

Authentication with JWT tokens

Protected routes with middleware

CORS enabled for frontend communication

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Developed by Nikah.com Team

yaml
Copy code

## Getting Started

1. Set up your environment variables
2. Configure the database connection
3. Register a new user account
4. Login to receive JWT token
5. Use the token for authenticated requests

## Notes

- All dates should be in ISO 8601 format
- File uploads should be handled via external services (URLs only)
- JWT tokens expire after 7 days
- Admin endpoints require admin role authentication
- All passwords must meet minimum security requirements

## Support

For support and queries, please use the Contact Us endpoint or reach out to the development team.

## License

This project is licensed under the MIT License.

---

Do you want me to also **add sample API response examples** (like JSON outputs for register/login/profile) i
