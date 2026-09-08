
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// Applications file
const applicationsFile = path.join(__dirname, "applications.json");

// Create applications.json if it does not exist
if (!fs.existsSync(applicationsFile)) {
  fs.writeFileSync(applicationsFile, "[]", "utf8");
  console.log("Created applications.json");
}

// Allow the website to communicate with the backend
app.use(cors());

// JSON support
app.use(express.json());

// Upload folder
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Store uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG and PNG files are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "Meke Cashloan Backend is running"
  });
});

// Receive loan application
app.post(
  "/api/applications",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "proofIncome", maxCount: 1 },
    { name: "proofResidence", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
    { name: "guarantor", maxCount: 1 },
    { name: "collateral", maxCount: 1 }
  ]),
  (req, res) => {

    try {
      const application = {
        name: req.body.name,
        phone: req.body.phone,
        amount: req.body.amount,
        income: req.body.income,
        message: req.body.message,

        documents: {
          idDocument: req.files?.idDocument?.[0]?.filename || null,
          proofIncome: req.files?.proofIncome?.[0]?.filename || null,
          proofResidence: req.files?.proofResidence?.[0]?.filename || null,
          bankStatement: req.files?.bankStatement?.[0]?.filename || null,
          guarantor: req.files?.guarantor?.[0]?.filename || null,
          collateral: req.files?.collateral?.[0]?.filename || null
        },

        submittedAt: new Date().toISOString()
      };


let applications = [];

if (fs.existsSync(applicationsFile)) {
  try {
    applications = JSON.parse(
      fs.readFileSync(applicationsFile, "utf8")
    );
  } catch (error) {
    applications = [];
  }
}

// Give the application an ID
application.id = Date.now();

// Set initial status
application.status = "Pending";

// SHOW WHAT WAS RECEIVED

console.log("FORM DATA RECEIVED:");
console.log(req.body);

console.log("FILES RECEIVED:");
console.log(req.files);

// Add application to the list
applications.push(application);

// Save applications to file
fs.writeFileSync(
  applicationsFile,
  JSON.stringify(applications, null, 2),
    "utf8"
);

// Show application in terminal
console.log("NEW MEKE LOAN APPLICATION:");
console.log(application);

console.log("APPLICATION SAVED TO:");
console.log(applicationsFile);

res.status(201).json({
  success: true,
  message: "Your loan application was received successfully.",
  applicationId: application.id
});
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Something went wrong while processing your application."
      });
    }
  }
);

// Error handling
app.use((error, req, res, next) => {
  console.error(error);

  res.status(400).json({
    success: false,
    message: error.message || "Upload failed."
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Meke backend running on http://localhost:${PORT}`);
});

