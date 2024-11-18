const express = require('express');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const corsOptions = {
    origin: 'https://node-js-three-puce.vercel.app/submit-assignment.html', // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

// Set up Express server
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // Adjust as needed
});
// pool.connect((err) => {
//   if (err) {
//       console.error('error connecting:', err);
//       return;
//   }
//   console.log('connected as id ' + db.threadId);
// });

// Handle assignment submission
const upload = multer({
    dest: './uploads/',
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
            return cb(new Error('Please upload a PDF or Word document'));
        }
        cb(undefined, true);
    }
});

app.post('/submit-assignment', upload.single('assignment'), (req, res) => {
    let studentName = req.body.studentName;
    let departmentName = req.body.departmentName;
    let matricNumber = req.body.matricNumber;
    let level = req.body.level;
    let assignment = req.file.originalname;

    if (!req.file) {
        console.log('No file uploaded');
        return res.json({ success: false, message: 'Please upload a file' });
    }

    const query = 'INSERT INTO assignments (studentName, departmentName, matricNumber, level, assignment) VALUES (?, ?, ?, ?, ?)';
    const data = [studentName, departmentName, matricNumber, level, req.file.path];

    // Use the pool to query the database
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ success: false, message: 'Database connection error' });
        }

        connection.query(query, data, (err, results) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error('Error inserting data:', err);
                return res.json({ success: false, message: 'Error inserting data' });
            }

            console.log(`Assignment submitted successfully: ${req.file.path}`);

            // Set a timeout to delete the file after 2 minutes
            setTimeout(() => {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log(`File deleted: ${req.file.path}`);
                    }
                });
            }, 2 * 60 * 1000); // 2 minutes in milliseconds
            
            res.json({ success: true, message: 'Assignment submitted successfully' });
        });
    });
});

// Handle view feedback
app.get('/view-feedback', (req, res) => {
    const query = 'SELECT * FROM assignments';
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).send({ message: 'Error retrieving assignments' });
        }
        const assignments = results.map((assignment) => {
            if (assignment.assignment) {
                assignment.assignment = assignment.assignment.toString('utf8');
            }
            return assignment;
        });
        res.json(assignments);
    });
});

// Handle student status
app.get('/student-status', (req, res) => {
    const query = 'SELECT * FROM assignments';
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).send({ message: 'Error retrieving student status' });
        }
        const students = results.map((assignment) => {
            return {
                studentName: assignment.studentName,
                matricNumber: assignment.matricNumber,
                level: assignment.level,
                status: assignment.seen ? 'Seen' : 'Not Seen'
            };
        });
        res.json(students);
    });
});

// Update status
app.post('/update-status/:id', (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE assignments SET seen = 1 WHERE id = ?';
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).send({ message: 'Error updating status' });
        }
        res.json({ message: 'Status updated successfully' });
    });
});

// Handle download assignment
app.get('/download-assignment/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM assignments WHERE id = ?';
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).send({ message: 'Error retrieving assignment' });
        }
        const assignment = results[0];
        if (assignment) {
            if (assignment.assignment) {
                const filePath = assignment.assignment.toString();
                if (fs.existsSync(filePath)) {
                    res.download(filePath, path.basename(filePath));
                } else {
                    res.status(404).send({ message: 'No assignment file found' });
                }
            } else {
                res.status(404).send({ message: 'No assignment file found' });
            }
        } else {
            res.status(404).send({ message: 'Assignment not found' });
        }
    });
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});