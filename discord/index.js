const { Client, Intents, MessageAttachment } = require('discord.js')
const TOKEN = require("./config.json")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const functions = require("../generateformrequest")
// const client = new Client()

client.on('ready', () => {
    console.log("Logged in")
})

client.on('messageCreate', (msg) => {
    if (msg.author != client.user) {
        // console.log(msg)    
        // msg.channel.send("TESTING")
        if (msg.content.toLowerCase() == "getcookie") {
            functions.getFirstCookie((cookie) => {
                msg.channel.send(cookie)
            })
        }
        else if (msg.content.toLowerCase().startsWith("getmenu ")) {
            cookie = msg.content.substring("getmenu ".length, msg.content.length)
            // msg.channel.send(cookie)
            functions.getWebsite(cookie, (website) => {
                console.log(website)
                msg.channel.send({
                    files: [{
                        attachment: Buffer.from(website),
                        name: "Home.txt"
                    }
                    ]
                })
            })
        }
        else if (msg.content.toLowerCase().startsWith("changetostrachan ")) {
            cookie = msg.content.substring("getmenu ".length, msg.content.length)
            functions.changeDiningHall(cookie, true, (errorPage)=>{
                console.log(errorPage)
                msg.channel.send("Sent in request")
            })
        }
        else  if (msg.content.toLowerCase().startsWith("changetobuttery ")){
            cookie = msg.content.substring("getmenu ".length, msg.content.length)
            functions.changeDiningHall(cookie, false, (errorPage)=>{
                console.log(errorPage)
                msg.channel.send("Sent in request")
            })
        } else if (msg.content.toLowerCase() == "getmenus"){
            msg.channel.sendTyping()
            .then(()=>{
                functions.getAllMenus((breakfastMenu, lunchMenu, dinnerMenu)=>{
                    console.log(breakfastMenu)
                    msg.channel.send(breakfastMenu.getMeals())
                    console.log(lunchMenu)
                    msg.channel.send(lunchMenu.getMeals())
                    console.log(dinnerMenu)
                    msg.channel.send(dinnerMenu.getMeals())
                })

            })
            .catch(()=>{

            })
        } else if(msg.content.toLowerCase() == "custom"){
            functions.getStrachanLunchSpecific((result)=>{
                console.log(result)
                msg.channel.send(result)
            })
        }

    }
})

// console.log(TOKEN.TOKEN)
client.login(TOKEN.TOKEN)