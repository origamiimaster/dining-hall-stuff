# Process to access menu:
1. `POST` request made to the [http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx](http://chartwellsdining.compass-usa.com/Trinity/Pages/Home.aspx) url.  
2. Website loads, displays default information.  `set-cookie` header is sent with `ASP.NET_SessionId` set.  
3. On selecting an option (ie a drop down or a different day) the website sends a `POST` request to [http://chartwellsdining.compass-usa.com/Trinity/_vti_bin/sites.asmx](http://chartwellsdining.compass-usa.com/Trinity/_vti_bin/sites.asmx).  
   1. This will make a request to the endpoint `GetUpdatedFormDigest`...
   2. The javascript that triggers the event is `javascript:setTimeout('__doPostBack(\'ctl00$m$g_f6c765ee_3151_4000_aef7_ee0b51cfbe3c$ctl00$cboLocations30\',\'\')', 0)`
4. 