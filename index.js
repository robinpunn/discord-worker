// Require necessary discord.js classes
const fs = require('node:fs')
const path = require('node:path')
const {Client, Collection, Intents, ClientUser} = require('discord.js');
const {token} = require('./config.json');
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const { time } = require('@discordjs/builders');
// const date = new Date();


//create new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// Reading command files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of  commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath)
	// Set a new item in the collection
	// With the key as the command  name and the value as the exported module
	client.commands.set(command.data.name, command)
}

// When client is ready run this command only once
client.once('ready', () => {
    console.log('Ready!');
})

// Replying to commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true})
	}
});


// console.log(time(date, 'R'))

// login into discord with token
client.login(token);