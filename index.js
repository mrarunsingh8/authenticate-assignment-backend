import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Hello Express");
});


app.listen(3000, ()=>{
    console.log(`Server is started on port: 3000`);
});