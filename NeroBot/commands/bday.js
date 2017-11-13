exports.run = (client, message, args) => {
    var client = require("../run.js");
    var db = client.db;
    db.connect();

    db.query("SELECT * FROM bdays;", (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(res));
        message.channel.send(JSON.stringify(res));
    });
    db.end();
}

