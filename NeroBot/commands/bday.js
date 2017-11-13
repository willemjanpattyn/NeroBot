var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "WDA055",
    password: "52394167",
    database: "WDA055"
});

exports.run = (client, message, args) => {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to DB!");
    });
    con.query("SELECT * FROM bdays;", function (err, result) {
        if (err) throw err;
        message.send("Result: " + result).catch(console.error);
    });
}
