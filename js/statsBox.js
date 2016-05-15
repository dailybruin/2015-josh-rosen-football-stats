$(document).ready(function() {
	setStats(false, false);
});

function setStats(first, second, firstID, firstVal, secondVal) {
	var game = virginia;

	var completePasses = 0;
	var totalPasses = 0;
	var extraneous = 0;
	var passDistance = 0;
	var truePassDistance = 0;
	var receivers = [];
	var drops = 0;

	for (var i = 0, len = game.length; i < len; i++) {
		var pass = game[i];
		
		if (first == false && second == false) {
			if (pass['Pass No.'] != "") {
				completePasses += calculateCompletePasses(pass);
				totalPasses += 1;
			}
			extraneous += calculateExtraneousIncompletions(pass);
			passDistance += (pass['Yards'] - pass['YAC']);
			truePassDistance += calculateTPD(pass);
			drops += calculateDrops(pass);
			appendReceivers(pass,receivers);
		} else if (first == true && second == false) {
			if (pass[firstID] == firstVal) {
				if (pass['Pass No.'] != "") {
					completePasses += calculateCompletePasses(pass);
					totalPasses += 1;
				}
				extraneous += calculateExtraneousIncompletions(pass);
				passDistance += (pass['Yards'] - pass['YAC']);
				truePassDistance += calculateTPD(pass);
				drops += calculateDrops(pass);
				appendReceivers(pass,receivers);
			}
		} else if (first == false && second == true) {
			if (pass['Play type'] == secondVal) {
				if (pass['Pass No.'] != "") {
					completePasses += calculateCompletePasses(pass);
					totalPasses += 1;
				}
				extraneous += calculateExtraneousIncompletions(pass);
				passDistance += (pass['Yards'] - pass['YAC']);
				truePassDistance += calculateTPD(pass);
				drops += calculateDrops(pass);
				appendReceivers(pass,receivers);
			}
		} else {
			if (pass['Play type'] == secondVal && pass[firstID] == firstVal) {
				if (pass['Pass No.'] != "") {
					completePasses += calculateCompletePasses(pass);
					totalPasses += 1;
				}
				extraneous += calculateExtraneousIncompletions(pass);
				passDistance += (pass['Yards'] - pass['YAC']);
				truePassDistance += calculateTPD(pass);
				drops += calculateDrops(pass);
				appendReceivers(pass,receivers);
			}
		}
	}

	// Completed Passes & Total Passes
	var passPercentage = Math.round(completePasses/totalPasses * 100);
	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;

	// Extraneous Incompletions
	document.getElementById('extrIncomplete').innerHTML=extraneous;

	// Average Pass Distance
	var avgPassDistance = Math.round(passDistance/totalPasses);
	document.getElementById('pDistance').innerHTML=avgPassDistance;

	// True Pass Distance
	var tpassDistance = Math.round(truePassDistance/totalPasses);
	document.getElementById('tpDistance').innerHTML=tpassDistance;

	// Adjusted Completion Percentage
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous - drops) * 100);
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	console.log(completePasses + " " + drops + " " + totalPasses + " " + extraneous);
	
	// Receivers
	var frequency = {};
	var max = 0;
	var result;
	var maxReceivers = [];
	for (var v in receivers) {
		frequency[receivers[v]]=(frequency[receivers[v]] || 0)+1;
		if (frequency[receivers[v]] > max) {
			max = frequency[receivers[v]];
		}
	}
	for (var v in frequency) {
		if (frequency[v] === max) {
			maxReceivers.push(v);
		}
	}
	var maxReceiversString = "";
	for (var v = 0; v < maxReceivers.length-1; v++) {
		maxReceiversString += maxReceivers[v];
		maxReceiversString += ", "
	}
	maxReceiversString += maxReceivers[maxReceivers.length-1];

	document.getElementById('receiver').innerHTML=maxReceiversString;

}

$('#quarterDownFilter').change(function() {
	getStatus();
});

$('#playTypeFilter').change(function() {
	getStatus();
});

function getStatus() {
	var qDFilter = $("#quarterDownFilter");
	var qDSelectedId = qDFilter.find(":selected")[0].id;
	var qDSelectedVal = qDFilter.find(":selected").val();
	var DownFilter = (qDSelectedId.substring(0,4) == "down");
	var pTFilter = $("#playTypeFilter");
	var pTSelectedVal = pTFilter.find(":selected").val();

	var first = false;
	var second = false;
	var firstID = "";

	if (qDSelectedVal !== "" && qDSelectedVal !== "all")
		first = true;
	if (pTSelectedVal !== "" && pTSelectedVal !== "all")
		second = true;

	if (DownFilter) 
		firstID = "Down";
	else
		firstID = "Qtr.";

	setStats(first, second, firstID, qDSelectedVal, pTSelectedVal);
}

function calculateCompletePasses(pass) {
	if (pass['Result of pass'] == 'Complete')
		return 1;
	else
		return 0;
}

function calculateExtraneousIncompletions(pass) {
	if (pass['Extraneous Incompletions'] != 0) 
		return 1;
	else 
		return 0;
}

function calculateTPD(pass) {
	return Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
}

function calculateDrops(pass) {
	if (pass['Extraneous Incompletions'] == 'Drop')
		return 1;
	else
		return 0;
}

function appendReceivers(pass, receivers) {
	if (pass['Receiver'] != 0)
		receivers.push(pass['Receiver']);
}







