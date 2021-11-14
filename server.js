// configuration
// const Airtable = require('airtable');
// const d3 = require("d3");
//read data from Airtable through the Sequin database
require("dotenv").config();
const { Client } = require("pg");
const express = require('express');
// const axios = require('axios').default;
const app = express();

const PORT = process.env.PORT || 8000;

// const AIRTABLE_API_KEY = ;
// const AIRTABLE_BASE_ID =;
app.set('view engine', 'html');
app.use(express.json());
app.engine('html', require('ejs').renderFile);
//connection

const connection = new Client({
    host: "evening-soiree.sequindb.com",
    user: "ru9q7fewoahv9r1",
    database: "dbvjydxan6knsbw",
    password: process.env.PG_PASSWORD,
    port: 5432,
});
connection.connect((err) => {
    if (err) throw err;
    
    console.log('Connected!');
  }); 
// load routes: define controller which act on db
let routes = require('./route.js');
routes(app, connection);


//listen
app.listen(PORT, ()=>console.log(`app running on port ${PORT}`));