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
    db.query("SELECT * FROM bdays ORDER BY birthday2;", (err, result) => {
        if (err) throw err;
        var output = "Here is the list of birthdays, Praetor!\n```";
        for (let row of result.rows) {
            console.log(JSON.stringify(row));

            var formattedDate = "" + row.birthday2;
            console.log(formattedDate);
            var month = formattedDate.substring(4, 7);
            var day = formattedDate.substring(8, 10);
            output += row.username + "\t" + day + " " + month + "\n";
        }
        output += "```";
        message.channel.send(output);
    });
}

