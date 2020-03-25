function convertDate(dateString){
    let mmnt = moment(dateString);
    if (mmnt.hours() == 0 && mmnt.minutes() == 0){
        return mmnt.format("D.M. YYYY");
    }else{
        return mmnt.format("D.M. YYYY H:mm");
    }
}

var firstRecordConfirmedCases = 4;

var daysSinceOutbreakSt;
function calculateInfectionDefaultProbability(daysSinceOutbreakStart, currentConfirmedCases, meetPerDay) {
    if (daysSinceOutbreakStart == false){
        let latestRecordDate = new Date(datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length-1].x);
        let outbreakStartDate = new Date(datasets.confirmedMaxInDay[0].x);
        let timeSinceOutbreakSt = Math.abs(latestRecordDate-outbreakStartDate);
        daysSinceOutbreakSt = Math.round(timeSinceOutbreakSt / (1000 * 60 * 60 * 24));
        daysSinceOutbreakStart = daysSinceOutbreakSt;
    }
    let howtonamethis = ((Math.pow(currentConfirmedCases/firstRecordConfirmedCases, 1/daysSinceOutbreakStart)-1));
    if (meetPerDay!=false){
        return howtonamethis*100/meetPerDay;
    }else{
        return howtonamethis;
    }
}

NProgress.configure({ showSpinner: false });
var czechCovidDbURLs = {currentNumbers: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/current_numbers.json',
                        confirmed: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/records_confirmed.csv',
                        recovered: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/records_recovered.csv',
                        deaths: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/records_deaths.csv',
}
var csseURLs = {confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
            recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv',
            deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
}
var csStrings = {world: "Svět",
             czechia: "Česko",
             jhoRecoveredUnavailable: "JHO CSSE nyní nemá funkční dataset zotavených.",
             copyAndShareURL: "Následující adresu si zkopírujte a někomu pošlete:",
             endVarsPrompt: "Zadejte ve formátu: hodnota1(*kolik dní); hodnota2(*kolik dní),... \n\
             hodnota -1 znamená poslední použítá hodnota.",
             endVarsBadFormat: "Něco nevyšlo, možná jste zadali špatný formát.",
             tryItAgaing: "Zkuste to znovu",
             errorReadingFile: "Chyba při čtení souboru:\n",
             fileApiNotSupported: "Nahrávání soborů není podporováno vaším prohlížečem",
             predictionLabel: "Počet lidí, kteří jsou nebo byli infikováni",
             predictionTooltipLabel: 'Počet lidí',
             growthFactorChartLabel: "Faktor šíření",
             dataChartConfirmedLabel: "Potvrzené případy",
             dataChartRecoveredLabel: "Zotavení",
             dataChartDeathsLabel: "Úmrtí",
             dataChartPredictionLabel: "Predikce",
             idiotError: "Error - co delas ty blazne??",
            }
var enStrings = {world: "World",
             czechia: "Czechia",
             jhoRecoveredUnavailable: "JHO CSSE haven't got the recovered dataset working.",
             copyAndShareURL: "Copy and send this adress to someone:",
             endVarsPrompt: "Enter in format: value1(*how many days); value2(*how many days),... \n\
             value -1 means last used value.",
             endVarsBadFormat: "Exception occured, maybe you entered it in bad format.",
             tryItAgaing: "Try it again.",
             errorReadingFile: "Error reading file:\n",
             fileApiNotSupported: "The File API is not supported by your browser.",
             predictionLabel: "Number of people that are or were infected",
             predictionTooltipLabel: 'Number of people',
             growthFactorChartLabel: "Growth factor",
             dataChartConfirmedLabel: "Confirmed cases",
             dataChartRecoveredLabel: "Recovered",
             dataChartDeathsLabel: "Deaths",
             dataChartPredictionLabel: "Prediction",
             idiotError: "Error - you doing weird things",
            }

var predictionConfigCzechDefaults = {functionName: "henry1",
                                startValue: 4,
                                startDate: new Date(2020, 02, 02),
                                infectionPeriod: 6,
                                growthFactor: "continuousFromExistingData",
                                growthFactorDataUntilDate: -2, //This will be good when we would want to know how our predictions from day X matched current data
                                averageMeetPerDay: 30,
                                infectionProbability: 30,
                                continuous_endCustom: false,
                                continuos_endCustom_val: 0.5,
                                populationSize:10649800,
                                continuous_endVar: true,
                                continuous_endVarValues: "0.25*10; 0.2*10; 0.12",
                                plotPredictionToDataChart: true,
                                plotPredictionToDataChartAddDays: 4
}

