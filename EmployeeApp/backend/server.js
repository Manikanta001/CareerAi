
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Home Page');
});

// About route
app.get('/about', (req, res) => {
    res.send('Welcome to About Page');
});

// Contact route
app.get('/contact', (req, res) => {
    res.send('Welcome to Contact Page');
});

// Employee details
app.get('/employees', (req, res) => {
    const employees = [
        { id: 1, name: 'Pavan', department: 'IT', salary: 30000 },
        { id: 2, name: 'Rahul', department: 'HR', salary: 25000 },
        { id: 3, name: 'Kiran', department: 'Finance', salary: 35000 }
    ];

    res.json(employees);
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
