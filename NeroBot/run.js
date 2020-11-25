'use strict';

const Discord = require("discord.js");
const client = new Discord.Client();

//let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { Client } = require("pg");

const gwId = "434375055917711360";

const prefix = "!";
exports.prefix = prefix;

var db;

const cooldown = new Set();

client.on("ready", () => {
  console.log("I am ready, Praetor!");
  client.user.setActivity('with her Praetor!', {type: 'PLAYING'});
  //setInterval(getDaysUntil, 60000);

  db = null;
  try {
    if (db == null) {
      db = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      db.connect();
    }
  } catch (err) {
    console.log(err);
  }
  exports.db = db;
});

//New member join message
client.on("guildMemberAdd", member => {
  console.log(member);
  console.log("inside guildMemberAdd");
  
  // const roleID = "466718453836021770";
  // member.addRole(roleID).then(console.log).catch(console.error);
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  if (!channel) return;
  let guildIcon = member.guild.iconURL;

  channel.send({
    embed: {
      color: 0xbf0000,
      title: "Welcome to the Nero Mancave!",
      description: `${member}, for rules and more information on the server, please check <#549612774431391747>. If you wish to change your color and get a role name, you can mention them in <#348786731421794315>!
                \nEnjoy your stay! <:umu:473851038592663552>`,
      thumbnail: { url: guildIcon },
      image: { url: "https://i.imgur.com/CUS8GGh.gif" },
    },
  });
  // console.log(
  //   `USERJOIN_LOG: User ${member.username} (${member.id}) joined the server.`
  // );
});

//Server boost message
// client.on('guildMemberUpdate', (oldMember, newMember) => {
//   if (oldMember.premiumSince !== newMember.premiumSince) {
//     const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
//     if (!channel) return;
//     let guildIcon = member.guild.iconURL;

//     channel.send({
//       embed: {
//         color: 0xbf0000,
//         title: "Thank you for mana transferring!",
//         description: `Hoooo, I can feel more power ${member}, . If you wish to change your color and get a role name, you can mention them in <#348786731421794315>!
//                   \nEnjoy your stay! <:umu:473851038592663552>`,
//         thumbnail: { url: guildIcon },
//         image: { url: "https://i.imgur.com/CUS8GGh.gif" },
//       },
//     });
//   }
// });

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

//Grants regular role to regular users
// function grantRegularRole() {
//   const roleID = "513678231656988692";
//   const guildID = "343061617275174912";
//   const apiKey = process.env.API_KEY;
//   const apiHost = "https://api.tatsumaki.xyz";

//   let members = client.guilds.first().members;

//   let xhttp = new XMLHttpRequest();

//   xhttp.open("GET", apiHost + "/guilds/" + guildID + "/leaderboard", true);
//   xhttp.setRequestHeader("Content-Type", "application/json");
//   xhttp.setRequestHeader("Authorization", apiKey);
//   console.log(xhttp.status);
//   xhttp.onload = function () {
//     if (xhttp.status >= 200 && xhttp.status < 400) {
//       let data = JSON.parse(this.responseText);
//       data.forEach((guildMember) => {
//         if (
//           guildMember != null &&
//           members.find("id", guildMember.user_id) != null
//         ) {
//           if (
//             guildMember.score >= 10000 &&
//             !members.find("id", guildMember.user_id).roles.has(roleID)
//           ) {
//             members.find("id", guildMember.user_id).addRole(roleID);
//           }
//         }
//       });
//     } else {
//       console.log("error");
//     }
//   };
//   xhttp.send();
// }

// client.on("message", async (message) => {
//   if (
//     message.content == "@!grantRegular" &&
//     message.author.id == "232430593193803777"
//   ) {
//     grantRegularRole();
//   }
// });

// var episodeCount = 7;
// function getDaysUntil() {
//   db.query(
//     `SELECT * FROM fate_extra_eps WHERE episode_count = ${episodeCount};`,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         for (let row of result.rows) {
//           //var releaseDate = new Date("Jan 27, 2018 16:00:00");
//           var releaseDate = new Date(row.release_date);
//           releaseDate.setHours(15, 0, 0, 0);

//           var oneDay = 24 * 60 * 60 * 1000;
//           var today = new Date();
//           var daysLeft = (releaseDate.getTime() - today.getTime()) / oneDay;
//           console.log(daysLeft);
//           var distance = releaseDate.getTime() - today.getTime();

