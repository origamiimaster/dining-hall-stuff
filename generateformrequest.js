const fetch = require('node-fetch')
var JSSoup = require('jssoup').default;
const mythingy = require('./Menu')
const Menu = mythingy.Menu

function locationHelper(soup) {
    return soup.find("select", { "name": "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30" }).find("option", { "selected": "selected" }).attrs.value
}

function collectionHelper(soup) {
    return soup.find("select", { "name": "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocationsCollections30" }).find("option", { "selected": "selected" }).attrs.value
}

function mealHelper(soup) {
    return soup.find("select", { "name": "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30" }).find("option", { "selected": "selected" }).attrs.value
}

function generateRequestBody(soup, __EVENTTARGET, __EVENTARGUMENT) {
    form = soup.find("form")
    let newRequest = {
        "_wpcmWpid": "",
        "wpcmVal": "",
        "MSOWebPartPage_PostbackSource": "",
        "MSOTlPn_SelectedWpId": "",
        "MSOTlPn_View": "0",
        "MSOTlPn_ShowSettings": "False",
        "MSOGallery_SelectedLibrary": "",
        "MSOGallery_FilterString": "",
        "MSOTlPn_Button": "none",
        "__EVENTTARGET": __EVENTTARGET,
        "__EVENTARGUMENT": __EVENTARGUMENT,
        "__REQUESTDIGEST": soup.find("input", { "name": "__REQUESTDIGEST" }).attrs.value,
        "balloonIsOpen": "False",
        "MSOSPWebPartManager_DisplayModeName": "Browse",
        "MSOSPWebPartManager_ExitingDesignMode": "false",
        "MSOWebPartPage_Shared": "",
        "MSOLayout_LayoutChanges": "",
        "MSOLayout_InDesignMode": "",
        "_wpSelected": "",
        "_wzSelected": "",
        "MSOSPWebPartManager_OldDisplayModeName": "Browse",
        "MSOSPWebPartManager_StartWebPartEditingName": "false",
        "MSOSPWebPartManager_EndWebPartEditing": "false",
        "__LASTFOCUS": "",
        "__VIEWSTATE": soup.find("input", { "name": "__VIEWSTATE" }).attrs.value,
        "__VIEWSTATEGENERATOR": soup.find("input", { "name": "__VIEWSTATEGENERATOR" }).attrs.value,
        "__EVENTVALIDATION": soup.find("input", { "name": "__EVENTVALIDATION" }).attrs.value,
        "ctl00$g_356fe037_7f2f_47f9_b0dd_36f3506c4b07$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$hiddenEmailBody30": "",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30": locationHelper(soup),//"53338",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocationsCollections30": collectionHelper(soup),// "193823",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30": mealHelper(soup), //"6715124",
        "ctl00$g_da1e985a_815f_4b8f_9f06_fcd9985627ed$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "__spText1": "",
        "__spText2": "",
    }
    // console.log(newRequest["ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30"])
    console.log(Buffer.from(newRequest['__VIEWSTATE'], 'base64').toString())
    throw Test;
    resultString = ""
    Object.keys(newRequest).forEach(key => {
        // console.log(key, newRequest[key])
        resultString += key + "=" + newRequest[key] + "&"
    })
    return resultString.substring(0, resultString.length - 1)
}

