$(document).ready(function() {
	initializeGame("Virginia");
});

function setGameVariable(gameValue) {
	var game;
	if (gameValue == "Virginia")
		game = virginia;
	else if (gameValue == "Arizona")
		game = arizona;
	return game;
}

function setPlayName(playValue) {
	var playName = "";
	if (playValue == "playType1")
		playName = "Pass";
	else if (playValue == "playType2")
		playName = "PA Pass";
	else 
		playName = "Screen pass";
	return playName;
}

function initializeGame(gameValue) {
	var game = setGameVariable(gameValue);

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
	var maxReceiversString = returnMaxReceiverString(receivers);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;
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
	var filtersQuarter = (qDSelectedId.substring(0,7) == "quarter");
	var qPFilter = $("#playTypeFilter");
	var qPSelectedId = qPFilter.find(":selected")[0].id;
	var filterByPlay = (qPSelectedId !== "" && qPSelectedId !== "playTypeAll");
	var gFilter = $("#gameFilter");
	var gSelectedFilter = gFilter.find(":selected")[0].id;
	var filterByGame = (gSelectedFilter !== "");

	if (filtersQuarter) {
		if (filterByPlay) {
			console.log("Filter by Quarter + Play");
			filterByQuarter(qDSelectedVal, qPSelectedId, gSelectedFilter);
		} else if (qDSelectedVal == 'all') {
			initializeGame(gSelectedFilter);
		} else {
			console.log("Filter by Quarter");
			filterByQuarter(qDSelectedVal, null, gSelectedFilter);
		}
	} else if (filtersDown) {
		if (filterByPlay) {
			console.log("Filter by Down + Play");
			filterByDown(qDSelectedVal, qPSelectedId, gSelectedFilter);
		} else {
			console.log("Filter by Down");
			filterByDown(qDSelectedVal, null, gSelectedFilter);
		}
	} else {
		if (filterByPlay) {
			console.log("Filter by Play");
			filterByPlayAlone(qPSelectedId, gSelectedFilter);
		} else {
			console.log("Initialize");
			initializeGame(gSelectedFilter);
		}
	}
}

function filterByPlayAlone(playValue, gameValue) {
	var game = setGameVariable(gameValue);

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

	var playName = setPlayName(playValue);

	for (var i = 0; i < game.length; i++) {
		var pass = game[i];
		if (pass['Play type'] == playName) {
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

	var passPercentage = Math.round(completePasses/totalPasses * 100);
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous) * 100);
	var pDistance = Math.round(truePassDistance/totalPasses);
	var avgTPassDistance = Math.round(passDistance/totalPasses);
	var avgOffPassDist = Math.round(offPassDis/totalPasses);
	var maxReceiversString = returnMaxReceiverString(receivers);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;
	document.getElementById('receiver').innerHTML=maxReceiversString;
}

// value is the quarter number
function filterByQuarter(value, playValue, gameValue) {
	var game = setGameVariable(gameValue);

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
		var playName = setPlayName(playValue);

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
	var maxReceiversString = returnMaxReceiverString(receivers);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;
	document.getElementById('receiver').innerHTML=maxReceiversString;
}

function filterByDown(value, playValue, gameValue) {
	var game = setGameVariable(gameValue);

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
		var playName = setPlayName(playValue);

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
	var maxReceiversString = returnMaxReceiverString(receivers);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('drops').innerHTML=drops;
	document.getElementById('PAPasses').innerHTML=PAPass;
	document.getElementById('sPasses').innerHTML=standardPass;
	document.getElementById('pythDistance').innerHTML=pDistance;
	document.getElementById('tpDistance').innerHTML=avgTPassDistance;
	document.getElementById('offPassDistance').innerHTML=avgOffPassDist;
	document.getElementById('receiver').innerHTML=maxReceiversString;
}

function returnMaxReceiverString(param) {
	var frequency = {};
	var max = 0;
	var result;
	var maxReceivers = [];
	var maxReceiversString = "";

	for (var v in param) {
		frequency[param[v]]=(frequency[param[v]] || 0)+1;
		if (frequency[param[v]] > max) {
			max = frequency[param[v]];
		}
	}

	for (var v in frequency) {
		if (frequency[v] === max) {
			maxReceivers.push(v);
		}
	}
	
	for (var v = 0; v < maxReceivers.length-1; v++) {
		if (maxReceivers[v] == "N/A")
			continue;
		maxReceiversString += maxReceivers[v];
		maxReceiversString += ", "
	}

	if (maxReceivers[maxReceivers.length-1] == "N/A")
		maxReceiversString = maxReceiversString.substr(0, maxReceiversString.length-2);
	else 
		maxReceiversString += maxReceivers[maxReceivers.length-1];
	maxReceiversString += (" (" + max + ")");
	return maxReceiversString;
}
























