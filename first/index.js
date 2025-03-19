const express = require('express');
const data=require('./students.json')
const app=express()
const port=5000
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get("/students/:branch",(req,res)=>{
    const branch=req.params.branch
    const student=data.filter((stud)=>stud.branch===branch)
   
   return res.status(200).json({
        data:student
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
