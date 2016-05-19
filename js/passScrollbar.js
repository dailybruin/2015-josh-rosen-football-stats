$(document).ready(function() {


	var field = $("#field");
	for (var g = 0; g < 3024; g++){
		var x = (g % 63) - 5;
		var y = (36 - (Math.floor(g/63) + 1));
		var p;
		p = $('<div class="flex-item" id="' + x + "-" + y + "\"" + "> </div>");	
		
		field.append(p);
	}

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
		if (pass.hasOwnProperty('Pass X')) {
			p.attr("xstart", pass["Pass X"]);
		}
		if (pass.hasOwnProperty('Pass Y')) {
			p.attr("ystart", pass["Pass Y"]);
		}
		if (pass.hasOwnProperty('Receive X')) {
			p.attr("xend", pass["Receive X"]);
		}
		if (pass.hasOwnProperty('Receive Y')) {
			p.attr("yend", pass["Receive Y"]);
		}
		p.attr("PassNumber", i);
		
		p.append("Pass #: " + (i+1) + "<br>");
		
		var requiredKeys = {
			"Qtr.": false, 
			"Down": false, 
			"Distance": false, 
			"Play type": false, 
			"Result of pass": false, 
			"Receiver": false, 
			"Yards": false,
			"Distance Of Pass": false,
			"Play notes": true
		};
		
		for (var key in pass) {
			if (key in requiredKeys && requiredKeys[key])
				p.append(key + ": " + pass[key] + "<br>");
		}
		
		var xstart = pass["Pass X"], ystart = pass["Pass Y"];
		var xend = pass["Receive X"], yend = pass["Receive Y"];
		//Calculate absolute distance of pass
		var absoluteDistance = Math.sqrt(Math.pow(xend-xstart,2) + Math.pow(yend-ystart,2));
		absoluteDistance = Math.round(absoluteDistance*100)/100;

		$("#" + xend + "-" + yend).attr('class', 'flex-item-r');
		$("#" + xstart + "-" + ystart).attr('class', 'flex-item-r');


		//p.append("Distance Of Pass: " + absoluteDistance + " yards" + "<br><hr>");
		p.append("<hr>");

				
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
		var xstart = obj.getAttribute("xstart");
		var ystart = obj.getAttribute("ystart");
		var xend = obj.getAttribute("xend");
		var yend = obj.getAttribute("yend");
		$("#" + xstart + "-" + ystart).attr('class', 'flex-item-r');
		$("#" + xend + "-" + yend).attr('class', 'flex-item-r');

		if (qDSelectedVal !== "" && qDSelectedVal !== "all") {		
			if (filtersDown) {
				//check downs
				var downFilter = obj.getAttribute("down");
				if (downFilter !== qDSelectedVal) {
					$(obj).hide();
					$("#" + xstart + "-" + ystart).attr('class', 'flex-item');
					$("#" + xend + "-" + yend).attr('class', 'flex-item');
				}
			}
			else {
				//check quarters
				var quarterFilter = obj.getAttribute("quarter");
				if (quarterFilter !== qDSelectedVal) {
					$(obj).hide();
					$("#" + xstart + "-" + ystart).attr('class', 'flex-item');
					$("#" + xend + "-" + yend).attr('class', 'flex-item');
				}
			}
		}
		
		if (pTSelectedVal !== "" && pTSelectedVal !== "all") {
			//check play type
			var playTypeFilter = obj.getAttribute("playType");
			if (playTypeFilter !== pTSelectedVal) {
				$(obj).hide();
				$("#" + xstart + "-" + ystart).attr('class', 'flex-item');
				$("#" + xend + "-" + yend).attr('class', 'flex-item');
			}
		}
	});
}