function generateLocationChangeRequest(soup, strachan) {
    form = soup.find("form")
    let newRequest = {
        "_wpcmWpid": "",
        "wpcmVal": "",
        "MSOWebPartPage_PostbackSource": "",
        "MSOTlPn_SelectedWpId": "",
        "MSOTlPn_View": "0",
        "MSOTlPn_ShowSettings": "False",
        "MSOGallery_SelectedLibrary": "",
        "MSOGallery_FilterString": "",
        "MSOTlPn_Button": "none",
        "__EVENTTARGET": "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30",
        "__EVENTARGUMENT": "",
        "__REQUESTDIGEST": soup.find("input", { "name": "__REQUESTDIGEST" }).attrs.value,
        "balloonIsOpen": "False",
        "MSOSPWebPartManager_DisplayModeName": "Browse",
        "MSOSPWebPartManager_ExitingDesignMode": "false",
        "MSOWebPartPage_Shared": "",
        "MSOLayout_LayoutChanges": "",
        "MSOLayout_InDesignMode": "",
        "_wpSelected": "",
        "_wzSelected": "",
        "MSOSPWebPartManager_OldDisplayModeName": "Browse",
        "MSOSPWebPartManager_StartWebPartEditingName": "false",
        "MSOSPWebPartManager_EndWebPartEditing": "false",
        "__LASTFOCUS": "",
        "__VIEWSTATE": soup.find("input", { "name": "__VIEWSTATE" }).attrs.value,
        "__VIEWSTATEGENERATOR": soup.find("input", { "name": "__VIEWSTATEGENERATOR" }).attrs.value,
        "__EVENTVALIDATION": soup.find("input", { "name": "__EVENTVALIDATION" }).attrs.value,
        "ctl00$g_356fe037_7f2f_47f9_b0dd_36f3506c4b07$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$hiddenEmailBody30": "",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30": strachan ? "52988" : "53338",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocationsCollections30": collectionHelper(soup),// "193823",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30": mealHelper(soup), //"6715124",
        "ctl00$g_da1e985a_815f_4b8f_9f06_fcd9985627ed$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "__spText1": "",
        "__spText2": "",
    }
    // console.log(newRequest["ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30"])
    // console.log(Buffer.from(newRequest['__VIEWSTATE'], 'base64').toString())
    // throw Test;
    resultString = ""
    Object.keys(newRequest).forEach(key => {
        // console.log(key, newRequest[key])
        resultString += key + "=" + newRequest[key] + "&"
    })
    return resultString.substring(0, resultString.length - 1)
}

function makeFormBody(soup) {
    form = soup.find("form")
    let formBody = {
        "_wpcmWpid": "",
        "wpcmVal": "",
        "MSOWebPartPage_PostbackSource": "",
        "MSOTlPn_SelectedWpId": "",
        "MSOTlPn_View": "0",
        "MSOTlPn_ShowSettings": "False",
        "MSOGallery_SelectedLibrary": "",
        "MSOGallery_FilterString": "",
        "MSOTlPn_Button": "none",
        "__EVENTTARGET": "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30",
        "__EVENTARGUMENT": "",
        "__REQUESTDIGEST": soup.find("input", { "name": "__REQUESTDIGEST" }).attrs.value,
        "balloonIsOpen": "False",
        "MSOSPWebPartManager_DisplayModeName": "Browse",
        "MSOSPWebPartManager_ExitingDesignMode": "false",
        "MSOWebPartPage_Shared": "",
        "MSOLayout_LayoutChanges": "",
        "MSOLayout_InDesignMode": "",
        "_wpSelected": "",
        "_wzSelected": "",
        "MSOSPWebPartManager_OldDisplayModeName": "Browse",
        "MSOSPWebPartManager_StartWebPartEditingName": "false",
        "MSOSPWebPartManager_EndWebPartEditing": "false",
        "__LASTFOCUS": "",
        "__VIEWSTATE": soup.find("input", { "name": "__VIEWSTATE" }).attrs.value,
        "__VIEWSTATEGENERATOR": soup.find("input", { "name": "__VIEWSTATEGENERATOR" }).attrs.value,
        "__EVENTVALIDATION": soup.find("input", { "name": "__EVENTVALIDATION" }).attrs.value,
        "ctl00$g_356fe037_7f2f_47f9_b0dd_36f3506c4b07$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$hiddenEmailBody30": "",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30": "52988",// : "53338",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocationsCollections30": collectionHelper(soup),// "193823",
        "ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30": mealHelper(soup), //"6715124",
        "ctl00$g_da1e985a_815f_4b8f_9f06_fcd9985627ed$HiddenRedirectURL": "http://www.dineoncampus.ca/trinity",
        "__spText1": "",
        "__spText2": "",
    }
    return formBody
}
function compileFormBody(formBody) {
    let resultString = ""
    Object.keys(formBody).forEach(key => {
        // console.log(key, newRequest[key])
        resultString += key + "=" + formBody[key] + "&"
    })
    return resultString.substring(0, resultString.length - 1)
}