//           var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//           var hours = Math.floor(
//             (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//           );
//           var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//           var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//           if (daysLeft <= 0) {
//             //client.user.setGame("Fate/EXTRA IS OUT!!!");
//             episodeCount++;
//             console.log("Added +1 to episodeCount");
//           } else {
//             //client.user.setGame("Episode " + episodeCount + days + "d " + hours + "h " + minutes + "m " + "left until Fate/EXTRA!!");
//             client.user.setGame(
//               `${days}d ${hours}h ${minutes}m left until Fate/EXTRA ep ${episodeCount}!!`
//             );
//             //console.log(`${days}d ${hours}h ${minutes}m left until Fate/EXTRA ep ${episodeCount}!!`);
//           }
//         }
//       }
//     }
//   );
// }

client.on("message", async (message) => {
  // if (
  //   message.content.includes("Paused") &&
  //   message.channel.name == "music" &&
  //   message.author.id == "381425973356134400"
  // ) {
  //   message.channel.send({
  //     files: ["https://i.imgur.com/61qtRJu.png"],
  //   });
  // }

  // if (
  //   message.content.includes("The player has stopped") &&
  //   message.channel.name == "music" &&
  //   message.author.id == "381425973356134400"
  // ) {
  //   message.channel.send({
  //     files: ["https://i.imgur.com/tJIDqYs.png"],
  //   });
  // }

  if (message.author.bot) return;

  ////Special Xmas message
  //if (message.content.toLowerCase().includes("merry christmas") || message.content.toLowerCase().includes("merry xmas")) {
  //    return message.channel.send("PADORU PADORUUU~");
  //}

  if (message.content.indexOf(prefix) !== 0) return;

  if (cooldown.has(message.author.id)) {
    console.log(
      `COOLDOWN_LOG: User ${message.author.username} (${message.author.id}) set on cooldown`
    );
    console.log();
    return message.channel
      .send("Easy there, Praetor! I'm going to become angry!!")
      .then((msg) => {
        msg.delete(5000);
      });
  }

  cooldown.add(message.author.id);
  setTimeout(() => {
    cooldown.delete(message.author.id);
  }, 2500);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command == "optin") {
    if (
      message.channel.name != "my-room" &&
      message.channel.name != "bot-testing"
    )
      return;
    if (args[0] != null) {
      if (args[0].toLowerCase() == "gw") {
        if (!message.member.roles.cache.find(role => role.id === gwId)) {
          message.member
            .roles.add(gwId)
            .then(
              console.log(
                `OPT_IN: ${message.author.username} opted in Group Watch`
              )
            )
            .catch(console.error);
          message.channel.send(
            `You are now opted in the Group Watch role, ${message.author.username}! <:umu:473851038592663552>`
          );
        } else {
          message.channel.send("You are already opted in this role.");
        }
      } else {
        message.channel.send("Please enter a valid argument: `gw`");
      }
    }
    return;
  } else if (command == "optout") {
    if (
      message.channel.name != "my-room" &&
      message.channel.name != "bot-testing"
    )
      return;
    if (args[0] != null) {
      if (args[0].toLowerCase() == "gw") {
        if (message.member.roles.cache.find(role => role.id === gwId)) {
          message.member
            .roles.remove(gwId)
            .then(
              console.log(
                `OPT_OUT: ${message.author.username} opted out of Group Watch`
              )
            )
            .catch(console.error);
          message.channel.send(
            `You are now opted out of the Group Watch role, ${message.author.username}.`
          );
        } else {
          message.channel.send("You are not opted in this role.");
        }
      } else {
        message.channel.send("Please enter a valid argument: `gw`");
      }
    }
    return;
  }

  //Custom command command
  //Show list commands
  if (command == "cl") {
    var padEnd = require("pad-end");
    db.query("SELECT * FROM commands;", (err, result) => {
      if (err) return console.log(err);

      let output = "```";

      var index = 1;
      for (let row of result.rows) {
        output += `${padEnd(index + ".", 4, "")}${row.command_name} (${row.value})\n`;
        //output += padEnd(index + ".", 4, "") + row.command_name + " ("+ row.value + ")" + "\n";
        index++;
      }
      output += "```";

      message.author.send(":clipboard: | **Custom Command List**\n" + output, {
        split: { prepend: "```", append: "```" },
      });

      message.react(message.guild.emojis.cache.get('473851038592663552'));
      //message.channel.send("List of available custom commands\n" + output).
      //    then(msg => {
      //        msg.delete(15000);
      //});
    });
  }
  //Rename command
  else if (command == "rename") {
    if (
      args.length < 2 ||
      !args[0].startsWith(prefix) ||
      !args[1].startsWith(prefix)
    ) {
      return message.channel.send(
        "Please input the correct command format\n```!rename !old !new```"
      );
    }
    db.query(
      `UPDATE commands SET command_name = '${args[1]}' WHERE command_name = '${args[0]}';`,
      (err, result) => {
        if (err) {
          message.channel.send(
            "New command name may already exist, please use a different name!"
          );
          return console.log(err);
        } else if (result.rowCount < 1) {
          return message.channel.send(
            "The command you're trying to update doesn't exist!"
          );
        } else {
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated command ${args[0]} to ${args[1]}`
          );
          return message.channel.send(
            `Renamed command ${args[0]} to **${args[1]}**`
          );
        }
      }
    );
  }
  //Edit URL command
  else if (command == "edit") {
    console.log(args.length, args[0], args[1], args[2]);
    if (args.length < 2 || !args[0].startsWith(prefix)) {
      return message.channel.send(
        "Please input the correct command format\n```!edit !yourcommand new_command_value```"
      );
    }
    var value = "";
    if (args.length >= 2) {
      for (var i = 1; i < args.length; i++) {
        value += args[i] + " ";
      }
    }
    db.query(
      `UPDATE commands SET value = '${value}' WHERE command_name = '${args[0]}';`,
      (err, result) => {
        if (err) {
          message.channel.send("An error has occured!");
          return console.log(err);
        } else if (result.rowCount < 1) {
          return message.channel.send(
            "The command you're trying to update doesn't exist!"
          );
        } else {
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) updated value of ${args[0]} to ${value}`
          );
          return message.channel.send(`Updated value of **${args[0]}**`);
        }
      }
    );
  }
  //Find command
  else if(command == "find"){
    if (args.length < 1) {
      return message.channel.send(
        "Please input the correct command format\n```!find search_value```"
      );
    }
    db.query(`SELECT * FROM commands WHERE value ILIKE '${args[0]}';`, (err, result) => {
      if (err) {
        message.channel.send(
          "Something went wrong finding the command..."
        );
        return console.log(err);
      }
      else if(result.rowCount < 1){
        return message.channel.send(
          "No search results..."
        );
      }
      let searchResults = result.rows;
      console.log(searchResults);
    });
  }
  //Delete command
  else if (command == "del" || command == "delete") {
    if (message.member.roles.has("343063483836792833")) {
      console.log(args[0], args.length);
      if (args.length < 1 || !args[0].startsWith(prefix)) {
        return message.channel.send(
          "Please input the correct command format\n```!delete !todeletecommand```"
        );
      }
      db.query(
        `DELETE FROM commands WHERE command_name = '${args[0]}';`,
        (err, result) => {
          if (err) {
            message.channel.send(
              "Something went wrong deleting the command..."
            );
            return console.log(err);
          } else if (result.rowCount < 1) {
            return message.channel.send(
              "The command you're trying to delete doesn't exist!"
            );
          }
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id}) deleted ${args[0]}`
          );
          return message.channel.send(
            `Succesfully deleted the **${args[0]}** command!`
          );
        }
      );
    } else {
      message.channel.send(
        "You don't have the permission to use this command!"
      );
    }
  }
  //Insert command
  else if (command == "add") {
    if (args.length < 2 || !args[0].startsWith(prefix)) {
      message.channel.send(
        "Please input the correct command format\n```!add !yourcommand command_value```"
      );
    } else {
      var commandName = ("" + args[0]).toLowerCase();
      var value = "";
      if (args.length >= 2) {
        for (var i = 1; i < args.length; i++) {
          if (i == args.length) {
            value += args[i];
          } else {
            value += args[i] + " ";
          }
        }
      }
      //var value = "" + args[1];

      db.query(
        `INSERT INTO commands VALUES ('${commandName}','${value}');`,
        (err, result) => {
          if (err) {
            message.channel.send(
              "Command may already exist, please use a different name!"
            );
            return console.log(err);
          }
          message.channel.send(`**${commandName}** has been created!`);
          console.log(
            `COMMAND_LOG: User ${message.author.username} (${message.author.id})`
          );
        }
      );
    }
  }

  //Commands
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    //Try to look if command in commands table
    const custCommmand = (prefix + command).toLowerCase();
    db.query(
      `SELECT * FROM commands WHERE command_name = '${custCommmand}'`,
      (err, result) => {
        if (err) {
          return console.log(err);
        }
        var val = "";
        for (let row of result.rows) {
          val = row.value;
        }
        message.channel.send(val);
      }
    );
    //console.log(`COMMAND_LOG: User ${message.author.username} (${message.author.id}) issued !command command`);
  }
});

//Login
client.login(process.env.BOT_TOKEN);
