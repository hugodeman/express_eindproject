import express from 'express';
import mongoose from "mongoose";
import gamesRouter from "./routes/gamesRouter.js";

const app = express();

await mongoose.connect(process.env.MONGO_DB);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use((req, res, next) => {
    const acceptHeader = req.header('Accept')
    if (acceptHeader === 'application/json' || req.method === 'OPTIONS' ){
        next();
    } else {
        res.status(406).json({message: 'Illegal format'});
    }
});

app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, Access');
    //Cache - control

    next();
});

app.use('/',gamesRouter);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});