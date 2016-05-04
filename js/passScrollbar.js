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
		p.attr("PassNumber", i);
		
		var requiredKeys = {
			"Qtr.": false, 
			"Down": false, 
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


$('#filter').click(function() {
	var scrollbar = $("#passScrollbar");
	
	$('.pass').each(function(i, obj) {
		$(obj).show();
		
		//check downs
		var downFilter = $('#down' + obj.getAttribute("down"));
		if (!downFilter.is(':checked')) {
			$(obj).hide();
		}
		
		//check quarters
		var quarterFilter = $('#quarter' + obj.getAttribute("quarter"));
		if (!quarterFilter.is(':checked')) {
			$(obj).hide();
		}
	});
	
});