$(document).ready(function() {

	var scrollbar = $("#passScrollbar");
	var gamePasses = virginia;
	// nPasses = gamePasses.length;
	
	scrollbar.html("");	//clear the scrollbar

	len = gamePasses.length;

	for (var i = 0; i < len; i++) {
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
		

		// Create divs for start and end point nodes
		xstart = (xstart + 1) * .8;
		xend = (xend + 1) * .8;
		ystart = (ystart + 1) * 0.8;
		yend = (yend + 1) * 0.8;

		$(".flex-container").append("<p id=\"end" + i + "\" style=\"color:rgb(255, 0, 0); position:absolute; z-index:10; top:" + yend + "vw; left:" + xend + "vw;\">X</p>");
		$(".flex-container").append("<p id=\"start" + i + "\" style=\"color:rgb(0, 255, 0); position:absolute; z-index:10; top:" + ystart + "vw; left:" + xstart + "vw;\">$</p>");
	}
});

jsPlumb.ready(function() {
	for (var i = 0; i < 5; i++)
	{
		var stdiv = "start" + i;
		var endiv = "end" + i;

		jsPlumb.connect({
			source:stdiv,
			target:endiv,
			endpoint:"Rectangle"
		});
	}
});