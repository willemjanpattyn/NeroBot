const { DB } = require("pg");

const db = new DB({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


exports.run = (client, message, args) => {
    db.connect();
    db.query("SELECT * FROM bdays;", (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(res));
        message.channel.send(JSON.stringify(res));
    });
    db.end();
}
