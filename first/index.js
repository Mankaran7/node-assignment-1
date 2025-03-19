
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;
const filePath = path.join(__dirname, './students.json');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const  writeTofile = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};
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
});

