function convertDate(dateString){
    return dateString;
}

function calculateInfectionDefaultProbability(daysSinceOutbreakStart, currentConfirmedCases, meetPerDay) {
    return ((Math.pow(currentConfirmedCases, 1/daysSinceOutbreakStart)-1)*100)/meetPerDay;
}

var predictionConfigDefaults = {infectionPeriod: 21, averageMeetPerDay: 30, infectionProbability: 30, populationSize:10649800}

function loadCurrentData(){
    var datasets = {confirmed:[]};
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
            let daysSinceOutbreakSt = Math.ceil(timeSinceOutbreakSt / (1000 * 60 * 60 * 24));
            
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
        if (xhrConfirmed.status == 200) { // analyze HTTP status of the response
            var results = Papa.parse(xhrConfirmed.response);
            if (results["errors"].length == 0){
                columnNames = results.data[0];
                datasetsInColumns = results.data.slice(1);
                datasetsInRows = datasetsInColumns[0].map(function(col, i) {
                    return datasetsInColumns.map(function(row) {
                        return row[i];
                    });
                });

                var i = 0;
                var lastValue = -1;
                datasetsInRows[1].forEach(function(entry) {
                    var currValue = datasetsInRows[2][i];
                    if (currValue != lastValue){
                        var dataObject = {x: entry, y: currValue};
                        datasets["confirmed"].push(dataObject);
                    }
                    i++;
                    lastValue = currValue;
                });
                
                var ctx = document.getElementById("chart");
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{ 
                            data: datasets["confirmed"],
                            label: "Potvrzené případy",
                            borderColor: "#f84f4a",
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


var predictionConfig = predictionConfigDefaults;

var predictionConfigHtml = "<form> \
    <label for=\"infectionPeriod\">Doba trvání infekce:</label><br> \
    <input type=\"number\" id=\"infectionPeriod\" name=\"infectionPeriod\" onfocus=\"this.select();\" min=\"0\">dní<br> \
    \
    <label for=\"averageMeetPerDay\">Počet lidí které člověk průměrně potká za den:</label><br> \
    <input type=\"number\" id=\"averageMeetPerDay\" name=\"averageMeetPerDay\" onfocus=\"this.select();\" min=\"0\">lidí<br> \
    \
    <label for=\"infectionProbability\">Pravděpodobnost nákazy při setkání s nakaženým</label><br> \
    <input type=\"number\" id=\"infectionProbability\" name=\"infectionProbability\" onfocus=\"this.select();\" min=\"0\" max=\"100\" step=\"any\">%<br> \
    \
    <label for=\"populationSize\">Velikost populace</label><br> \
    <input type=\"number\" id=\"populationSize\" name=\"populationSize\" onfocus=\"this.select();\" min=\"0\">lidí<br> \
</form> ";

var predictionChartHtml = "<canvas class=\"chartjs\" id=\"predictionChart\"></canvas>";



var predictionConfigShowed=false;

function predictionConfigSH(){
    if (predictionConfigShowed == false) {
        predictionConfigShowed = true;
        document.getElementById("predictionChartDiv").innerHTML = "";
        document.getElementById("predictionConfig").innerHTML = predictionConfigHtml;
        document.getElementById("infectionPeriod").value = predictionConfig["infectionPeriod"];
        document.getElementById("averageMeetPerDay").value = predictionConfig["averageMeetPerDay"];
        document.getElementById("infectionProbability").value = predictionConfig["infectionProbability"];
        document.getElementById("populationSize").value = predictionConfig["populationSize"];
        document.getElementById("infectionPeriod").focus()
    }else{
        predictionConfigShowed = false;
        
        predictionConfig["infectionPeriod"] = document.getElementById("infectionPeriod").value;
        predictionConfig["averageMeetPerDay"] = document.getElementById("averageMeetPerDay").value;
        predictionConfig["infectionProbability"] = document.getElementById("infectionProbability").value;
        predictionConfig["populationSize"] = document.getElementById("populationSize").value;
        
        document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
        document.getElementById("predictionConfig").innerHTML = "";
        getDataCalculatePredictionAndPlot();
    }
}

function getDataCalculatePredictionAndPlot(){
    if (predictionConfigShowed) {
        predictionConfigSH();
    }
    result = calculatePredictions(predictionConfig["infectionPeriod"],
                                  predictionConfig["averageMeetPerDay"], predictionConfig["infectionProbability"],
                                  predictionConfig["populationSize"]);
    var predictionDataset = [];
    labels = [];
    var peopleInfected = []
    var i = 0;
    result["infectedPeopleInDay"].forEach(function(entry) {
        peopleInfected.push(Math.round(entry));
        labels.push(i);
        i++;
    });
    
    
    document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
    var ctx2 = document.getElementById("predictionChart");
    var predictionChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ 
                data: peopleInfected,
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Den od vypuknutí'
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
    
}


function calculatePredictions(infectionPeriod, averageMeetPerDay, infectionProbability, populationSize){
    returnObject = {infectedPeopleInDay:[]}
    
    var lastResult = 1;
    var day = 0;
    infectionProbability = infectionProbability*0.01; //convert it to decimal from percentual
    
    var resultBeforeInfectionPeriod = 0;
    while(lastResult <= populationSize && Math.round(lastResult) != Math.round(resultBeforeInfectionPeriod) ){
        if (day-infectionPeriod >= 0){
            resultBeforeInfectionPeriod = returnObject["infectedPeopleInDay"][day-infectionPeriod];
        }else{
            resultBeforeInfectionPeriod = 0;
        }
        var result = lastResult + averageMeetPerDay*infectionProbability*(1-(lastResult/populationSize))*(lastResult-resultBeforeInfectionPeriod);
        
        if (result <= populationSize){
            returnObject["infectedPeopleInDay"].push(result);
        }else{
            returnObject["infectedPeopleInDay"].push(populationSize);
        }
        day++;
        lastResult = result;
    }
    returnObject["pandemicPeriod"] = day;
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
