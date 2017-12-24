exports.run = (client, message, args) => {
    message.channel.startTyping();
    setTimeout(() => {
        message.channel.send("HASHIRE SORI YO");
        message.channel.stopTyping();
    }, 1000);
    setTimeout(() => {
        message.channel.startTyping();
    }, 2000);
    setTimeout(() => {
        message.channel.send("KAZE NO YOU NI");
        message.channel.stopTyping();
    }, 3000);
    setTimeout(() => {
        message.channel.startTyping();
    }, 4000);
    setTimeout(() => {
        message.channel.send("TSUKIMIHARA WO");
        message.channel.stopTyping();
    }, 5000);
    setTimeout(() => {
        message.channel.startTyping();
    }, 6000);
    setTimeout(() => {
        message.channel.send("PADORU PADORUUU~");
        message.channel.stopTyping();
    }, 7000);
};