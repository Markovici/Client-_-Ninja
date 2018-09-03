const Discord = require('discord.js');
const { prefix, token, color, footer, role } = require('./config.json');
const bot = new Discord.Client();
const fs = require('fs');
const ms = require('ms');

bot.on('ready', () => {
    console.log("#########################")
    console.log(`#   ${bot.user.username} loaded!   #`)
    console.log("#########################")
})

bot.on('message', async message => {
    if(!message.guild) return;
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) return;
    switch(command) {
        case 'ban':
            if(!message.member.roles.has(message.guild.roles.find(r => r.name === role).id)) return message.channel.send(`${message.author} - Invalid permissions!`)
            let bUser = message.mentions.members.first();
            if(!bUser) return message.channel.send(new Discord.RichEmbed()
            .setDescription("The user you mentioned is invalid!")
            .setColor(color)
            .setFooter(footer));
            let bReason = args.slice(1).join(" ");
            if(!bReason) bReason = "No ban reason given!";

            message.channel.send(new Discord.RichEmbed()
            .setTitle("Banned")
            .setDescription(`${bUser} was banned by ${message.author}`)
            .setColor(color)    
            .setFooter(footer));
            bUser.ban(bReason);
        break;
        case 'warn':
            let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
            if(!message.member.roles.has(message.guild.roles.find(r => r.name === role).id)) return message.channel.send(`${message.author} - Invalid permissions!`);
            let wUser = message.mentions.members.first();
            if(!wUser) return message.channel.send(new Discord.RichEmbed()
            .setDescription("The user you mentioned is invalid!")
            .setColor(color)
            .setFooter(footer));
            let wReason = args.slice(1).join(" ");
            if(!wReason) wReason = "No reason provided!";

            if(!warns[wUser.id]) warns[wUser.id] = {
                warns: 0
              };
            
              warns[wUser.id].warns++;
            
              fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
                if (err) console.log(err)
              });
              message.channel.send(new Discord.RichEmbed()
              .setTitle("Warned")
              .setDescription(`${wUser} was warned by ${message.author}\n\n**Warnings:** ${warns[wUser.id].warns}`)
              .setColor(color)    
              .setFooter(footer));

              let log = message.guild.channels.find(r => r.name === "logs") 
              if(!log) return message.channel.send("Logs channel not found!");

              log.send(new Discord.RichEmbed()
                .setTitle("Warning")
                .setDescription(`${wUser} was warned!`)
                .addField("Current Warnings", `${warns[wUser.id].warns}`)
                .addField("By", message.author));

                if(warn[xUser.id.warns] === 3) {
                    let muterole = message.guild.roles.find(r => r.name === "Muted");
                    if(!muterole) return message.channel.send(new Discord.RichEmbed()
                    .setDescription("The Muted role wasn't found!")
                    .setColor(color)
                    .setFooter(footer));
                    xUser.addRole(muterole.id);
    
                    setTimeout(function(){
                        xUser.removeRole(muterole.id);
                        log.send(`<@${xUser.id}> has been unmuted!`);
                    }, ms(30000));
                }
        break;
        case 'warnings':
            let warn = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
            let xUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
            if(!xUser) xUser = message.member;
            if(!warn[xUser.id]) warn[xUser.id] = {
                warns: 0
              };
            let warning = warn[xUser.id].warns;
        
            message.channel.send(new Discord.RichEmbed()    
                .setDescription(`<@${xUser.id}> has **${warning}** warnings.`)
                .setColor(color)
                .setFooter(footer));
            
        break;
        case 'mute':
            if(!message.member.roles.has(message.guild.roles.find(r => r.name === role).id)) return message.channel.send(`${message.author} - Invalid permissions!`)
            let mUser = message.mentions.members.first();
            if(!mUser) return message.channel.send(new Discord.RichEmbed()
            .setDescription("The user you mentioned is invalid!")
            .setColor(color)
            .setFooter(footer));
            let mReason = args.slice(1).join(" ");
            if(!mReason) mReason = "No reason provided";
            let muterole = message.guild.roles.find(r => r.name === "Muted");
            if(!muterole) {
                try{
                    muterole = await message.guild.createRole({
                      name: "Muted",
                      color: "#000000",
                      permissions:[]
                    })
                    message.guild.channels.forEach(async (channel, id) => {
                      await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                      });
                    });
                  }catch(e){
                    console.log(e.stack);
                  }
            }
            let mutetime = args[1];
            if(!mutetime) return message.channel.send(new Discord.RichEmbed()
            .setDescription("Invalid mute time!")
            .setColor(color)
            .setFooter(footer));

            await(mUser.addRole(muterole.id));

            message.channel.send(new Discord.RichEmbed()
              .setTitle("Muted")
              .setDescription(`${mUser} was muted by ${message.author} for ${mutetime}`)
              .setColor(color)    
              .setFooter(footer));

              let logs = message.guild.channels.find(r => r.name === "logs");
                if(!logs) return message.channel.send("Logs channel not found!");
                logs.send(new Discord.RichEmbed()
                .setTitle("Muted")
                .setDescription(`${mUser} was muted!`)
                .addField("Time", mutetime)
                .addField("By", message.author)
                .addField("Reason", mReason)
                .setColor(color)
                .setFooter(footer));

            setTimeout(function(){
              mUser.removeRole(muterole.id);
              logs.send(`${mUser} has been unmuted!`);
            }, ms(mutetime));

        

        break;
        case 'new':
            let nCat = message.guild.channels.find(r => r.name === "Tickets");
            if(!nCat) return message.channel.send("Ticket category not found!"); 
            let support = message.guild.roles.find(r => r.name === "Staff");
            if(!support) return message.channel.send("Staff role wasn't found");
            let nReason = args.join(" ");
            if(!nReason) nReason = "No reason provided";
            message.guild.createChannel(`ticket-${Math.floor((Math.random() * 10000))}`, `text`, [ // Creates the ticket
                {
                  id: message.guild.id,
                  deny: ['VIEW_CHANNEL', 'MANAGE_MESSAGES']
                },
                {
                  id: support.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
    
                },
                {
                  id: message.author.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
                },
            ], 'Ticket opened').then(channel => {
                channel.setParent(nCat.id);
                channel.send(`${support.toString()} | New Support Ticket!`);
                message.channel.send(new Discord.RichEmbed()
                .setDescription(`✅ | Your ticket has been created, ${message.author} | ${channel}`)
                .setColor(color)
                .setTimestamp()
                .setFooter(footer, bot.user.displayAvatarURL));
                if(!channel) return message.channel.send("Error!");
                channel.send(new Discord.RichEmbed()
                .setTitle("Ticket - " + message.author.tag)
                .addField("Reason", nReason)
                .setColor(color)
                .setDescription(`Hello <@${message.author.id}>, \n\nThank you for joining **#1 Fortnite Market**!\n\nWhile you're waiting for us to respond, please give us some information on your request.`)
                .setTimestamp()
                .setFooter(footer, bot.user.displayAvatarURL));
            });
        break;
        case 'close':
            let cCat = message.guild.channels.find(r => r.name === 'Tickets');
            if(!cCat) return message.channel.send("The category 'Tickets' wasn't found");
            if(message.channel.parent === cCat) {
                message.channel.send(new Discord.RichEmbed()
                .setDescription("This ticket will close in 5 seconds")
                .setColor(color)
                .setFooter(footer));
                setTimeout(function () {
                  message.channel.delete("Ticket closed!");
                }, 5000);
                return;
            } else {
                message.channel.send(new Discord.RichEmbed()
                .setDescription("This isn't a ticket!")
                .setColor(color)
                .setFooter(footer));
            }
        break;
        case 'add':
            let aCat = message.guild.channels.find(r => r.name === 'Tickets');
            if(!aCat) return message.channel.send("The category 'Tickets' wasn't found");
            if(message.channel.parent === aCat) {
                let friend = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
                message.channel.overwritePermissions(friend.id,
                    {
                      'VIEW_CHANNEL': true,
                      'SEND_MESSAGES': true
                   },
                   `${message.author.tag} invited ${friend.tag} to the ticket`);
                   message.channel.send(new Discord.RichEmbed()
                   .setTitle("User Added!")
                   .setDescription(`User: ${friend}\nBy: ${message.author}`)
                   .setColor(`${color}`)
                   .setTimestamp()
                   .setFooter(footer, bot.user.displayAvatarURL));
                   return;
            } else {
                message.channel.send(new Discord.RichEmbed()
                .setDescription("This isn't a ticket!")
                .setColor(color)
                .setFooter(footer));
            }
        break;
        case 'remove':
            let rCat = message.guild.channels.find(r => r.name === 'Tickets');
            if(!rCat) return message.channel.send("The category 'Tickets' wasn't found");
            let friends = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if(message.channel.parent === rCat) {
                message.channel.overwritePermissions(friends.id,
                    {
                    'VIEW_CHANNEL': false,
                    'SEND_MESSAGES': false
                },
                `${message.author.tag} removed ${friends.tag} from the ticket`);
                message.channel.send(new Discord.RichEmbed()
                .setTitle("User Removed!")
                .setDescription(`User: ${friends}\nBy: ${message.author}`)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(footer, bot.user.displayAvatarURL));
                return;
            } else {
                message.channel.send(new Discord.RichEmbed()
                .setDescription("This isn't a ticket!")
                .setColor(color)
                .setFooter(footer));
            }
        break;

    }

})

bot.login(token);