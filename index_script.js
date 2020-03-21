function convertDate(dateString){
    return dateString;
}

var firstRecordConfirmedCases = 4;

function calculateInfectionDefaultProbability(daysSinceOutbreakStart, currentConfirmedCases, meetPerDay) {
    let howtonamethis = ((Math.pow(currentConfirmedCases/firstRecordConfirmedCases, 1/daysSinceOutbreakStart)-1));
    if (meetPerDay!=false){
        return howtonamethis*100/meetPerDay;
    }else{
        return howtonamethis;
    }
}

var predictionConfigDefaults = {functionName: "henry1",
                                startValue: 4,
                                startDate: new Date(2020, 02, 02),
                                infectionPeriod: 6,
                                growthFactor: "continuousFromExistingData",
                                growthFactorDataUntilDate: new Date("2020-03-09T00:00:00.000Z"), //This will be good when we would want to know how our predictions from day X matched current data
                                averageMeetPerDay: 30,
                                infectionProbability: 30,
                                continuous_endCustom: false,
                                continuos_endCustom_val: 0.5,
                                populationSize:10649800,
                                continuous_endVar: true,
                                continuous_endVarValues: "0.27*12; 0.2*10; 0.12",
                                plotPredictionToDataChart: true,
                                plotPredictionToDataChartAddDays: 4
}

function parseEndVarValues(varValues){
    let returnList = [];
    let entries = varValues.split(";");
    for (i=0; i<entries.length; i++){
        let entry = entries[i].trim();
        if (entry.includes('*')) {
            let valueAndTimes = entry.split("*");
            let value = parseFloat(valueAndTimes[0].trim().replace(",", "."));
            let times = parseInt(valueAndTimes[1].trim());
            for(j=0; j<times; j++){
                returnList.push(value);
            }
        }else{
            returnList.push(parseFloat(entry));
        }
    }
    return returnList;
}


var predictionConfig = predictionConfigDefaults;

var growthFactorCalcConfigDefaults = {days: 4, perDay: true};
var growthFactorCalcConfig = growthFactorCalcConfigDefaults;

var myMeetPerDayConf = 20;

