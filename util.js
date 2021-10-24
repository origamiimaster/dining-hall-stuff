function getLocationId(){
    let spans = document.getElementsByName("span");
    for (let i = 0; i < spans.length; i++){
        if (spans[i].innerHTML == "LOCATION: "){
            console.log(spans[i])
        }
    }
}


document.getElementsByClassName("wt-venueprompt")[0].parentElement.parentElement.children[1].children[0].onchange



javascript:setTimeout('__doPostBack(\'ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30\',\'\')', 0)
__doPostBack('ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30', '')