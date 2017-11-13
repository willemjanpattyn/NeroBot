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
        for (let row of result.rows) {
            console.log(JSON.stringify(row));
        }
        //message.channel.send(JSON.stringify(res));
    });
}

