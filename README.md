No longer actively maintained. I am too lazy to keep it working all the time. Sorry. Please use the official page - Onemocneni aktualne MZCR
# [koronagrafy](http://koronagrafy.techbrick.cz)
Mathematical prediction of COVID-19 pandemic's development. Fetching data from [czech-covid-db](https://github.com/kukosek/czech-covid-db) and Johns Hopkins University [COVID-19 repository](https://github.com/CSSEGISandData/COVID-19/). Everything is downloaded and calculated on the client side. This project has no server side, except the [program](https://github.com/kukosek/czech-covid-db-multiparser) that updates czech-covid-db.
### Getting currently displayed data from console
If you want the data in JSON format, open your browser's developer console and type one of these commands:
* tests: `console.log(JSON.stringify(datasets.tests, null, 1))`
* confirmed cases: `console.log(JSON.stringify(datasets.confirmed, null, 1))`
* recovered: `console.log(JSON.stringify(datasets.recovered, null, 1))`
* deaths: `console.log(JSON.stringify(datasets.deaths, null, 1))`
* growth factor: `console.log(JSON.stringify(datasets.spreadGrowthFactor, null, 1))`
* prediction: `console.log(JSON.stringify(datasets.prediction, null, 1))`
### Used libraries
* [Chart.js](https://github.com/chartjs/Chart.js) for visualisation
* [Moment.js](https://github.com/moment/moment) for easy date/time manipulation
* [PapaParse](https://github.com/mholt/PapaParse) for csv parsing (they say it's faster than string splitting, but idk)
* [NProgress](https://github.com/rstacruz/nprogress) for the loading bar at top

 ### Math behind the scenes
Explanation of the function is in about. Here is how the code for it works.
The prediction dataset is created in function `calculatePredictions()`. There are many lines in the function that provide the growth factor (`MtimesP`) it has to use and other things depending on user configuration. The essential parts are these:
* The loop. One iteration calculates a result for one day. `while(lastResult <= populationSize && Math.round(lastResult) != Math.round(resultBeforeInfectionPeriod) ){`  
In the loop, one of these calculations happen:
  * If selected function is Henry's logistic/first: `result = lastResult + MtimesP*(1-(lastResult/populationSize))*(lastResult-resultBeforeInfectionPeriod);`
  * If it is the other function (Henry's probabilistic), `MtimesP` is converted to `meetInThisDay`, then `result = populationSize*(1 - (1-lastResult/populationSize)*Math.pow((1- probabilisticProbability*(lastResult-resultBeforeInfectionPeriod)/populationSize),meetInThisDay));`
