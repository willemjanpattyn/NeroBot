exports.run = (client, message, args) => {
    var client = require("../run.js");
    var db = client.db;
    try {
        if (db != null)
            db.connect();
    } catch (err) {
        console.log(err);
    }
    console.log("Sucessfully conencted to DB");
    db.query("SELECT * FROM bdays;", (err, result) => {
        if (err) throw err;
        var output = "```";
        for (let row of result.rows) {
            console.log(JSON.stringify(row));
            output += row.username.padEnd(25) + row.date + "\n";
        }
        output += "```";
        message.channel.send(output);
    });
}

