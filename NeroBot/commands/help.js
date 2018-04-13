exports.run = (client, message, args) => {

    if (args == "") {
        let output = "```Nero Command List```\n";
        output += "Use `!help [command]` to get more info on a specific command, for example: `!help bday`\n\n";
        output += "`bday`, `command`, `opt`"

        message.channel.send(output);
    }
    else if (args[0].toLowerCase() == "bday") {
        let output = "`!bday` __`View birthdays of members or set your own birthday`__\n\n";
        output += "**Usage:** !bday [set] <DD/MM>\n\n";
        output += "**Examples:**\n`!bday` Shows list of birthdays of members\n`!bday set 12/05` Set or update your birthday\n\n";

        message.channel.send(output);
    }
    else if (args[0].toLowerCase() == "command") {
        let output = "`!command` __`View custom command list or set your own commands`__\n\n";
        //output += "**Usage:** !command [!yourcommand | list | rename | url | delete] [<url> | <!old !new> | <!yourcommand url> | <!todeletecommand>]\n\n";

        output += "**Usage examples:**\n`!command list` Shows list of of available custom created commands\n";
        output += "`!command !yourcommand http://i.imgur.com/YrgluxT.gif ` Adds your own command\n";
        output += "`!command rename !old !new` Renames old command to new command\n";
        output += "`!command url !yourcommand http://i.imgur.com/YrgluxT.gif ` Edits the image URL of the command\n";
        output += "`!command delete !yourcommand` Deletes the command [Admin only]\n";

        message.channel.send(output);
    }
    else if (args[0].toLowerCase() == "opt") {
        let output = "`!optin | !optout` __`Adds or removes mentionable role`__\n\n";

        output += "**Usage:** !optin [role] | !optout [role]\n";
        output += "**Args:** `gw`\n\n";
        output += "**Examples:**\n`!optin gw` Opts you in the Group Watch role\n";
        output += "`!optout gw` Opts you out of the Group Watch role";

        message.channel.send(output);
    }  
}