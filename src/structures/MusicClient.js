const { Client, Collection } = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const { readdirSync } = require("fs");
const { endsWith } = require("lodash");
const mongoose = require('mongoose');
require("./PlayerBase"); 

class MusicBot extends Client {
	 constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: 643
        });
		 this.commands = new Collection();
     this.slashCommands = new Collection();
     this.config = require("../config.js");
     this.owner = this.config.ownerID;
     this.prefix = this.config.prefix;
     this.aliases = new Collection();
     this.commands = new Collection();
     if(!this.token) this.token = this.config.token;

/**
* Mongose for data base
*/
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    mongoose.connect(this.config.mongourl, dbOptions);
    mongoose.connection.on('connected', () => {
       console.log('Database Connected');
    });
    mongoose.connection.on('err', (err) => {
      console.log(`Mongoose connection error: \n ${err.stack}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    }); 
/**
* Error Handler
*/
    this.on("disconnect", () => console.log("Bot is disconnecting..."))
    this.on("reconnecting", () => console.log("Bot reconnecting..."))
    this.on('warn', error => console.log(error));
    this.on('error', error => console.log(error));
    process.on('unhandledRejection', () => {});
    process.on('uncaughtException', () => {})
    const client = this;
    this.manager = new Manager({
      autoPlay: true,
      nodes: this.config.nodes,
      plugins: [
        new Spotify({
          clientID: this.config.SpotifyID,
          clientSecret: this.config.SpotifySecret
        }),
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
		  
/**
* Client-Lavalink Events
*/
   readdirSync("./src/events/Client/").forEach(file => {
    const event = require(`../events/Client/${file}`);
    this.on(event.name, (...args) => event.run(this, ...args));
  });
  readdirSync("./src/events/Lavalink").forEach(file => {
    const event = require(`../events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    this.manager.on(eventName, event.bind(null, this));
  });
/**
* Import all commands
*/
  readdirSync("./src/commands/").forEach(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${dir}/${file}`);
        this.commands.set(command.name, command);
    }
  })
  console.log(`Commands Loaded`);
/**
* SlashCommands 
*/
  const data = [];
  readdirSync("./src/slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);
            if(!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);
            if(!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);
            this.slashCommands.set(slashCommand.name, slashCommand);
            data.push(slashCommand);
        }
     });
    console.log(`SlashCommands Loaded`);
	  this.on("ready", async () => {
        await this.application.commands.set(data).then(() => console.log(`Client Application (/) Registered.`)).catch((e) => console.log(e));
    });
	 }
		 connect() {
        return super.login(this.token);
    };
};
module.exports = MusicBot;
 