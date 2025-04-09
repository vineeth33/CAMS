# CAMS - Consultancy Management System

CAMS is a comprehensive web application designed to streamline the management of consultancy projects in academic institutions. It provides a centralized platform for faculty members to track, manage, and report on consultancy projects with industry partners.

![ConsultEase Dashboard](https://placeholder.svg?height=400&width=800)

## Features

- **User Authentication**: Secure login and registration system for faculty members using college email addresses
- **Dashboard Overview**: Visual summary of project statistics and recent activities
- **Project Management**: Create, view, and manage consultancy projects
- **Financial Tracking**: Monitor sanctioned amounts, received payments, and bill settlements
- **Document Management**: Upload and store project agreements and bill settlement proofs
- **Reporting**: Generate Excel reports with customizable filters
- **Notification System**: Automated email notifications for new projects and projects nearing completion

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- XLSX for Excel file generation
- Nodemailer for email notifications
- Node-cron for scheduled tasks

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/consultease.git
   cd consultease
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Install frontend dependencies**
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

4. **Configure environment variables**
   - Create a `.env` file in the server directory with the following variables:
     \`\`\`
     PORT=5000
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password
     \`\`\`

5. **Start the development servers**

   Backend:
   \`\`\`bash
   cd server
   npm run dev
   \`\`\`

   Frontend:
   \`\`\`bash
   cd client
   npm start
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### User Registration and Login
- Register with a valid college email (ending with .edu or .ac.in)
- Login with your credentials
- A test account is automatically created: test@college.edu / password123

### Managing Projects
1. **Creating a New Project**
   - Navigate to "New Project" from the dashboard or navigation menu
   - Fill in the project details, including industry name, title, and financial information
   - Upload required documents (agreement document is mandatory)
   - Submit the form to create the project

2. **Viewing Projects**
   - Access the "Projects" page to see a list of all projects
   - Use filters to narrow down the list by academic year, amount, faculty name, or industry
   - Click on a project to view its details

3. **Downloading Reports**
   - Apply filters as needed on the Projects page
   - Click "Download Excel" to generate and download a report

## Project Structure

\`\`\`
CAMS/
├── client/                  # Frontend React application
│   ├── public/              # Public assets
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React context providers
│       ├── pages/           # Page components
│       └── App.js           # Main application component
│
└── server/                  # Backend Node.js application
    ├── data/                # Data storage (Excel files)
    ├── uploads/             # Uploaded files storage
    ├── corsMiddleware.js    # CORS configuration
    └── server.js            # Main server file
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `GET /api/auth/verify` - Verify authentication token

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects (with optional filters)
- `GET /api/projects/:id` - Get a specific project by ID
- `GET /api/projects/recent` - Get recent projects
- `GET /api/projects/stats` - Get project statistics
- `GET /api/projects/:id/download/:fileType` - Download project documents
- `GET /api/projects/download` - Download projects as Excel file

## Data Storage

ConsultEase uses Excel files for data storage:
- `users.xlsx` - Stores user information
- `projects.xlsx` - Stores project details

Uploaded files are stored in the `uploads` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
