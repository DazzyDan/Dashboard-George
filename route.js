module.exports = (app, connection) => {
    //get angular controller
    app.get('/ng_dashboard.js', function(req, res) {    
            // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(__dirname +'/ng_dashboard.js');
    });

    app.get('/dashboard', function(req, res) {

            // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/dashboard.html');
    });

    app.get('/data_bubble', function(req, res) {

        // send the main (and unique) page
    res.setHeader('Content-Type', 'text/html');
    res.sendFile( __dirname + '/data_bubble.csv');
});
    app.get('/bubblejs', function(req, res) {

        // send the main (and unique) page
    res.setHeader('Content-Type', 'text/html');
    res.sendFile( __dirname + '/scripts/bubble_d3.js');
    });

    app.get('/chartjs', function(req, res) {

        // send the main (and unique) page
    res.setHeader('Content-Type', 'text/html');
    res.sendFile( __dirname + '/scripts/chart.js');
    });
    app.get('/dashboardCss', function(req, res) {

        // send the main (and unique) page
    res.setHeader('Content-Type', 'text/html');
    res.sendFile( __dirname + '/public/style/dashstyle.css');
    });
    app.get('/georgeAvatar', function(req, res) {

        // send the main (and unique) page
    res.setHeader('Content-Type', 'text/html');
    res.sendFile( __dirname + '/public/images/george.png');
    });
    //Functions

    //get Total User Number Indicator
    app.get('/getAllUser',(req,res)=>{
        //sql
        let sql = `SELECT * FROM Users`;
        //connect
        connection.query(sql,(err, result)=>{
            if(!err){
                let tun = result.rows.length;
                // console.log(result);
                res.json(tun);
            };
        });
    });

    //get other indicators
    app.get('/getIndicators/:date',(req,res)=>{
        //sql
        let sql = `SELECT * FROM Users_Daily_Log WHERE Date = '${req.params.date}';`;
        //connect 
        connection.query(sql, (err, result)=>{
            if(!err){
                res.json(result);
            };
        });  
    });
// tests
	app.get("/getRangeBubble/:start_date/:end_date", (req, res) => {
		const startDate = req.params.start_date
		const endDate = req.params.end_date;

		//sql
		console.log("Start date: "+startDate+" ;  End date: "+endDate);
            	let sql = `SELECT u.pseudo as username,u.avatar_image_from_avatars as avatar,c.color,n.participation FROM Users u,mood_color c,(SELECT d.username,ROUND(d.mood/d.day) as mood,ROUND(d.participation/d.day) as participation FROM (SELECT UserName[1] as username,SUM(Mood) as mood,SUM(Participation) AS participation,'${endDate}'::date - '${startDate}'::date +1 AS day FROM EachUsers_Daily_Log WHERE Date BETWEEN '${startDate}' AND '${endDate}' GROUP BY username) d) n WHERE u.id = n.username AND n.mood = c.moodscale;`;
            
		//connect
		connection.query(sql, (err, result) => {
			if (!err) {
				res.json(result.rows);
	   			console.log(res);
			}
		});
	});

   
};


