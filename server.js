const express = require('express');
const cors = require('cors');
const sql = require("mssql/msnodesqlv8")
const db = require('./config');

//routes declaration
const bookRouter = require('./routes/Book');

const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

//db connection
sql.connect(db, (err) => {
    if(err) throw err;
    console.log(`Connected to ${db.database}`);
})

//routes
app.use('/book', bookRouter);

//app
app.listen(port , () => {
    console.log(`Server is running in port ${port}`);
});