var dataChartHtml = "<canvas class=\"chartjs\" id=\"dataChart\"></canvas>"
var datasets = {confirmed:[], confirmedMaxInDay:[], spreadGrowthFactor:[]};
var dataChartFirstLoad = true;
function loadDataChart(optionalDataset){
    let dataChartDataset;
    if(document.getElementById("dataChart_dailyData").checked || optionalDataset != null){
        document.getElementById("dataChart_dailyData").checked = true;
        dataChartDataset = datasets["confirmedMaxInDay"];
    }else{
        dataChartDataset = datasets["confirmed"];
    }
    let feeddatasets;
    let ttformat;
    if(optionalDataset != null){
        for(var i=0; i<dataChartDataset.length; i++){
            blablaDate = new Date(dataChartDataset[i].x);
            blablaDate.setHours(0,0,0,0);
            dataChartDataset[i].x = blablaDate.toISOString();
        }
        feeddatasets = [{ 
                data: dataChartDataset,
                label: "Potvrzené případy",
                borderColor: "#f84f4a",
                fill: false
            },{
                data: optionalDataset,
                label: "Predikce",
                borderColor: "#c96526",
                fill: false
            }
                
        ];
        ttformat = 'D. M.';
    }else{
        feeddatasets = [{ 
                data: dataChartDataset,
                label: "Potvrzené případy",
                borderColor: "#f84f4a",
                fill: false
            }
        ];
        ttformat = 'D. M. H:mm';
    }
    document.getElementById("dataChartDiv").innerHTML = "";
    document.getElementById("dataChartDiv").innerHTML = dataChartHtml;
    let ctx = document.getElementById("dataChart");
    var dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: feeddatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: ttformat,
                        unit: 'day',
                        unitStepSize: 1,
                        displayFormats: {
                            'day': 'D. M.'
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        // forces step size to be 5 units
                        stepSize: 50 // <----- This prop sets the stepSize
                    }
                }]
            }
        }
    });
    document.getElementById("dataChart").onclick = function (evt) {
        var activePoints = dataChart.getElementsAtEventForMode(evt, 'point', dataChart.options);
        if(activePoints.length > 0 && predictionConfigShowed && document.getElementById("mTimesPway").value == "continuousFromExistingData" && document.getElementById("continuous_limitData").checked){
            var firstPointIndex = activePoints[0]._index;
            let dateOfClickedPoint = new Date(datasets["spreadGrowthFactor"][firstPointIndex].x);
            document.getElementById("growthFactorDateLimit").value = dateOfClickedPoint.toISOString().substr(0, 10);
        }
    };
}
var daysSinceOutbreakSt;
var data;
function loadCurrentData(){
    /* Fetch current data from kukosek's github
     * 
     */
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/current_numbers.json');
    xhr.send();

    // This will be called after the response is received
    xhr.onload = function() {
        if (xhr.status == 200) { // analyze HTTP status of the response
            data = JSON.parse(xhr.response); // responseText is the server
            //confirmed cases box
            document.getElementById("confirmedCasesText").getElementsByClassName("statNumber")[0].innerHTML = data["confirmed"]["number"];
            document.getElementById("confirmedCasesText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["confirmed"]["date"]);
            
            //cured box
            document.getElementById("curedText").getElementsByClassName("statNumber")[0].innerHTML = data["recovered"]["number"];
            document.getElementById("curedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["recovered"]["date"]);
            
            //deaths box
            document.getElementById("deathsText").getElementsByClassName("statNumber")[0].innerHTML = data["deaths"]["number"];
            document.getElementById("deathsText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["deaths"]["date"]);
            
            //calculate config variable for prediction
            let latestRecordDate = new Date(data["confirmed"]["date"]);
            let outbreakStartDate = new Date(2020, 02, 02);
            let timeSinceOutbreakSt = Math.abs(latestRecordDate-outbreakStartDate);
            daysSinceOutbreakSt = Math.round(timeSinceOutbreakSt / (1000 * 60 * 60 * 24));
            predictionConfigDefaults["infectionProbability"] = calculateInfectionDefaultProbability(daysSinceOutbreakSt, data["confirmed"]["number"], predictionConfigDefaults["averageMeetPerDay"]);
            
            //load default value into did i got the virus today box inputBox
            document.getElementById("myMeetPerDay").value = myMeetPerDayConf;
            myTodayInfectedProbability();
            dynamicInputAdjust();
        } else { // show the result
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        }
    };

    xhr.onerror = function() {
        alert("Request failed");
    };
    
    
    
    /* Fetch current datasets to charts from kukosek's github
     * 
     */
    let xhrConfirmed = new XMLHttpRequest();
    xhrConfirmed.open('GET', 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/records_confirmed.csv');
    xhrConfirmed.send();

    // This will be called after the response is received
    xhrConfirmed.onload = function() {
        if (xhrConfirmed.status == 200 || xhrConfirmed.status == 304) { // analyze HTTP status of the response
            var results = Papa.parse(xhrConfirmed.response);
            if (results["errors"].length == 0){
                columnNames = results.data[0];
                datasetsInColumns = results.data.slice(1);
                datasetsInRows = datasetsInColumns[0].map(function(col, i) {
                    return datasetsInColumns.map(function(row) {
                        return row[i];
                    });
                });
                datasets["confirmed"] = [];
                datasets["confirmedMaxInDay"] = [];
                
                let firstDate = new Date(datasetsInRows[1][0]);
                let i = 0;
                var lastValueConfirmed = -1;
                datasetsInRows[1].forEach(function(entry) {
                    let currValueConfirmed = datasetsInRows[2][i];
                    if (currValueConfirmed != lastValueConfirmed){
                        var dataObject = {x: entry, y: currValueConfirmed};
                        datasets["confirmed"].push(dataObject);
                    }
                    if (i+1<datasetsInRows[1].length){
                        dateOfEntry = new Date(entry);
                        let nextDate = new Date(datasetsInRows[1][i+1]);
                        if (nextDate.getDate() != dateOfEntry.getDate()){
                            datasets["confirmedMaxInDay"].push({x: entry, y: currValueConfirmed});
                        }
                    }else{
                        //datasets["confirmedMaxInDay"].push({x: entry, y: currValueConfirmed});
                    }
                    i++;
                    lastValueConfirmed = currValueConfirmed;
                });
                loadDataChart(null);
                
                //calculate spread growth factors from confirmed dataset
                calculateSpreadGrowthFactorAndPlot("77%");
                getDataCalculatePredictionAndPlot();
                
                
            }else{
                alert("Error parsing chart dataset");
            }
        } else { // show the result
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        }
    };

    xhrConfirmed.onerror = function() {
        alert("Request failed");
    };
};


var predictionChartHtml = "<canvas class=\"chartjs\" id=\"predictionChart\"></canvas>";


function loadPredictionConfigIntoHTML(){
    document.getElementById("predictionChartDiv").innerHTML = "";
    document.getElementById("predictionFunctionName").value = predictionConfig["functionName"];
    document.getElementById("mTimesPway").value = predictionConfig["growthFactor"];
    document.getElementById("infectionPeriod").value = predictionConfig["infectionPeriod"];
    document.getElementById("averageMeetPerDay").value = predictionConfig["averageMeetPerDay"];
    document.getElementById("infectionProbability").value = predictionConfig["infectionProbability"];
    document.getElementById("continuous_endLast").checked = !predictionConfig["continuous_endCustom"];
    document.getElementById("continuous_endCustom").checked = predictionConfig["continuous_endCustom"];
    document.getElementById("continuous_endCustomVars").checked = predictionConfig["continuous_endVar"];
    if (predictionConfig["growthFactorDataUntilDate"] == -1) {
        document.getElementById("continuous_limitData").checked = false;
    }else{
        document.getElementById("continuous_limitData").checked = true;
        document.getElementById("growthFactorDateLimit").value = predictionConfig["growthFactorDataUntilDate"].toISOString().substr(0, 10);
    }
    predictionConfigDateLimitCbChange();
    document.getElementById("valueAfterDataFromGrowthChart").value = predictionConfig["continuos_endCustom_val"];
    document.getElementById("populationSize").value = predictionConfig["populationSize"];
    document.getElementById("plotPredictionToDataChart").checked = predictionConfig["plotPredictionToDataChart"];
    document.getElementById("plotPredictionToDataChartAddDays").value = predictionConfig["plotPredictionToDataChartAddDays"];
    dynamicInputAdjust();
    predictionConfigMtimesPwayChange();
    predictionConfigValAtEndChange(false);
    plotPredictionToDataChartCbChange();
}
function saveHTMLtoPredictionConfig(){
    predictionConfig["functionName"] = document.getElementById("predictionFunctionName").value;
    predictionConfig["growthFactor"] = document.getElementById("mTimesPway").value;
    predictionConfig["infectionPeriod"] = document.getElementById("infectionPeriod").value;
    predictionConfig["averageMeetPerDay"] = document.getElementById("averageMeetPerDay").value;
    predictionConfig["infectionProbability"] = document.getElementById("infectionProbability").value;
    predictionConfig["continuous_endCustom"] = document.getElementById("continuous_endCustom").checked;
    predictionConfig["continuos_endCustom_val"] = document.getElementById("valueAfterDataFromGrowthChart").value;
    if (document.getElementById("continuous_limitData").checked) {
        predictionConfig["growthFactorDataUntilDate"] = new Date(document.getElementById("growthFactorDateLimit").value);
    }else{
        predictionConfig["growthFactorDataUntilDate"] = -1;
    }
    predictionConfig["populationSize"] = document.getElementById("populationSize").value;
    predictionConfig["plotPredictionToDataChart"] = document.getElementById("plotPredictionToDataChart").checked;
    predictionConfig["plotPredictionToDataChartAddDays"] = document.getElementById("plotPredictionToDataChartAddDays").value;
}


var predictionConfigShowed=false;
function predictionConfigSH(calculate){
    if (predictionConfigShowed == false) {
        predictionConfigShowed = true;
        document.getElementById("settingsApplyButton").src="apply.svg";
        let fghjkl = document.getElementsByClassName("showedInPredictionConfig");
        for (i=0; i<fghjkl.length; i++){
            fghjkl[i].style.display = "initial";
        }
        
        document.getElementById("predictionConfig").style.display = "initial";
        loadPredictionConfigIntoHTML();
        document.getElementById('config-input').addEventListener('change', loadPredictionConfigFile, false);
    }else{
        predictionConfigShowed = false;
        document.getElementById("settingsApplyButton").src="settings.svg";
        let fghjkl = document.getElementsByClassName("showedInPredictionConfig");
        for (i=0; i<fghjkl.length; i++){
            fghjkl[i].style.display = "none";
        }
        
        saveHTMLtoPredictionConfig();
        document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
        document.getElementById("predictionConfig").style.display = "none";
        if(calculate){
            getDataCalculatePredictionAndPlot();
        }
    }
}

function savePredictionConfigFile(){
    saveHTMLtoPredictionConfig();
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(predictionConfig)));
    pom.setAttribute('download', "koronagrafy-prediction-config.json");

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
function loadPredictionConfigFile(evt){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload=function(){
            try{
                let loadedDict = JSON.parse(reader.result);
                predictionConfig = JSON.parse(reader.result);
            }catch(err){
                alert("Chyba při čtení souboru:\n"+err.message);
            }
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    loadPredictionConfigIntoHTML()
}

function resetPredictionConfigToDefault(){
    if (confirm('Opravdu chcete obnovit výchozí hodnoty konfigurace?')) {
        predictionConfig = predictionConfigDefaults;
        loadPredictionConfigIntoHTML();
    }
}

function predictionConfigMtimesPwayChange(){
    if (document.getElementById("mTimesPway").value == "customFixed") {
        document.getElementById("customFixedValueConfig").style.display = "initial";
        document.getElementById("label_averageMeetPerDay").style.display = "initial";
        document.getElementById("label_infectionProbability").style.display = "initial";
        document.getElementById("continuousFromExistingDataConfig").style.display = "none";
        
    }else if (document.getElementById("predictionFunctionName").value == "henryProbabilistic" &&  document.getElementById("mTimesPway").value == "continuousFromExistingData") {
        document.getElementById("continuousFromExistingDataConfig").style.display = "initial";
        document.getElementById("customFixedValueConfig").style.display = "initial";
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "initial";
    }else if (document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "fixedFromCurrentValue"){
        document.getElementById("continuousFromExistingDataConfig").style.display = "none";
        document.getElementById("customFixedValueConfig").style.display = "initial";
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "initial";
    }else if(document.getElementById("mTimesPway").value == "continuousFromExistingData") {
        document.getElementById("continuousFromExistingDataConfig").style.display = "initial";
        document.getElementById("customFixedValueConfig").style.display = "none";
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "none";
    }else{
        document.getElementById("customFixedValueConfig").style.display = "none";
        document.getElementById("continuousFromExistingDataConfig").style.display = "none";
    }
}

function predictionConfigFunctionNameChange(){
    if (document.getElementById("predictionFunctionName").value == "henryProbabilistic" &&  document.getElementById("mTimesPway").value == "continuousFromExistingData") {
        document.getElementById("customFixedValueConfig").style.display = "initial";
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "initial";
    }else if(document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "fixedFromCurrentValue"){
        document.getElementById("continuousFromExistingDataConfig").style.display = "none";
        document.getElementById("customFixedValueConfig").style.display = "initial";
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "initial";
    }else{
        document.getElementById("label_averageMeetPerDay").style.display = "none";
        document.getElementById("label_infectionProbability").style.display = "none";
    }
}

function plotPredictionToDataChartCbChange(){
    if(document.getElementById("plotPredictionToDataChart").checked){
        document.getElementById("plotPredictionToDataChartAddDays").disabled = false;
        document.getElementById("label_plotPredictionToDataChartAddDays").style.color = "#444";
    }else{
        document.getElementById("plotPredictionToDataChartAddDays").disabled = true;
        document.getElementById("label_plotPredictionToDataChartAddDays").style.color = "grey";
    }
}

function predictionConfigValAtEndChange(promptT){
    if(document.getElementById("continuous_endCustom").checked){
        document.getElementById("valueAfterDataFromGrowthChart").disabled = false;
        document.getElementById("label_continuous_endLast").style.color = "grey";
        predictionConfig["continuous_endVar"] = false;
    }else if(document.getElementById("continuous_endLast").checked){
        document.getElementById("valueAfterDataFromGrowthChart").disabled = true;
        document.getElementById("label_continuous_endLast").style.color = "#444";
        predictionConfig["continuous_endVar"] = false;
    }else{
        if (promptT){
            predictionConfig["continuous_endVar"] = true;
            let specifiedEndVars = prompt("Zadejte ve formátu: hodnota1(*kolik dní); hodnota2(*kolik dní),...\n hodnota -1 znamená poslední použítá hodnota.", predictionConfig["continuous_endVarValues"]);
            try {
                let output =parseEndVarValues(specifiedEndVars);
                if (output.length>0 && !output.includes(NaN)){
                    predictionConfig["continuous_endVarValues"] = specifiedEndVars;
                }else{
                    alert("Něco nevyšlo, možná jste zadali špatný formát. Zkuste to znovu");
                    predictionConfigValAtEndChange();
                }
            }catch(err){
                if (err.message != "varValues is null"){
                    alert("Něco nevyšlo, možná jste zadali špatný formát. "+err.message);
                }
            }
        }
    }
}

function predictionConfigDateLimitCbChange() {
    if (document.getElementById("continuous_limitData").checked) {
        document.getElementById("growthFactorDateLimit").disabled = false;
    }else{
        document.getElementById("growthFactorDateLimit").disabled = true;
    }
}

function infectionPeriodGrowthFactorChange() {
    predictionConfig["infectionPeriod"] = parseInt(document.getElementById("infectionPeriod").value);
    if (growthFactorCalcConfig["days"] != "all"){
        calculateSpreadGrowthFactorAndPlot("77%");
    }
    myTodayInfectedProbability();
}
function dynamicInputAdjust(){
    let inputBoxes = document.getElementsByClassName("dynamicInput");
    for(i = 0; i < inputBoxes.length; i++) {
        inputBoxes[i].style.width = ((inputBoxes[i].value.length + 1) * 8)+36 + 'px';
    }
}

function getDataCalculatePredictionAndPlot(){
    if (predictionConfigShowed) {
        predictionConfigSH(false);
    }
    result = calculatePredictions();
    labels = [];
    let predDataset = [];
    //round the results
    result["infectedPeopleInDay"].forEach(function(entry) {
        predDataset.push({
            x: entry.x,
            y: Math.round(entry.y)
        });
    });
    
    
    document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
    var ctx2 = document.getElementById("predictionChart");
    var predictionChart = new Chart(ctx2, {
        type: 'line',
        data: {
            datasets: [{
                data: predDataset,
                label: "Počet lidí, kteří jsou nebo byli infikováni",
                borderColor: "#c96526",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'D. M. Y',
                        unit: 'day',
                        displayFormats: {
                            'day': 'D. M.'
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: false,
                        labelString: 'Počet lidí'
                    }
                }]
            }
        }
    });
    if(predictionConfig["plotPredictionToDataChart"]){
        let endOf = parseInt(daysSinceOutbreakSt)+parseInt(predictionConfig["plotPredictionToDataChartAddDays"]);
        loadDataChart(predDataset.slice(0,endOf));
    }
}

function growthFactorConfigChange(){
    if (document.getElementById("dataChart_whole").checked){
        document.getElementById("label_daysToCalculateGrowthFactorOver").style.color = "grey";
        document.getElementById("daysToCalculateGrowthFactorOver").disabled = true;
        growthFactorCalcConfig["days"] = "all";
    }else{
        document.getElementById("label_daysToCalculateGrowthFactorOver").style.color = "#444";
        document.getElementById("daysToCalculateGrowthFactorOver").disabled = false;
        growthFactorCalcConfig["days"] = document.getElementById("daysToCalculateGrowthFactorOver").value;
    }
    calculateSpreadGrowthFactorAndPlot("50%");
    getDataCalculatePredictionAndPlot();
}

var growthFactorConfigShowed = false;
function growthFactorConfigSH(){
    if(growthFactorConfigShowed){
        calculateSpreadGrowthFactorAndPlot("77%");
        document.getElementById("growthFactorChartConfig").style.display = "none";
        document.getElementById("growthFactorChartInfo").style.display = "initial";
    }else{
        document.getElementById("growthFactorChartConfig").style.display = "initial";
        document.getElementById("growthFactorChartInfo").style.display = "none";
        if (growthFactorCalcConfig["days"]=="all"){
            document.getElementById("dataChart_whole").checked = true;
        }else{
            document.getElementById("chartConfig_between").checked = true;
            document.getElementById("daysToCalculateGrowthFactorOver").value = growthFactorCalcConfig["days"];
        }
        calculateSpreadGrowthFactorAndPlot("50%");
    }
    growthFactorConfigShowed = !growthFactorConfigShowed;
    
}

function calculateSpreadGrowthFactor(dataset){
    datasets["spreadGrowthFactor"] = [];
    days = parseInt(growthFactorCalcConfig["days"]);
    if (growthFactorCalcConfig["perDay"]){
        if(growthFactorCalcConfig["days"] == "all"){
            for(i=1; i < dataset.length; i++) {
                
                let result = calculateInfectionDefaultProbability(i, dataset[i].y, false);
                let date = new Date(dataset[i-1].x);
                date.setHours(12,0,0,0);
                datasets["spreadGrowthFactor"].push({x: date.toISOString(), y: result});
            }
        }else{
            for(i=0; i < dataset.length-days; i++) {
                let upperSide = dataset[i+days].y - dataset[i].y;
                let bottomSidePart1 = 0;
                let bottomSidePart2 = 0;
                for (j = 0; j<days; j++){
                    bottomSidePart1 += parseInt(dataset[i+j].y);
                    let indexOfMyPoop = i-predictionConfig["infectionPeriod"]+j;
                    if (indexOfMyPoop < 0) {
                        bottomSidePart2 += 0;
                    }else{
                        bottomSidePart2 +=  parseInt(dataset[indexOfMyPoop].y);
                    }
                }
                let bottomSide = bottomSidePart1 - bottomSidePart2;
                
                let result = upperSide/bottomSide;
                let date = new Date(dataset[i].x) //V2
                date.setHours(12,0,0,0);
                datasets["spreadGrowthFactor"].push({x: date.toISOString(), y: result});
            }
        }
    } //TODO if not perday
}



growthFactorChartHtml = "<canvas class=\"chartjs\" id=\"infectionGrowthFactorChart\"></canvas>";
function calculateSpreadGrowthFactorAndPlot(height){//TODO dont call this twice like idiot
    calculateSpreadGrowthFactor(datasets["confirmedMaxInDay"]);
    
    document.getElementById("growthFactorChartDiv").innerHTML = "";
    document.getElementById("growthFactorChartDiv").innerHTML = growthFactorChartHtml;
    document.getElementById("infectionGrowthFactorChart").style.height = height;
    var ctx = document.getElementById("infectionGrowthFactorChart");
    
    
    
    var infectionGrowthFactorChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{ 
                data: datasets["spreadGrowthFactor"],
                label: "Faktor šíření",
                borderColor: "#5e00c9",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'D. M.',
                        unit: 'day',
                        displayFormats: {
                            'day': 'D. M.'
                        }
                    }
                }]
            }
        }
    });
    document.getElementById("infectionGrowthFactorChart").onclick = function (evt) {
        var activePoints = infectionGrowthFactorChart.getElementsAtEventForMode(evt, 'point', infectionGrowthFactorChart.options);
        if(activePoints.length > 0 && predictionConfigShowed && document.getElementById("mTimesPway").value == "continuousFromExistingData" && document.getElementById("continuous_limitData").checked){
            var firstPointIndex = activePoints[0]._index;
            let dateOfClickedPoint = new Date(datasets["spreadGrowthFactor"][firstPointIndex].x);
            document.getElementById("growthFactorDateLimit").value = dateOfClickedPoint.toISOString().substr(0, 10);
        }
    };
}

