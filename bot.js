const Discord = require("discord.js");
const client = new Discord.Client();

var reminders,waitDate,message,discordMsg;
client.on("ready", () => {
  console.log("Bot started!");
  reminders = []
  setInterval(function() {
      reminders.forEach(function(reminder,index) {
          if (reminder.remindDate<=(new Date-0)) {
              reminder.discordMsg.channel.send(`${reminder.message}\n<@${reminder.discordMsg.author.id}>`);
  			reminders.splice(index,1)
          }
      });
  },500);
});

String.prototype.isMatch = function(s){
   return this.match(s)!==null
}

function calcTime(time,scale,me) {
    if (scale.isMatch(/^s/gi)){return(time*1000)}else
    if (scale.isMatch(/^m/gi)){return(time*60000)}else
    if (scale.isMatch(/^h/gi)){return(time*3600000)}else
    if (scale.isMatch(/^d/gi)){return(time*86400000)}else {
		return(0)
	}
}

client.on("message", message => {
  if (message.content==".rb") {message.channel.send("Version: 1.5.2\nNext Verion Additions:\n`- Repeating Reminders\n- Specific Time reminders\n - Custom Timespans`  ");return;}
  if (message.author.bot) return;
  const args = message.content.trim().split(/ +/g);
  if (args.length>1&&message.content.match(/[0123456789]/gi)!=null) {
    discordMsg=message;
    let currentDate = (new Date()-0);
    var waitDate = currentDate,
    	message=[],
      readingMessage=false;
    args.forEach(function(me) {
    	if (me.match(/[0-9]/gi)==null||readingMessage){message.push(me);readingMessage=true;}else{
        let timescale = me.split(/([0-9]+)/gi)[2],
    		time = Number(me.split(/([0-9]+)/gi)[1]);
    	currentDate = (new Date()-0);
    	waitDate += calcTime(time,timescale,me);
    }});
    reminders.push({remindDate: waitDate, message: message.join(" "), discordMsg: discordMsg});
	discordMsg.channel.send("Ok, I'll remind you!");
  } else {
    message.channel.send("**Usage**:\n`<time> <message> [repeat?]\n\nTimescales:\n\nSeconds: s, sec(s), second(s)\nMinutes: m, min(s), minute(s)\nHours: h, hour(s)\nDays: d, day(s)\n`");
  }
});


client.login(process.env.BOT_TOKEN);
