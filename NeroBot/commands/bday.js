const { Client } = require("pg");

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

db.connect();
exports.run = (client, message, args) => {

    db.query("SELECT * FROM bdays;", (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(res));
        message.channel.send(JSON.stringify(res));
    });
}
db.end();