function getAllMenus(callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx")
        .then((r) => {
            let cookie = generateCookies(r)
            r.text()
                .then((text) => {
                    let soup = new JSSoup(text)
                    let formBody = makeFormBody(soup)
                    formBody['ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30'] = "52988" // strachan?  
                    formBody['ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30'] = "6806675" // "6806675" == breakfast, "6806673" == lunch, "6806674" == dinner.

                    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "max-age=0",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-gpc": "1",
                            "upgrade-insecure-requests": "1",
                            "cookie": cookie,
                            "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "body": formBody,
                        "method": "POST"
                    })
                        .then((r) => {
                            // console.log(r)
                            r.text()
                                .then((errorPageAfterSettingStrachanBreafast) => {
                                    getMenu(cookie, (BreakfastMenu) => {
                                        formBody['__EVENTTARGET'] = 'ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30'
                                        formBody['ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30'] = "6806673" // "6806675" == breakfast, "6806673" == lunch, "6806674" == dinner.
                                        fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                                            "headers": {
                                                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                                "accept-language": "en-US,en;q=0.9",
                                                "cache-control": "max-age=0",
                                                "content-type": "application/x-www-form-urlencoded",
                                                "sec-gpc": "1",
                                                "upgrade-insecure-requests": "1",
                                                "cookie": cookie,
                                                "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
                                                "Referrer-Policy": "strict-origin-when-cross-origin"
                                            },
                                            "body": formBody,
                                            "method": "POST"
                                        })
                                            .then((r) => {
                                                r.text()
                                                    .then((errorPageAfterSettingStrachanLunch) => {
                                                        getMenu(cookie, (LunchMenu) => {
                                                            formBody['ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboMealPeriods30'] = "6806674" // "6806675" == breakfast, "6806673" == lunch, "6806674" == dinner.
                                                            fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                                                                "headers": {
                                                                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                                                    "accept-language": "en-US,en;q=0.9",
                                                                    "cache-control": "max-age=0",
                                                                    "content-type": "application/x-www-form-urlencoded",
                                                                    "sec-gpc": "1",
                                                                    "upgrade-insecure-requests": "1",
                                                                    "cookie": cookie,
                                                                    "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
                                                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                                                },
                                                                "body": formBody,
                                                                "method": "POST"
                                                            })
                                                                .then((r) => {
                                                                    r.text()
                                                                        .then((errorPageAfterSettingStrachanDinner) => {
                                                                            getMenu(cookie, (DinnerMenu) => {
                                                                                callback(BreakfastMenu, LunchMenu, DinnerMenu)
                                                                            })
                                                                        })
                                                                        .catch((e) => {
                                                                            console.log(e)
                                                                        })
                                                                })
                                                                .catch((e) => { console.log(e) })

                                                        })
                                                    })
                                                    .catch((e) => { console.log(e) })
                                            })
                                            .catch((e) => { console.log(e) })
                                    })

                                })
                                .catch((e) => { console.log(e) })
                        })
                        .catch((e) => { console.log(e) })
                })
                .catch((e) => { console.log(e) })
        })
        .catch((e) => { console.log(e) })
}