var predictionConfigWorldDefaults = {functionName: "henry1",
                                startValue: 4,
                                startDate: new Date(2020, 02, 02),
                                infectionPeriod: 6,
                                growthFactor: "continuousFromExistingData",
                                growthFactorDataUntilDate: -1, //This will be good when we would want to know how our predictions from day X matched current data
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
var growthFactorCalcConfigCzechDefaults = {days: 1, perDay: true};
var growthFactorCalcConfigWorldDefaults = {days: 1, perDay: true};

var populations = {world: 7800000000, Germany: 83149300, Italy: 60243406,
                    Spain: 47100396, Iran: 83295597,
                    "Korea, South": 51780579, France: 67069000,
                    China: 1401841400, Netherlands: 17446481
                }
var data = {"confirmed":{"number":"", "date":""},
"recovered":{"number":"", "date":""},
"deaths":     {"number":"", "date":""}};

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

if (window.location.toString().includes("cs")){
    var databaseName = "czech-covid-db";
    var strings = csStrings;
    var predictionConfig = predictionConfigCzechDefaults;
    var growthFactorCalcConfig = growthFactorCalcConfigCzechDefaults;
}else{
    var databaseName = "CSSE COVID-19 Dataset";
    var strings = enStrings;
    var predictionConfig = predictionConfigWorldDefaults;
    var growthFactorCalcConfig = growthFactorCalcConfigWorldDefaults;
}
var myMeetPerDayConf = 20;

var dataChartHtml = "<canvas class=\"chartjs\" id=\"dataChart\"></canvas>";
var dataChart;
var datasets = {confirmed:[], confirmedMaxInDay:[], spreadGrowthFactor:[]};
var dataChartFirstLoad = true;
function loadDataChart(optionalDataset){
    let dataChartDataset;
    let datasetNameMaxString;
    if(document.getElementById("dataChart_dailyData").checked || optionalDataset != null){
        document.getElementById("dataChart_dailyData").checked = true;
        datasetNameMaxString ="MaxInDay";
    }else{
        datasetNameMaxString ="";
    }
    let feeddatasets;
    let ttformat;

    if(optionalDataset != null){
        for(var i=0; i<datasets["confirmed"+datasetNameMaxString].length; i++){
            blablaDate = new Date(datasets["confirmed"+datasetNameMaxString][i].x);
            blablaDate.setHours(0,0,0,0);
            datasets["confirmed"+datasetNameMaxString][i].x = blablaDate.toISOString();
        }
        ttformat = 'D. M.';
    }else{
        ttformat = 'D. M. H:mm';
    }

    feeddatasets = [{ 
        data: datasets["confirmed"+datasetNameMaxString],
        label: strings.dataChartConfirmedLabel,
        borderColor: "#f84f4a",
        fill: 1
            },{
        data: datasets["recovered"+datasetNameMaxString],
        label: strings.dataChartRecoveredLabel,
        borderColor: "#1261ff",
        fill: false
            },{
        data: datasets["deaths"+datasetNameMaxString],
        label: strings.dataChartDeathsLabel,
        borderColor: "#383838",
        fill: false
        }
    ];
    if (optionalDataset != null){
        feeddatasets.push({
            data: optionalDataset,
            label: strings.dataChartPredictionLabel,
            borderColor: "#964906",
            fill: false
        });
    }
    
    if(dataChart == undefined){
        document.getElementById("dataChartDiv").innerHTML = "";
        document.getElementById("dataChartDiv").innerHTML = dataChartHtml;
        let ctx = document.getElementById("dataChart");
        dataChart = new Chart(ctx, {
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
    }else{
        dataChart.data.datasets = feeddatasets;
        dataChart.update();
    }
}
var csseArrParsed = {confirmed: false, recovered: false, deaths: false};
var csseArr = {confirmed: [], recovered: [], deaths: []};
var czechCovidDbArr = {confirmed: [], recovered: [], deaths: []};
var czechCovidDbArrParsed = {confirmed: false, recovered: false, deaths: false};
var csseCountriesList = [];
function databaseChange() {
    databaseName = document.getElementById("databasePick").value;
    if (databaseName == "CSSE COVID-19 Dataset"){
        if (!progressBarShowed){
            NProgress.start();
            progressBarShowed = true;
        }
        csseArrParsed = {confirmed: false, recovered: false, deaths: false};
        predictionConfig = predictionConfigWorldDefaults;
        growthFactorCalcConfig = growthFactorCalcConfigWorldDefaults;
        if (csseArr.confirmed.length == 0) {
            loadCurrentData(databaseName)
        }else{
            document.getElementById("stateSelect").innerHTML = "";
            let optionToAdd = document.createElement("option");
            optionToAdd.value = "world";
            optionToAdd.innerHTML = strings.world;
            document.getElementById("stateSelect").appendChild(optionToAdd);
            for(i=1; i<csseCountriesList.length; i++){
                let currContryName = csseCountriesList[i];
                optionToAdd = document.createElement("option");
                optionToAdd.value = currContryName;
                optionToAdd.innerHTML = currContryName;
                document.getElementById("stateSelect").appendChild(optionToAdd);
            }
            csseParse("confirmed");
            NProgress.inc();
            csseParse("recovered");
            NProgress.inc();
            csseParse("deaths");
        }
    }else if (databaseName == "czech-covid-db"){
        if (!progressBarShowed){
            NProgress.start();
            progressBarShowed = true;
        }
        czechCovidDbArrParsed = {confirmed: false, recovered: false, deaths: false};
        predictionConfig = predictionConfigCzechDefaults;
        growthFactorCalcConfig = growthFactorCalcConfigCzechDefaults;
        if (czechCovidDbArr.confirmed.length==0){
            loadCurrentData(databaseName);
        }else{
            czechCovidDbParse("confirmed");
            if (progressBarShowed){NProgress.inc();}
            czechCovidDbParse("recovered");
            if (progressBarShowed){NProgress.inc();}
            czechCovidDbParse("deaths");
        }
    }
}

function countryNameChange(){
    if (document.getElementById("databasePick").value == "CSSE COVID-19 Dataset"){
        if (!progressBarShowed){
            NProgress.start();
            progressBarShowed = true;
        }
        csseArrParsed = {confirmed: false, recovered: false, deaths: false};
        csseParse("confirmed");
        csseParse("recovered");
        csseParse("deaths");
    }
}

function csseParse(datasetName){
    let columnNames = csseArr[datasetName][0];
    let dataFromCsse = csseArr[datasetName].slice(1);
    let datasetNameMaxInDay = datasetName+"MaxInDay";
    datasets[datasetNameMaxInDay]=[];
    for (i=4; i<columnNames.length; i++){
        dateOfColumn = moment(columnNames[i], "M/D/YY").toISOString();
        datasets[datasetNameMaxInDay].push({x: dateOfColumn, y: 0});
    }
    
    let stateName;
    if (urlSelectedCountry==null){
        stateName = document.getElementById("stateSelect").value;
    }else{
        stateName = urlSelectedCountry;
        document.getElementById("stateSelect").value = stateName;
        urlSelectedCountry = null;
    }
    for(i=0; i<dataFromCsse.length; i++){
        let currStateName = dataFromCsse[i][1];
        if (stateName == currStateName || stateName == "world"){
            for (j=0; j<datasets[datasetNameMaxInDay].length; j++){
                if (dataFromCsse[i][j+4] != ""){
                    datasets[datasetNameMaxInDay][j].y += parseInt(dataFromCsse[i][j+4]);
                }
            }
        }
    }
    //clean start zeros and same values
    let valuesStart = null;
    for(i=0; i<datasets[datasetNameMaxInDay].length; i++){
        let currValConfirmed = parseInt(datasets[datasetNameMaxInDay][i].y);
        if (currValConfirmed >0 )  {
            valuesStart=i;
            break;
        }
    }
    
    if (valuesStart == null){
        datasets[datasetNameMaxInDay] = [datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1]];
    }else{
        datasets[datasetNameMaxInDay].splice(0,valuesStart);
    }
    datasets[datasetName]= datasets[datasetNameMaxInDay];
    
    if (datasetName == "confirmed"){
        predictionConfig.startDate = new Date(datasets[datasetNameMaxInDay][0].x);
        predictionConfig.startValue = datasets[datasetNameMaxInDay][0].y;
        predictionConfig.infectionProbability = calculateInfectionDefaultProbability(false, datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].y, predictionConfig["averageMeetPerDay"]);
        if (populations.hasOwnProperty(stateName)){
            predictionConfig.populationSize = populations[stateName];
        }
    }
    data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].y;
    data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].x;

    //basic stats cases box
    document.getElementById(datasetName+"Text").getElementsByClassName("statNumber")[0].innerHTML = data[datasetName]["number"];
    if(datasetName == "recovered"){
        document.getElementsByClassName("box")[1].style.fontSize = "11px";
        document.getElementById(datasetName+"Text").getElementsByClassName("statDate")[0].innerHTML = strings.jhoRecoveredUnavailable;
        document.getElementById(datasetName+"Text").getElementsByClassName("statDate")[0].style.fontSize = "10px";
    }else{
        document.getElementById(datasetName+"Text").getElementsByClassName("statDate")[0].innerHTML = convertDate(data[datasetName]["date"]);
    }
    
    if(datasetName == "confirmed"){
        //calculate spread growth factors from confirmed dataset
        calculateSpreadGrowthFactorAndPlot("77%");
        myTodayInfectedProbability();
        
        progressBarShowed = false;
    }

    

    //calculate config variable for prediction
    csseArrParsed[datasetName] = true;
    if (csseArrParsed.confirmed == true && csseArrParsed.recovered == true && csseArrParsed.deaths == true) {
        if (predictionConfig.plotPredictionToDataChart){
            getDataCalculatePredictionAndPlot();
            if (progressBarShowed){NProgress.inc();};
        }else{
            loadDataChart(null);
            if (progressBarShowed){NProgress.inc();};
            getDataCalculatePredictionAndPlot();
        }
        NProgress.done();
    }else{
        if (progressBarShowed){NProgress.inc();};
    }
}

