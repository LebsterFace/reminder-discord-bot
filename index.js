const Discord = require("discord.js"),
	ms = require("ms"),
	prettyMilliseconds = require("pretty-ms"),
	fs = require("fs");

const client = new Discord.Client(),
	reminders = [],
	loadedReminders = require("./reminders.json");

client.on("ready", async () => {
	console.log("Bot started!");
	const now = Date.now(),
		  users = await Promise.all(loadedReminders.map(e => client.users.fetch(e.userId)));
	
	for (let i = 0; i < loadedReminders.length; i++) {
		const user = users[i],
			  {text, time} = loadedReminders[i];

		addReminder(user, time - now, text);
	}
});

function showHelp(channel) {
	const embed = new Discord.MessageEmbed();
	embed.setColor("#0099ff");
	embed.setTitle("Help Message");
	embed.setAuthor("ReminderBot");
	embed.setDescription("How to use ReminderBot");
	embed.setThumbnail("https://cdn.discordapp.com/avatars/611361134657667075/f4c772e34d866c4411dc4b6792e25ad5.webp?size=256");
	embed.addFields({name: "Regular field title", value: "Some value here"});
	embed.setTimestamp();
	embed.setFooter("ReminderBot by Lebster", "https://cdn.discordapp.com/avatars/387692962043265034/0bb6ae992054cefbe430e4b966c81bd7.webp?size=256");

	channel.send(embed);
}

function addReminder(user, delay, text) {
	const start = Date.now(),
		  index = reminders.length - 1;

	setTimeout(() => {
		user.send(`${user} from ${prettyMilliseconds(Date.now() - start, {verbose: true})} ago:\n${text}`);
		reminders.splice(index, 1);
	}, delay);

	reminders.push({text, time: Date.now() + delay, userId: user.id});
}

function exitHandler() {
	fs.writeFileSync("reminders.json", JSON.stringify(reminders));
	process.exit();
}

client.on("message", message => {
	if (message.author.bot || message.channel.type !== "dm") return;
	const args = message.content.trim().split(/ +/g);
	if (args[0] === "help") {
		howHelp(message.channel);
	} else {
		const delay = ms(args[0]),
			human = prettyMilliseconds(delay, {verbose: true}),
			text = args.slice(1).join(" ");

		addReminder(message.author, delay, text);

		if (text.length > 0) {
			message.channel.send(`Okay, ${message.author}, in ${human}: text`);
		} else {
			message.channel.send(`Pinging you in ${human}`);
		}
	}
});

client.login(require("./config.json").token);

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("uncaughtException", exitHandler);
process.on("beforeExit", exitHandler);