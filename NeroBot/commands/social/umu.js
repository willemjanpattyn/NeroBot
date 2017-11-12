const Commando = require('discord.js-commando');

class UmuCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'umu',
            group: 'social',
            memberName: 'umu',
            description: 'Nero replies umu'
        });
    }

    async run(message, args) {
        message.reply("<:nero_umu:343092064822755338>");
    }
}

module.exports = UmuCommand;