function czechCovidDbParse(datasetName){
    let columnNames = czechCovidDbArr[datasetName][0];
    let datasetsInColumns = czechCovidDbArr[datasetName].slice(1);
    let datasetNameMaxInDay = datasetName+"MaxInDay";

    let optionToAdd = document.createElement("option");
    optionToAdd.value = "czechia";
    optionToAdd.innerHTML = strings.czechia;
    document.getElementById("stateSelect").innerHTML="";
    document.getElementById("stateSelect").appendChild(optionToAdd);

    
    datasetsInRows = datasetsInColumns[0].map(function(col, i) {
        return datasetsInColumns.map(function(row) {
            return row[i];
        });
    });
    datasets[datasetName] = [];
    datasets[datasetNameMaxInDay] = [];
    
    let firstDate = new Date(datasetsInRows[1][0]);
    let i = 0;
    var lastValueConfirmed = -1;
    datasetsInRows[1].forEach(function(entry) {
        let currValueConfirmed = datasetsInRows[2][i];
        if (currValueConfirmed != 0) {
            if (currValueConfirmed != lastValueConfirmed){
                var dataObject = {x: entry, y: currValueConfirmed};
                datasets[datasetName].push(dataObject);
            }
            if (i+1<datasetsInRows[1].length){
                let dateOfEntry = new Date(entry);
                let nextDate = new Date(datasetsInRows[1][i+1]);
                if (nextDate.getDate() != dateOfEntry.getDate()){
                    dateOfEntry.setHours(0,0,0,0);
                    datasets[datasetNameMaxInDay].push({x: dateOfEntry.toISOString(), y: currValueConfirmed});
                }
            }else{
                //datasets["confirmedMaxInDay"].push({x: entry, y: currValueConfirmed});
            }
        }
        i++;
        lastValueConfirmed = currValueConfirmed;
    });

    data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].y;
    data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].x;

    //basic stats cases box
    document.getElementById(datasetName+"Text").getElementsByClassName("statNumber")[0].innerHTML = data[datasetName]["number"];
    document.getElementsByClassName("box")[1].style.fontSize = "150%";
    document.getElementsByClassName("statDate")[1].style.fontSize = "8px";
    document.getElementById(datasetName+"Text").getElementsByClassName("statDate")[0].innerHTML = convertDate(data[datasetName]["date"]);

    if(datasetName == "confirmed"){
        predictionConfig.startDate = new Date(datasets.confirmedMaxInDay[0].x);
        predictionConfig.startValue = parseInt(datasets.confirmedMaxInDay[0].y);
        //calculate config variable for prediction
        predictionConfigCzechDefaults["infectionProbability"] = calculateInfectionDefaultProbability(false, datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length-1].y, predictionConfigCzechDefaults["averageMeetPerDay"]);
        predictionConfig.infectionProbability = predictionConfigCzechDefaults.infectionProbability;

        //calculate spread growth factors from confirmed dataset
        calculateSpreadGrowthFactorAndPlot("77%");
        myTodayInfectedProbability();
        if (progressBarShowed){NProgress.inc();};
    }
    czechCovidDbArrParsed[datasetName] = true;
    if (czechCovidDbArrParsed.confirmed == true && czechCovidDbArrParsed.recovered == true && czechCovidDbArrParsed.deaths == true) {
        if (predictionConfig.plotPredictionToDataChart){
            getDataCalculatePredictionAndPlot();
        }else{
            loadDataChart(null);        
            getDataCalculatePredictionAndPlot();
        }
        NProgress.done();
        progressBarShowed = false;
    }
}

