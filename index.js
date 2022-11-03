// Import express
import express from "express";
// Import cors
import cors from "cors";
// Import router
import Router from "./routes/index.js";
// import dotenv 
import dotenv from "dotenv";
dotenv.config();

// Init express
const app = express();
// use express json
app.use(express.json());
// use express form urlencoded
app.use(express.urlencoded({ extended: true }));
// use cors
app.use(cors());
// use router
app.use('/', Router);

// catch 404
app.use((req, res, next) => {
    res.statusCode = 404;
    res.json({
        'status' : 0,
        'message': '404_NOT_FOUND'
    });
});

// error handler
app.use((req, res, next ) => {
    if(process.env.NODE_ENV == 'production'){
        // render the error page
        res.status(500)
            .json({message : 'REQUEST_FAILED' });
    } else {
        //development error handler
        next();
    }
});

// listen on port
app.listen(process.env.APP_PORT, () => console.log('Server running at http://localhost:'+process.env.APP_PORT));