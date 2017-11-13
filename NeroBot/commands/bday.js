exports.run = (client, message, args) => {
    var client = require("../run.js");
    var db = client.db;
    try {
        db.connect();
    } catch (err) {
        console.log(err);
    }
    console.log("Sucessfully conencted to DB");
    db.query("SELECT * FROM bdays;", (err, result) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        //message.channel.send(JSON.stringify(res));
        db.end();
    });
}

