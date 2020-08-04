function convertDate(dateString) {
	if(dateString == null) {
		return strings.noData;
	}else{
		let mmnt = moment(dateString);
		let today = moment();
		let yesterday = moment().subtract(1, "days");
		if(mmnt.isSame(today, "day")) {
			if(mmnt.hours() == 0 && mmnt.minutes() == 0) {
				return strings.today
			}else{
				return strings.today + " " + mmnt.format("H:mm");
			}
		}else if(mmnt.isSame(yesterday, "day")) {
			if(mmnt.hours() == 0 && mmnt.minutes() == 0) {
				return strings.yesterday
			}else{
				return strings.yesterday + " " + mmnt.format("H:mm");
			}
		}else if(mmnt.hours() == 0 && mmnt.minutes() == 0) {
			return mmnt.format("D.M. YYYY");
		}else{
			return mmnt.format("D.M. YYYY H:mm");
		}
	}
}
var firstRecordConfirmedCases = 4;
var daysSinceOutbreakSt;

function calculateInfectionDefaultProbability(daysSinceOutbreakStart, currentConfirmedCases, meetPerDay) {
	if(daysSinceOutbreakStart == false) {
		let latestRecordDate = new Date(datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length - 1].x);
		let outbreakStartDate = new Date(datasets.confirmedMaxInDay[0].x);
		let timeSinceOutbreakSt = Math.abs(latestRecordDate - outbreakStartDate);
		daysSinceOutbreakSt = Math.round(timeSinceOutbreakSt / (1000 * 60 * 60 * 24));
		daysSinceOutbreakStart = daysSinceOutbreakSt;
	}
	let howtonamethis = ((Math.pow(currentConfirmedCases / firstRecordConfirmedCases, 1 / daysSinceOutbreakStart) - 1));
	if(meetPerDay != false) {
		return howtonamethis * 100 / meetPerDay;
	}else{
		return howtonamethis;
	}
}
NProgress.configure({
	showSpinner: false
});
var czechCovidDbURLs = {
	currentNumbers: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/current_numbers_uzis.json',
	tests: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_tests_uzis.csv',
	confirmed: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_confirmed_uzis.csv',
	recovered: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_recovered_uzis.csv',
	deaths: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_deaths_uzis.csv',
	districtsNumbers: 'https://secret-ocean-49799.herokuapp.com/https://mapy.cz/covid/data/districts.json',
	imports: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_imports_uzis.csv',
	ageGroups: 'https://raw.githubusercontent.com/kukosek/czech-covid-db/master/uzis/records_confirmed-agegroups_uzis.csv'
};
var csseURLs = {
	confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
	recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
	deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
	populations: 'https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json'
};
var csseDateFormat = {
	confirmed: "M/D/YY",
	recovered: "M/D/YYYY",
	deaths: "M/D/YY"
};
var csvFormat = {
	"CSSE COVID-19 Dataset": {
		delimeter: ","
	},
	"czech-covid-db": {
		delimeter: ","
	}
};
var csStrings = {
	world: "Svět",
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
	dataChartPerDayConfirmedLabel: "Nárůst potvrzených případů",
	dataChartActiveLabel: "Aktuálně nemocní",
	dataChartPerDayActiveLabel: "Nárůst počtu aktuálně nemocných",
	dataChartRecoveredLabel: "Zotavení",
	dataChartPerDayRecoveredLabel: "Nárůst počtu zotavených",
	dataChartDeathsLabel: "Úmrtí",
	dataChartPerDayDeathsLabel: "Nárůst úmrtí",
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
	testsPerDayRatio: "Procento pozitivních testů za den",
	countryNames: {
		AT: "Rakousko",
		IT: "Itálie",
		DE: "Německo",
		GB: "Velká Británie",
		FR: "Francie",
		ES: "Španělsko",
		US: "USA",
		CH: "Švýcarsko",
		TH: "Thajsko"
	}
};
var enStrings = {
	world: "World",
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
	dataChartPerDayConfirmedLabel: "Confirmed cases increase",
	dataChartActiveLabel: "Currently infected",
	dataChartPerDayActiveLabel: "Currently infected increase",
	dataChartRecoveredLabel: "Recovered",
	dataChartPerDayRecoveredLabel: "Recovered increase",
	dataChartDeathsLabel: "Deaths",
	dataChartPerDayDeathsLabel: "Deaths increase",
	dataChartPredictionLabel: "Prediction",
	idiotError: "Error - you doing weird things",
	datasetError: "Sorry, but an error occured. It was probably because of changed formats in a dataset. This often happens with the JHO CSSE dataset, they sometimes do really inconsistent changes - it is a mess! Please email us about that at koronagrafy@seznam.cz. We will try to fix it.",
	noData: "Data not available",
	today: "Today",
	yesterday: "Yesterday",
	importedCases: "Imported cases",
	testsAll: "Cumulative number of tests",
	testsPerDay: "Daily tests",
	testsAllRatio: "Cumulative percentage of positive tests",
	testsPerDayRatio: "Daily percentage of positive tests",
	countryNames: {
		AT: "Austria",
		IT: "Italy",
		DE: "Germany",
		GB: "Great Britain",
		FR: "France",
		ES: "Spain",
		US: "USA",
		CH: "Switzerland",
		TH: "Thailand"
	}
};
var predictionConfigCzechDefaults = {
	functionName: "henry1",
	startValue: 4,
	startDate: new Date(2020, 02, 02),
	infectionPeriod: 6,
	growthFactor: "continuousFromExistingData",
	growthFactorDataUntilDate: -2,
	averageMeetPerDay: 30,
	infectionProbability: 30,
	continuous_endCustom: true,
	continuos_endCustom_val: 0.16,
	populationSize: 10649800,
	continuous_endVar: false,
	continuous_endVarValues: "0.25*10; 0.2*10; 0.12",
	plotPredictionToDataChart: true,
	plotPredictionToDataChartAddDays: 4
};
var predictionConfigWorldDefaults = {
	functionName: "henry1",
	startValue: 4,
	startDate: new Date(2020, 02, 02),
	infectionPeriod: 6,
	growthFactor: "continuousFromExistingData",
	growthFactorDataUntilDate: -1,
	averageMeetPerDay: 30,
	infectionProbability: 30,
	continuous_endCustom: true,
	continuos_endCustom_val: 0.15,
	populationSize: 10649800,
	continuous_endVar: false,
	continuous_endVarValues: "0.27*12; 0.2*10; 0.12",
	plotPredictionToDataChart: true,
	plotPredictionToDataChartAddDays: 4
};
var growthFactorCalcConfigCzechDefaults = {
	days: 1,
	perDay: true
};
var growthFactorCalcConfigWorldDefaults = {
	days: 1,
	perDay: true
};
var populations = {
	world: 7800000000,
	"Korea, South": 51780579,
	US: 327200000
};
var czechRegionsPopulations = {
	'Hlavní město Praha': 1280508,
	'Středočeský kraj': 1338982,
	'Jihočeský kraj': 638782,
	'Plzeňský kraj': 578629,
	'Karlovarský kraj': 296749,
	'Ústecký kraj': 821377,
	'Liberecký kraj': 440836,
	'Královéhradecký kraj': 550804,
	'Pardubický kraj': 517087,
	'Kraj Vysočina': 508952,
	'Jihomoravský kraj': 1178812,
	'Olomoucký kraj': 633925,
	'Zlínský kraj': 583698,
	'Moravskoslezský kraj': 1209879
};
var czechRegionCodes = {
	'Hlavní město Praha': 'CZ010',
	'Středočeský kraj': 'CZ020',
	'Jihočeský kraj': 'CZ031',
	'Plzeňský kraj': 'CZ032',
	'Karlovarský kraj': 'CZ041',
	'Ústecký kraj': 'CZ042',
	'Liberecký kraj': 'CZ051',
	'Královéhradecký kraj': 'CZ052',
	'Pardubický kraj': 'CZ053',
	'Kraj Vysočina': 'CZ063',
	'Jihomoravský kraj': 'CZ064',
	'Olomoucký kraj': 'CZ071',
	'Zlínský kraj': 'CZ072',
	'Moravskoslezský kraj': 'CZ080'
};
var data = {
	"confirmed": {
		"number": "",
		"date": ""
	},
	"recovered": {
		"number": "",
		"date": ""
	},
	"deaths": {
		"number": "",
		"date": ""
	}
};

