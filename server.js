require("dotenv").config();
// configuration
const Airtable = require("airtable");
const base = new Airtable({
	apiKey: process.env.AIRTABLE_API_KEY,
	endpointUrl: "https://proxy.sequin.io/api.airtable.com",
}).base(process.env.AIRTABLE_BASE_ID);

// const d3 = require("d3");
//read data from Airtable through the Sequin database
const { Client } = require("pg");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "html");
app.use(express.json());
//use static file in public
app.use(express.static("public"));
//use static file in scripts
app.use(express.static("scripts"));
app.engine("html", require("ejs").renderFile);
//connection

const connection = new Client({
	host: "evening-soiree.sequindb.com",
	user: process.env.PG_USER,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: 5432,
});
connection.connect((err) => {
	if (err) throw err;
	console.log("Connected!");
});

// load routes: define controller which act on db
let routes = require("./route.js");
routes(app, connection, base);

//listen
app.listen(PORT, () => console.log(`app running on port ${PORT}`));
