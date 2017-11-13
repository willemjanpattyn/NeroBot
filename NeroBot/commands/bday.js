exports.run = (client, message, args) => {
    var client = require("../run.js");
    var db = client.db;
    db.connect();

    db.query("SELECT table_schema,table_name FROM information_schema.tables;", (err, result) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        //message.channel.send(JSON.stringify(res));
    });
    db.end();
}

