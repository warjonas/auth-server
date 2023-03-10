import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import * as dotenv from 'dotenv'

import connect from './database/conn.js';
import router from './router/route.js';

dotenv.config();

const app = express();

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody=buf.toString()
    },
    limit:'50mb'
}));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack

const port = process.env.PORT;



app.get('/', (req, res) => {
    res.status(201).json("Server is running")
})

/**api routes */
app.use('/api', router)
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));


//Start server only with valid db connection

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected`
            );
        })
    } catch (error) {
        console.log('Cannot connect to the server')
        
    }
}).catch(error => {
    console.log('Invalid Database connection')
})



