$(document).ready(function() {

	var scrollbar = $("#passScrollbar");
	var gamePasses = virginia;
	
	scrollbar.html("");	//clear the scrollbar

	for (var i = 0, len = gamePasses.length; i < len; i++) {
		var pass = gamePasses[i];
		var p = $('<p class="pass"></p>');
		
		//initialize data-attrs for filter
		if (pass.hasOwnProperty('Down')) {
			p.attr("down", pass["Down"]);
		}
		if (pass.hasOwnProperty('Qtr.')) {
			p.attr("quarter", pass["Qtr."]);
		}
		if (pass.hasOwnProperty('Play type')) {
			p.attr("playType", pass["Play type"]);
		}
		p.attr("PassNumber", i);
		
		var requiredKeys = {
			"Qtr.": true, 
			"Down": true, 
			"Distance": true, 
			"Play type": true, 
			"Result of pass": true, 
			"Receiver": true, 
			"Yards": true,
			"Distance Of Pass": true
		};
		
		for (var key in pass) {
			if (key in requiredKeys && requiredKeys[key])
				p.append(key + ": " + pass[key] + "<br>");
		}
		
		//Calculate absolute distance of pass
		var xstart = pass["Pass X"], ystart = pass["Pass Y"];
		var xend = pass["Receive X"], yend = pass["Receive Y"];
		var absoluteDistance = Math.sqrt(Math.pow(xend-xstart,2) + Math.pow(yend-ystart,2));
		absoluteDistance = Math.round(absoluteDistance*100)/100;
		
		p.append("Distance Of Pass: " + absoluteDistance + " yards" + "<br><hr>");
				
		scrollbar.append(p);
	}
});


$('#quarterDownFilter').change(function() {
	filter();
});

$('#playTypeFilter').change(function() {
	filter();
});

function filter() {
	var scrollbar = $("#passScrollbar");
	
	/////////////////////////////////////// quarter down filter
	var qDFilter = $("#quarterDownFilter");
	var qDSelectedId = qDFilter.find(":selected")[0].id;
	var qDSelectedVal = qDFilter.find(":selected").val();
	var filtersDown = (qDSelectedId.substring(0,4) == "down");	//check if filters quarter or down


	///////////////////////////////////////// play type filter
	var pTFilter = $("#playTypeFilter");
	var pTSelectedVal = pTFilter.find(":selected").val();

	$('.pass').each(function(i, obj) {
		$(obj).show();

		if (qDSelectedVal !== "" && qDSelectedVal !== "all") {		
			if (filtersDown) {
				//check downs
				var downFilter = obj.getAttribute("down");
				if (downFilter !== qDSelectedVal) {
					$(obj).hide();
				}
			}
			else {
				//check quarters
				var quarterFilter = obj.getAttribute("quarter");
				if (quarterFilter !== qDSelectedVal) {
					$(obj).hide();
				}
			}
		}
		
		if (pTSelectedVal !== "" && pTSelectedVal !== "all") {
			//check play type
			var playTypeFilter = obj.getAttribute("playType");
			if (playTypeFilter !== pTSelectedVal) {
				$(obj).hide();
			}
		}
	});
}