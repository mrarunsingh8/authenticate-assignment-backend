import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/sequelize.js";
import RouteConfig from "./config/routeConfig.js";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(RouteConfig);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is started on port: ${process.env.PORT}`);
    sequelize.authenticate().then(()=>{
        console.log(`DB connected.`);
    });
});