function calculatePredictions(){
    returnObject = {infectedPeopleInDay:[]}
    
    let lastResult = predictionConfig["startValue"];
    let date = new Date(predictionConfig["startDate"].getTime());
    let day = 0;
    
    
    let indexOfStartSpreadGrowthFactor = -1;
    if(predictionConfig["growthFactor"] == "continuousFromExistingData") {
        for(var i=0; i<datasets["spreadGrowthFactor"].length; i++){
            anotherDate = new Date(datasets["spreadGrowthFactor"][i].x);
            if(anotherDate.getDate() == date.getDate()){
                indexOfStartSpreadGrowthFactor = i;
            }
        }
        if(indexOfStartSpreadGrowthFactor == -1){
            let minDateSpreadGrowthKnows = new Date(datasets["spreadGrowthFactor"][0].x);
            let minDateConfirmedValue = null;
            for(var i=0; i<datasets["confirmedMaxInDay"].length; i++) {
                let currvitDate = new Date(datasets["confirmedMaxInDay"][i].x);
                if (minDateSpreadGrowthKnows.getDate() == currvitDate.getDate()){
                    minDateConfirmedValue = datasets["confirmedMaxInDay"][i].y;
                    break;
                }
            }
            if (minDateConfirmedValue == null){
                alert("Error - co delas ty blazne??");
            }else{
                indexOfStartSpreadGrowthFactor = 0;
                lastResult = minDateConfirmedValue;
                date = new Date(minDateSpreadGrowthKnows);
            }
        }
    }
    
    returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: lastResult});
    day++;
    date.setDate(date.getDate() + 1);
    let lastMTimesP = 0;
    let resultBeforeInfectionPeriod = 0;
    let populationSize = parseInt(predictionConfig["populationSize"]);
    let growthFactorUntilDate;
    if (predictionConfig["growthFactorDataUntilDate"] == -1){
        growthFactorUntilDate = new Date(datasets["confirmedMaxInDay"][datasets["confirmedMaxInDay"].length-1].x);
    }else{
        growthFactorUntilDate = new Date(predictionConfig["growthFactorDataUntilDate"]);
    }
    growthFactorUntilDate.setHours(0,0,0,0);
    let endVarsIndex = 0;
    let endVars;
    if(predictionConfig["continuous_endVar"] == true){
        endVars = parseEndVarValues(predictionConfig["continuous_endVarValues"]);
    }
    while(lastResult <= populationSize && Math.round(lastResult) != Math.round(resultBeforeInfectionPeriod) ){
        if (day-predictionConfig["infectionPeriod"]-1 >= 0){
            resultBeforeInfectionPeriod = returnObject["infectedPeopleInDay"][day-predictionConfig["infectionPeriod"]-1].y;
        }else{
            resultBeforeInfectionPeriod = 0;
        }
        
        let MtimesP;
        if(predictionConfig["growthFactor"] == "continuousFromExistingData"){
            let indexOfSGF = indexOfStartSpreadGrowthFactor+day-1;
            if (indexOfSGF<datasets["spreadGrowthFactor"].length){
                let dateOfPotentialIndex = new Date(datasets["spreadGrowthFactor"][indexOfSGF].x);
                dateOfPotentialIndex.setHours(0,0,0,0);
                if(dateOfPotentialIndex.getTime() <= growthFactorUntilDate.getTime()){
                    MtimesP = datasets["spreadGrowthFactor"][indexOfSGF].y;
                    lastMTimesP = MtimesP;
                }else{
                    MtimesP = lastMTimesP;
                }
            }else{
                if(predictionConfig["continuous_endCustom"] && date.getTime() > growthFactorUntilDate.getTime()){
                    MtimesP = predictionConfig["continuos_endCustom_val"];
                }else if(predictionConfig["continuous_endVar"] == true){
                    if (endVarsIndex<endVars.length){
                        endVarFromList = endVars[endVarsIndex];
                        if (endVarFromList == -1) {
                            MtimesP = lastMTimesP;
                        }else{
                            MtimesP = endVarFromList;
                            lastMTimesP = MtimesP;
                        }
                        endVarsIndex++;
                    }else{
                        MtimesP = lastMTimesP;
                    }
                }else{
                    MtimesP = lastMTimesP;
                }
            }
        }else if(predictionConfig["growthFactor"] == "customFixed"){
            MtimesP = predictionConfig["averageMeetPerDay"]*predictionConfig["infectionProbability"]*0.01;
        }else if(predictionConfig["growthFactor"] == "fixedFromCurrentValue"){
            MtimesP = predictionConfigDefaults["averageMeetPerDay"]*predictionConfigDefaults["infectionProbability"]*0.01;
        }
        let result;
        if(predictionConfig["functionName"] == "henry1"){
            result = lastResult + MtimesP*(1-(lastResult/populationSize))*(lastResult-resultBeforeInfectionPeriod);
        }else if (predictionConfig["functionName"] == "henryProbabilistic"){
            let probabilisticProbability = predictionConfig["infectionProbability"]*0.01; //When you run out of variable names
            let meetInThisDay = MtimesP / probabilisticProbability;
            result = populationSize*(1 - (1-lastResult/populationSize)*Math.pow((1- probabilisticProbability*(lastResult-resultBeforeInfectionPeriod)/populationSize),meetInThisDay));
        }
        if (result <= populationSize){
            returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: result});
        }else{
            returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: populationSize});
        }
        day++;
        date.setDate(date.getDate() + 1);
        lastResult = result;
    }
    returnObject["pandemicPeriod"] = day;
    returnObject["pandemicEndDate"] = date;
    return returnObject;
}

function myTodayInfectedProbability() {
    let myMeetPerDay = document.getElementById("myMeetPerDay").value;
    let indexOfRBIP = datasets["confirmedMaxInDay"].length-parseInt(predictionConfig["infectionPeriod"].y);
    let resultBeforeInfectionPeriod;
    if (indexOfRBIP >= 0){
        resultBeforeInfectionPeriod = datasets["confirmedMaxInDay"][indexOfRBIP];
    }else{
        resultBeforeInfectionPeriod = 0;
    }
    let probabilityIamInfected = 1-Math.pow((1 - predictionConfig["infectionProbability"]*0.01*(data["confirmed"]["number"]-resultBeforeInfectionPeriod)/predictionConfig["populationSize"]),myMeetPerDay)
    
    document.getElementById("probabilityOfBeingInfectedToday").innerHTML = (probabilityIamInfected*100).toString()+"%";
}

window.addEventListener('load', (event) => {
    document.addEventListener('keyup', (e) => {
        if (e.code === "Enter"){
            predictionConfigSH(true);
        }
    });
});

loadCurrentData();
