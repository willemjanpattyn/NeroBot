module.exports = {
    getFgoEmbed: function(user,ign,friendCode,region,image) {
        const { MessageEmbed } = require("discord.js");
        return new MessageEmbed()
            .setColor(0xbf0000)
            .setTitle("FGO Profile for " + user.username)
            .addFields(
                {
                    name: "IGN",
                    value: ign || "Not Provided",
                    inline: true
                },
                {
                    name: "Friend ID",
                    value: friendCode || "Not Provided",
                    inline: true
                },
                {
                    name: "Region",
                    value: region || "Not Provided",
                    inline: true
                }
            )
            .setThumbnail(user.displayAvatarURL)
            .setImage(image);
    }
}