function parseEndVarValues(varValues) {
	let returnList = [];
	let entries = varValues.split(";");
	for(i = 0; i < entries.length; i += 1) {
		let entry = entries[i].trim();
		if(entry.includes('*')) {
			let valueAndTimes = entry.split("*");
			let value = parseFloat(valueAndTimes[0].trim().replace(",", "."));
			let times = parseInt(valueAndTimes[1].trim(), 10);
			for(j = 0; j < times; j += 1) {
				returnList.push(value);
			}
		}else{
			returnList.push(parseFloat(entry));
		}
	}
	return returnList;
}
if(window.location.toString().includes("cs")) {
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
var datasets = {
	confirmed: [],
	confirmedMaxInDay: [],
	spreadGrowthFactor: []
};

function loadDataChart() {
	let optionalDataset = null;
	if(predictionConfig.plotPredictionToDataChart) {
		let endOf = parseInt(daysSinceOutbreakSt, 10) + parseInt(predictionConfig.plotPredictionToDataChartAddDays, 10);
		optionalDataset = JSON.parse(JSON.stringify(datasets.prediction.slice(0, endOf)));
	}
	let datasetNameMaxString = "MaxInDay";
	let feeddatasets;
	let ttformat = 'dddd D. M.';
	let confirmedDataset = JSON.parse(JSON.stringify(datasets["confirmed" + datasetNameMaxString]));
	let confirmedLabel;
	let activeDataset = [];
	let activeLabel;
	let recoveredDataset = JSON.parse(JSON.stringify(datasets["recovered" + datasetNameMaxString]));
	let recoveredLabel;
	let deathsDataset = JSON.parse(JSON.stringify(datasets["deaths" + datasetNameMaxString]));
	let deathsLabel;

	let activeCasesPlot = document.getElementById("stateSelect").value == "czechia" || databaseName != "czech-covid-db";
	if (activeCasesPlot){
		let recoveredDate = moment(recoveredDataset[0].x);
		let deathsDate = moment(deathsDataset[0].x);
		let recoveredStartIndex = (function() {
			let dateDiff = recoveredDate.diff(moment(confirmedDataset[0].x), 'days');
			if (dateDiff<0){
				return 0;
			}else{
				return dateDiff;
			}
		})();
		let deathsStartIndex = (function() {
			let dateDiff = deathsDate.diff(moment(confirmedDataset[0].x), 'days');
			if (dateDiff<0){
				return 0;
			}else{
				return dateDiff;
			}
		})();
		let desiredDate = moment(confirmedDataset[0].x);
		let shiftRecovered = 0;
		let shiftDeaths = 0;
		let lastNumRecovered = 0;
		let lastNumDeaths = 0;
		for (i=0; i<confirmedDataset.length; i++){
			let numRecovered = 0;
			if (i>=recoveredStartIndex){
				let record = recoveredDataset[i-recoveredStartIndex-shiftRecovered];
				if(record!=undefined && moment(record.x).isSame(desiredDate, 'day')){
					numRecovered = record.y;
				}else{
					numRecovered = lastNumRecovered;
					shiftRecovered++;
				}
			}
			lastNumRecovered = numRecovered;

			let numDeaths = 0;
			if (i>=deathsStartIndex){
				let record = deathsDataset[i-deathsStartIndex-shiftDeaths];
				if(record!=undefined && moment(record.x).isSame(desiredDate, 'day')){
					numDeaths = record.y;
				}else{
					numDeaths = lastNumDeaths;
					shiftDeaths++;
				}
			}
			lastNumDeaths = numDeaths;
			activeDataset.push({x: confirmedDataset[i].x, y: confirmedDataset[i].y-numRecovered-numDeaths});
			desiredDate.add(1, 'days');
		}
	}
	if(document.getElementById("dataChart_perDay").checked) {
		let lastValue = 0;
		confirmedLabel = strings.dataChartPerDayConfirmedLabel;
		activeLabel = strings.dataChartPerDayActiveLabel;
		recoveredLabel = strings.dataChartPerDayRecoveredLabel;
		deathsLabel = strings.dataChartPerDayDeathsLabel;
		if(optionalDataset != null) {
			for(i = 0; i < optionalDataset.length; i += 1) {
				let currValue = optionalDataset[i].y;
				optionalDataset[i].y = currValue - lastValue;
				lastValue = currValue;
			}
		}
		if (activeCasesPlot){
			lastValue = 0;
			for(i = 0; i < activeDataset.length; i += 1) {
				let currValue = activeDataset[i].y;
				activeDataset[i].y = currValue - lastValue;
				lastValue = currValue;
			}
		}
		lastValue = 0;
		for(i = 0; i < confirmedDataset.length; i += 1) {
			let currValue = confirmedDataset[i].y;
			confirmedDataset[i].y = currValue - lastValue;
			lastValue = currValue;
		}
		lastValue = 0;
		for(i = 0; i < recoveredDataset.length; i += 1) {
			let currValue = recoveredDataset[i].y;
			recoveredDataset[i].y = currValue - lastValue;
			lastValue = currValue;
		}
		lastValue = 0;
		for(i = 0; i < deathsDataset.length; i += 1) {
			let currValue = deathsDataset[i].y;
			deathsDataset[i].y = currValue - lastValue;
			lastValue = currValue;
		}
	}else{
		confirmedLabel = strings.dataChartConfirmedLabel;
		activeLabel = strings.dataChartActiveLabel;
		recoveredLabel = strings.dataChartRecoveredLabel;
		deathsLabel = strings.dataChartDeathsLabel;
	}
	feeddatasets = [{
			data: confirmedDataset,
			label: confirmedLabel,
			borderColor: "#f84f4a",
			fill: true
		},
		{
			data: recoveredDataset,
			label: recoveredLabel,
			borderColor: "#1261ff",
			fill: false
		},
		{
			data: deathsDataset,
			label: deathsLabel,
			borderColor: "#383838",
			fill: false
		}
	];
	if(optionalDataset != null) {
		feeddatasets.push({
			data: optionalDataset,
			label: strings.dataChartPredictionLabel,
			borderColor: "#964906",
			fill: false
		});
	}
	if (activeCasesPlot){
		feeddatasets.push({
			data: activeDataset,
			label: activeLabel,
			borderColor: "#f84f4a",
			backgroundColor: "#5e00c9",
			fill: false,
			hidden: true
		});
	}
	if(dataChart == undefined) {
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
		document.getElementById("dataChart").onclick = function(evt) {
			var activePoints = dataChart.getElementsAtEventForMode(evt, 'point', dataChart.options);
			if(activePoints.length > 0 && predictionConfigShowed && document.getElementById("mTimesPway").value == "continuousFromExistingData" && document.getElementById("continuous_limitData").checked) {
				var firstPointIndex = activePoints[0]._index;
				let dateOfClickedPoint = new Date(datasets.spreadGrowthFactor[firstPointIndex].x);
				document.getElementById("growthFactorDateLimit").value = dateOfClickedPoint.toISOString().substr(0, 10);
			}
		};
	}else{
		dataChart.data.datasets = feeddatasets;
		dataChart.update();
	}
}
var csseArrParseWaiting = {
	recovered: false,
	deaths: false
};
var csseLoadedConfirmed;
var csseArrParsed  = {
	confirmed: false,
	recovered: false,
	deaths: false,
	populations: false
};
var csseArr = {
	confirmed: [],
	recovered: [],
	deaths: []
};
var czechCovidDbData;
var czechCovidDbArrParseWaiting = {
	tests: false,
	recovered: false,
	deaths: false,
	imports: false,
	districtsNumbers: false,
	ageGroups: false
};
var czechCovidDbArr = {
	tests: {},
	confirmed: [],
	recovered: [],
	deaths: []
};
var czechCovidDbArrParsed = {
	confirmed: false,
	recovered: false,
	deaths: false
};
var csseCountriesList = [];

function databaseChange() {
	databaseName = document.getElementById("databasePick").value;
	if(databaseName == "CSSE COVID-19 Dataset") {
		document.getElementById("okresyBox").style.display = "none";
		if(!progressBarShowed) {
			NProgress.start();
			progressBarShowed = true;
		}
		for(var i in csseArrParsed) csseArrParsed[i] = false;
		predictionConfig = JSON.parse(JSON.stringify(predictionConfigWorldDefaults));
		growthFactorCalcConfig = growthFactorCalcConfigWorldDefaults;
		if(csseArr.confirmed.length == 0) {
			loadCurrentData(databaseName)
		}else{
			document.getElementById("stateSelect").innerHTML = "";
			let optionToAdd = document.createElement("option");
			optionToAdd.value = "world";
			optionToAdd.innerHTML = strings.world;
			document.getElementById("stateSelect").appendChild(optionToAdd);
			detailedStatsSH();
			for(i = 1; i < csseCountriesList.length; i += 1) {
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
		scaleSmallBox(x);
		scaleSmallBox2(match2);
		scaleSmallBox3(match3);
	}else if(databaseName == "czech-covid-db") {
		if(!progressBarShowed) {
			NProgress.start();
			progressBarShowed = true;
		}
		for(var i in czechCovidDbArrParsed) czechCovidDbArrParsed[i] = false;
		predictionConfig = JSON.parse(JSON.stringify(predictionConfigCzechDefaults));
		predictionConfig.startDate = new Date(predictionConfig.startDate);
		growthFactorCalcConfig = growthFactorCalcConfigCzechDefaults;
		if(czechCovidDbArr.confirmed.length == 0) {
			loadCurrentData(databaseName);
		}else{
			czechCountrySelect(czechCovidDbArr.confirmed[0]);
			data = JSON.parse(JSON.stringify(czechCovidDbData));
			czechCovidDbParse("confirmed");
			if(progressBarShowed) {
				NProgress.inc();
			}
			czechCovidDbParse("recovered");
			if(progressBarShowed) {
				NProgress.inc();
			}
			czechCovidDbParse("deaths");
		}
		if(document.getElementById("stateSelect").value != "czechia") {
			document.getElementById("okresyBox").style.display = "initial";
		}else{
			document.getElementById("okresyBox").style.display = "none";
		}
	}
}

function countryNameChange() {
	if(document.getElementById("databasePick").value == "CSSE COVID-19 Dataset") {
		if(!progressBarShowed) {
			NProgress.start();
			progressBarShowed = true;
		}
		for(var i in csseArrParsed) csseArrParsed[i] = false;
		csseParse("confirmed");
		csseParse("recovered");
		csseParse("deaths");
	}else if(document.getElementById("databasePick").value == "czech-covid-db") {
		detailedStatsSH()
		scaleSmallBox(x);
		scaleSmallBox2(match2);
		scaleSmallBox3(match3);
		for(var i in czechCovidDbArrParsed) czechCovidDbArrParsed[i] = false;
		czechCovidDbParse("recovered");
		czechCovidDbParse("deaths");
		czechCovidDbParse("confirmed");
		if(document.getElementById("stateSelect").value != "czechia") {
			document.getElementById("okresyBox").style.display = "initial";
			scaleSmallBox(x);
			loadDistrictsTable();
		}else{
			//average age box
			document.getElementById("importedCasesText").getElementsByClassName("statNumber")[0].innerHTML = data.confirmedImported.number;
			document.getElementById("importedCasesText").getElementsByClassName("statDate")[0].innerHTML = strings.importedCases;
			document.getElementById("okresyBox").style.display = "none";
			loadTestsChart();
			loadImportsChart();
			loadAgegroupsChart();
		}
	}
}

function czechCountrySelect(columnNamesCon) {
	let optionToAdd = document.createElement("option");
	optionToAdd.value = "czechia";
	optionToAdd.innerHTML = strings.czechia;
	document.getElementById("stateSelect").innerHTML = "";
	document.getElementById("stateSelect").appendChild(optionToAdd);
	detailedStatsSH();
	for(i = columnNamesCon.length - 14; i < columnNamesCon.length; i += 1) {
		optionToAdd = document.createElement("option");
		optionToAdd.value = columnNamesCon[i];
		optionToAdd.innerHTML = columnNamesCon[i];
		document.getElementById("stateSelect").appendChild(optionToAdd);
	}
	if(urlSelectedCountry != null) {
		document.getElementById("stateSelect").value = urlSelectedCountry;
	}
	detailedStatsSH();
}

function csseParse(datasetName) {
	let columnNames = csseArr[datasetName][0];
	let dataFromCsse = csseArr[datasetName].slice(1);
	let datasetNameMaxInDay = datasetName + "MaxInDay";
	datasets[datasetNameMaxInDay] = [];
	for(i = 4; i < columnNames.length; i += 1) {
		let dateOfColumn = moment(columnNames[i], csseDateFormat[datasetName]).toISOString();
		datasets[datasetNameMaxInDay].push({
			x: dateOfColumn,
			y: 0
		});
	}
	let stateName;
	if(urlSelectedCountry == null) {
		stateName = document.getElementById("stateSelect").value;
	}else{
		stateName = urlSelectedCountry;
		document.getElementById("stateSelect").value = stateName;
		urlSelectedCountry = null;
	}
	for(i = 0; i < dataFromCsse.length; i += 1) {
		let currStateName = dataFromCsse[i][1];
		if(stateName == currStateName || stateName == "world") {
			for(j = 0; j < datasets[datasetNameMaxInDay].length; j += 1) {
				let item = dataFromCsse[i][j + 4];
				if(item != undefined && item != "") {
					datasets[datasetNameMaxInDay][j].y += parseInt(item.replace(/\D+/g, ""), 10);
				}
			}
		}
	}
	//clean start zeros and same values
	let valuesStart = null;
	for(i = 0; i < datasets[datasetNameMaxInDay].length; i += 1) {
		let currValConfirmed = parseInt(datasets[datasetNameMaxInDay][i].y, 10);
		if(currValConfirmed > 0) {
			valuesStart = i;
			break;
		}
	}
	if(valuesStart == null) {
		datasets[datasetNameMaxInDay] = [datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1]];
	}else{
		datasets[datasetNameMaxInDay].splice(0, valuesStart);
	}
	datasets[datasetName] = datasets[datasetNameMaxInDay];
	if(datasetName == "confirmed") {
		predictionConfig.startDate = new Date(datasets[datasetNameMaxInDay][0].x);
		predictionConfig.startValue = datasets[datasetNameMaxInDay][0].y;
		predictionConfig.infectionProbability = calculateInfectionDefaultProbability(false, datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1].y, predictionConfig.averageMeetPerDay);

		if(populations.hasOwnProperty(stateName)) {
			predictionConfig.populationSize = populations[stateName];
		}else{
			predictionConfig.populationSize = Math.floor(parseInt(populations.world, 10) / 198);
		}
	}
	data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1].y;
	data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1].x;
	//basic stats cases box
	document.getElementById(datasetName + "Text").getElementsByClassName("statNumber")[0].innerHTML = data[datasetName].number;
	if(isNaN(data[datasetName].number)) {
		document.getElementsByClassName("box")[1].style.fontSize = "11px";
		document.getElementById(datasetName + "Text").getElementsByClassName("statDate")[0].innerHTML = strings.jhoRecoveredUnavailable;
		document.getElementById(datasetName + "Text").getElementsByClassName("statDate")[0].style.fontSize = "10px";
	}else{
		document.getElementById(datasetName + "Text").getElementsByClassName("statDate")[0].innerHTML = convertDate(data[datasetName].date);
	}
	if(datasetName == "confirmed") {
		//calculate spread growth factors from confirmed dataset
		calculateSpreadGrowthFactorAndPlot("77%");
		myTodayInfectedProbability();
		progressBarShowed = false;
	}
	//calculate config variable for prediction
	csseArrParsed[datasetName] = true;
	if(csseArrParsed.confirmed == true && csseArrParsed.recovered == true && csseArrParsed.deaths == true) {
		if(predictionConfig.plotPredictionToDataChart) {
			getDataCalculatePredictionAndPlot();
			if(progressBarShowed) {
				NProgress.inc();
			}
		}else{
			loadDataChart();
			if(progressBarShowed) {
				NProgress.inc();
			}
			getDataCalculatePredictionAndPlot();
		}
		NProgress.done();
	}else{
		if(progressBarShowed) {
			NProgress.inc();
		}
	}
}

