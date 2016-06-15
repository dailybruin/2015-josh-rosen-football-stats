$(document).ready(function() {
	initializeGame();
});

function initializeGame() {
	var game = virginia;

	var completePasses = 0;
	var totalPasses = 0;
	var extraneous = 0;
	var passDistance = 0;
	var truePassDistance = 0;
	var receivers = [];
	var drops = 0;
	var PAPass = 0;
	var standardPass = 0;
	var offPassDis = 0; 

	for (var i = 0, len = game.length; i < len; i++) {
		var pass = game[i];
		
		if (pass.hasOwnProperty('Result of pass')) {
			if (pass['Result of pass'] == 'Complete') {
				completePasses += 1;
				totalPasses += 1;
			} else if (pass['Result of pass'] == 'Incomplete') {
				totalPasses += 1;
			}
		}

		if (pass.hasOwnProperty('Extraneous Incompletions')) {
			if (pass['Extraneous Incompletions'] != 0) {
				if (pass['Extraneous Incompletions'] === 'Drop')
					drops += 1;
				else 
					extraneous += 1;
			}
		}

		if (pass.hasOwnProperty('Play type')) {
			if (pass['Play type'] == 'Pass') 
				standardPass += 1;
			else if (pass['Play type'] == 'PA Pass')
				PAPass += 1;
		}

		if (pass.hasOwnProperty('Pass X') && pass.hasOwnProperty('Pass Y') && pass.hasOwnProperty('Receive X') && pass.hasOwnProperty('Receive Y')) {
			truePassDistance += Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
		}

		if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
			passDistance += (pass['Yards'] - pass['YAC'])
		}

		if (pass.hasOwnProperty('Yards')) {
			offPassDis += pass['Yards'];
		}

		if (pass.hasOwnProperty('Receiver')) {
			if (pass['Receiver'] != 0) {
				receivers.push(pass['Receiver']);
			}
		}
	}

	var passPercentage = Math.round(completePasses/totalPasses * 100);
	var pDistance = Math.round(truePassDistance/totalPasses);
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous) * 100);
	var avgTPassDistance = Math.round(passDistance/totalPasses);
	var avgOffPassDist = Math.round(offPassDis/totalPasses);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;

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
	maxReceiversString += (" (" + max + ")");

	document.getElementById('receiver').innerHTML=maxReceiversString;

}

$('#quarterDownFilter').change(function() {
	filterStatsBox();
});

$('#playTypeFilter').change(function() {
	filterStatsBox();
});

$('#gameFilter').change(function() {
	filterStatsBox();
});

function filterStatsBox() {
	var qDFilter = $("#quarterDownFilter");
	var qDSelectedId = qDFilter.find(":selected")[0].id;
	var qDSelectedVal = qDFilter.find(":selected").val();
	var filtersDown = (qDSelectedId.substring(0,4) == "down");	//check if filters quarter or down
	var qPFilter = $("#playTypeFilter");
	var qPSelectedId = qPFilter.find(":selected")[0].id;
	var filterByPlay = (qPSelectedId !== "" && qPSelectedId !== "playTypeAll");
	var gFilter = $("#gameFilter");
	var gSelectedFilter = gFilter.find(":selected")[0].id;
	var filterByGame = (gSelectedFilter !== "");

	if (qDSelectedVal !== "" && qDSelectedVal !== "all" && (qPSelectedId == "playTypeAll" || qPSelectedId == "") && (gSelectedFilter == "" || gSelectedFilter == "Virginia")) {
		if (filterByGame) { // filter by game
			if (!filtersDown) { // filter by quarter
				if (filterByPlay) //filter by play
					filterByQuarter(qDSelectedVal, qPSelectedId, gSelectedFilter);
				else // filter by game + quarter
					filterByQuarter(qDSelectedVal, null, gSelectedFilter);
			} else { // filter by down
				if (filterByPlay) 
					filterByDown(qDSelectedVal, qPSelectedId, gSelectedFilter);
				else // filter by game + down
					filterByDown(qDSelectedVal, null, gSelectedFilter);
			}
		} else { // don't filter by game
			if (!filtersDown) { // filter by quarter
				if (filterByPlay) // filter by play
					filterByQuarter(qDSelectedVal, qPSelectedId, null);
				else // filter by quarter only
					filterByQuarter(qDSelectedVal, null, null);
			} else { // filter by down
				console.log("filter");
				if (filterByPlay) // filter by down + play
					filterByDown(qDSelectedVal, qPSelectedId, null);
				else // filter by down
					filterByDown(qDSelectedVal, null, null);
			}
		}
	} else {
		initializeGame();
	}
}

