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
                                infectionPeriod: 21,
                                growthFactor: "continuousFromExistingData",
                                averageMeetPerDay: 30,
                                infectionProbability: 30,
                                populationSize:10649800,
                                plotPredictionToDataChart: false,
                                plotPredictionToDataChartAddDays: 1
}
var predictionConfig = predictionConfigDefaults;

var growthFactorCalcConfigDefaults = {days: 1, perDay: true};
var growthFactorCalcConfig = growthFactorCalcConfigDefaults;

var dataChartHtml = "<canvas class=\"chartjs\" id=\"dataChart\"></canvas>"
var datasets = {confirmed:[], confirmedMaxInDay:[], spreadGrowthFactor:[]};
var dataChartFirstLoad = true;
function loadDataChart(optionalDataset){
    let dataChartDataset;
    if(document.getElementById("dataChart_dailyData").checked){
        dataChartDataset = datasets["confirmedMaxInDay"];
    }else{
        dataChartDataset = datasets["confirmed"];
    }
    if(optionalDataset != null){
        for(var i=0; i<dataChartDataset.length; i++){
            blablaDate = new Date(dataChartDataset[i].x);
            blablaDate.setHours(0,0,0,0);
            dataChartDataset[i].x = blablaDate.toISOString();
        }
    }
    document.getElementById("dataChartDiv").innerHTML = "";
    document.getElementById("dataChartDiv").innerHTML = dataChartHtml;
    let ctx = document.getElementById("dataChart");
    let dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{ 
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
                
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        tooltipFormat: 'D. M. HH:mm',
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



var predictionConfigShowed=false;

function predictionConfigSH(){
    if (predictionConfigShowed == false) {
        predictionConfigShowed = true;
        document.getElementById("predictionChartDiv").innerHTML = "";
        document.getElementById("predictionConfig").style.display = "initial";
        document.getElementById("predictionFunctionName").value = predictionConfig["functionName"];
        document.getElementById("mTimesPway").value = predictionConfig["growthFactor"];
        document.getElementById("infectionPeriod").value = predictionConfig["infectionPeriod"];
        document.getElementById("averageMeetPerDay").value = predictionConfig["averageMeetPerDay"];
        document.getElementById("infectionProbability").value = predictionConfig["infectionProbability"];
        document.getElementById("populationSize").value = predictionConfig["populationSize"];
        document.getElementById("plotPredictionToDataChart").checked = predictionConfig["plotPredictionToDataChart"];
        document.getElementById("plotPredictionToDataChartAddDays").value = predictionConfig["plotPredictionToDataChartAddDays"];
        dynamicInputAdjust();
        predictionConfigMtimesPwayChange();
        plotPredictionToDataChartCbChange();
        document.getElementById("infectionPeriod").focus()
    }else{
        predictionConfigShowed = false;
        
        predictionConfig["functionName"] = document.getElementById("predictionFunctionName").value;
        predictionConfig["growthFactor"] = document.getElementById("mTimesPway").value;
        predictionConfig["infectionPeriod"] = document.getElementById("infectionPeriod").value;
        predictionConfig["averageMeetPerDay"] = document.getElementById("averageMeetPerDay").value;
        predictionConfig["infectionProbability"] = document.getElementById("infectionProbability").value;
        predictionConfig["populationSize"] = document.getElementById("populationSize").value;
        predictionConfig["plotPredictionToDataChart"] = document.getElementById("plotPredictionToDataChart").checked;
        predictionConfig["plotPredictionToDataChartAddDays"] = document.getElementById("plotPredictionToDataChartAddDays").value;
        document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
        document.getElementById("predictionConfig").style.display = "none";
        getDataCalculatePredictionAndPlot();
    }
}

function predictionConfigMtimesPwayChange(){
    if (document.getElementById("mTimesPway").value == "customFixed") {
        document.getElementById("customFixedValueConfig").style.display = "initial";
    }else{
        document.getElementById("customFixedValueConfig").style.display = "none";
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

function dynamicInputAdjust(){
    let inputBoxes = document.getElementsByClassName("dynamicInput");
    for(i = 0; i < inputBoxes.length; i++) {
        inputBoxes[i].style.width = ((inputBoxes[i].value.length + 1) * 8)+36 + 'px';
    }
}

function getDataCalculatePredictionAndPlot(){
    if (predictionConfigShowed) {
        predictionConfigSH();
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
                        tooltipFormat: 'D. M.',
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
            document.getElementById("daysToCalculateGrowthFactorOver").value = growthFactorCalcConfig["days"];
        }
        growthFactorConfigChange();
    }
    growthFactorConfigShowed = !growthFactorConfigShowed;
    
}

function calculateSpreadGrowthFactor(dataset){
    datasets["spreadGrowthFactor"] = [];
    days = growthFactorCalcConfig["days"];
    if (growthFactorCalcConfig["perDay"]){
        if(days == "all"){
            for(i=1; i < dataset.length; i++) {
                let result = calculateInfectionDefaultProbability(i, dataset[i].y, false);
                let date = new Date(dataset[i].x);
                date.setHours(12,0,0,0);
                datasets["spreadGrowthFactor"].push({x: date.toISOString(), y: result});
            }
        }else{
            for(i=days; i < dataset.length; i++) {
                let result = Math.pow(dataset[i].y/dataset[i-days].y, 1/days)-1;
                let date = new Date(dataset[i-days].x)
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
    let ctx = document.getElementById("infectionGrowthFactorChart");
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
                        tooltipFormat: 'D. M. HH:mm',
                        unit: 'day',
                        displayFormats: {
                            'day': 'D. M.'
                        }
                    }
                }]
            }
        }
    });
}

