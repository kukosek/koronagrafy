function loadLicense(Req){
    document.getElementById("licenseArea").innerHTML = Req.responseText.replace(/\n/g, "<br>\n");
}
var licenseReq = new XMLHttpRequest();
var waiting = false;
licenseReq.onload = function(e) {
    if (document.readyState === "complete" || document.readyState === "interactive"){
        loadLicense(licenseReq);
    }else{
        waiting = true;
    }
}
licenseReq.onerror = function(e) {
    document.getElementById("licenseArea").innerHTML = "ERROR: Could't load license";
}
licenseReq.open("GET", "/LICENSE");
licenseReq.send();
window.onload = (event) => {
    if (waiting){
        loadLicense(licenseReq);
        waiting = false;
    }
};
  