// value is the quarter number
function filterByQuarter(value, playValue, gameValue) {
	var game = "";
	if (gameValue == "Virginia")
		game = virginia;
	else if (gameValue == "Arizona")
		game = arizona;

	console.log("THE GAME IS " + game);

	var completePasses = 0;
	var totalPasses = 0;
	var extraneous = 0;
	var passDistance = 0;
	var truePassDistance = 0;
	var receivers = [];
	var drops = 0;
	var PAPass = 0;
	var standardPass = 0;
	var offPassDis = 0; 

	if (playValue == null) {
		for (var i = 0; i < game.length; i++) {
			var pass = game[i];
			if (pass['Qtr.'] == value) {
				if (pass['Result of pass'] == 'Complete') {
					completePasses += 1;
					totalPasses += 1;
				} else if (pass['Result of pass'] == 'Incomplete') {
					totalPasses += 1;
				}

				if (pass.hasOwnProperty('Extraneous Incompletions')) {
					if (pass['Extraneous Incompletions'] != 0) {
						if (pass['Extraneous Incompletions'] === 'Drop')
							drops += 1;
						else 
							extraneous += 1;
					}
				}

				if (pass.hasOwnProperty('Play type')) {
					if (pass['Play type'] == 'Pass') 
						standardPass += 1;
					else if (pass['Play type'] == 'PA Pass')
						PAPass += 1;
				}

				if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
					passDistance += (pass['Yards'] - pass['YAC'])
				}

				if (pass.hasOwnProperty('Yards')) {
					offPassDis += pass['Yards'];
				}

				if (pass.hasOwnProperty('Pass X') && pass.hasOwnProperty('Pass Y') && pass.hasOwnProperty('Receive X') && pass.hasOwnProperty('Receive Y')) {
					truePassDistance += Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
				}

				if (pass.hasOwnProperty('Receiver')) {
					if (pass['Receiver'] != 0) {
						receivers.push(pass['Receiver']);
					}
				}
			}
		}
	} else {
		playName = "";
		if (playValue == "playType1")
			playName = "Pass";
		else if (playValue == "playType2")
			playName = "PA Pass";
		else 
			playName = "Screen pass";

		for (var i = 0; i < game.length; i++) {
			var pass = game[i];
			if (pass['Qtr.'] == value && pass['Play type'] == playName) {
				if (pass['Result of pass'] == 'Complete') {
					completePasses += 1;
					totalPasses += 1;
				} else if (pass['Result of pass'] == 'Incomplete') {
					totalPasses += 1;
				}

				if (pass.hasOwnProperty('Extraneous Incompletions')) {
					if (pass['Extraneous Incompletions'] != 0) {
						if (pass['Extraneous Incompletions'] === 'Drop')
							drops += 1;
						else 
							extraneous += 1;
					}
				}

				if (pass.hasOwnProperty('Play type')) {
					if (pass['Play type'] == 'Pass') 
						standardPass += 1;
					else if (pass['Play type'] == 'PA Pass')
						PAPass += 1;
				}

				if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
					passDistance += (pass['Yards'] - pass['YAC'])
				}

				if (pass.hasOwnProperty('Yards')) {
					offPassDis += pass['Yards'];
				}

				if (pass.hasOwnProperty('Pass X') && pass.hasOwnProperty('Pass Y') && pass.hasOwnProperty('Receive X') && pass.hasOwnProperty('Receive Y')) {
					truePassDistance += Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
				}

				if (pass.hasOwnProperty('Receiver')) {
					if (pass['Receiver'] != 0) {
						receivers.push(pass['Receiver']);
					}
				}
			}
		}
	}

	var passPercentage = Math.round(completePasses/totalPasses * 100);
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous) * 100);
	var pDistance = Math.round(truePassDistance/totalPasses);
	var avgTPassDistance = Math.round(passDistance/totalPasses);
	var avgOffPassDist = Math.round(offPassDis/totalPasses);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;

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
	maxReceiversString += (" (" + max + ")");

	document.getElementById('receiver').innerHTML=maxReceiversString;
}