function calculatePredictions(){
    returnObject = {infectedPeopleInDay:[]}
    
    let lastResult = predictionConfig["startValue"];
    let date = new Date(predictionConfig["startDate"].getTime());
    let day = 0;
    returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: lastResult});
    let indexOfStartSpreadGrowthFactor = -1;
    if(predictionConfig["growthFactor"] == "continuousFromExistingData") {
        for(var i=0; i<datasets["spreadGrowthFactor"].length; i++){
            anotherDate = new Date(datasets["spreadGrowthFactor"][i].x);
            if(anotherDate.getDate() == date.getDate()){
                indexOfStartSpreadGrowthFactor = i;
            }
        }
        if(indexOfStartSpreadGrowthFactor == -1){
            alert("Error: not a value in growthFactors for startdate");
        }
    }
    day++;
    date.setDate(date.getDate() + 1);
    let lastMTimesP = 0;
    let resultBeforeInfectionPeriod = 0;
    if(predictionConfig["functionName"] == "henry1"){
        while(lastResult <= predictionConfig["populationSize"] && Math.round(lastResult) != Math.round(resultBeforeInfectionPeriod) ){
            if (day-predictionConfig["infectionPeriod"] >= 0){
                resultBeforeInfectionPeriod = returnObject["infectedPeopleInDay"][day-predictionConfig["infectionPeriod"]].y;
            }else{
                resultBeforeInfectionPeriod = 0;
            }
            
            let MtimesP;
            if(predictionConfig["growthFactor"] == "continuousFromExistingData"){
                let indexOfSGF = indexOfStartSpreadGrowthFactor+day-1;
                if (indexOfSGF<datasets["spreadGrowthFactor"].length){
                    MtimesP = datasets["spreadGrowthFactor"][indexOfSGF].y;
                    lastMTimesP = MtimesP;
                }else{
                    MtimesP = lastMTimesP;
                }
            }else if(predictionConfig["growthFactor"] == "customFixed"){
                MtimesP = predictionConfig["averageMeetPerDay"]*predictionConfig["infectionProbability"]*0.01;
            }else if(predictionConfig["growthFactor"] == "fixedFromCurrentValue"){
                MtimesP = predictionConfigDefaults["averageMeetPerDay"]*predictionConfigDefaults["infectionProbability"]*0.01;
            }
            var result = lastResult + MtimesP*(1-(lastResult/predictionConfig["populationSize"]))*(lastResult-resultBeforeInfectionPeriod);
            
            if (result <= predictionConfig["populationSize"]){
                returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: result});
            }else{
                returnObject["infectedPeopleInDay"].push({x: date.toISOString(), y: predictionConfig["populationSize"]});
            }
            day++;
            date.setDate(date.getDate() + 1);
            lastResult = result;
        }
        returnObject["pandemicPeriod"] = day;
        returnObject["pandemicEndDate"] = date;
    }
    return returnObject;
}

window.addEventListener('load', (event) => {
    document.addEventListener('keyup', (e) => {
        if (e.code === "Enter"){
            predictionConfigSH();
        }
    });
});

loadCurrentData();
