const express=require("express");
const exphbs = require("express-handlebars");
const bodyParser=require("body-parser")//using it for getting the data n json format
const mysql=require("mysql2")//using it to connect mysql db

require("dotenv").config();

const app=express();
const port=process.env.PORT || 3000

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//static files
app.use(express.static("public"))

//Template engine
const handleBars=exphbs.create({extname:".hbs"})
app.engine("hbs",handleBars.engine)
app.set("view engine","hbs");


// MySql connection
const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Anubala@17",
  database: "employee",
});
// Check database connection
conn.getConnection((err,connection)=>{
    if(err)throw err;
    console.log("MySql connected successfully");
})
//Routers
// View all records
app.get('/',(req,res)=>{
    conn.getConnection((err,connection)=>{
        if(err) throw err;
        connection.query("select * from users",(err,rows)=>{
            connection.release();
            if(!err){
                res.render("home",{rows})
            }else{
                console.log("Error in listening data "+err);
            }
        })
    })
});

// create User
app.get('/addUser',(req,res)=>{
    res.render("addUsers")
})

app.post("/addUser",(req,res)=>{
    conn.getConnection((err, connection) => {
      if (err) throw err;
      const {name,age,designation,salary,phoneno}=req.body;
      connection.query("insert into users (NAME,AGE,DESIGNATION,SALARY,PHONENO) values(?,?,?,?,?)",[name,age,designation,salary,phoneno], (err, rows) => {
        connection.release();
        if (!err) {
          res.render("addUsers",{msg:"User details added successfully"});
        } else {
          console.log("Error in listening data " + err);
        }
      });
    });
});

// Update details
app.get("/editUser/:id", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    let {id}=req.params;
    connection.query("select * from users where id=?",[id], (err, rows) => {
      connection.release();
      if (!err) {
        res.render("editUser", { rows });
      } else {
        console.log("Error in listening data " + err);
      }
    });
  });

});

app.post("/editUser/:id", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    let {id}=req.params;
    const { name, age, designation,salary,phoneno } = req.body;
    connection.query(
      "update users set NAME=?,AGE=?,DESIGNATION=?,SALARY=?,PHONENO=?, where ID=?",
      [name, age, designation,salary,phoneno, id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("editUser", { msg: "User details updated successfully" });
        } else {
          console.log("Error in listening data " + err);
        }
      }
    );
  });
});

// Delete user

app.get('/deleteUser/:id',(req,res)=>{
    conn.getConnection((err,connection)=>{
        if(err)throw err;
        let {id}=req.params;
        connection.query("delete from users where id=?",[id],(err,rows)=>{
            connection.release();
            if(!err){
                res.redirect("/");
            }else{
                console.log(err);
            }
        })
    })
})


app.listen(port,()=>{
    console.log("server running on localhost "+port);
})