import express from 'express';
import dotenv from 'dotenv';

import sequelize from './db/db.js';
import cors from 'cors';
import cookiesParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookiesParser());
dotenv.config();

const PORT =process.env.PORT || 6000;


// middleware
app.use(express.json());
// start server and ensure DB connection
(async () => {
    try {

        await sequelize.authenticate();
        console.log(`connected to the POSTGRES successfully`);

    } catch (error) {
        console.log(`error starting in the database connection `,error);
        
    }
})();
(async () => {
    try {
        
        app.listen(PORT,()=>{
            console.log(`listening on port ${PORT}`);
        });
        
    } catch (error) {
        console.log(`error with connection to the server`);
    }
    
})();

