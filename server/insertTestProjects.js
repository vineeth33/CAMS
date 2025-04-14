const axios = require("axios")

const BASE_URL = "http://localhost:5173/api/projects"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NDQwMDM3NDMwOTYiLCJlbWFpbCI6InZpbmVldGgyMjEwMzY5QHNzbi5lZHUiLCJuYW1lIjoiVmluZWV0aCBVbW1hZGlzZXR0eSIsImlhdCI6MTc0NDY1MDMwNywiZXhwIjoxNzQ0NzM2NzA3fQ.LwgdLleFUu8_nBWqE2qg9O56BiTKqyElMDiwelJ-Oys"

const testProjects = [
    {
        industryName: "Renewable Energy",
        duration: "4",
        title: "Green Grid Optimization",
        principalInvestigator: "Dr. Anil Kumar",
        coPrincipalInvestigator: "Dr. Neha Rao",
        academicYear: "2024-2025",
        amountSanctioned: "800000",
        amountReceived: "600000",
        billSettlementDetails: "Pending",
        studentDetails: "4 students involved",
        summary: "Improving efficiency of smart grids through AI.",
        createdAt: "2024-12-15T00:00:00.000Z"
    },
    {
        industryName: "EdTech",
        duration: "3",
        title: "AI Tutoring System",
        principalInvestigator: "Prof. Sneha Verma",
        coPrincipalInvestigator: "",
        academicYear: "2024-2025",
        amountSanctioned: "300000",
        amountReceived: "300000",
        billSettlementDetails: "Submitted",
        studentDetails: "2 interns",
        summary: "Developing AI-powered tutoring for underprivileged schools.",
        createdAt: "2025-02-15T00:00:00.000Z"
    },
    {
        industryName: "Healthcare AI",
        duration: "2",
        title: "ER Wait Time Predictor",
        principalInvestigator: "Dr. Surya Mehta",
        coPrincipalInvestigator: "Dr. Lakshmi Reddy",
        academicYear: "2024-2025",
        amountSanctioned: "950000",
        amountReceived: "500000",
        billSettlementDetails: "In process",
        studentDetails: "5 students",
        summary: "Predicting ER congestion using ML models.",
        createdAt: "2025-03-05T00:00:00.000Z"
    }
]

async function insertProjects() {
    for (const project of testProjects) {
        try {
            const res = await axios.post(BASE_URL, project, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            })
            console.log(`✅ Inserted project: ${project.title}`)
        } catch (err) {
            console.error(`❌ Failed to insert project: ${project.title}`, err.response?.data || err.message)
        }
    }
}

insertProjects()
