$(document).ready(function() {
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
		
		if (pass.hasOwnProperty('Result of pass')) {
			if (pass['Result of pass'] == 'Complete') {
				completePasses += 1;
				totalPasses += 1;
			} else if (pass['Result of pass'] == 'Incomplete') {
				totalPasses += 1;
			}
		}

		if (pass.hasOwnProperty('Extraneous Incompletions')) {
			if (pass['Extraneous Incompletions'] != 0) 
				extraneous += 1;
			else if (pass['Extraneous Incompletions'] === 'Drop')
				drops += 1;
		}

		if (pass.hasOwnProperty('X-axis') && pass.hasOwnProperty('Y-axis')) {
			truePassDistance += Math.sqrt(Math.pow(pass['X-axis'],2) + Math.pow(pass['Y-axis'],2));
		}

		if (pass.hasOwnProperty('Yards') && pass.hasOwnProperty('YAC')) {
			passDistance += (pass['Yards'] - pass['YAC'])
		}

		if (pass.hasOwnProperty('Receiver')) {
			if (pass['Receiver'] != 0) {
				receivers.push(pass['Receiver']);
			}
		}
	}

	var passPercentage = Math.round(completePasses/totalPasses * 100);
	var avgPassDistance = Math.round(passDistance/totalPasses);
	var tpassDistance = Math.round(truePassDistance/totalPasses);
	var adjCompletionPercentage = Math.round((completePasses + drops)/(totalPasses - extraneous - drops) * 100);

	document.getElementById('completePasses').innerHTML=passPercentage+'%';
	document.getElementById('totalPasses').innerHTML=totalPasses;
	document.getElementById('extrIncomplete').innerHTML=extraneous;
	document.getElementById('adjCompletion').innerHTML=adjCompletionPercentage + '%';
	document.getElementById('tpDistance').innerHTML=tpassDistance ;
	document.getElementById('pDistance').innerHTML=avgPassDistance ;

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
});