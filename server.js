const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
//load env vars
dotenv.config({ path: './config/config.env' });

connectDB();
const app = express();
//body parer
app.use(express.json());

//dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}! in ${process.env.NODE_ENV} mode`);
});

//handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