var progressBarShowed = false;
function loadCurrentData(databaseName){
    progressBarShowed = true;
    if (databaseName == "czech-covid-db"){
        urlSelectedCountry=null;
        /* Fetch current data from kukosek's github
        * 
        */
        

        let xhr = new XMLHttpRequest();
        xhr.open('GET', czechCovidDbURLs.currentNumbers);
        xhr.send();

        // This will be called after the response is received
        xhr.onload = function() {
            if (xhr.status == 200) { // analyze HTTP status of the response
                document.getElementById("databasePick").value = databaseName;
                data = JSON.parse(xhr.response); // responseText is the server
                //confirmed cases box
                document.getElementById("confirmedText").getElementsByClassName("statNumber")[0].innerHTML = data["confirmed"]["number"];
                document.getElementById("confirmedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["confirmed"]["date"]);
                
                //cured box
                document.getElementById("recoveredText").getElementsByClassName("statNumber")[0].innerHTML = data["recovered"]["number"];
                document.getElementById("recoveredText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["recovered"]["date"]);
                
                //deaths box
                document.getElementById("deathsText").getElementsByClassName("statNumber")[0].innerHTML = data["deaths"]["number"];
                document.getElementById("deathsText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["deaths"]["date"]);
                
                
                //load default value into did i got the virus today box inputBox
                document.getElementById("myMeetPerDay").value = myMeetPerDayConf;
                dynamicInputAdjust();
            } else { // show the result
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
        
        
        czechCovidDbArrParsed = {confirmed: false, recovered: false, deaths: false};
        /* Fetch current datasets to charts from kukosek's github
        * 
        */
        let xhrConfirmed = new XMLHttpRequest();
        xhrConfirmed.open('GET', czechCovidDbURLs.confirmed);
        xhrConfirmed.send();
        // This will be called after the response is received
        xhrConfirmed.onload = function() {
            if (xhrConfirmed.status == 200 || xhrConfirmed.status == 304) { // analyze HTTP status of the response
                let results = Papa.parse(xhrConfirmed.response);
                if (results["errors"].length == 0){
                    czechCovidDbArr["confirmed"] = results.data;
                    czechCovidDbParse("confirmed");
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset");
                }
            } else { // show the result
                alert(`Error ${xhrConfirmed.status}: ${xhrConfirmed.statusText}`); // e.g. 404: Not Found
            }
        };
        xhrConfirmed.onerror = function() {
            alert("Request failed");
        };

        let xhrRecovered = new XMLHttpRequest();
        xhrRecovered.open('GET', czechCovidDbURLs.recovered);
        xhrRecovered.send();
        // This will be called after the response is received
        xhrRecovered.onload = function() {
            if (xhrRecovered.status == 200 || xhrRecovered.status == 304) { // analyze HTTP status of the response
                let results = Papa.parse(xhrRecovered.response);
                if (results["errors"].length == 0){
                    czechCovidDbArr["recovered"] = results.data;
                    czechCovidDbParse("recovered");
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset");
                }
            } else { // show the result
                alert(`Error ${xhrRecovered.status}: ${xhrRecovered.statusText}`); // e.g. 404: Not Found
            }
        };
        xhrRecovered.onerror = function() {
            alert("Request failed");
        };

        let xhrDeaths = new XMLHttpRequest();
        xhrDeaths.open('GET', czechCovidDbURLs.deaths);
        xhrDeaths.send();
        // This will be called after the response is received
        xhrDeaths.onload = function() {
            if (xhrDeaths.status == 200 || xhrDeaths.status == 304) { // analyze HTTP status of the response
                let results = Papa.parse(xhrDeaths.response);
                if (results["errors"].length == 0){
                    czechCovidDbArr["deaths"] = results.data;
                    czechCovidDbParse("deaths");
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset");
                }
            } else { // show the result
                alert(`Error ${xhrDeaths.status}: ${xhrDeaths.statusText}`); // e.g. 404: Not Found
            }
        };
        xhrDeaths.onerror = function() {
            alert("Request failed");
        };
    }else if(databaseName == "CSSE COVID-19 Dataset"){
        csseArrParsed = {confirmed: false, recovered: false, deaths: false};
       /* Fetch current data from CSSEGISandData github
       * 
       */
       let xhrConfirmed = new XMLHttpRequest();
       xhrConfirmed.open('GET', csseURLs.confirmed);
       xhrConfirmed.send();

       // This will be called after the response is received
       xhrConfirmed.onload = function() {
           document.getElementById("databasePick").value = databaseName;
           if (xhrConfirmed.status == 200 || xhrConfirmed.status == 304) { // analyze HTTP status of the response
               let results = Papa.parse(xhrConfirmed.response);
               if (results["errors"].length == 0){
                    csseArr["confirmed"] = results.data;
                    document.getElementById("stateSelect").innerHTML="";

                    
                    let optionToAdd = document.createElement("option");
                    optionToAdd.value = "world";
                    optionToAdd.innerHTML = strings.world;
                    document.getElementById("stateSelect").appendChild(optionToAdd);
                    for(i=1; i<csseArr["confirmed"].length; i++){
                        let currContryName = csseArr["confirmed"][i][1];
                        if (!csseCountriesList.includes(currContryName)){
                            csseCountriesList.push(currContryName);
                        }
                    }
                    csseCountriesList.sort();
                    for(i=1; i<csseCountriesList.length; i++){
                        let currContryName = csseCountriesList[i];
                        optionToAdd = document.createElement("option");
                        optionToAdd.value = currContryName;
                        optionToAdd.innerHTML = currContryName;
                        document.getElementById("stateSelect").appendChild(optionToAdd);
                    }
                    csseParse("confirmed");
               }else{
                   alert("Error parsing chart dataset");
               }
           } else { // show the result
               alert(`Error ${xhrConfirmed.status}: ${xhrConfirmed.statusText}`); // e.g. 404: Not Found
           }
       };

       xhrConfirmed.onerror = function() {
           alert("Request to github JHO CSSE - confirmed failed");
       };
       let xhrRecovered = new XMLHttpRequest();

       xhrRecovered.open('GET', csseURLs.recovered);
       xhrRecovered.send();

       // This will be called after the response is received
       xhrRecovered.onload = function() {
           document.getElementById("databasePick").value = databaseName;
           if (xhrRecovered.status == 200 || xhrRecovered.status == 304) { // analyze HTTP status of the response
               let results = Papa.parse(xhrRecovered.response);
               if (results["errors"].length == 0){
                    csseArr["recovered"] = results.data;
                    csseParse("recovered");
               }else{
                   alert("Error parsing chart dataset");
               }
           } else { // show the result
               alert(`Error ${xhrRecovered.status}: ${xhrRecovered.statusText}`); // e.g. 404: Not Found
           }
       };

       xhrRecovered.onerror = function() {
           alert("Request to github JHO CSSE - recovered failed");
       };
       
       let xhrDeaths = new XMLHttpRequest();
       xhrDeaths.open('GET', csseURLs.deaths);
       xhrDeaths.send();

       // This will be called after the response is received
       xhrDeaths.onload = function() {
           document.getElementById("databasePick").value = databaseName;
           if (xhrDeaths.status == 200 || xhrDeaths.status == 304) { // analyze HTTP status of the response
               let results = Papa.parse(xhrDeaths.response);
               if (results["errors"].length == 0){
                    csseArr["deaths"] = results.data;
                    csseParse("deaths");
               }else{
                   alert("Error parsing chart dataset");
               }
           } else { // show the result
               alert(`Error ${xhrDeaths.status}: ${xhrDeaths.statusText}`); // e.g. 404: Not Found
           }
       };

       xhrRecovered.onerror = function() {
           alert("Request to github JHO CSSE - deaths failed");
       };
    }
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
    }else if (predictionConfig["growthFactorDataUntilDate"] < -1){
        document.getElementById("continuous_limitData").checked = true;
        document.getElementById("growthFactorDateLimit").value = new Date(new Date().setDate(new Date().getDate()+(predictionConfig.growthFactorDataUntilDate+1))).toISOString().substr(0, 10);
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
        document.getElementById("settingsApplyButton").src="/images/apply.svg";
        let fghjkl = document.getElementsByClassName("showedInPredictionConfig");
        for (i=0; i<fghjkl.length; i++){
            fghjkl[i].style.display = "initial";
        }
        
        document.getElementById("predictionConfig").style.display = "initial";
        loadPredictionConfigIntoHTML();
        document.getElementById('config-input').addEventListener('change', loadPredictionConfigFile, false);
    }else{
        predictionConfigShowed = false;
        document.getElementById("settingsApplyButton").src="/images/settings.svg";
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
                alert(strings.errorReadingFile+err.message);
            }
        }
    } else {
        alert(strings.fileApiNotSupported);
    }
    loadPredictionConfigIntoHTML()
}

function resetPredictionConfigToDefault(){
    if (confirm('Opravdu chcete obnovit výchozí hodnoty konfigurace?')) {
        predictionConfig = predictionConfigCzechDefaults;
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
            let specifiedEndVars = prompt(strings.endVarsPrompt, predictionConfig["continuous_endVarValues"]);
            try {
                let output =parseEndVarValues(specifiedEndVars);
                if (output.length>0 && !output.includes(NaN)){
                    predictionConfig["continuous_endVarValues"] = specifiedEndVars;
                }else{
                    alert(strings.endVarsBadFormat+" "+strings.tryItAgaing);
                    predictionConfigValAtEndChange();
                }
            }catch(err){
                if (err.message != "varValues is null"){
                    alert(strings.endVarsBadFormat+err.message);
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

var predictionChart;
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
    predictionChart = new Chart(ctx2, {
        type: 'line',
        data: {
            datasets: [{
                data: predDataset,
                label: strings.predictionLabel,
                borderColor: "#964906",
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
                        labelString: strings.predictionTooltipLabel
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
                    if (indexOfMyPoop >= 0) {
                        bottomSidePart2 +=  parseInt(dataset[indexOfMyPoop].y);
                    }
                }
                
                let bottomSide = bottomSidePart1 - bottomSidePart2;
                let result;
                if (bottomSide == 0){
                    result = 0;
                }else{
                    result = upperSide/bottomSide;
                }
                if (result == 0){
                    if (bottomSidePart1 != 0){
                        for (c=i; c<dataset.length; c++){
                            if (dataset[c].y != dataset[i]) {
                                result = upperSide/bottomSidePart1;
                                break;
                            }
                        }
                    }else{
                        result = 0;
                    }
                }
                
                
                let date = new Date(dataset[i].x) //V2
                date.setHours(12,0,0,0);
                datasets["spreadGrowthFactor"].push({x: date.toISOString(), y: result});
            }
        }
    } //TODO if not perday
}

var lastHeight = 0;
var infectionGrowthFactorChart;
growthFactorChartHtml = "<canvas class=\"chartjs\" id=\"infectionGrowthFactorChart\"></canvas>";
function calculateSpreadGrowthFactorAndPlot(height){//TODO dont call this twice like idiot
    calculateSpreadGrowthFactor(datasets["confirmedMaxInDay"]);
    if (infectionGrowthFactorChart == undefined || height.localeCompare(lastHeight) != 0){
        document.getElementById("growthFactorChartDiv").innerHTML = "";
        document.getElementById("growthFactorChartDiv").innerHTML = growthFactorChartHtml;
        document.getElementById("infectionGrowthFactorChart").style.height = height;
        var ctx = document.getElementById("infectionGrowthFactorChart");
        
        infectionGrowthFactorChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{ 
                    data: datasets["spreadGrowthFactor"],
                    label: strings.growthFactorChartLabel,
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
        lastHeight = height;
    }else{
        infectionGrowthFactorChart.data.datasets[0].data = datasets.spreadGrowthFactor;
        infectionGrowthFactorChart.update();
    }
}

function calculatePredictions(){
    returnObject = {infectedPeopleInDay:[]}
    
    let lastResult = predictionConfig["startValue"];
    let date = new Date(predictionConfig["startDate"]);
    let day = 0;
    
    
    let indexOfStartSpreadGrowthFactor = -1;
    if(predictionConfig["growthFactor"] == "continuousFromExistingData") {
        for(var i=0; i<datasets["spreadGrowthFactor"].length; i++){
            anotherDate = new Date(datasets["spreadGrowthFactor"][i].x);
            if(anotherDate.getDate() == date.getDate()){
                indexOfStartSpreadGrowthFactor = i;
                break;
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
                alert(strings.idiotError);
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
    if (predictionConfig["growthFactorDataUntilDate"] < 0){
        growthFactorUntilDate = new Date(datasets["confirmedMaxInDay"][datasets["confirmedMaxInDay"].length+predictionConfig["growthFactorDataUntilDate"]].x);
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
                
                if (indexOfSGF > 0){
                    if (lastResult-resultBeforeInfectionPeriod == 0 && datasets["spreadGrowthFactor"][indexOfSGF-1].y == 0){
                        for (i=indexOfStartSpreadGrowthFactor+day; i<datasets["spreadGrowthFactor"].length; i++){
                            if (datasets["spreadGrowthFactor"][i].y != 0) {
                                resultBeforeInfectionPeriod = 0;
                                break;
                            }
                        }
                    }
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
            MtimesP = predictionConfigCzechDefaults["averageMeetPerDay"]*predictionConfigCzechDefaults["infectionProbability"]*0.01;
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
        lastResult = result;
        date.setDate(date.getDate() + 1);
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
    let probabilityIamInfected = 1-Math.pow((1 - predictionConfig["infectionProbability"]*0.01*(datasets["confirmedMaxInDay"][datasets["confirmedMaxInDay"].length-1].y-resultBeforeInfectionPeriod)/predictionConfig["populationSize"]),myMeetPerDay)
    
    document.getElementById("probabilityOfBeingInfectedToday").innerHTML = (probabilityIamInfected*100).toString()+"%";
}

window.addEventListener('load', (event) => {
    document.addEventListener('keyup', (e) => {
        if (e.code === "Enter"){
            predictionConfigSH(true);
        }
    });
});

function shareCurrentView() {
    let obj = {"databaseName": databaseName,
           "countryName": stateName = document.getElementById("stateSelect").value,
           "predictionConfig" : JSON.stringify(predictionConfig),
           "growthFactorCalcConfig": JSON.stringify(growthFactorCalcConfig)
    };
    paramsEncoded = new URLSearchParams(obj).toString();
    let url = location.protocol + '//' + location.host + location.pathname+"?"+paramsEncoded;
    prompt(strings.copyAndShareURL,url);
}

var urlSelectedCountry=null;
var search = location.search.substring(1);
let haveParams = false;
try{
    var urlSettings = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\+/g,' ') + '"}');
    haveParams = true;
}catch(err){}

if (haveParams){
    if(urlSettings.hasOwnProperty("databaseName")){
        databaseName=urlSettings["databaseName"];
    }
    if(urlSettings.hasOwnProperty("countryName")){
        urlSelectedCountry = urlSettings["countryName"];
    }
    if(urlSettings.hasOwnProperty("predictionConfig")){
        urlSettings["predictionConfig"] = JSON.parse(decodeURIComponent(urlSettings["predictionConfig"]));
        if (urlSettings["predictionConfig"].growthFactorDataUntilDate > 0){
            urlSettings["predictionConfig"].growthFactorDataUntilDate = new Date(urlSettings["predictionConfig"].growthFactorDataUntilDate);
        }
        predictionConfig=urlSettings["predictionConfig"];
    }
    if(urlSettings.hasOwnProperty("growthFactorCalcConfig")){
        urlSettings["growthFactorCalcConfig"] = JSON.parse(decodeURIComponent(urlSettings["growthFactorCalcConfig"]));
        growthFactorCalcConfig=urlSettings["growthFactorCalcConfig"];
    }
}

loadCurrentData(databaseName);
