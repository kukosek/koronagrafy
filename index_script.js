function convertDate(dateString){
    if (dateString == null){
        return strings.noData;
    }else{
        let mmnt = moment(dateString);
        let today = moment();
        let yesterday = moment().subtract(1, "days");
        if (mmnt.isSame(today, "day")){
            if (mmnt.hours() == 0 && mmnt.minutes() == 0){
                return strings.today
            }else{
                return strings.today+" "+mmnt.format("H:mm");
            }
        }else if (mmnt.isSame(yesterday, "day")){
            if (mmnt.hours() == 0 && mmnt.minutes() == 0){
                return strings.yesterday
            }else{
                return strings.yesterday+" "+mmnt.format("H:mm");
            }
        }else if (mmnt.hours() == 0 && mmnt.minutes() == 0){
            return mmnt.format("D.M. YYYY");
        }else{
            return mmnt.format("D.M. YYYY H:mm");
        }
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
var czechCovidDbURLs = {currentNumbers: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/current_numbers_uzis.json',
                        tests: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_tests_uzis.csv',
                        confirmed: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_confirmed_uzis.csv',
                        recovered: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_recovered_uzis.csv',
                        deaths: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_deaths_uzis.csv',
}
var csseURLs = {confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
            recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
            deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
}
var csseDateFormat = {confirmed: "M/D/YY", recovered: "M/D/YYYY", deaths: "M/D/YY"};
var csvFormat = {"CSSE COVID-19 Dataset": {delimeter: ","}, "czech-covid-db": {delimeter: ","}};
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
             datasetError: "Omlouváme se, ale asi se vyskytla chyba pravděpodobně způsobená změněnými formáty v datasetu. Toto se často stává u datasetu JHO CSSE, někdy udělají opravdu nekonzistentní změny. Prosím dejte nám vědět na adrese koronagrafy@seznam.cz. Pokusíme se to spravit.",
             noData: "Nemám data",
             today: "Dnes",
             yesterday: "Včera",
             importedCases: "Importovaných případů",
             testsAll: "Počet provedených testů",
             testsPerDay: "Nárůst počtu provedených testů",
             testsAllRatio: "Procento pozitivních testů",
             testsPerDayRatio: "Procento pozitivních testů za den"
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
             datasetError: "Sorry, but an error occured. It was probably because of changed formats in a dataset. This often happens with the JHO CSSE dataset, they sometimes do really inconsistent changes - it is a mess! Please email us about that at koronagrafy@seznam.cz. We will try to fix it.",
             noData: "Data not available",
             today: "Today",
             yesterday: "Yesterday",
             importedCases: "Imported cases"
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

var czechRegionsPopulations = {};

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
    moment.locale('cs');
    var databaseName = "czech-covid-db";
    var strings = csStrings;
    var predictionConfig = JSON.parse(JSON.stringify(predictionConfigCzechDefaults));
    predictionConfig.startDate = new Date(predictionConfig.startDate);
    var growthFactorCalcConfig = growthFactorCalcConfigCzechDefaults;
}else{
    var databaseName = "CSSE COVID-19 Dataset";
    var strings = enStrings;
    var predictionConfig = JSON.parse(JSON.stringify(predictionConfigWorldDefaults));
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
var csseArrParseWaiting = {recovered: false, deaths: false};
var csseArrParsed = {confirmed: false, recovered: false, deaths: false};
var csseArr = {confirmed: [], recovered: [], deaths: []};
var czechCovidDbData;
var czechCovidDbArrParseWaiting = {tests: false, recovered: false, deaths: false};
var czechCovidDbArr = {tests: {}, confirmed: [], recovered: [], deaths: []};
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
        predictionConfig = JSON.parse(JSON.stringify(predictionConfigWorldDefaults));
        growthFactorCalcConfig = growthFactorCalcConfigWorldDefaults;
        if (csseArr.confirmed.length == 0) {
            loadCurrentData(databaseName)
        }else{
            document.getElementById("stateSelect").innerHTML = "";
            let optionToAdd = document.createElement("option");
            optionToAdd.value = "world";
            optionToAdd.innerHTML = strings.world;
            document.getElementById("stateSelect").appendChild(optionToAdd);
            detailedStatsSH();
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
        predictionConfig = JSON.parse(JSON.stringify(predictionConfigCzechDefaults));
        predictionConfig.startDate = new Date(predictionConfig.startDate);
        growthFactorCalcConfig = growthFactorCalcConfigCzechDefaults;
        if (czechCovidDbArr.confirmed.length==0){
            loadCurrentData(databaseName);
        }else{
            czechCountrySelect(czechCovidDbArr.confirmed[0]);
            data = JSON.parse(JSON.stringify(czechCovidDbData));
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
    }else if (document.getElementById("databasePick").value == "czech-covid-db"){
        detailedStatsSH()
        czechCovidDbParse("confirmed");
        czechCovidDbParse("recovered");
        czechCovidDbParse("deaths");
    }
}
function czechCountrySelect(columnNamesCon){
    let optionToAdd = document.createElement("option");
    optionToAdd.value = "czechia";
    optionToAdd.innerHTML = strings.czechia;
    document.getElementById("stateSelect").innerHTML="";
    document.getElementById("stateSelect").appendChild(optionToAdd);
    detailedStatsSH();
    for (i=columnNamesCon.length - 14; i<columnNamesCon.length; i++){
        optionToAdd = document.createElement("option");
        optionToAdd.value = columnNamesCon[i];
        optionToAdd.innerHTML = columnNamesCon[i];
        document.getElementById("stateSelect").appendChild(optionToAdd);
    }
    if (urlSelectedCountry != null){
        document.getElementById("stateSelect").value = urlSelectedCountry;
    }
    detailedStatsSH();
}
function csseParse(datasetName){
    let columnNames = csseArr[datasetName][0];
    let dataFromCsse = csseArr[datasetName].slice(1);
    let datasetNameMaxInDay = datasetName+"MaxInDay";
    datasets[datasetNameMaxInDay]=[];
    for (i=4; i<columnNames.length; i++){
        dateOfColumn = moment(columnNames[i], csseDateFormat[datasetName]).toISOString();
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
                let item = dataFromCsse[i][j+4];
                if (item != undefined && item != ""){
                    datasets[datasetNameMaxInDay][j].y += parseInt(item.replace(/\D+/g, ""));
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
        }else{
            predictionConfig.populationSize = Math.floor(parseInt(populations.world)/198);
        }
    }
    data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].y;
    data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].x;

    //basic stats cases box
    document.getElementById(datasetName+"Text").getElementsByClassName("statNumber")[0].innerHTML = data[datasetName]["number"];
    if(data[datasetName].number == NaN){
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

    let selValue
    let targetIndex;
    if (urlSelectedCountry==null){
        selValue = document.getElementById("stateSelect").value;
        if (selValue && (!columnNames.includes(selValue) && selValue != "czechia")){
            targetIndex = null;
        }else if (!selValue || selValue == "czechia"){
            targetIndex = 2;
        }else{
            targetIndex = columnNames.indexOf(selValue);
        }
    }else{
        selValue = urlSelectedCountry; 
        console.log(selValue)
        if (urlSelectedCountry == "czechia"){
            targetIndex = 2;
        }else{
            targetIndex = columnNames.indexOf(urlSelectedCountry);
        }
        document.getElementById("stateSelect").value = urlSelectedCountry;
        urlSelectedCountry = null;
    }
    datasetsInRows = datasetsInColumns[0].map(function(col, i) {
        return datasetsInColumns.map(function(row) {
            return row[i];
        });
    });
    datasets[datasetName] = [];
    datasets[datasetNameMaxInDay] = [];
    
    if (targetIndex != null){
        let firstDate = new Date(datasetsInRows[1][0]);
        let i = 0;
        var lastValueConfirmed = -1;
        datasetsInRows[1].forEach(function(entry) {
            let currValueConfirmed = datasetsInRows[targetIndex][i];
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
        if (targetIndex != 2){
            data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].y;
            data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length-1].x;
        }else if (czechCovidDbData !== undefined){
            data[datasetName].number = czechCovidDbData[datasetName].number
            data[datasetName].date = czechCovidDbData[datasetName].date
        }
    }else{
        data[datasetName].number = "???";
        data[datasetName].date = null;
    }
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

        if (selValue == "czechia"){
            predictionConfig.populationSize = predictionConfigCzechDefaults.populationSize
        }else if (czechRegionsPopulations.hasOwnProperty(selValue)){
            predictionConfig.populationSize = czechRegionsPopulations[selValue];
        }else{
            predictionConfig.populationSize = parseInt(predictionConfigCzechDefaults.populationSize)/14;
        }

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

function czechCovidDbTestsParse(){
    datasets["tests"] = {};
    datasets["tests"]["all"] = [];
    datasets["tests"]["allRatio"] = [];
    datasets["tests"]["perDay"] = [];
    datasets["tests"]["perDayRatio"] = [];
    let lastValue = 0;
    let confirmedStartIndex = null;
    let lastValueConfirmed = 0;
    for (i=1; i<czechCovidDbArr.tests.length-1; i++){
        let currentValueConfirmed = 0;
        let currValue = czechCovidDbArr.tests[i][2];
        let currDate = moment(czechCovidDbArr.tests[i][1]);
        let ratio;
        let perDayRatio;
        if (confirmedStartIndex == null){
            if (currDate.isSameOrAfter(predictionConfig.startDate)){
                confirmedStartIndex = i;
                currentValueConfirmed = datasets.confirmedMaxInDay[i-confirmedStartIndex].y;
                ratio = currentValueConfirmed/currValue;
                perDayRatio = (currentValueConfirmed-lastValueConfirmed)/currValue;
            }else{
                ratio = 0;
                perDayRatio = 0;
            }
        }else{
            currentValueConfirmed = datasets.confirmedMaxInDay[i-confirmedStartIndex].y;
            ratio = currentValueConfirmed/currValue;
            perDayRatio = (currentValueConfirmed-lastValueConfirmed)/currValue;
        }
        
        datasets["tests"]["all"].push({x: czechCovidDbArr.tests[i][1], y: currValue});
        datasets["tests"]["allRatio"].push({x: czechCovidDbArr.tests[i][1], y: ratio});
        datasets["tests"]["perDay"].push({x: czechCovidDbArr.tests[i][1], y: currValue-lastValue});
        datasets["tests"]["perDayRatio"].push({x: czechCovidDbArr.tests[i][1], y: perDayRatio});

        lastValue = currValue;
        lastValueConfirmed = currentValueConfirmed;
    }
    loadTestsChart();
}

var testsChart;
var testsChartHtml = "<canvas class=\"chartjs\" id=\"testsChart\"></canvas>";
function loadTestsChart(){
    let perDayChecked = document.getElementById("testingChart_perDay").checked;
    let ratioChecked = document.getElementById("testingChart_ratio").checked;
    let testsDataset;
    let testsLabel;
    let yAxisPercent = {
        ticks: {
            min: 0,
            callback: function (value) {
                return (value * 100).toFixed(0) + '%'; // convert it to percentage
            }
        }
    }
    let yAxis = {};
    let ttipsPercent = {
        callbacks: {
            label: function (tooltipItem, data) {
            let tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
            return (tooltipValue*100).toString()+"%";
            }
        }
    }
    let ttips = {};
    let color = "#5e00c9";
    if (perDayChecked && ratioChecked){
        testsDataset = datasets.tests.perDayRatio;
        testsLabel = strings.testsPerDayRatio;
        yAxis = yAxisPercent;
        ttips = ttipsPercent;
        color = "#f84f4a";
    }else if (!perDayChecked && ratioChecked){
        testsDataset = datasets.tests.allRatio;
        testsLabel = strings.testsAllRatio;
        yAxis = yAxisPercent;
        ttips = ttipsPercent;
        color = "#f84f4a";
    }else if(perDayChecked && !ratioChecked){
        testsDataset = datasets.tests.perDay;
        testsLabel = strings.testsPerDay;
    }else{
        testsDataset = datasets.tests.all;
        testsLabel = strings.testsAll;
    }
    if (testsChart == undefined){
        document.getElementById("testingChartDiv").innerHTML = "";
        document.getElementById("testingChartDiv").innerHTML = testsChartHtml;
        //document.getElementById("testsChart").style.height = "125px";
        var ctx = document.getElementById("testsChart");
        
        testsChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{ 
                    data: testsDataset,
                    label: testsLabel,
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
                            tooltipFormat: 'dddd D. M.',
                            unit: 'day',
                            displayFormats: {
                                'day': 'D. M.'
                            }
                        }
                    }],
                    yAxes: [yAxis]
                },
                tooltips: ttips
            }
        });
    }else{
        testsChart.data.datasets[0].data = testsDataset;
        testsChart.data.datasets[0].label = testsLabel;
        testsChart.data.datasets[0].borderColor = color;
        testsChart.options.scales.yAxes[0] = yAxis;
        testsChart.options.tooltips = ttips;
        testsChart.update();
    }
}

