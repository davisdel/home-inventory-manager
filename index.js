const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require("sqlite3");
const dbSource = ('inventory.db');

const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8080;

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/items", (req,res,next) => {

    let strCommand = "SELECT * FROM tblInventory";
    db.all(strCommand,(err,rows) => {
        if(rows.length < 1){
            res.json({"status":200,"message":"error: not found"});
        } else {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":200,"message":"success","items":rows});
            }
        }
    })

});

app.post("/items", (req,res,next) => {

    let name = req.body.name;
    let quantity = req.body.quantity;
    let location = req.body.location;
    let strCommand = "INSERT INTO tblInventory (item, quantity, location) VALUES (?,?,?)";
    if(name && quantity && location){
        let arrParameters = [name, quantity, location];
        db.run(strCommand, arrParameters, (err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"Item added successfully"});
            }
        })
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }

});

app.put("/items/:id", (req,res,next) => {

    let id = req.params.id;
    let name = req.body.name;
    let quantity = req.body.quantity;
    let location = req.body.location;
    let strCommand = "UPDATE tblInventory SET item=?, quantity=?, location=? WHERE id=?";
    if(id && name && quantity && location){
        let arrParameters = [name, quantity, location, id];
        db.run(strCommand, arrParameters, (err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"Task updated successfully"});
            }
        })
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }

});

app.delete("/items/:id", (req,res,next) => {
    
    let id = req.params.id;
    let strCommand = "DELETE FROM tblInventory WHERE id=?";
    let arrParameters = [id];
    if(id){
        db.run(strCommand, arrParameters, (err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"Task removed successfully"});
            }
        })
    } else {
        res.json({"status":200,"error":"Task not found"});
    }

});

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});