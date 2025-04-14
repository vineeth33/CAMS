# 🎓 CAMS - Consultancy Academic Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61DAFB)

CAMS (formerly ConsultEase) is a powerful, intuitive web platform designed specifically for academic institutions to streamline consultancy project management. It bridges the gap between academia and industry by providing faculty members with a centralized hub to track, manage, document, and report on their consultancy collaborations with industry partners.

> "Transforming academic consultancy management from spreadsheets to seamless workflows"

---

## ✨ Key Features

- 🔐 **Institutional Authentication**
  - Secure login and registration restricted to verified institutional emails (.edu, .ac.in)
  - Role-based access control for faculty, administrators, and department heads
  - JWT-based authentication with secure token management

- 📊 **Interactive Dashboard**
  - Real-time visual analytics of project metrics and KPIs
  - Financial summaries with amount sanctioned vs. received comparisons
  - Timeline view of active, upcoming, and completed projects
  - Quick-access links to recent activities and pending tasks

- 📁 **Comprehensive Project Management**
  - Intuitive project creation wizard with step-by-step guidance
  - Detailed project profiles with industry information, team members, and timelines
  - Status tracking from initiation to completion
  - Collaborative notes and updates for team coordination

- 💸 **Advanced Financial Tracking**
  - Detailed breakdown of sanctioned and received funds
  - Expense categorization and allocation
  - Bill settlement workflow with approval stages
  - Financial reporting with customizable parameters

- 📄 **Document Management System**
  - Secure storage for agreements, proposals, and financial documents
  - Version control for document revisions
  - PDF preview capabilities
  - Batch download options for project documentation

- 📥 **Data Export & Reporting**
  - Custom Excel report generation with advanced filtering
  - Department-wise and faculty-wise performance analytics
  - Year-on-year comparison reports
  - Compliance documentation for institutional requirements

- 📧 **Smart Notification System**
  - Customizable email alerts for project milestones
  - Deadline reminders for deliverables and financial submissions
  - Weekly digest of project updates
  - Notification preferences management

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Component-based UI development with hooks and context API
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router DOM 6** - Declarative routing for React applications
- **Axios** - Promise-based HTTP client for API requests
- **React Hot Toast** - Lightweight notification system
- **React Hook Form** - Performant form validation and handling

### Backend
- **Node.js & Express** - Fast, unopinionated web framework
- **JSON Web Tokens** - Secure authentication implementation
- **Multer** - Middleware for handling multipart/form-data and file uploads
- **XLSX** - Advanced Excel file generation and parsing
- **Nodemailer** - Email sending capabilities
- **Node-Cron** - Task scheduling for automated notifications
- **bcryptjs** - Secure password hashing

### Data Storage
- **Excel-based data store** - Lightweight, portable data storage solution
- **File system storage** - Organized document management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation Steps

1. **Clone the Repository**
\`\`\`bash
git clone https://github.com/yourusername/cams.git
cd cams
\`\`\`

2. **Set Up Backend**
\`\`\`bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create data and uploads directories
mkdir -p data uploads

# Create environment file
echo "PORT=5000
JWT_SECRET=your_secure_random_string
EMAIL_USER=your_notification_email@gmail.com
EMAIL_PASS=your_app_password" > .env
\`\`\`

3. **Set Up Frontend**
\`\`\`bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
\`\`\`

4. **Start Development Servers**

Terminal 1 (Backend):
\`\`\`bash
cd server
npm run dev
\`\`\`

Terminal 2 (Frontend):
\`\`\`bash
cd client
npm start
\`\`\`

5. **Access the Application**
- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:5000](http://localhost:5000)

### Default Test Account
- **Email:** test@college.edu
- **Password:** password123

---

## 📁 Project Structure

\`\`\`
CAMS/
├── client/                      # React Frontend
│   ├── public/                  # Static assets
│   │   ├── favicon.ico
│   │   └── index.html
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.js
│       │   └── ...
│       ├── context/             # React context providers
│       │   └── AuthContext.js
│       ├── pages/               # Application pages
│       │   ├── Dashboard.js
│       │   ├── Login.js
│       │   ├── ProjectDetails.js
│       │   ├── ProjectEntry.js
│       │   ├── ProjectList.js
│       │   ├── Register.js
│       │   └── NotFound.js
│       ├── App.js               # Main application component
│       └── index.js             # Application entry point
│
└── server/                      # Express Backend
    ├── data/                    # Excel-based data storage
    │   ├── users.xlsx
    │   └── projects.xlsx
    ├── uploads/                 # Uploaded project documents
    ├── corsMiddleware.js        # CORS configuration
    └── server.js                # Main server file with API routes
\`\`\`

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/auth/register` | Register new user | `{name, email, password, department}` | `{message}` |
| `POST` | `/api/auth/login` | User login | `{email, password}` | `{token, user, message}` |
| `GET` | `/api/auth/verify` | Verify auth token | - | `{user}` |