function getMenu(cookie, callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
        "headers": {
            "cookie": cookie,
        }
    })
        .then((r) => {
            r.text()
                .then((text) => {
                    let menuObject = new Menu()
                    // callback(text)
                    let soup = new JSSoup(text)
                    let thingies = soup.findAll('a', { "class": "wt-itemname" })
                    thingies.forEach(thing => {
                        menuObject.addMeal(thing.text)
                    })
                    callback(menuObject)
                })
                .catch((e) => { console.log(e) })
        })
        .catch((e) => { console.log(e) })

}




function generateCookies(response) {
    cookieString = ""
    // console.log(response.headers)
    cookies = response.headers.get('set-cookie')
    // console.log(cookies.split(';')[0])
    return cookies.split(';')[0]
}

function changeDiningHall(cookie, strachan, callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
        headers: {
            cookies: cookie
        }
    })
        .then((r) => {
            r.text()
                .then((text) => {
                    let soup = new JSSoup(text)
                    body = generateLocationChangeRequest(soup, strachan)
                    console.log(body)

                    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "max-age=0",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-gpc": "1",
                            "upgrade-insecure-requests": "1",
                            "cookie": cookies,
                            "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "body": body,
                        "method": "POST"
                    })
                        .then((r) => {
                            console.log(r)
                            r.text()
                                .then((text) => {
                                    // console.log(text)
                                    callback(text)
                                })
                                .catch((e) => {
                                    console.log(e)
                                })
                        })
                        .catch((e) => {
                            console.log(e)
                        })
                })
                .catch((e) => { console.log(e) })
        })
        .catch((e) => { console.log(e) })



}

function changeMealPeriod(cookie, meal, callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-gpc": "1",
            "upgrade-insecure-requests": "1",
            "cookie": cookies,
            "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": body,
        "method": "POST"
    })
        .then((r) => {
            callback()
        })
        .catch((e) => { console.log(e) })
}

function getFirstCookie(callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx")
        .then((r) => {
            cookieString = ""
            cookies = r.headers.get('set-cookie')
            console.log(cookies.split(';')[0])
            callback(cookies.split(';')[0])
        })
        .catch((e) => { console.log(e) })
}

function getWebsite(cookies, callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
        headers: {
            cookie: cookies || ''
        }
    })
        .then((r) => {
            r.text()
                .then((text) => {
                    callback(text)
                })
                .catch((e) => { console.log(e) })
        })
        .catch((e) => { console.log(e) })
}

function getStrachanLunchSpecific(callback) {
    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx")
    .then((r)=>{
        let cookie = generateCookies(r)
        console.log(cookie)
        r.text()
        .then((textOfFirstMenu)=>{
            // Go to Strachan:
            let soup = new JSSoup(textOfFirstMenu)
            let formBody = makeFormBody(soup)
            // Ask to go to strachan, expect to not work...
            fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-gpc": "1",
                    "upgrade-insecure-requests": "1",
                    "cookie": cookie,
                    "Referer": "http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": formBody,
                "method": "POST"
            })
            .then((errorPageFromAskingForStrachan)=>{
                //Don't bother converting this to text, it should error out. 
                setTimeout(()=>{

                    fetch("http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx", {
                        headers: {
                            cookie: cookie
                        }
                    })
                    .then((responseWithStrachanAndBreakfast)=>{
                        responseWithStrachanAndBreakfast.text()
                        .then((textWithStrachanBreakfast)=>{
                            // This code is to verify that we are indeed at the Strachan but with breakfast.
                            let newSoup = new JSSoup(textWithStrachanBreakfast)
                            console.log(newSoup.findAll('a', { "class": "wt-itemname" }).map(r=>r.text))                    



                        })
                        .catch(e=>console.log)
                    })
                    .catch(e=>console.log)
                
                }, 5000)
                // await new Promise(r => setTimeout(r, 1000));
                //Ask for the main page, expecting it to be Strachan this time, but breakfast.



            })
            .catch(e=>console.log)
            

        })
    })
    .catch(e=>console.log)
}




module.exports = { getWebsite, getFirstCookie, changeDiningHall, getAllMenus, getStrachanLunchSpecific }