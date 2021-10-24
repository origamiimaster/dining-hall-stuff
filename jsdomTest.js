const jsdom = require('jsdom')
const fetch = require('node-fetch')

fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx")
    .then((r) => {
        console.log(r)
        r.text()
            .then((raw) => {
                console.log(raw)
                console.log("STARTING ")
                // const dom = new jsdom.JSDOM(raw, {
                //     runScripts: "dangerously"
                // })
                
            })
            .catch(e => console.log)
    })
    .catch(e => console.log)