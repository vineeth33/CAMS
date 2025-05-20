const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const cron = require("node-cron")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const xlsx = require("xlsx")
require('dotenv').config();

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5173

const allowedOrigins = [
  'http://localhost:3001',
  'https://scintillating-gelato-17f243.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Other middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Create data directories if they don't exist
const dataDir = path.join(__dirname, "data")
const uploadsDir = path.join(__dirname, "uploads")
const usersFilePath = path.join(dataDir, "users.xlsx")
const projectsFilePath = path.join(dataDir, "projects.xlsx")

// Check and create directories with detailed logging
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log(`Created data directory: ${dataDir}`)
  } catch (error) {
    console.error(`Error creating data directory: ${error.message}`)
  }
}

if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log(`Created uploads directory: ${uploadsDir}`)
  } catch (error) {
    console.error(`Error creating uploads directory: ${error.message}`)
  }
}

// Create Excel files if they don't exist
const createExcelFileIfNotExists = (filePath, headers) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Creating new Excel file at ${filePath}`)
      const workbook = xlsx.utils.book_new()
      const worksheet = xlsx.utils.aoa_to_sheet([headers])
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1")
      xlsx.writeFile(workbook, filePath)
      console.log(`Excel file created successfully at ${filePath}`)

      // Check if file was actually created
      if (fs.existsSync(filePath)) {
        console.log(`Verified: Excel file exists at ${filePath}`)

        // Check file permissions
        try {
          fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK)
          console.log(`File ${filePath} is readable and writable`)
        } catch (err) {
          console.error(`File ${filePath} is not accessible: ${err.message}`)
        }
      } else {
        console.error(`Failed to create Excel file at ${filePath}`)
      }
    } else {
      console.log(`Excel file already exists at ${filePath}`)

      // Check file permissions
      try {
        fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK)
        console.log(`File ${filePath} is readable and writable`)
      } catch (err) {
        console.error(`File ${filePath} is not accessible: ${err.message}`)
      }
    }
  } catch (error) {
    console.error(`Error creating Excel file at ${filePath}:`, error)
    // Create an empty directory structure if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    }
  }
}

// Create users Excel file
createExcelFileIfNotExists(usersFilePath, ["id", "name", "email", "password", "department", "createdAt"])

// Create projects Excel file
createExcelFileIfNotExists(projectsFilePath, [
  "id",
  "industryName",
  "duration",
  "title",
  "principalInvestigator",
  "coPrincipalInvestigator",
  "academicYear",
  "amountSanctioned",
  "amountReceived",
  "billSettlementDetails",
  "studentDetails",
  "summary",
  "agreementDocument",
  "billSettlementProof",
  "createdAt",
  "userId",
])

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed!"), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// JWT Secret
const JWT_SECRET = "your-secret-key" // In production, use environment variable

// Helper functions for Excel operations
const readExcelFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    return xlsx.utils.sheet_to_json(worksheet)
  } catch (error) {
    console.error(`Error reading Excel file ${filePath}:`, error)
    return []
  }
}

const writeExcelFile = (filePath, data) => {
  try {
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.json_to_sheet(data)
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    xlsx.writeFile(workbook, filePath)
    return true
  } catch (error) {
    console.error(`Error writing Excel file ${filePath}:`, error)
    return false
  }
}

// Authentication middleware - DO NOT apply globally
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" })
    }

    req.user = user
    next()
  })
}

app.get("/api/notifications", authenticateToken, (req, res) => {
  try {
    const projects = readExcelFile(projectsFilePath)
    const currentDate = new Date()
    const userId = req.user.id

    const newProjects = projects.filter(p => {
      const created = new Date(p.createdAt)
      const diff = (currentDate - created) / (1000 * 60 * 60 * 24)
      return diff <= 15 && p.userId === userId
    })

    const expiringProjects = projects.filter(p => {
      const created = new Date(p.createdAt)
      const duration = parseInt(p.duration || "0")
      const deadline = new Date(created.getTime() + duration * 30 * 24 * 60 * 60 * 1000)
      const daysLeft = (deadline - currentDate) / (1000 * 60 * 60 * 24)
      return daysLeft > 0 && daysLeft <= 15 && p.userId === userId
    })

    const notifications = [
      ...newProjects.map(p => ({
        title: "New Project Added",
        message: `${p.title} - ${p.industryName}`,
      })),
      ...expiringProjects.map(p => ({
        title: "Project Nearing Completion",
        message: `${p.title} - ${p.industryName}`,
      })),
    ]

    res.json(notifications)
  } catch (err) {
    console.error("Notification fetch error:", err)
    res.status(500).json({ message: "Failed to fetch notifications" })
  }
})


// Routes

// Auth routes - NO authentication middleware here
app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body)
    const { name, email, password, department } = req.body

    // Validate input
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate college email
    if (!email.endsWith(".edu") && !email.endsWith(".ac.in")) {
      return res.status(400).json({ message: "Please use a valid college email address" })
    }

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log(`Created data directory: ${dataDir}`)
    }

    // Read existing users or create file if it doesn't exist
    let users = []
    try {
      if (fs.existsSync(usersFilePath)) {
        users = readExcelFile(usersFilePath)
      } else {
        // Create the file with headers
        createExcelFileIfNotExists(usersFilePath, ["id", "name", "email", "password", "department", "createdAt"])
        console.log("Created new users Excel file")
      }
    } catch (error) {
      console.error("Error reading/creating users file:", error)
      return res.status(500).json({ message: "Error accessing user database" })
    }

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      department,
      createdAt: new Date().toISOString(),
    }

    // Add user to Excel file
    users.push(newUser)
    const writeResult = writeExcelFile(usersFilePath, users)

    if (!writeResult) {
      return res.status(500).json({ message: "Failed to save user data" })
    }

    console.log("User registered successfully:", email)
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: `Server error during registration: ${error.message}` })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Read users from Excel
    const users = readExcelFile(usersFilePath)

    // Find user by email
    const user = users.find((user) => user.email === email)

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "24h" })

    // Return user info (excluding password) and token
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

// Project routes - Apply authentication middleware to each route
app.post(
  "/api/projects",
  authenticateToken,
  upload.fields([
    { name: "agreementDocument", maxCount: 1 },
    { name: "billSettlementProof", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const projectData = req.body
      const files = req.files

      // Read existing projects
      const projects = readExcelFile(projectsFilePath)

      // Create new project
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        agreementDocument: files.agreementDocument ? files.agreementDocument[0].filename : null,
        billSettlementProof: files.billSettlementProof ? files.billSettlementProof[0].filename : null,
        createdAt: req.body.createdAt || new Date().toISOString(),
        userId: req.user.id,
      }

      // Add project to Excel file
      projects.push(newProject)
      writeExcelFile(projectsFilePath, projects)

      res.status(201).json({ message: "Project added successfully", id: newProject.id })
    } catch (error) {
      console.error("Error adding project:", error)
      res.status(500).json({ message: "Server error while adding project" })
    }
  },
)

app.get("/api/projects", authenticateToken, (req, res) => {
  try {
    const { academicYear, amountThreshold, facultyName, industryName } = req.query

    // Read projects from Excel
    let projects = readExcelFile(projectsFilePath)

    // Apply filters if provided
    if (academicYear) {
      projects = projects.filter((project) => project.academicYear === academicYear)
    }

    if (amountThreshold) {
      const threshold = Number.parseInt(amountThreshold)
      projects = projects.filter((project) => Number.parseInt(project.amountSanctioned) >= threshold)
    }

    if (facultyName) {
      const name = facultyName.toLowerCase()
      projects = projects.filter(
        (project) =>
          project.principalInvestigator.toLowerCase().includes(name) ||
          (project.coPrincipalInvestigator && project.coPrincipalInvestigator.toLowerCase().includes(name)),
      )
    }

    if (industryName) {
      const name = industryName.toLowerCase()
      projects = projects.filter((project) => project.industryName.toLowerCase().includes(name))
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    res.status(500).json({ message: "Server error while fetching projects" })
  }
})

app.get("/api/projects/recent", authenticateToken, (req, res) => {
  try {
    // Read projects from Excel
    const projects = readExcelFile(projectsFilePath)

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Return only the 5 most recent projects
    const recentProjects = projects.slice(0, 5)

    res.json(recentProjects)
  } catch (error) {
    console.error("Error fetching recent projects:", error)
    res.status(500).json({ message: "Server error while fetching recent projects" })
  }
})

app.get("/api/projects/stats", authenticateToken, (req, res) => {
  try {
    // User ID
    const userId = req.query.user;

    // Read projects from Excel
    const projects = readExcelFile(projectsFilePath)

    // Assuming a project is active if it was created within the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userProjects = projects.filter((project) => project.userId === userId);
    const activeProjects = userProjects.filter((project) => new Date(project.createdAt).getMonth() - new Date().getMonth() <= project.duration).length;

    const completedProjects = userProjects.length - activeProjects

    // Calculate total amount sanctioned
    const totalAmount = userProjects.reduce((sum, project) => sum + (Number.parseInt(project.amountSanctioned) || 0), 0)

    res.json({
      totalProjects: userProjects.length,
      activeProjects,
      completedProjects,
      totalAmount,
    })
  } catch (error) {
    console.error("Error fetching project stats:", error)
    res.status(500).json({ message: "Server error while fetching project statistics" })
  }
})

app.get("/api/projects/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params

    // Read projects from Excel
    const projects = readExcelFile(projectsFilePath)

    // Find project by ID
    const project = projects.find((project) => project.id === id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (error) {
    console.error("Error fetching project details:", error)
    res.status(500).json({ message: "Server error while fetching project details" })
  }
})

app.get("/api/projects/:id/download/:fileType", authenticateToken, (req, res) => {
  try {
    const { id, fileType } = req.params

    // Read projects from Excel
    const projects = readExcelFile(projectsFilePath)

    // Find project by ID
    const project = projects.find((project) => project.id === id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    let filename

    if (fileType === "agreement") {
      filename = project.agreementDocument
    } else if (fileType === "billSettlement") {
      filename = project.billSettlementProof
    } else {
      return res.status(400).json({ message: "Invalid file type" })
    }

    if (!filename) {
      return res.status(404).json({ message: "File not found" })
    }

    const filePath = path.join(uploadsDir, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" })
    }

    res.download(filePath)
  } catch (error) {
    console.error("Error downloading file:", error)
    res.status(500).json({ message: "Server error while downloading file" })
  }
})

app.get("/api/projects/download", authenticateToken, (req, res) => {
  try {
    const { academicYear, amountThreshold, facultyName, industryName } = req.query

    // Read projects from Excel
    let projects = readExcelFile(projectsFilePath)

    // Apply filters if provided
    if (academicYear) {
      projects = projects.filter((project) => project.academicYear === academicYear)
    }

    if (amountThreshold) {
      const threshold = Number.parseInt(amountThreshold)
      projects = projects.filter((project) => Number.parseInt(project.amountSanctioned) >= threshold)
    }

    if (facultyName) {
      const name = facultyName.toLowerCase()
      projects = projects.filter(
        (project) =>
          project.principalInvestigator.toLowerCase().includes(name) ||
          (project.coPrincipalInvestigator && project.coPrincipalInvestigator.toLowerCase().includes(name)),
      )
    }

    if (industryName) {
      const name = industryName.toLowerCase()
      projects = projects.filter((project) => project.industryName.toLowerCase().includes(name))
    }

    // Create a new workbook for download
    const workbook = xlsx.utils.book_new()

    // Remove file paths from the data
    const projectsForExport = projects.map((project) => {
      const { agreementDocument, billSettlementProof, ...rest } = project
      return {
        ...rest,
        hasAgreementDocument: agreementDocument ? "Yes" : "No",
        hasBillSettlementProof: billSettlementProof ? "Yes" : "No",
      }
    })

    // Add the data to the workbook
    const worksheet = xlsx.utils.json_to_sheet(projectsForExport)
    xlsx.utils.book_append_sheet(workbook, worksheet, "Projects")

    // Create a temporary file
    const tempFilePath = path.join(dataDir, "temp-export.xlsx")
    xlsx.writeFile(workbook, tempFilePath)

    // Send the file
    res.download(tempFilePath, `consultancy-projects-${new Date().toISOString().split("T")[0]}.xlsx`, (err) => {
      // Delete the temporary file after download
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
      }
    })
  } catch (error) {
    console.error("Error downloading projects Excel:", error)
    res.status(500).json({ message: "Server error while downloading projects" })
  }
})

// Setup notification system
const sendNotifications = async () => {
  try {
    // Read projects and users from Excel
    const projects = readExcelFile(projectsFilePath)
    const users = readExcelFile(usersFilePath)

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-password", // Replace with your password or app password
      },
    })

    // Get current date
    const currentDate = new Date()

    // Find projects that need notifications
    const newProjects = projects.filter((project) => {
      const creationDate = new Date(project.createdAt)
      const daysSinceCreation = Math.floor((currentDate - creationDate) / (1000 * 60 * 60 * 24))
      return daysSinceCreation <= 15 // Projects created within the last 15 days
    })

    // Find projects nearing completion based on duration
    const projectsNearingCompletion = projects.filter((project) => {
      if (!project.duration) return false

      const creationDate = new Date(project.createdAt)
      const durationInDays = Number.parseInt(project.duration) * 30 // Convert months to days
      const completionDate = new Date(creationDate.getTime() + durationInDays * 24 * 60 * 60 * 1000)
      const daysUntilCompletion = Math.floor((completionDate - currentDate) / (1000 * 60 * 60 * 24))

      return daysUntilCompletion > 0 && daysUntilCompletion <= 15 // Projects completing within 15 days
    })

    // Send notifications to users
    for (const user of users) {
      // Skip if no email
      if (!user.email) continue

      let emailContent = ""

      // Add new projects to email
      if (newProjects.length > 0) {
        emailContent += "<h2>New Consultancy Projects</h2>"
        emailContent += "<ul>"
        for (const project of newProjects) {
          emailContent += `<li><strong>${project.title}</strong> - ${project.industryName}</li>`
        }
        emailContent += "</ul>"
      }

      // Add projects nearing completion to email
      if (projectsNearingCompletion.length > 0) {
        emailContent += "<h2>Projects Nearing Completion</h2>"
        emailContent += "<ul>"
        for (const project of projectsNearingCompletion) {
          emailContent += `<li><strong>${project.title}</strong> - ${project.industryName}</li>`
        }
        emailContent += "</ul>"
      }

      // Skip if no content
      if (!emailContent) continue

      // Send email
      await transporter.sendMail({
        from: "your-email@gmail.com", // Replace with your email
        to: user.email,
        subject: "CAMS: Project Notifications",
        html: `
          <h1>CAMS Notifications</h1>
          <p>Hello ${user.name},</p>
          <p>Here are your consultancy project updates:</p>
          ${emailContent}
          <p>Login to the system for more details.</p>
          <p>Regards,<br>CAMs Team</p>
        `,
      })
    }

    console.log("Notifications sent successfully")
  } catch (error) {
    console.error("Error sending notifications:", error)
  }
}

// Schedule notifications to run every 15 days
// Runs every 1 minute for testing
cron.schedule("* * * * *", () => {
  console.log("🚀 Running test notification job")
  sendNotifications()
})


// Add this code at the bottom of server.js, before app.listen
// This creates a test user when the server starts
const createTestUser = async () => {
  try {
    // Ensure directories exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Create users file if it doesn't exist
    createExcelFileIfNotExists(usersFilePath, ["id", "name", "email", "password", "department", "createdAt"])

    // Read existing users
    const users = readExcelFile(usersFilePath)

    // Check if test user already exists
    if (!users.some((user) => user.email === "test@college.edu")) {
      // Hash password
      const hashedPassword = await bcrypt.hash("password123", 10)

      // Create test user
      const testUser = {
        id: Date.now().toString(),
        name: "Test User",
        email: "test@college.edu",
        password: hashedPassword,
        department: "Computer Science",
        createdAt: new Date().toISOString(),
      }

      // Add user to Excel file
      users.push(testUser)
      writeExcelFile(usersFilePath, users)

      console.log("Test user created: test@college.edu / password123")
    }
  } catch (error) {
    console.error("Error creating test user:", error)
  }
}

// Call the function when the server starts
createTestUser()

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

