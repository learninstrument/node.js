const express = require('express');
const app = express();
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config()
app.use(cors());
// Set up MySQL connection
const db = mysql.createConnection({
    // host: 'sql.freedb.tech',
    // user: 'freedb_submission-user',
    // password: 'Q!&ej9Wcr$D6k8w',
    // database: 'freedb_submission'
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

db.connect((err) => {
    if (err) {
        console.error('error connecting:', err);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

// Set up Express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join('/tmp', 'uploads');


// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.get('/test-db', (req, res) => {
  const query = 'SELECT * FROM assignments LIMIT 10'; // Adjust the query as needed
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving data:', err);
          return res.status(500).json({ message: 'Error retrieving data' });
      }
      return res.json(results);
  });
});

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

// Handle assignment submission
app.post('/submit-assignment', upload.single('assignment'), (req, res) => {
    let studentName = req.body.studentName;
    let departmentName = req.body.departmentName;
    let matricNumber = req.body.matricNumber;
    let level = req.body.level;
    let assignment = req.file.originalname;
  
    if (!req.file) {
      console.log('No file uploaded');
      res.json({ success: false, message: 'Please upload a file' });
    } else {
      const query = 'INSERT INTO assignments (studentName, departmentName, matricNumber, level, assignment) VALUES (?, ?, ?, ?, ?)';
      const data = [studentName, departmentName, matricNumber, level, req.file.path];
      db.query(query, data, (err, results) => {
        if (err) {
          console.error('error inserting data:', err);
          res.json({ success: false, message: 'Error inserting data' });
        } else {
          res.json({ success: true, message: 'Assignment submitted successfully' });
        }
      });
    }
  });
// Handle view feedback
// In your server-side code
app.get('/view-feedback', (req, res) => {
    const query = 'SELECT * FROM assignments';
    db.query(query, (err, results) => {
      if (err) {
        console.error('error running query:', err);
        res.status(500).send({ message: 'Error retrieving assignments' });
      } else {
        const assignments = results.map((assignment) => {
          if (assignment.assignment) {
            assignment.assignment = assignment.assignment.toString('utf8');
          }
          return assignment;
        });
        res.json(assignments);
      }
    });
  }); 
  
  app.get('/student-status', (req, res) => {
    const query = 'SELECT * FROM assignments';
    db.query(query, (err, results) => {
      if (err) {
        console.error('error running query:', err);
        res.status(500).send({ message: 'Error retrieving student status' });
      } else {
        const students = results.map((assignment) => {
          return {
            studentName: assignment.studentName,
            matricNumber: assignment.matricNumber,
            level: assignment.level,
            status: assignment.seen ? 'Seen' : 'Not Seen'
          };
        });
        res.json(students);
      }
    });
  });


  app.post('/update-status/:id', (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE assignments SET seen = 1 WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('error running query:', err);
        res.status(500).send({ message: 'Error updating status' });
      } else {
        res.json({ message: 'Status updated successfully' });
      }
    });
  });
  // Handle download assignment


// In your server-side code
// In your server-side code

// In your server-side code
app.get('/download-assignment/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM assignments WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('error running query:', err);
        res.status(500).send({ message: 'Error retrieving assignment' });
      } else {
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
      }
    });
  });
  
  // Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});