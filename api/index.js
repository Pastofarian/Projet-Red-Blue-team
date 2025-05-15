require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const loggerMiddleware = require('./self_modules/middlewares/logger'); //logger
const router = require('./self_modules/routes/routes');
const routerSecure = require('./self_modules/routes/routesSecure');
const authorize = require('./self_modules/middlewares/authorize');
const corsOptions = require('./self_modules/middlewares/cors');
const cookieParser = require('cookie-parser'); 

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({limit:"1.1MB"}));
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(cors(corsOptions))

// --- Forensic logging: all requests go here ---
app.use(loggerMiddleware);

// unprotected roads
app.use('/', router);

// authentication middleware
app.use(authorize);

// safe roads
app.use('/', routerSecure);

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.info(`[SERVER] Listening on http://${process.env.URL_API}:${port}`);
})