function czechCovidDbParse(datasetName) {
	let columnNames = czechCovidDbArr[datasetName][0];
	let datasetsInColumns = czechCovidDbArr[datasetName].slice(1);
	let datasetNameMaxInDay = datasetName + "MaxInDay";
	let selValue
	let targetIndex;
	if(urlSelectedCountry == null) {
		selValue = document.getElementById("stateSelect").value;
		if(selValue && (!columnNames.includes(selValue) && selValue != "czechia")) {
			targetIndex = null;
		}else if(!selValue || selValue == "czechia") {
			targetIndex = 2;
		}else{
			targetIndex = columnNames.indexOf(selValue);
		}
	}else{
		selValue = urlSelectedCountry;
		if(urlSelectedCountry == "czechia") {
			targetIndex = 2;
		}else{
			targetIndex = columnNames.indexOf(urlSelectedCountry);
		}
		document.getElementById("stateSelect").value = urlSelectedCountry;
		urlSelectedCountry = null;
	}
	if(selValue != "czechia") {
		document.getElementById("okresyBox").style.display = "initial";
	}else{
		document.getElementById("okresyBox").style.display = "none";
	}
	let datasetsInRows = datasetsInColumns[0].map(function(col, i) {
		return datasetsInColumns.map(function(row) {
			return row[i];
		});
	});
	datasets[datasetName] = [];
	datasets[datasetNameMaxInDay] = [];
	if(targetIndex != null) {
		let i = 0;
		var lastValueConfirmed = -1;
		datasetsInRows[1].forEach(function(entry) {
			let currValueConfirmed = datasetsInRows[targetIndex][i];
			if(currValueConfirmed != 0) {
				if(currValueConfirmed != lastValueConfirmed) {
					var dataObject = {
						x: entry,
						y: currValueConfirmed
					};
					datasets[datasetName].push(dataObject);
				}
				if(i + 1 < datasetsInRows[1].length) {
					let dateOfEntry = new Date(entry);
					let nextDate = new Date(datasetsInRows[1][i + 1]);
					if(nextDate.getDate() != dateOfEntry.getDate()) {
						dateOfEntry.setHours(0, 0, 0, 0);
						datasets[datasetNameMaxInDay].push({
							x: dateOfEntry.toISOString(),
							y: currValueConfirmed
						});
					}
				}
			}
			i += 1;
			lastValueConfirmed = currValueConfirmed;
		});
		if(targetIndex != 2) {
			data[datasetName].number = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1].y;
			data[datasetName].date = datasets[datasetNameMaxInDay][datasets[datasetNameMaxInDay].length - 1].x;
		}else if(czechCovidDbData !== undefined) {
			data[datasetName].number = czechCovidDbData[datasetName].number
			data[datasetName].date = czechCovidDbData[datasetName].date
		}
	}else{
		data[datasetName].number = "???";
		data[datasetName].date = null;
	}
	//basic stats cases box
	document.getElementById(datasetName + "Text").getElementsByClassName("statNumber")[0].innerHTML = data[datasetName].number;
	document.getElementsByClassName("box")[1].style.fontSize = "150%";
	document.getElementsByClassName("statDate")[1].style.fontSize = "8px";
	document.getElementById(datasetName + "Text").getElementsByClassName("statDate")[0].innerHTML = convertDate(data[datasetName].date);
	if(datasetName == "confirmed") {
		predictionConfig.startDate = new Date(datasets.confirmedMaxInDay[0].x);
		predictionConfig.startValue = parseInt(datasets.confirmedMaxInDay[0].y, 10);
		//calculate config variable for prediction
		predictionConfigCzechDefaults.infectionProbability = calculateInfectionDefaultProbability(false, datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length - 1].y, predictionConfigCzechDefaults.averageMeetPerDay);
		predictionConfig.infectionProbability = predictionConfigCzechDefaults.infectionProbability;
		if(selValue == "czechia") {
			predictionConfig.populationSize = predictionConfigCzechDefaults.populationSize
		}else if(czechRegionsPopulations.hasOwnProperty(selValue)) {
			predictionConfig.populationSize = czechRegionsPopulations[selValue];
		}else{
			predictionConfig.populationSize = parseInt(predictionConfigCzechDefaults.populationSize, 10) / 14;
		}
		//calculate spread growth factors from confirmed dataset
		calculateSpreadGrowthFactorAndPlot("77%");
		myTodayInfectedProbability();
		if(progressBarShowed) {
			NProgress.inc();
		}
	}
	czechCovidDbArrParsed[datasetName] = true;
	if(czechCovidDbArrParsed.confirmed == true && czechCovidDbArrParsed.recovered == true && czechCovidDbArrParsed.deaths == true) {
		if(predictionConfig.plotPredictionToDataChart) {
			getDataCalculatePredictionAndPlot();
		}else{
			loadDataChart();
			getDataCalculatePredictionAndPlot();
		}
		NProgress.done();
		progressBarShowed = false;
	}
}

function czechCovidDbTestsParse() {
	datasets.tests = {};
	datasets.tests.all = [];
	datasets.tests.allRatio = [];
	datasets.tests.perDay = [];
	datasets.tests.perDayRatio = [];
	let lastValue = 0;
	let confirmedStartIndex = null;
	let lastValueConfirmed = 0;
	for(i = 1; i < czechCovidDbArr.tests.length - 1; i += 1) {
		let currentValueConfirmed = 0;
		let currValue = czechCovidDbArr.tests[i][2];
		let currDate = moment(czechCovidDbArr.tests[i][1]);
		let ratio;
		let perDayRatio;
		if(confirmedStartIndex == null) {
			if(currDate.isSameOrAfter(predictionConfig.startDate)) {
				confirmedStartIndex = i;
				currentValueConfirmed = datasets.confirmedMaxInDay[i - confirmedStartIndex].y;
				ratio = currentValueConfirmed / currValue;
				perDayRatio = (currentValueConfirmed - lastValueConfirmed) / currValue;
			}else{
				ratio = 0;
				perDayRatio = 0;
			}
		}else{
			currentValueConfirmed = datasets.confirmedMaxInDay[i - confirmedStartIndex].y;
			ratio = currentValueConfirmed / currValue;
			perDayRatio = (currentValueConfirmed - lastValueConfirmed) / currValue;
		}
		datasets.tests.all.push({
			x: czechCovidDbArr.tests[i][1],
			y: currValue
		});
		datasets.tests.allRatio.push({
			x: czechCovidDbArr.tests[i][1],
			y: ratio
		});
		datasets.tests.perDay.push({
			x: czechCovidDbArr.tests[i][1],
			y: currValue - lastValue
		});
		datasets.tests.perDayRatio.push({
			x: czechCovidDbArr.tests[i][1],
			y: perDayRatio
		});
		lastValue = currValue;
		lastValueConfirmed = currentValueConfirmed;
	}
	let selSt = document.getElementById("stateSelect").value;
	if(databaseName == "czech-covid-db") {
		if(selSt == "czechia" || (selSt == "" && urlSelectedCountry == null)) {
			loadTestsChart();
		}
	}
}
var testsChart;
var testsChartHtml = "<canvas class=\"chartjs\" id=\"testsChart\"></canvas>";

