/*const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;
const filePath = path.join(__dirname, './students.json');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/students/:branch", (req, res) => {
    const branch = req.params.branch.toLowerCase();
    const students = getStudentsFromFile();

    const student = students.filter(
        (stud) => stud.branch.toLowerCase() === branch
    );

    if (student.length === 0) {
        return res.status(404).json({
            error: "No students found for this branch"
        });
    }

    return res.status(200).json({
        data: student
    });
});
app.get("/students/action/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const data = fs.readFileSync(filePath);
    const students=JSON.parse(data);
    const studentIndex = students.findIndex((stud) => stud.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({
            error: "Student not found"
        });
    }
    students.splice(studentIndex, 1);

    
    writeTofile(students);

    return res.status(200).json({
        message: `Student with ID ${id} deleted successfully`,
        data: students
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;
const filePath = path.join(__dirname, './users.json');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const addDateMiddleware = (req, res, next) => {
    req.created_on = new Date()
    next();
};

const getUsersFromFile = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const saveUsersToFile = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

app.get('/api/home', (req, res) => {
    const users = getUsersFromFile();
    res.status(200).json(users);
});

app.get('/api/users/:username', (req, res) => {
    const users = getUsersFromFile();
    const user = users.find((user) => user.username === req.params.username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});

app.post('/api/users', addDateMiddleware, (req, res) => {
    const users = getUsersFromFile();
    const newUser = {
        id: users.length + 1,
        ...req.body,
        created_on: req.created_on
    };
    users.push(newUser);
    saveUsersToFile(users);
    res.status(201).json({ message: 'User added successfully', data: newUser });
});

app.put('/api/users/:id', (req, res) => {
    let users = getUsersFromFile();
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    saveUsersToFile(users);
    res.status(200).json({ message: 'User updated successfully', data: users[userIndex] });
});

app.delete('/api/users/:id', (req, res) => {
    let users = getUsersFromFile();
    const id = parseInt(req.params.id);
    const updatedUsers = users.filter((user) => user.id !== id);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: 'User not found' });
    }

    saveUsersToFile(updatedUsers);
    res.status(200).json({ message: 'User deleted successfully' });
});
app.get('/api/about',(req,res)=>{
    res.status(200).json({
        about:"It is a webpage which tells about users",
        creator:"It is created by js trainee"
    })
})
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
