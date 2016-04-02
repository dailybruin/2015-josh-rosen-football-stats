$(document).ready(function() {

	var scrollbar = $("#passScrollbar");
	var gamePasses = virginia;
	
	scrollbar.html("");	//clear the scrollbar

	for (var i = 0, len = gamePasses.length; i < len; i++) {
		var pass = gamePasses[i];
		scrollbar.append("<p>");
		for (var key in pass) {
			scrollbar.append(key + ": " + pass[key] + "<br>");
		}
		
		//Calculate absolute distance of pass
		var xstart = pass["X-axis-pass"], ystart = pass["Y-axis-pass"];
		var xend = pass["X-axis-receive"], yend = pass["X-axis-receive"];
		var absoluteDistance = Math.sqrt(Math.pow(xend-xstart,2) + Math.pow(yend-ystart,2));
		absoluteDistance = Math.round(absoluteDistance*100)/100;
		scrollbar.append("Distance Of Pass: " + absoluteDistance + " yards<br>");
				
		scrollbar.append("<\p>");
	}
});