function loadTestsChart() {
	if(datasets.tests == undefined) {
		czechCovidDbTestsParse();
	}else{
		//tests box
		document.getElementById("testedText").getElementsByClassName("statNumber")[0].innerHTML = data.tested.number;
		document.getElementById("testedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data.tested.date);
		let perDayChecked = document.getElementById("testingChart_perDay").checked;
		let ratioChecked = document.getElementById("testingChart_ratio").checked;
		let testsDataset;
		let testsLabel;
		let yAxisPercent = {
			ticks: {
				min: 0,
				callback: function(value) {
					return (value * 100).toFixed(0) + '%'; // convert it to percentage
				}
			}
		};
		let yAxis = {};
		let ttipsPercent = {
			callbacks: {
				label: function(tooltipItem, data) {
					let tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
					return (tooltipValue * 100).toString() + "%";
				}
			}
		};
		let ttips = {};
		let color = "#b200c9";
		if(perDayChecked && ratioChecked) {
			testsDataset = datasets.tests.perDayRatio;
			testsLabel = strings.testsPerDayRatio;
			yAxis = yAxisPercent;
			ttips = ttipsPercent;
			color = "#f84f4a";
		}else if(!perDayChecked && ratioChecked) {
			testsDataset = datasets.tests.allRatio;
			testsLabel = strings.testsAllRatio;
			yAxis = yAxisPercent;
			ttips = ttipsPercent;
			color = "#f84f4a";
		}else if(perDayChecked && !ratioChecked) {
			testsDataset = datasets.tests.perDay;
			testsLabel = strings.testsPerDay;
		}else{
			testsDataset = datasets.tests.all;
			testsLabel = strings.testsAll;
		}
		if(testsChart == undefined) {
			document.getElementById("testingChartDiv").innerHTML = "";
			document.getElementById("testingChartDiv").innerHTML = testsChartHtml;
			var ctx = document.getElementById("testsChart");
			testsChart = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [{
						data: testsDataset,
						label: testsLabel,
						borderColor: color,
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
}

function loadDistrictsTable() {
	let table = document.getElementById("districts").getElementsByTagName("tbody")[0];
	table.innerHTML = "";
	let deathsSum = 0;
	let regionId = czechRegionCodes[document.getElementById("stateSelect").value];
	let suitDistricts = [];
	for(i = 0; i < data.districtsNumbers.districts.length; i += 1) {
		let district = data.districtsNumbers.districts[i];
		if(district.id.substring(0, 5) == regionId) {
			deathsSum += district.deaths || 0;
			suitDistricts.push(district);
		}
	}
	suitDistricts.sort(function(first, second) {
		return second.total_cases - first.total_cases;
	});
	for(i = 0; i < suitDistricts.length; i += 1) {
		let district = suitDistricts[i];
		let row = table.insertRow(-1);
		let nameCell = row.insertCell(0);
		nameCell.appendChild(document.createTextNode(district.name));
		let confirmedCell = row.insertCell(1);
		confirmedCell.appendChild(document.createTextNode(district.total_cases));
		let deathsCell = row.insertCell(2);
		deathsCell.appendChild(document.createTextNode(district.deaths || 0));
	}
	data.deaths.number = deathsSum;
	document.getElementById("deathsText").getElementsByClassName("statNumber")[0].innerHTML = data.deaths.number;
}
var progressBarShowed = false;

function loadCurrentData(databaseName) {
	progressBarShowed = true;
	if(databaseName == "czech-covid-db") {
		/* Fetch current data from kukosek's github
		 * 
		 */
		let xhr = new XMLHttpRequest();
		xhr.open('GET', czechCovidDbURLs.currentNumbers);
		xhr.send();
		xhr.onload = function() {
			if(xhr.status == 200) { // analyze HTTP status of the response
				document.getElementById("databasePick").value = databaseName;
				czechCovidDbData = JSON.parse(xhr.response); // responseText is the server
				data = {
					...data,
					...JSON.parse(JSON.stringify(czechCovidDbData))
				};
				let selectedCountry = document.getElementById("stateSelect").value;
				let basicStatsParse = false;
				if(document.getElementById("stateSelect") == undefined) {
					basicStatsParse = true;
				}else{
					if(selectedCountry == "czechia" || selectedCountry == "world" || selectedCountry == "") {
						basicStatsParse = true;
					}
				}
				if(selectedCountry == "czechia" && czechCovidDbArrParseWaiting.tests && czechCovidDbArrParsed.confirmed) {
					czechCovidDbTestsParse();
				}
				if(urlSelectedCountry == null && basicStatsParse) {
					//confirmed cases box
					document.getElementById("confirmedText").getElementsByClassName("statNumber")[0].innerHTML = data.confirmed.number;
					document.getElementById("confirmedText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data.confirmed.date);
					//cured box
					document.getElementById("recoveredText").getElementsByClassName("statNumber")[0].innerHTML = data.recovered.number;
					document.getElementById("recoveredText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data.recovered.date);
					//deaths box
					document.getElementById("deathsText").getElementsByClassName("statNumber")[0].innerHTML = data.deaths.number;
					document.getElementById("deathsText").getElementsByClassName("statDate")[0].innerHTML = convertDate(data.deaths.date);
					//average age box
					document.getElementById("importedCasesText").getElementsByClassName("statNumber")[0].innerHTML = data.confirmedImported.number;
					document.getElementById("importedCasesText").getElementsByClassName("statDate")[0].innerHTML = strings.importedCases;
				}
				//load default value into did i got the virus today box inputBox
				document.getElementById("myMeetPerDay").value = myMeetPerDayConf;
				dynamicInputAdjust();
			}else{ // show the result
				alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
			}
		};
		xhr.onerror = function() {
			alert("Request failed");
		};
		let xhrTests = new XMLHttpRequest();
		xhrTests.open('GET', czechCovidDbURLs.tests);
		xhrTests.send();
		xhrTests.onload = function() {
			if(xhrTests.status == 200 || xhrTests.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrTests.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.tests = results.data;
					let selectedCountry = document.getElementById("stateSelect").value;
					if(selectedCountry == "czechia" && czechCovidDbArrParsed.confirmed && data.tested != undefined) {
						czechCovidDbTestsParse();
					}else{
						czechCovidDbArrParseWaiting.tests = true;
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrTests.status}: ${xhrTests.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrTests.onerror = function() {
			alert("Request failed");
		};
		for(var i in czechCovidDbArrParsed) czechCovidDbArrParsed[i] = false;
		/* Fetch current datasets to charts from kukosek's github
		 * 
		 */
		let xhrConfirmed = new XMLHttpRequest();
		xhrConfirmed.open('GET', czechCovidDbURLs.confirmed);
		xhrConfirmed.send();
		xhrConfirmed.onload = function() {
			if(xhrConfirmed.status == 200 || xhrConfirmed.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrConfirmed.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.confirmed = results.data;
					czechCountrySelect(czechCovidDbArr.confirmed[0]);
					czechCovidDbParse("confirmed");
					let selectedCountry = document.getElementById("stateSelect").value;
					if(selectedCountry == "czechia" && czechCovidDbArrParseWaiting.tests && data.tested != undefined) {
						czechCovidDbTestsParse();
					}
					if(czechCovidDbArrParseWaiting.recovered) {
						czechCovidDbParse("recovered");
						czechCovidDbArrParseWaiting.recovered = true;
					}
					if(czechCovidDbArrParseWaiting.deaths) {
						czechCovidDbParse("deaths");
						czechCovidDbArrParseWaiting.deaths = false;
					}
					if(czechCovidDbArrParseWaiting.districtsNumbers) {
						let selectedCountry = document.getElementById("stateSelect").value;
						if((selectedCountry != "" && selectedCountry != "czechia") || (urlSelectedCountry != "czechia" && urlSelectedCountry != null)) {
							loadDistrictsTable();
						}
						czechCovidDbArrParseWaiting.districtsNumbers = false;
					}
					if(czechCovidDbArrParseWaiting.imports) {
						loadImportsChart();
						czechCovidDbArrParseWaiting.imports = false;
					}
					if(czechCovidDbArrParseWaiting.ageGroups) {
						loadAgegroupsChart();
						czechCovidDbArrParseWaiting.ageGroups = false;
					}
					if(progressBarShowed) {
						NProgress.inc();
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrConfirmed.status}: ${xhrConfirmed.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrConfirmed.onerror = function() {
			alert("Request failed");
		};
		let xhrRecovered = new XMLHttpRequest();
		xhrRecovered.open('GET', czechCovidDbURLs.recovered);
		xhrRecovered.send();
		xhrRecovered.onload = function() {
			if(xhrRecovered.status == 200 || xhrRecovered.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrRecovered.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.recovered = results.data;
					if(czechCovidDbArrParsed.confirmed) {
						czechCovidDbParse("recovered");
					}else{
						czechCovidDbArrParseWaiting.recovered = true;
					}
					if(progressBarShowed) {
						NProgress.inc();
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrRecovered.status}: ${xhrRecovered.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrRecovered.onerror = function() {
			alert("Request failed");
		};
		let xhrDeaths = new XMLHttpRequest();
		xhrDeaths.open('GET', czechCovidDbURLs.deaths);
		xhrDeaths.send();
		xhrDeaths.onload = function() {
			if(xhrDeaths.status == 200 || xhrDeaths.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrDeaths.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.deaths = results.data;
					if(czechCovidDbArrParsed.confirmed) {
						czechCovidDbParse("deaths");
					}else{
						czechCovidDbArrParseWaiting.deaths = true;
					}
					if(progressBarShowed) {
						NProgress.inc();
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrDeaths.status}: ${xhrDeaths.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrDeaths.onerror = function() {
			alert("Request failed");
		};
		let xhrDN = new XMLHttpRequest();
		xhrDN.open('GET', czechCovidDbURLs.districtsNumbers);
		//xhrDN.setRequestHeader("x-requested-with", "XMLHttpRequest");
		xhrDN.send();
		xhrDN.onload = function() {
			if(xhrDN.status == 200) { // analyze HTTP status of the response
				czechCovidDbData.districtsNumbers = JSON.parse(xhrDN.response.replace('/', ''));
				data.districtsNumbers = JSON.parse(JSON.stringify(czechCovidDbData.districtsNumbers));
				if(czechCovidDbArrParsed.confirmed) {
					let selectedCountry = document.getElementById("stateSelect").value;
					if((selectedCountry != "" && selectedCountry != "czechia") || (urlSelectedCountry != "czechia" && urlSelectedCountry != null)) {
						loadDistrictsTable();
					}
				}else{
					czechCovidDbArrParseWaiting.districtsNumbers = true;
				}
			}else{ // show the result
				alert(`Error ${xhrDN.status}: ${xhrDN.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrDN.onerror = function() {
			alert("Request failed");
		};
		let xhrImports = new XMLHttpRequest();
		xhrImports.open('GET', czechCovidDbURLs.imports);
		xhrImports.send();
		xhrImports.onload = function() {
			if(xhrImports.status == 200) { // analyze HTTP status of the response
				let results = Papa.parse(xhrImports.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.imports = results.data;
					if(czechCovidDbArrParsed.confirmed) {
						let selectedCountry = document.getElementById("stateSelect").value;
						if(urlSelectedCountry == "czechia" || selectedCountry == "czechia") {
							loadImportsChart();
						}
					}else{
						czechCovidDbArrParseWaiting.imports = true;
					}
					if(progressBarShowed) {
						NProgress.inc();
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrImports.status}: ${xhrImports.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrImports.onerror = function() {
			alert("Request failed");
		};
		let xhrAgegroups = new XMLHttpRequest();
		xhrAgegroups.open('GET', czechCovidDbURLs.ageGroups);
		xhrAgegroups.send();
		xhrAgegroups.onload = function() {
			if(xhrAgegroups.status == 200) { // analyze HTTP status of the response
				let results = Papa.parse(xhrAgegroups.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					czechCovidDbArr.ageGroups = results.data;
					if(czechCovidDbArrParsed.confirmed) {
						let selectedCountry = document.getElementById("stateSelect").value;
						if(urlSelectedCountry == "czechia" || selectedCountry == "czechia") {
							loadAgegroupsChart();
						}
					}else{
						czechCovidDbArrParseWaiting.ageGroups = true;
					}
					if(progressBarShowed) {
						NProgress.inc();
					}
				}else{
					alert("Error parsing chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrAgegroups.status}: ${xhrAgegroups.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrAgegroups.onerror = function() {
			alert("Request failed");
		};
	}else if(databaseName == "CSSE COVID-19 Dataset") {
		csseLoadedConfirmed = false;
		for(var i in csseArrParsed) csseArrParsed[i] = false;
		/* Fetch current data from CSSEGISandData github
		 * 
		 */
		let xhrPopulations = new XMLHttpRequest();
		xhrPopulations.open('GET', csseURLs.populations);
		xhrPopulations.send();
		xhrPopulations.onload = function() {
			if(xhrPopulations.status == 200) { // analyze HTTP status of the response
				let populationList = JSON.parse(xhrPopulations.response);
				populationList.forEach(element => {
					populations[element.country] = parseInt(element.population);
					
				});
				csseArrParsed.populations = true;
				if(csseLoadedConfirmed) {
					csseParse("confirmed");
					if(csseArrParseWaiting.recovered) {
						csseParse("recovered");
						csseArrParseWaiting.recovered = false;
					}
					if(csseArrParseWaiting.deaths) {
						csseParse("deaths");
						csseArrParseWaiting.deaths = false;
					}
				}
			}else{ // show the result
				alert(`Error ${xhrPopulations.status}: ${xhrPopulations.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrPopulations.onerror = function() {
			alert("Request for country populations failed");
		};
		 
		let xhrConfirmed = new XMLHttpRequest();
		xhrConfirmed.open('GET', csseURLs.confirmed);
		xhrConfirmed.send();
		xhrConfirmed.onload = function() {
			document.getElementById("databasePick").value = databaseName;
			if(xhrConfirmed.status == 200 || xhrConfirmed.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrConfirmed.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					csseArr.confirmed = JSON.parse(JSON.stringify(results.data));
					document.getElementById("stateSelect").innerHTML = "";
					let optionToAdd = document.createElement("option");
					optionToAdd.value = "world";
					optionToAdd.innerHTML = strings.world;
					document.getElementById("stateSelect").appendChild(optionToAdd);
					detailedStatsSH();
					for(i = 1; i < csseArr.confirmed.length-1; i += 1) {
						let currContryName = csseArr.confirmed[i][1];
						if(!csseCountriesList.includes(currContryName)) {
							csseCountriesList.push(currContryName);
						}
					}
					csseCountriesList.sort();
					for(i = 1; i < csseCountriesList.length; i += 1) {
						let currContryName = csseCountriesList[i];
						optionToAdd = document.createElement("option");
						optionToAdd.value = currContryName;
						optionToAdd.innerHTML = currContryName;
						document.getElementById("stateSelect").appendChild(optionToAdd);
					}
					csseLoadedConfirmed = true;
					if (csseArrParsed.populations){
						csseParse("confirmed");
						if(csseArrParseWaiting.recovered) {
							csseParse("recovered");
							csseArrParseWaiting.recovered = false;
						}
						if(csseArrParseWaiting.deaths) {
							csseParse("deaths");
							csseArrParseWaiting.deaths = false;
						}
					}
				}else{
					alert("Error parsing confirmed chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrConfirmed.status}: ${xhrConfirmed.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrConfirmed.onerror = function() {
			alert("Request to github JHO CSSE - confirmed failed");
		};
		let xhrRecovered = new XMLHttpRequest();
		xhrRecovered.open('GET', csseURLs.recovered);
		xhrRecovered.send();
		xhrRecovered.onload = function() {
			document.getElementById("databasePick").value = databaseName;
			if(xhrRecovered.status == 200 || xhrRecovered.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrRecovered.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					csseArr.recovered = JSON.parse(JSON.stringify(results.data));
					if(csseArrParsed.confirmed) {
						csseParse("recovered");
					}else{
						csseArrParseWaiting.recovered = true;
					}
				}else{
					alert("Error parsing recovered chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrRecovered.status}: ${xhrRecovered.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrRecovered.onerror = function() {
			alert("Request to github JHO CSSE - recovered failed");
		};
		let xhrDeaths = new XMLHttpRequest();
		xhrDeaths.open('GET', csseURLs.deaths);
		xhrDeaths.send();
		xhrDeaths.onload = function() {
			document.getElementById("databasePick").value = databaseName;
			if(xhrDeaths.status == 200 || xhrDeaths.status == 304) { // analyze HTTP status of the response
				let results = Papa.parse(xhrDeaths.response, csvFormat[databaseName]);
				if(results.errors.length == 0) {
					csseArr.deaths = JSON.parse(JSON.stringify(results.data));
					if(csseArrParsed.confirmed) {
						csseParse("deaths");
					}else{
						csseArrParseWaiting.deaths = true;
					}
				}else{
					alert("Error parsing deaths chart dataset\n" + results.errors[0].message);
				}
			}else{ // show the result
				alert(`Error ${xhrDeaths.status}: ${xhrDeaths.statusText}`); // e.g. 404: Not Found
			}
		};
		xhrRecovered.onerror = function() {
			alert("Request to github JHO CSSE - deaths failed");
		};
	}
}
var predictionChartHtml = "<canvas class=\"chartjs\" id=\"predictionChart\"></canvas>";

function detailedStatsSH() {
	let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	let elems = document.getElementsByClassName("detailedData");
	if(databaseName == "czech-covid-db" && document.getElementById("stateSelect").value == "czechia") {
		for(i = 0; i < elems.length; i += 1) {
			if(elems[i].parentElement.className == "wrapperBasicStats") {
				elems[i].style.display = "flex";
			}else{
				elems[i].style.display = "initial";
			}
		}
		let elemsSmall = document.getElementsByClassName("small");
		if(width > 1655 && width < 2075) {
			for(i = 0; i < elemsSmall.length; i += 1) {
				elemsSmall[i].style.height = "160px";
			}
		}
	}else{
		for(i = 0; i < elems.length; i += 1) {
			elems[i].style.display = "none";
		}
		let bigHeight = getComputedStyle(document.querySelector('.big')).height;
		let elemsSmall = document.getElementsByClassName("small");
		if(width > 1655 && width < 2075) {
			for(i = 0; i < elemsSmall.length; i += 1) {
				elemsSmall[i].style.height = bigHeight;
			}
		}
	}
}

function scaleSmallBox(w) {
	if(databaseName == "czech-covid-db") {
		let elemsSmall = document.getElementsByClassName("small");
		if(w.matches) {
			bigHeight = getComputedStyle(document.querySelector('.big')).height;
			for(i = 0; i < elemsSmall.length; i += 1) {
				elemsSmall[i].style.height = bigHeight;
			}
			document.getElementById("infectionProbabilityBox").style.gridColumn = "";
		}else{
			for(i = 0; i < elemsSmall.length; i += 1) {
				elemsSmall[i].style.height = "160px";
			}
			let selectedstate = document.getElementById("stateSelect").value;
			if((urlSelectedCountry != null && urlSelectedCountry != "czechia") || selectedstate != "" && selectedstate != "czechia") {
				document.getElementById("infectionProbabilityBox").style["grid-column"] = "1/5";
			}else{
				document.getElementById("infectionProbabilityBox").style["grid-column"] = "";
			}
		}
	}else{
		document.getElementById("infectionProbabilityBox").style["grid-column"] = "";
	}
}

function scaleSmallBox2(w) {
	let selectedstate = document.getElementById("stateSelect").value;
	let czechia = selectedstate == "czechia" || urlSelectedCountry == "czechia";
	if(w.matches && databaseName == "czech-covid-db" && czechia) {
		document.getElementById("infectionProbabilityBox").style["grid-column"] = "1/4";
	}else if(!czechia && selectedstate != "czechia") {
		document.getElementById("infectionProbabilityBox").style.gridColumn = "";
	}
}

function scaleSmallBox3(w) {
	let selectedstate = document.getElementById("stateSelect").value;
	let czechia = selectedstate == "czechia" || urlSelectedCountry == "czechia";
	if(w.matches && databaseName == "czech-covid-db") {
		document.getElementById("infectionProbabilityBox").style["grid-column"] = "1/3";
	}else if(!czechia && selectedstate != "czechia") {
		document.getElementById("infectionProbabilityBox").style.gridColumn = "";
	}
}

function scaleSmallBox4(w) {
	let selectedstate = document.getElementById("stateSelect").value;
	let czechia = selectedstate == "czechia" || urlSelectedCountry == "czechia";
	if(w.matches) {
		document.getElementById("infectionProbabilityBox").style["grid-column"] = "";
	}else if(!czechia && selectedstate != "czechia") {
		document.getElementById("infectionProbabilityBox").style.gridColumn = "";
	}
}
function movePageControls(quer){
	let indiv;
	if(quer.matches){
		indiv = document.getElementById("navBarInfoDiv");
	}else{
		indiv = document.getElementById("navBar").children[0];
	}
	indiv.appendChild(document.getElementById("databasePick"));
	indiv.appendChild(document.getElementById("stateSelect"));
}
var x = window.matchMedia("(max-width:1655px), (min-width:2075px)");
var match2 = window.matchMedia("(min-width:1235px) and (max-width:1655px)");
var match3 = window.matchMedia("(min-width:840px) and (max-width:1235px)");
var match4 = window.matchMedia("(max-width:840px)");
var pagecontrolsQuery = window.matchMedia("(max-width:410px)");
x.addListener(scaleSmallBox);
match2.addListener(scaleSmallBox2);
match3.addListener(scaleSmallBox3);
match4.addListener(scaleSmallBox4);
pagecontrolsQuery.addListener(movePageControls);
movePageControls(pagecontrolsQuery);

var lastPredictionConfigShCountryName;
function loadPredictionConfigIntoHTML() {
	lastPredictionConfigShCountryName = document.getElementById("stateSelect").value;
	document.getElementById("predictionChartDiv").innerHTML = "";
	document.getElementById("predictionFunctionName").value = predictionConfig.functionName;
	document.getElementById("mTimesPway").value = predictionConfig.growthFactor;
	document.getElementById("infectionPeriod").value = predictionConfig.infectionPeriod;
	document.getElementById("averageMeetPerDay").value = predictionConfig.averageMeetPerDay;
	document.getElementById("infectionProbability").value = predictionConfig.infectionProbability;
	document.getElementById("continuous_endLast").checked = !predictionConfig.continuous_endCustom;
	document.getElementById("continuous_endCustom").checked = predictionConfig.continuous_endCustom;
	document.getElementById("continuous_endCustomVars").checked = predictionConfig.continuous_endVar;
	if(predictionConfig.growthFactorDataUntilDate == -1) {
		document.getElementById("continuous_limitData").checked = false;
	}else if(predictionConfig.growthFactorDataUntilDate < -1) {
		document.getElementById("continuous_limitData").checked = true;
		document.getElementById("growthFactorDateLimit").value = new Date(new Date().setDate(new Date().getDate() + (predictionConfig.growthFactorDataUntilDate + 1))).toISOString().substr(0, 10);
	}else{
		document.getElementById("continuous_limitData").checked = true;
		document.getElementById("growthFactorDateLimit").value = predictionConfig.growthFactorDataUntilDate.toISOString().substr(0, 10);
	}
	predictionConfigDateLimitCbChange();
	document.getElementById("valueAfterDataFromGrowthChart").value = predictionConfig.continuos_endCustom_val;
	document.getElementById("populationSize").value = predictionConfig.populationSize;
	document.getElementById("plotPredictionToDataChart").checked = predictionConfig.plotPredictionToDataChart;
	document.getElementById("plotPredictionToDataChartAddDays").value = predictionConfig.plotPredictionToDataChartAddDays;
	dynamicInputAdjust();
	predictionConfigMtimesPwayChange();
	predictionConfigValAtEndChange(false);
	plotPredictionToDataChartCbChange();
}

function saveHTMLtoPredictionConfig() {
	predictionConfig.functionName = document.getElementById("predictionFunctionName").value;
	predictionConfig.growthFactor = document.getElementById("mTimesPway").value;
	predictionConfig.infectionPeriod = document.getElementById("infectionPeriod").value;
	predictionConfig.averageMeetPerDay = document.getElementById("averageMeetPerDay").value;
	predictionConfig.infectionProbability = document.getElementById("infectionProbability").value;
	predictionConfig.continuous_endCustom = document.getElementById("continuous_endCustom").checked;
	predictionConfig.continuos_endCustom_val = document.getElementById("valueAfterDataFromGrowthChart").value;
	if(document.getElementById("continuous_limitData").checked) {
		predictionConfig.growthFactorDataUntilDate = new Date(document.getElementById("growthFactorDateLimit").value);
	}else{
		predictionConfig.growthFactorDataUntilDate = -1;
	}
	if (document.getElementById("stateSelect").value == lastPredictionConfigShCountryName){
		predictionConfig.populationSize = document.getElementById("populationSize").value;
	}
	lastPredictionConfigShCountryName
	predictionConfig.plotPredictionToDataChart = document.getElementById("plotPredictionToDataChart").checked;
	predictionConfig.plotPredictionToDataChartAddDays = document.getElementById("plotPredictionToDataChartAddDays").value;
}
var predictionConfigShowed = false;
function predictionConfigSH(calculate) {
	if(predictionConfigShowed == false) {
		predictionConfigShowed = true;
		document.getElementById("settingsApplyButton").src = "/images/apply.svg";
		let fghjkl = document.getElementsByClassName("showedInPredictionConfig");
		for(i = 0; i < fghjkl.length; i += 1) {
			fghjkl[i].style.display = "initial";
		}
		document.getElementById("predictionConfig").style.display = "initial";
		loadPredictionConfigIntoHTML();
		document.getElementById('config-input').addEventListener('change', loadPredictionConfigFile, false);
	}else{
		predictionConfigShowed = false;
		document.getElementById("settingsApplyButton").src = "/images/settings.svg";
		let fghjkl = document.getElementsByClassName("showedInPredictionConfig");
		for(i = 0; i < fghjkl.length; i += 1) {
			fghjkl[i].style.display = "none";
		}
		saveHTMLtoPredictionConfig();
		document.getElementById("predictionChartDiv").innerHTML = predictionChartHtml;
		document.getElementById("predictionConfig").style.display = "none";
		if(calculate) {
			getDataCalculatePredictionAndPlot();
		}
	}
}

function savePredictionConfigFile() {
	saveHTMLtoPredictionConfig();
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(predictionConfig)));
	pom.setAttribute('download', "koronagrafy-prediction-config.json");
	if(document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	}else{
		pom.click();
	}
}

function loadPredictionConfigFile(evt) {
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
		var file = evt.target.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function() {
			try {
				predictionConfig = JSON.parse(reader.result);
			} catch (err) {
				alert(strings.errorReadingFile + err.message);
			}
		};
	}else{
		alert(strings.fileApiNotSupported);
	}
	loadPredictionConfigIntoHTML();
}

function resetPredictionConfigToDefault() {
	if(confirm('Opravdu chcete obnovit výchozí hodnoty konfigurace?')) {
		predictionConfig = JSON.parse(JSON.stringify(predictionConfigCzechDefaults));
		predictionConfig.startDate = new Date(predictionConfig.startDate);
		loadPredictionConfigIntoHTML();
	}
}

function predictionConfigMtimesPwayChange() {
	if(document.getElementById("mTimesPway").value == "customFixed") {
		document.getElementById("customFixedValueConfig").style.display = "initial";
		document.getElementById("label_averageMeetPerDay").style.display = "initial";
		document.getElementById("label_infectionProbability").style.display = "initial";
		document.getElementById("continuousFromExistingDataConfig").style.display = "none";
	}else if(document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "continuousFromExistingData") {
		document.getElementById("continuousFromExistingDataConfig").style.display = "initial";
		document.getElementById("customFixedValueConfig").style.display = "initial";
		document.getElementById("label_averageMeetPerDay").style.display = "none";
		document.getElementById("label_infectionProbability").style.display = "initial";
	}else if(document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "fixedFromCurrentValue") {
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

function predictionConfigFunctionNameChange() {
	if(document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "continuousFromExistingData") {
		document.getElementById("customFixedValueConfig").style.display = "initial";
		document.getElementById("label_averageMeetPerDay").style.display = "none";
		document.getElementById("label_infectionProbability").style.display = "initial";
	}else if(document.getElementById("predictionFunctionName").value == "henryProbabilistic" && document.getElementById("mTimesPway").value == "fixedFromCurrentValue") {
		document.getElementById("continuousFromExistingDataConfig").style.display = "none";
		document.getElementById("customFixedValueConfig").style.display = "initial";
		document.getElementById("label_averageMeetPerDay").style.display = "none";
		document.getElementById("label_infectionProbability").style.display = "initial";
	}else{
		document.getElementById("label_averageMeetPerDay").style.display = "none";
		document.getElementById("label_infectionProbability").style.display = "none";
	}
}

function plotPredictionToDataChartCbChange() {
	if(document.getElementById("plotPredictionToDataChart").checked) {
		document.getElementById("plotPredictionToDataChartAddDays").disabled = false;
		document.getElementById("label_plotPredictionToDataChartAddDays").style.color = "#444";
	}else{
		document.getElementById("plotPredictionToDataChartAddDays").disabled = true;
		document.getElementById("label_plotPredictionToDataChartAddDays").style.color = "grey";
	}
}

function predictionConfigValAtEndChange(promptT) {
	if(document.getElementById("continuous_endCustom").checked) {
		document.getElementById("valueAfterDataFromGrowthChart").disabled = false;
		document.getElementById("label_continuous_endLast").style.color = "grey";
		predictionConfig.continuous_endVar = false;
	}else if(document.getElementById("continuous_endLast").checked) {
		document.getElementById("valueAfterDataFromGrowthChart").disabled = true;
		document.getElementById("label_continuous_endLast").style.color = "#444";
		predictionConfig.continuous_endVar = false;
	}else{
		if(promptT) {
			predictionConfig.continuous_endVar = true;
			let specifiedEndVars = prompt(strings.endVarsPrompt, predictionConfig.continuous_endVarValues);
			try {
				let output = parseEndVarValues(specifiedEndVars);
				if(output.length > 0 && !output.includes(NaN)) {
					predictionConfig.continuous_endVarValues = specifiedEndVars;
				}else{
					alert(strings.endVarsBadFormat + " " + strings.tryItAgaing);
					predictionConfigValAtEndChange();
				}
			} catch (err) {
				if(err.message != "varValues is null") {
					alert(strings.endVarsBadFormat + err.message);
				}
			}
		}
	}
}

function predictionConfigDateLimitCbChange() {
	if(document.getElementById("continuous_limitData").checked) {
		document.getElementById("growthFactorDateLimit").disabled = false;
	}else{
		document.getElementById("growthFactorDateLimit").disabled = true;
	}
}

function infectionPeriodGrowthFactorChange() {
	predictionConfig.infectionPeriod = parseInt(document.getElementById("infectionPeriod").value, 10);
	if(growthFactorCalcConfig.days != "all") {
		calculateSpreadGrowthFactorAndPlot("77%");
	}
	myTodayInfectedProbability();
}

function dynamicInputAdjust() {
	let inputBoxes = document.getElementsByClassName("dynamicInput");
	for(i = 0; i < inputBoxes.length; i += 1) {
		inputBoxes[i].style.width = ((inputBoxes[i].value.length + 1) * 8) + 36 + 'px';
	}
}
var predictionChart;

function getDataCalculatePredictionAndPlot() {
	if(predictionConfigShowed) {
		predictionConfigSH(false);
	}
	result = calculatePredictions();
	labels = [];
	let predDataset = [];
	//round the results
	result.infectedPeopleInDay.forEach(function(entry) {
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
				lineTension: 0,
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
	datasets.prediction = predDataset;
	loadDataChart();
}

function growthFactorConfigChange() {
	if(document.getElementById("dataChart_whole").checked) {
		document.getElementById("label_daysToCalculateGrowthFactorOver").style.color = "grey";
		document.getElementById("daysToCalculateGrowthFactorOver").disabled = true;
		growthFactorCalcConfig.days = "all";
	}else{
		document.getElementById("label_daysToCalculateGrowthFactorOver").style.color = "#444";
		document.getElementById("daysToCalculateGrowthFactorOver").disabled = false;
		growthFactorCalcConfig.days = document.getElementById("daysToCalculateGrowthFactorOver").value;
	}
	calculateSpreadGrowthFactorAndPlot("50%");
	getDataCalculatePredictionAndPlot();
}
var growthFactorConfigShowed = false;

function growthFactorConfigSH() {
	if(growthFactorConfigShowed) {
		calculateSpreadGrowthFactorAndPlot("77%");
		document.getElementById("growthFactorChartConfig").style.display = "none";
		document.getElementById("growthFactorChartInfo").style.display = "initial";
	}else{
		document.getElementById("growthFactorChartConfig").style.display = "initial";
		document.getElementById("growthFactorChartInfo").style.display = "none";
		if(growthFactorCalcConfig.days == "all") {
			document.getElementById("dataChart_whole").checked = true;
		}else{
			document.getElementById("chartConfig_between").checked = true;
			document.getElementById("daysToCalculateGrowthFactorOver").value = growthFactorCalcConfig.days;
		}
		calculateSpreadGrowthFactorAndPlot("50%");
	}
	growthFactorConfigShowed = !growthFactorConfigShowed;
}

function calculateSpreadGrowthFactor(dataset) {
	datasets.spreadGrowthFactor = [];
	days = parseInt(growthFactorCalcConfig.days, 10);
	if(growthFactorCalcConfig.perDay) {
		if(growthFactorCalcConfig.days == "all") {
			for(i = 1; i < dataset.length; i += 1) {
				let result = calculateInfectionDefaultProbability(i, dataset[i].y, false);
				let date = new Date(dataset[i - 1].x);
				date.setHours(12, 0, 0, 0);
				datasets.spreadGrowthFactor.push({
					x: date.toISOString(),
					y: result
				});
			}
		}else{
			for(i = 0; i < dataset.length - days; i += 1) {
				let upperSide = dataset[i + days].y - dataset[i].y;
				let bottomSidePart1 = 0;
				let bottomSidePart2 = 0;
				for(j = 0; j < days; j += 1) {
					bottomSidePart1 += parseInt(dataset[i + j].y, 10);
					let indexOfMyPoop = i - predictionConfig.infectionPeriod + j;
					if(indexOfMyPoop >= 0) {
						bottomSidePart2 += parseInt(dataset[indexOfMyPoop].y, 10);
					}
				}
				let bottomSide = bottomSidePart1 - bottomSidePart2;
				let result;
				if(bottomSide == 0) {
					result = 0;
				}else{
					result = upperSide / bottomSide;
				}
				if(result == 0) {
					if(bottomSidePart1 != 0) {
						for(c = i; c < dataset.length; c += 1) {
							if(dataset[c].y != dataset[i]) {
								result = upperSide / bottomSidePart1;
								break;
							}
						}
					}else{
						result = 0;
					}
				}
				let date = new Date(dataset[i].x);
				date.setHours(12, 0, 0, 0);
				datasets.spreadGrowthFactor.push({
					x: date.toISOString(),
					y: result
				});
			}
		}
	}
}
var importsChartHtml = "<canvas class=\"chartjs\" id=\"importschart\"></canvas>";
var importschart;

function loadImportsChart(changed) {
	let firstRecordDate = moment(czechCovidDbArr.imports[1][1]);
	let latestRecordDate = moment(czechCovidDbArr.imports[czechCovidDbArr.imports.length - 1][1]);
	let dateDiff = latestRecordDate.diff(firstRecordDate, 'days');
	let slider = document.getElementById("importsSlider");
	let dateThing = document.getElementById("importsDate");
	let statesToShow = document.getElementById("numberOfStatesToShow");
	if(slider.max != dateDiff) {
		slider.max = dateDiff;
		slider.value = dateDiff;
	}
	let selectedDate;
	if(changed != 1) {
		selectedDate = moment(firstRecordDate);
		selectedDate.add(parseInt(slider.value, 10), "days");
		dateThing.value = selectedDate.toISOString().substr(0, 10);
	}else{
		selectedDate = moment(dateThing.value);
		dateDiff = selectedDate.diff(firstRecordDate, 'days');
		slider.value = dateDiff;
	}
	let numberOfStates = parseInt(statesToShow.value, 10);
	let statesNames = czechCovidDbArr.imports[0].slice(3, 3 + numberOfStates);
	if(numberOfStates < 8) {
		for(i = 0; i < statesNames.length; i += 1) {
			let currName = statesNames[i];
			if(strings.countryNames.hasOwnProperty(currName)) {
				statesNames[i] = strings.countryNames[currName];
			}
		}
	}
	statesToShow.max = czechCovidDbArr.imports[0].slice(3).length;
	let targetIndex = parseInt(slider.value, 10) - 1;
	let stateValues = czechCovidDbArr.imports[targetIndex].slice(3, 3 + numberOfStates);
	for(i = 0; i < stateValues.length; i += 1) {
		stateValues[i] = parseInt(stateValues[i], 10);
	}
	let chartData = {
		labels: statesNames,
		datasets: [{
			backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(255, 206, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 99, 132, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(255, 206, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)'],
			borderColor: "#f84f4a",
			borderWidth: 2,
			data: stateValues
		}]
	};
	if(importschart == undefined) {
		document.getElementById("importsChartDiv").innerHTML = "";
		document.getElementById("importsChartDiv").innerHTML = importsChartHtml;
		var ctx = document.getElementById("importschart");
		importschart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				legend: {
					display: false
				},
				responsive: true,
				maintainAspectRatio: false,
			}
		});
	}else{
		importschart.data = chartData;
		importschart.update(0);
	}
}
let ageGroupsHtml = "<canvas class=\"chartjs\" id=\"agegroupschart\"></canvas>";
var agegroupschart;

function loadAgegroupsChart(changed) {
	let firstRecordDate = moment(czechCovidDbArr.ageGroups[1][1]);
	let latestRecordDate = moment(czechCovidDbArr.ageGroups[czechCovidDbArr.ageGroups.length - 1][1]);
	let dateDiff = latestRecordDate.diff(firstRecordDate, 'days');
	let slider = document.getElementById("agegroupsSlider");
	let dateThing = document.getElementById("agegroupsDate");
	if(slider.max != dateDiff) {
		slider.max = dateDiff;
		slider.value = dateDiff;
	}
	let selectedDate;
	if(changed != 1) {
		selectedDate = moment(firstRecordDate);
		selectedDate.add(parseInt(slider.value, 10), "days");
		dateThing.value = selectedDate.toISOString().substr(0, 10);
	}else{
		selectedDate = moment(dateThing.value);
		dateDiff = selectedDate.diff(firstRecordDate, 'days');
		slider.value = dateDiff;
	}
	let statesNames = czechCovidDbArr.ageGroups[0].slice(3);
	let targetIndex = parseInt(slider.value, 10);
	let stateValues = czechCovidDbArr.ageGroups[targetIndex].slice(3);
	for(i = 0; i < stateValues.length; i += 1) {
		stateValues[i] = parseInt(stateValues[i], 10);
	}
	let chartData = {
		labels: statesNames,
		datasets: [{
			backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(255, 206, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)', ],
			borderColor: "#f84f4a",
			borderWidth: 2,
			data: stateValues
		}]
	};
	if(agegroupschart == undefined) {
		document.getElementById("agegroupsChartDiv").innerHTML = "";
		document.getElementById("agegroupsChartDiv").innerHTML = ageGroupsHtml;
		let ctx = document.getElementById("agegroupschart");
		agegroupschart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				legend: {
					display: false
				},
				responsive: true,
				maintainAspectRatio: false,
			}
		});
	}else{
		agegroupschart.data = chartData;
		agegroupschart.update(0);
	}
}
var lastHeight = 0;
var infectionGrowthFactorChart;
var growthFactorChartHtml = "<canvas class=\"chartjs\" id=\"infectionGrowthFactorChart\"></canvas>";

function calculateSpreadGrowthFactorAndPlot(height) {
	calculateSpreadGrowthFactor(datasets.confirmedMaxInDay);
	if(infectionGrowthFactorChart == undefined || height.localeCompare(lastHeight) != 0) {
		document.getElementById("growthFactorChartDiv").innerHTML = "";
		document.getElementById("growthFactorChartDiv").innerHTML = growthFactorChartHtml;
		document.getElementById("infectionGrowthFactorChart").style.height = height;
		var ctx = document.getElementById("infectionGrowthFactorChart");
		infectionGrowthFactorChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [{
					data: datasets.spreadGrowthFactor,
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
		document.getElementById("infectionGrowthFactorChart").onclick = function(evt) {
			var activePoints = infectionGrowthFactorChart.getElementsAtEventForMode(evt, 'point', infectionGrowthFactorChart.options);
			if(activePoints.length > 0 && predictionConfigShowed && document.getElementById("mTimesPway").value == "continuousFromExistingData" && document.getElementById("continuous_limitData").checked) {
				var firstPointIndex = activePoints[0]._index;
				let dateOfClickedPoint = new Date(datasets.spreadGrowthFactor[firstPointIndex].x);
				document.getElementById("growthFactorDateLimit").value = dateOfClickedPoint.toISOString().substr(0, 10);
			}
		};
		lastHeight = height;
	}else{
		infectionGrowthFactorChart.data.datasets[0].data = datasets.spreadGrowthFactor;
		infectionGrowthFactorChart.update();
	}
}

function calculatePredictions() {
	let returnObject = {
		infectedPeopleInDay: []
	};
	let lastResult = predictionConfig.startValue;
	let date = new Date(predictionConfig.startDate);
	let day = 0;
	let indexOfStartSpreadGrowthFactor = -1;
	if(predictionConfig.growthFactor == "continuousFromExistingData") {
		for(i = 0; i < datasets.spreadGrowthFactor.length; i += 1) {
			let anotherDate = new Date(datasets.spreadGrowthFactor[i].x);
			if(anotherDate.getDate() == date.getDate()) {
				indexOfStartSpreadGrowthFactor = i;
				break;
			}
		}
		if(indexOfStartSpreadGrowthFactor == -1) {
			if(datasets.spreadGrowthFactor.length == 0) {
				alert(strings.datasetError);
			}
			let minDateSpreadGrowthKnows = new Date(datasets.spreadGrowthFactor[0].x);
			let minDateConfirmedValue = null;
			for(i = 0; i < datasets.confirmedMaxInDay.length; i += 1) {
				let currvitDate = new Date(datasets.confirmedMaxInDay[i].x);
				if(minDateSpreadGrowthKnows.getDate() == currvitDate.getDate()) {
					minDateConfirmedValue = datasets.confirmedMaxInDay[i].y;
					break;
				}
			}
			if(minDateConfirmedValue == null) {
				alert(strings.idiotError);
			}else{
				indexOfStartSpreadGrowthFactor = 0;
				lastResult = minDateConfirmedValue;
				date = new Date(minDateSpreadGrowthKnows);
			}
		}
	}
	returnObject.infectedPeopleInDay.push({
		x: date.toISOString(),
		y: lastResult
	});
	day += 1;
	date.setDate(date.getDate() + 1);
	let lastMTimesP = 0;
	let resultBeforeInfectionPeriod = 0;
	let populationSize = parseInt(predictionConfig.populationSize, 10);
	let growthFactorUntilDate;
	if(predictionConfig.growthFactorDataUntilDate < 0) {
		growthFactorUntilDate = new Date(datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length + predictionConfig.growthFactorDataUntilDate].x);
	}else{
		growthFactorUntilDate = new Date(predictionConfig.growthFactorDataUntilDate);
	}
	growthFactorUntilDate.setHours(0, 0, 0, 0);
	let endVarsIndex = 0;
	let endVars;
	if(predictionConfig.continuous_endVar == true) {
		endVars = parseEndVarValues(predictionConfig.continuous_endVarValues);
	}
	while(lastResult <= populationSize && Math.round(lastResult) != Math.round(resultBeforeInfectionPeriod)) {
		if(day - predictionConfig.infectionPeriod - 1 >= 0) {
			resultBeforeInfectionPeriod = returnObject.infectedPeopleInDay[day - predictionConfig.infectionPeriod - 1].y;
		}else{
			resultBeforeInfectionPeriod = 0;
		}
		let MtimesP;
		if(predictionConfig.growthFactor == "continuousFromExistingData") {
			let indexOfSGF = indexOfStartSpreadGrowthFactor + day - 1;
			if(indexOfSGF < datasets.spreadGrowthFactor.length) {
				let dateOfPotentialIndex = new Date(datasets.spreadGrowthFactor[indexOfSGF].x);
				dateOfPotentialIndex.setHours(0, 0, 0, 0);
				if(dateOfPotentialIndex.getTime() <= growthFactorUntilDate.getTime()) {
					MtimesP = datasets.spreadGrowthFactor[indexOfSGF].y;
					lastMTimesP = MtimesP;
				}else{
					MtimesP = lastMTimesP;
				}
				if(indexOfSGF > 0) {
					if(lastResult - resultBeforeInfectionPeriod == 0 && datasets.spreadGrowthFactor[indexOfSGF - 1].y == 0) {
						for(i = indexOfStartSpreadGrowthFactor + day; i < datasets.spreadGrowthFactor.length; i += 1) {
							if(datasets.spreadGrowthFactor[i].y != 0) {
								resultBeforeInfectionPeriod = 0;
								break;
							}
						}
					}
				}
			}else{
				if(predictionConfig.continuous_endCustom && date.getTime() > growthFactorUntilDate.getTime()) {
					MtimesP = predictionConfig.continuos_endCustom_val;
				}else if(predictionConfig.continuous_endVar == true) {
					if(endVarsIndex < endVars.length) {
						let endVarFromList = endVars[endVarsIndex];
						if(endVarFromList == -1) {
							MtimesP = lastMTimesP;
						}else{
							MtimesP = endVarFromList;
							lastMTimesP = MtimesP;
						}
						endVarsIndex += 1;
					}else{
						MtimesP = lastMTimesP;
					}
				}else{
					MtimesP = lastMTimesP;
				}
			}
		}else if(predictionConfig.growthFactor == "customFixed") {
			MtimesP = predictionConfig.averageMeetPerDay * predictionConfig.infectionProbability * 0.01;
		}else if(predictionConfig.growthFactor == "fixedFromCurrentValue") {
			MtimesP = predictionConfigCzechDefaults.averageMeetPerDay * predictionConfigCzechDefaults.infectionProbability * 0.01;
		}
		let result;
		if(predictionConfig.functionName == "henry1") {
			result = lastResult + MtimesP * (1 - (lastResult / populationSize)) * (lastResult - resultBeforeInfectionPeriod);
		}else if(predictionConfig.functionName == "henryProbabilistic") {
			let probabilisticProbability = predictionConfig.infectionProbability * 0.01;
			let meetInThisDay = MtimesP / probabilisticProbability;
			result = populationSize * (1 - (1 - lastResult / populationSize) * Math.pow((1 - probabilisticProbability * (lastResult - resultBeforeInfectionPeriod) / populationSize), meetInThisDay));
		}
		if(result <= populationSize) {
			returnObject.infectedPeopleInDay.push({
				x: date.toISOString(),
				y: result
			});
		}else{
			returnObject.infectedPeopleInDay.push({
				x: date.toISOString(),
				y: populationSize
			});
		}
		day += 1;
		lastResult = result;
		date.setDate(date.getDate() + 1);
	}
	returnObject.pandemicPeriod = day;
	returnObject.pandemicEndDate = date;
	return returnObject;
}

function myTodayInfectedProbability() {
	let myMeetPerDay = document.getElementById("myMeetPerDay").value;
	let indexOfRBIP = datasets.confirmedMaxInDay.length - parseInt(predictionConfig.infectionPeriod.y, 10);
	let resultBeforeInfectionPeriod;
	if(indexOfRBIP >= 0) {
		resultBeforeInfectionPeriod = datasets.confirmedMaxInDay[indexOfRBIP];
	}else{
		resultBeforeInfectionPeriod = 0;
	}
	let probabilityIamInfected = 1 - Math.pow((1 - predictionConfig.infectionProbability * 0.01 * (datasets.confirmedMaxInDay[datasets.confirmedMaxInDay.length - 1].y - resultBeforeInfectionPeriod) / predictionConfig.populationSize), myMeetPerDay);
	document.getElementById("probabilityOfBeingInfectedToday").innerHTML = (probabilityIamInfected * 100).toString() + "%";
}
window.addEventListener('load', (event) => {
	let selectedC = document.getElementById("stateSelect").value;
	if((databaseName == "czech-covid-db" && selectedC != "" && selectedC != "czechia") || (urlSelectedCountry != null && databaseName == "czech-covid-db" && urlSelectedCountry != "czechia")) {
		document.getElementById("okresyBox").style.display = "initial";
	}
	scaleSmallBox(x);
	scaleSmallBox2(match2);
	scaleSmallBox3(match3);
	document.addEventListener('keyup', (e) => {
		if(e.code === "Enter") {
			predictionConfigSH(true);
		}
	});
});

function shareCurrentView() {
	let obj = {
		"databaseName": databaseName,
		"countryName": document.getElementById("stateSelect").value,
		"predictionConfig": JSON.stringify(predictionConfig),
		"growthFactorCalcConfig": JSON.stringify(growthFactorCalcConfig)
	};
	let paramsEncoded = new URLSearchParams(obj).toString();
	let url = location.protocol + '//' + location.host + location.pathname + "?" + paramsEncoded;
	prompt(strings.copyAndShareURL, url);
}
var urlSelectedCountry = null;
var search = location.search.substring(1);
let haveParams = false;
try {
	var urlSettings = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}');
	haveParams = true;
} catch (err) {}
if(haveParams) {
	if(urlSettings.hasOwnProperty("databaseName")) {
		databaseName = urlSettings.databaseName;
	}
	if(urlSettings.hasOwnProperty("countryName")) {
		urlSelectedCountry = urlSettings.countryName;
	}
	if(urlSettings.hasOwnProperty("predictionConfig")) {
		urlSettings.predictionConfig = JSON.parse(decodeURIComponent(urlSettings.predictionConfig));
		if(urlSettings.predictionConfig.growthFactorDataUntilDate > 0) {
			urlSettings.predictionConfig.growthFactorDataUntilDate = new Date(urlSettings.predictionConfig.growthFactorDataUntilDate);
		}
		predictionConfig = urlSettings.predictionConfig;
	}
	if(urlSettings.hasOwnProperty("growthFactorCalcConfig")) {
		urlSettings.growthFactorCalcConfig = JSON.parse(decodeURIComponent(urlSettings.growthFactorCalcConfig));
		growthFactorCalcConfig = urlSettings.growthFactorCalcConfig;
	}
}
loadCurrentData(databaseName);
