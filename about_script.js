var licenseReq = new XMLHttpRequest();
licenseReq.onload = function(e) {
    document.getElementById("licenseArea").innerHTML = licenseReq.responseText.replace(/\n/g, "<br>\n"); // not responseText
    /* ... */
}
licenseReq.onerror = function(e) {
    document.getElementById("licenseArea").innerHTML = "ERROR: Could't load license"; // not responseText
    /* ... */
}

licenseReq.open("GET", "/LICENSE");
licenseReq.send();
