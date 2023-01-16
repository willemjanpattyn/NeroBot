const { SlashCommandBuilder } = require('discord.js');

function getBdayList(e) {
    var padEnd = require("pad-end");
    var db = require("../run.js").db;

    return new Promise(async function(resolve, reject){    
        try {
            await db.query("SELECT * FROM bdays ORDER BY birthday;", (err, result) => {
                if (err) {
                    var output = "Something went wrong..."
                    console.log(err);
                }
                else {
                    var output = ":cake: | **Nero Mancave Birthday List**\n```";
                    for (let row of result.rows) {
                        if (e.guild.members.cache.get(row.user_id) != null) {
                            let u = e.guild.members.cache.get(row.user_id).displayName;
                            let formattedDate = "" + row.birthday;
                            let month = formattedDate.substring(4, 7);
                            let day = formattedDate.substring(8, 10);
                            output += month + " " + padEnd(day, 15, "") + u + "\n";
                        }
                    }
                    output += "```";
                }

                resolve(output);
            });
        }
        catch(error) {
            reject(error);
        }
    });
}

function setBday(user, day, month) {
    var db = require("../run.js").db;
    return new Promise(async function(resolve, reject) {
        var givenBday = day + "/" + month;
        console.log(user.id);
        try {
           await db.query(`SELECT * FROM bdays WHERE user_id = '${user.id}';`, (err, result) => {
                if (err) {
                    var output = "Something went wrong...";
                    console.log(err);
                }
                else {
                    return new Promise(async function( resolvesub, rejectsub) {
                        console.log(result.rowCount);
                        if (result.rowCount > 0) {
                            db.query(`UPDATE bdays SET birthday = '2000-${month}-${day}' WHERE user_id = '${user.id}';`, (err, result) => {
                                if (err) {
                                    output = "Please input a correct date format [DD/MM]...";
                                    console.log(err);
                                    resolve(output);
                                }
                                else {
                                    output = `Your birthday has been updated to **${givenBday}**!`;
                                    console.log(`COMMAND_LOG: ${user.username} (${user.id}) updated their birthday to ${givenBday}`);
                                    resolve(output);
                                }
                            });
                        }
                        else {
                            db.query(`INSERT INTO bdays (user_id, username, birthday) VALUES ('${user.id}', '${user.username}', '2000-${month}-${day}');`, (err, result) => {
                                if (err) {
                                    output = "Please input a correct date format [DD/MM]...";
                                    console.log(err);
                                    resolve(output);
                                }
                                else {
                                    output = `Your birthday has been set to **${givenBday}**!`;
                                    console.log(`COMMAND_LOG: ${user.username} (${user.id}) set their birthday to ${givenBday}`);
                                    resolve(output);
                                }
                            });
                        }
                    })
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getBday(user) {
    var db = require("../run.js").db;

    return new Promise(async function(resolve, reject){
        try {
            await db.query(`SELECT * FROM bdays WHERE user_id = '${user.id}';`, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                if (result.rows <= 0) {
                   var output = `**${user.username}** hasn't set their birthday yet.`;
                }
                else {
                    console.log(user);
                    for (let row of result.rows) {
                        let formattedDate = "" + row.birthday;
                        let month = formattedDate.substring(4, 7);
                        let day = formattedDate.substring(8, 10);
    
                        var dateResult = row.birthday;
                        //console.log(dateResult);
                        var currentDate = new Date();
                        currentDate.setFullYear(2000);
                        //console.log(currentDate);
    
                        if (currentDate > dateResult) {
                            dateResult.setFullYear(2001);
                        }
    
                        var amountOfDays = Math.floor(Math.abs((currentDate.getTime() - dateResult.getTime()) / (24 * 60 * 60 * 1000)));
    
                        if (amountOfDays == 0 || amountOfDays == 365) {
                           output = `**${user.username}**'s birthday is on ${month} ${day}, which is today! Happy Birthday, ${user}!!\nhttps://www.youtube.com/watch?v=IylJ_daGouw`;
                        }
                        else {
                            output = `**${user.username}**'s birthday is on ${month} ${day}! (${amountOfDays} day(s) remaining)`;
                        }
                    }
                }

                resolve(output);
            });   
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bday')
		.setDescription('Shows birthdays of members')
        .addSubcommand((subcommand) =>
            subcommand
            .setName('set')
            .setDescription('Sets your birthday')
            .addStringOption((option) =>
                option.setName('day').setRequired(true).setDescription('Day of the month')
            )
            .addStringOption((option) =>
                option.setName('month').setRequired(true).setDescription('Month of your birthday')
            )
      )
      .addSubcommand((subcommand) =>
            subcommand
            .setName('get')
            .setDescription('View your own or someone else\'s birthday')
            .addUserOption((option) =>
                option.setName('user').setRequired(true).setDescription('Name of the user')
            )
      )
      .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('Shows a list of all birthdays of members who have set one')
      ),
	async execute(interaction) {
        await interaction.deferReply();
        const subCmd = interaction.options.getSubcommand();
        if (subCmd === 'list') {
            var reply = await getBdayList(interaction);
        }
        else if (subCmd === 'get') {
            var reply = await getBday(interaction.options.getUser('user'));
        }
        else if (subCmd === 'set') {
            var day = interaction.options.getString('day')
            var month = interaction.options.getString('month');
            var reply = await setBday(interaction.user, day, month);
        }
		await interaction.editReply(reply);
	},
    run: async (client, message, args) => {
        //Show list of birthdays
        if (args == "") {
            if (message.channel.name != "my-room" && message.channel.name != "bot-testing") return; // Ignore all channels except #my-room
            let output = await getBdayList(message);
            message.channel.send(output);
        }
        //Set birthday
        else if (args[0].toLowerCase() == "set") {
            let givenBday = "" + args[1];
            let u = message.author;
            var day = givenBday.split('/')[0];
            var month = givenBday.substring(givenBday.lastIndexOf('/') + 1);
            console.log(day + " " + month);
            
            let output = await setBday(u,day,month);
            message.channel.send(output);
        }
        //Show user birthday
        else {
            var u = null;
            if (message.mentions.members.first()) {
                u = message.mentions.members.first().user;
            }
            else {
                var query = args.join(' ').toLowerCase();
                u = message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query)).first().user;
            }
            if (u == null) {
                return message.channel.send("No user found.");
            }
            //console.log(u);
            let output = await getBday(u);
            message.channel.send(output);
        }
    }
};