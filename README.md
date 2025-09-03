# CodeAxis - Freelance Project & Payment Management System

A comprehensive MERN stack web application for managing freelance projects, payments, clients, and showcasing a public portfolio.

## 🚀 Features

### For Admins (Internal Team)
- **Project Management**: Create, update, and track project statuses
- **Payment Tracking**: Manage payments with auto-generated invoices/receipts
- **Client Management**: Store and manage client information
- **Dashboard**: Real-time project and payment overview
- **Admin Management**: Main admin can manage team accounts

### For Public Visitors
- **Portfolio Showcase**: Browse completed projects with full details
- **Project Requests**: Submit "Hire Us" forms
- **Search & Filter**: Find projects by type, tech stack, or category

### Core Features
- **Authentication**: Secure admin login with password reset
- **File Management**: Cloud storage for images and attachments
- **Email Notifications**: Automated alerts for leads and payments
- **Responsive Design**: Mobile-first Bootstrap 5 interface
- **Multi-currency Support**: Default LKR with expandable options

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Bootstrap 5
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Email**: Gmail SMTP / SendGrid
- **Hosting**: Vercel (Frontend) + Render/Railway (Backend)

## 📁 Project Structure

```
codeaxis-freelance-management/
├── backend/                 # Node.js + Express server
├── frontend/               # React + Vite application
├── package.json            # Root package.json
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account
- Gmail/SendGrid account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd codeaxis-freelance-management
   npm run install-all
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
   - Fill in your configuration values

3. **Start Development**
   ```bash
   npm run dev
   ```
   This will start both backend (port 5000) and frontend (port 5173)

### Production Build
```bash
npm run build
npm start
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## 📊 Database Schema

- **Users**: Admin accounts with role-based permissions
- **Clients**: Client information and contact details
- **Projects**: Project details, status, and visibility
- **Payments**: Payment tracking with invoices
- **Leads**: Public project requests
- **Testimonials**: Client feedback and ratings
- **Settings**: System configuration and workflows

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password hashing with Argon2
- Rate limiting for API endpoints
- CSRF protection
- File upload validation
- Role-based access control

## 📱 Responsive Design

- Mobile-first approach with Bootstrap 5
- Optimized for all device sizes
- Fast loading with lazy image loading
- SEO optimized with meta tags

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `frontend/dist`

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ by CodeAxis Team**
