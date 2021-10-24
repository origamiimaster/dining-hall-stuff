// import fetch from 'node-fetch';
const fetch = require('node-fetch')
var JSSoup = require('jssoup').default;
const fs = require("fs");


// Attempt to fetch the page, then run it as a server...
fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx")
  .then((r) => {
    r.text()
      .then((text) => {
        // console.log(text)
        let soup = new JSSoup(text)
        let body = soup.find("div", {'class': 'wt-mainpanel'})
        let table = body.find('table')
        // console.log(table.find("span").text)
        // console.log(table.text)

        let locationSelector = soup.findAll("span")
        // console.log(locationSelector)
        let locationSelectorTD;
        locationSelector.forEach(span => { 
          if (span.text  == "LOCATION: ") {
            // console.log(span.text)
            locationSelectorTD = span.parent.parent
          }
        });
        // console.log(locationSelectorTD.text)

        form = soup.find("form")
        // console.log(form.find("input", {"name": "__VIEWSTATE"}))
        console.log(
          soup.find("input", {"name": "ctl00$g_356fe037_7f2f_47f9_b0dd_36f3506c4b07$HiddenRedirectURL"})
        )

      })
      .catch((e) => { console.log(e) })
  })
  .catch((e) => { console.log(e) })