### Project Management Endpoints

| Method | Endpoint | Description | Query Parameters | Response |
|--------|----------|-------------|------------------|----------|
| `POST` | `/api/projects` | Create new project | - | `{message, id}` |
| `GET` | `/api/projects` | Get all projects | `academicYear, amountThreshold, facultyName, industryName` | `[projects]` |
| `GET` | `/api/projects/:id` | Get project by ID | - | `{project}` |
| `GET` | `/api/projects/stats` | Get dashboard statistics | - | `{totalProjects, activeProjects, completedProjects, totalAmount}` |
| `GET` | `/api/projects/recent` | Get recent projects | - | `[projects]` |
| `GET` | `/api/projects/:id/download/:fileType` | Download project document | - | File download |
| `GET` | `/api/projects/download` | Export projects to Excel | Same as GET /api/projects | Excel file download |

---

## 🔧 Troubleshooting

### Common Issues and Solutions

**Issue**: CORS errors when making API requests
- **Solution**: Ensure the server is running and CORS is properly configured in `server.js`
- **Fix**: Check that the origin in CORS configuration matches your client URL

**Issue**: File uploads failing
- **Solution**: Verify the uploads directory exists and has proper write permissions
- **Fix**: Run `mkdir -p server/uploads && chmod 755 server/uploads`

**Issue**: Excel files not being created
- **Solution**: Check data directory permissions and Excel library installation
- **Fix**: Run `mkdir -p server/data && chmod 755 server/data`

**Issue**: Authentication errors
- **Solution**: Clear browser localStorage and try logging in again
- **Fix**: Check JWT_SECRET in .env file is properly set

---

## 🔮 Roadmap

### Upcoming Features

- 📱 **Mobile Responsive Design** - Optimize for tablets and smartphones
- 🔄 **Real-time Updates** - Implement WebSockets for live data updates
- 📊 **Advanced Analytics** - Enhanced reporting with visual charts and trends
- 🔍 **Search Functionality** - Global search across projects and documents
- 👥 **Team Collaboration** - Comments and activity feeds on projects
- 🔐 **Two-Factor Authentication** - Enhanced security for sensitive data
- 🌐 **Multi-language Support** - Internationalization for global institutions

---

## 🛡️ Security Considerations

- All passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- File uploads are validated for type and size
- Input validation is performed on all API endpoints
- CORS is configured to restrict access to authorized origins
- Environment variables are used for sensitive configuration

---

## 📸 UI Showcase

<div align="center">
  <img src="https://placeholder.com/dashboard.png" alt="Dashboard" width="80%" />
  <p><em>Comprehensive dashboard with project statistics and quick actions</em></p>
  
  <img src="https://placeholder.com/form.png" alt="Project Entry Form" width="80%" />
  <p><em>Intuitive project entry form with real-time validation</em></p>
</div>

---

## 🤝 Contributing

We welcome contributions to improve CAMS! Here's how you can help:

1. **Fork the Repository** - Create your own copy of the project
2. **Create a Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Make Your Changes** - Implement and test your feature
4. **Commit Changes** - `git commit -m 'Add some amazing feature'`
5. **Push to Branch** - `git push origin feature/amazing-feature`
6. **Open a Pull Request** - Submit your changes for review

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