function filterByDown(value, playValue, gameValue) {
	var game = "";
	if (gameValue == "Virginia")
		game = virginia;
	else if (gameValue == "Arizona")
		game = arizona;

	var completePasses = 0;
	var totalPasses = 0;
	var extraneous = 0;
	var passDistance = 0;
	var truePassDistance = 0;
	var receivers = [];
	var drops = 0;
	var PAPass = 0;
	var standardPass = 0;
	var offPassDis = 0; 

	if (playValue == null) {
		for (var i = 0; i < game.length; i++) {
			var pass = game[i];
			if (pass['Down'] == value) {
				if (pass['Result of pass'] == 'Complete') {
					completePasses += 1;
					totalPasses += 1;
				} else if (pass['Result of pass'] == 'Incomplete') {
					totalPasses += 1;
				}

				if (pass.hasOwnProperty('Extraneous Incompletions')) {
					if (pass['Extraneous Incompletions'] != 0) {
						if (pass['Extraneous Incompletions'] === 'Drop')
							drops += 1;
						else 
							extraneous += 1;
					}
				}

				if (pass.hasOwnProperty('Play type')) {
					if (pass['Play type'] == 'Pass') 
						standardPass += 1;
					else if (pass['Play type'] == 'PA Pass')
						PAPass += 1;
				}

				if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
					passDistance += (pass['Yards'] - pass['YAC'])
				}

				if (pass.hasOwnProperty('Yards')) {
					offPassDis += pass['Yards'];
				}

				if (pass.hasOwnProperty('Pass X') && pass.hasOwnProperty('Pass Y') && pass.hasOwnProperty('Receive X') && pass.hasOwnProperty('Receive Y')) {
					truePassDistance += Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
				}

				if (pass.hasOwnProperty('Receiver')) {
					if (pass['Receiver'] != 0) {
						receivers.push(pass['Receiver']);
					}
				}
			}
		}
	} else {
		playName = "";
		if (playValue == "playType1")
			playName = "Pass";
		else if (playValue == "playType2")
			playName = "PA Pass";
		else 
			playName = "Screen pass";

		for (var i = 0; i < game.length; i++) {
			var pass = game[i];
			if (pass['Down'] == value && pass['Play type'] == playName) {
				if (pass['Result of pass'] == 'Complete') {
					completePasses += 1;
					totalPasses += 1;
				} else if (pass['Result of pass'] == 'Incomplete') {
					totalPasses += 1;
				}

				if (pass.hasOwnProperty('Extraneous Incompletions')) {
					if (pass['Extraneous Incompletions'] != 0) {
						if (pass['Extraneous Incompletions'] === 'Drop')
							drops += 1;
						else 
							extraneous += 1;
					}
				}

				if (pass.hasOwnProperty('Play type')) {
					if (pass['Play type'] == 'Pass') 
						standardPass += 1;
					else if (pass['Play type'] == 'PA Pass')
						PAPass += 1;
				}

				if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
					passDistance += (pass['Yards'] - pass['YAC'])
				}

				if (pass.hasOwnProperty('Yards')) {
					offPassDis += pass['Yards'];
				}

				if (pass.hasOwnProperty('Pass X') && pass.hasOwnProperty('Pass Y') && pass.hasOwnProperty('Receive X') && pass.hasOwnProperty('Receive Y')) {
					truePassDistance += Math.sqrt((Math.pow(pass['Pass X'],2)+(Math.pow(pass['Receive X'],2))) + (Math.pow(pass['Pass Y'],2) + (Math.pow(pass['Receive Y'],2))));
				}

				if (pass.hasOwnProperty('Receiver')) {
					if (pass['Receiver'] != 0) {
						receivers.push(pass['Receiver']);
					}
				}
			}
		}
	}

	var passPercentage = Math.round(completePasses/totalPasses * 100);
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous) * 100);
	var pDistance = Math.round(truePassDistance/totalPasses);
	var avgTPassDistance = Math.round(passDistance/totalPasses);
	var avgOffPassDist = Math.round(offPassDis/totalPasses);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;

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
	maxReceiversString += (" (" + max + ")");

	document.getElementById('receiver').innerHTML=maxReceiversString;
}


























