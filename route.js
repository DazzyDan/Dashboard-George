module.exports = (app, connection, base) => {
	//get angular controller
	app.get("/ng_dashboard.js", function (req, res) {
		// send the angular app
		res.setHeader("Content-Type", "application/javascript");
		res.sendFile(__dirname + "/js" + "/ng_dashboard.js");
	});

	app.get("/dashboard", function (req, res) {
		// send the main (and unique) page
		res.setHeader("Content-Type", "text/html");
		res.sendFile(__dirname + "/views" + "/dashboard.html");
	});

	app.get("/quests", function (req, res) {
		// send the main (and unique) page
		res.setHeader("Content-Type", "text/html");
		res.sendFile(__dirname + "/views" + "/quests.html");
	});

	app.get("/ng_quests.js", function (req, res) {
		// send the main (and unique) page
		res.setHeader("Content-Type", "application/javascript");
		res.sendFile(__dirname + "/js" + "/ng_quests.js");
	});

	//Functions

	//get Total User Number Indicator
	app.get("/getAllUser", (req, res) => {
		//sql
		let sql = `SELECT * FROM Users`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				let tun = result.rows.length;
				// console.log(result);
				res.json(tun);
			}
		});
	});

	//get other indicators
	app.get("/getIndicators/:date", (req, res) => {
		//sql
		let sql = `SELECT * FROM Users_Daily_Log WHERE Date = '${req.params.date}';`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				res.json(result.rows);
			}
		});
	});

	// display bubble in the range of selected date
	app.get("/getRangeBubble/:start_date/:end_date", (req, res) => {
		const startDate = req.params.start_date;
		const endDate = req.params.end_date;
		const fs = require("fs");

		//sql
		console.log("Start date: " + startDate + " ;  End date: " + endDate);
		let sql = `SELECT u.pseudo as username,u.avatar_image_from_avatars as avatar,c.color,n.participation FROM Users u,mood_color c,(SELECT d.username,ROUND(d.mood/d.day) as mood,ROUND(d.participation/d.day) as participation FROM (SELECT UserName[1] as username,SUM(Mood) as mood,SUM(Participation) AS participation,'${endDate}'::date - '${startDate}'::date +1 AS day FROM EachUsers_Daily_Log WHERE Date BETWEEN '${startDate}' AND '${endDate}' GROUP BY username) d) n WHERE u.id = n.username AND n.mood = c.moodscale;`;

		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				//write the result to a json file and read that json file in bubble_d3js
				const resultJson = result.rows;
				res.json(resultJson);
				// json object to json string
				const jsonString = JSON.stringify(resultJson, null, 2);
				// console.log(jsonString)

				//write in json file
				fs.writeFile("public/jsonFile/bubble.json", jsonString, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("File successfully written!");
					}
				});
			}
		});
	});

	//team chart
	app.get("/getTeamChart", (req, res) => {
		const fs = require("fs");
		//sql
		let sql = `SELECT EXTRACT(MONTH FROM date) as month,ROUND(AVG(mood)) as mood, ROUND(AVG(daily_action)) as participation FROM Users_Daily_Log GROUP BY EXTRACT(MONTH FROM date) ORDER BY EXTRACT(MONTH FROM date);`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				//write the result to a json file and read that json file in chartjs
				const resultJson = result.rows;
				res.json(resultJson);
				// json object to json string
				const jsonString = JSON.stringify(resultJson, null, 2);
				// console.log(jsonString)

				//write in json file
				fs.writeFile("public/jsonFile/teamChart.json", jsonString, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Team chart file successfully written!");
					}
				});
			}
		});
	});
	
	//user personal chart
	app.get("/getUserChart/:username", (req, res) => {
		const fs = require("fs");
		//parameter
		const user = req.params.username;
		//sql
		let sql = `SELECT EXTRACT(MONTH FROM date) as month,ROUND(AVG(mood)) as mood,ROUND(AVG(participation)) as participation FROM EachUsers_Daily_Log WHERE pseudo_from_username[1] = '${user}' GROUP BY EXTRACT(MONTH FROM date);`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				//write the result to a json file and read that json file in chartjs
				const resultJson = result.rows;
				res.json(resultJson);
				// json object to json string
				const jsonString = JSON.stringify(resultJson, null, 2);
				// console.log(jsonString)

				//write in json file
				fs.writeFile("public/jsonFile/userChart.json", jsonString, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("User chart file successfully written!");
					}
				});
			}
		});
	});

	app.get("/getAllQuests", (req, res) => {
		//sql
		let sql = `SELECT * FROM Quests`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				//console.log(result.rows);
				res.json(result.rows);
			}
		});
	});

	app.post("/submitQuests", (req, res) => {
		const ids = req.body.questIds;
		let data = ids.map((id) => {
			return {
				fields: {
					QuestRecId: id,
				},
			};
		});

		let sql = `SELECT * FROM ActiveQuests`;
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				if (result.rows.length <= 0) {
					base("ActiveQuests").create(data, function (err, records) {
						if (err) {
							console.error(err);
							return res.status(500).send("Error saving quest.");
						}
						res.status(201).send("Quests added successfully");
					});
				} else {
					const existingIds = result.rows.map((row) => row.id);
					base("ActiveQuests").destroy(
						existingIds,
						function (err, deletedRecords) {
							if (err) {
								console.error(err);
								return res.status(500).send("Error saving quests.");
							}
							base("ActiveQuests").create(data, function (err, records) {
								if (err) {
									console.error(err);
									return res.status(500).send("Error saving quests.");
								}
								res.status(201).send("Quests added successfully");
							});
						}
					);
				}
			}
		});
	});
};