var progressBarShowed = false;
function loadCurrentData(databaseName){
    progressBarShowed = true;
    if (databaseName == "czech-covid-db"){
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
                czechCovidDbData = JSON.parse(xhr.response); // responseText is the server
                data = JSON.parse(JSON.stringify(czechCovidDbData));
                
                let basicStatsParse = false;
                if (document.getElementById("stateSelect") == undefined){
                    basicStatsParse = true;
                }else{
                    let selectedCountry = document.getElementById("stateSelect").value;
                    if (selectedCountry == "czechia" || selectedCountry == "world" || selectedCountry == ""){
                        basicStatsParse=true;
                    }
                }
                if (urlSelectedCountry == null && basicStatsParse){
                    //tests box
                    document.getElementById("testedText").getElementsByClassName("statNumber")[0].innerHTML = data["tested"]["number"];
                    document.getElementById("testedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["tested"]["date"])

                    //confirmed cases box
                    document.getElementById("confirmedText").getElementsByClassName("statNumber")[0].innerHTML = data["confirmed"]["number"];
                    document.getElementById("confirmedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["confirmed"]["date"]);
                    
                    //cured box
                    document.getElementById("recoveredText").getElementsByClassName("statNumber")[0].innerHTML = data["recovered"]["number"];
                    document.getElementById("recoveredText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["recovered"]["date"]);
                    
                    //deaths box
                    document.getElementById("deathsText").getElementsByClassName("statNumber")[0].innerHTML = data["deaths"]["number"];
                    document.getElementById("deathsText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data["deaths"]["date"]);
                
                    //average age box
                    document.getElementById("importedCasesText").getElementsByClassName("statNumber")[0].innerHTML = data["confirmedImported"]["number"];
                    document.getElementById("importedCasesText").getElementsByClassName("statDate")[0].innerHTML = strings.importedCases;
                }
                
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

        let xhrTests = new XMLHttpRequest();
        xhrTests.open('GET', czechCovidDbURLs.tests);
        xhrTests.send();
        // This will be called after the response is received
        xhrTests.onload = function() {
            if (xhrTests.status == 200 || xhrTests.status == 304) { // analyze HTTP status of the response
                let results = Papa.parse(xhrTests.response, csvFormat[databaseName]);
                if (results["errors"].length == 0){
                    czechCovidDbArr.tests = results.data;
                    if (czechCovidDbArrParsed.confirmed){
                        czechCovidDbTestsParse();
                    }else{
                        czechCovidDbArrParseWaiting.tests = true;
                    }
                }else{
                    alert("Error parsing chart dataset\n"+results.errors[0].message);
                }
            } else { // show the result
                alert(`Error ${xhrTests.status}: ${xhrTests.statusText}`); // e.g. 404: Not Found
            }
        };
        xhrTests.onerror = function() {
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
                let results = Papa.parse(xhrConfirmed.response, csvFormat[databaseName]);
                if (results["errors"].length == 0){
                    czechCovidDbArr["confirmed"] = results.data;
                    czechCountrySelect(czechCovidDbArr["confirmed"][0]);
                    czechCovidDbParse("confirmed");
                    if (czechCovidDbArrParseWaiting.tests){
                        czechCovidDbTestsParse();
                    }
                    if (czechCovidDbArrParseWaiting.recovered){
                        czechCovidDbParse("recovered");
                        czechCovidDbArrParseWaiting.recovered = true;
                    }
                    if (czechCovidDbArrParseWaiting.deaths) {
                        czechCovidDbParse("deaths");
                        czechCovidDbArrParseWaiting.deaths = false;
                    }
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset\n"+results.errors[0].message);
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
                let results = Papa.parse(xhrRecovered.response, csvFormat[databaseName]);
                if (results["errors"].length == 0){
                    czechCovidDbArr["recovered"] = results.data;
                    if (czechCovidDbArrParsed.confirmed) {
                        czechCovidDbParse("recovered");
                    }else{
                        czechCovidDbArrParseWaiting.recovered = true;
                    }
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset\n"+results.errors[0].message);
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
                let results = Papa.parse(xhrDeaths.response, csvFormat[databaseName]);
                if (results["errors"].length == 0){
                    czechCovidDbArr["deaths"] = results.data;
                    if (czechCovidDbArrParsed.confirmed) {
                        czechCovidDbParse("deaths");
                    }else{
                        czechCovidDbArrParseWaiting.deaths = true;
                    }
                    if(progressBarShowed) {NProgress.inc();}
                }else{
                    alert("Error parsing chart dataset\n"+results.errors[0].message);
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
               let results = Papa.parse(xhrConfirmed.response, csvFormat[databaseName]);
               if (results["errors"].length == 0){
                    csseArr["confirmed"] = JSON.parse(JSON.stringify(results.data));
                    document.getElementById("stateSelect").innerHTML="";

                    
                    let optionToAdd = document.createElement("option");
                    optionToAdd.value = "world";
                    optionToAdd.innerHTML = strings.world;
                    document.getElementById("stateSelect").appendChild(optionToAdd);
                    detailedStatsSH();
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
                    if (csseArrParseWaiting.recovered){
                        csseParse("recovered");
                        csseArrParseWaiting.recovered = false;
                    }
                    if (csseArrParseWaiting.deaths){
                        csseParse("deaths");
                        csseArrParseWaiting.deaths = false;
                    }
               }else{
                   alert("Error parsing confirmed chart dataset\n"+results.errors[0].message);
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
               let results = Papa.parse(xhrRecovered.response, csvFormat[databaseName]);
               if (results["errors"].length == 0){
                    csseArr["recovered"] = JSON.parse(JSON.stringify(results.data));
                    if (csseArrParsed.confirmed){
                        csseParse("recovered");
                    }else{
                        csseArrParseWaiting.recovered = true;
                    }
               }else{
                   alert("Error parsing recovered chart dataset\n"+results.errors[0].message);
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
               let results = Papa.parse(xhrDeaths.response, csvFormat[databaseName]);
               if (results["errors"].length == 0){
                    csseArr["deaths"] = JSON.parse(JSON.stringify(results.data));
                    if (csseArrParsed.confirmed){
                        csseParse("deaths");
                    }else{
                        csseArrParseWaiting.deaths = true;
                    }
               }else{
                   alert("Error parsing deaths chart dataset\n"+results.errors[0].message);
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

function detailedStatsSH(){
    let elems = document.getElementsByClassName("detailedData");
    if (databaseName == "czech-covid-db" && document.getElementById("stateSelect").value == "czechia"){
        for (i=0; i< elems.length; i++){
            if (elems[i].parentElement.className == "wrapperBasicStats"){
                elems[i].style.display = "flex";
            }else{
                elems[i].style.display = "initial";
            }
        }
    }else{
        for (i=0; i< elems.length; i++){
            elems[i].style.display = "none";
        }
    }
}

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
        predictionConfig = JSON.parse(JSON.stringify(predictionConfigCzechDefaults));
        predictionConfig.startDate = new Date(predictionConfig.startDate);
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
            if (datasets["spreadGrowthFactor"].length == 0){
                alert(strings.datasetError);
            }
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
