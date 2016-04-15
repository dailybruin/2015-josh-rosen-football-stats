var connections = new Array;
var isOutlier = new Array; // boolean array for whether each receive point in the data is an outlier 
var nConnections = 0;

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
		xstart = xstart * .8;
		xend = xend * .8;
		ystart = 32 - ystart * .8;
		yend = 32 - yend * .8;

		// Draw startpoint (pass location) on screen
		$(".flex-container").append("<p id=\"start" + i + "\" class=\"flex-item\" style=\"color:rgb(0, 255, 0); position:absolute; z-index:10; top:" + ystart + "vw; left:" + xstart + "vw;\">$</p>");

		// Draw endpoint (receive location) on screen
		if (yend <= 0)
		{
			// treat endpoint as outlier
			isOutlier.push(true);
		}
		else
		{
			isOutlier.push(false);
			$(".flex-container").append("<p id=\"end" + i + "\" style=\"color:rgb(255, 0, 0); position:absolute; z-index:10; top:" + yend + "vw; left:" + xend + "vw;\">X</p>");
		}
		
	}

	$(".flex-container").append("<p id=\"end" + i + "\" style=\"color:rgb(255, 0, 255); position:absolute; z-index:10; top: 32vw; left:20vw;\">&&&</p>");

});

var drawConnections = function () {
	for (var i = 0; i < len; i++)
	{
		if (!isOutlier[i])
		{
			var stdiv = "start" + i;
			var endiv = "end" + i;

			var conn = jsPlumb.connect({
				source:stdiv,
				target:endiv,
				connector:["Bezier", {curviness: 40}],
				endpoint:"Blank"
			});

			nConnections++;
			connections.push(conn);
		}
	}
};

jsPlumb.ready(function() {
	establishedConnections = true;

	// for (var i = 0; i < len; i++)
	// {
	// 	if (!isOutlier[i])
	// 	{
	// 		var stdiv = "start" + i;
	// 		var endiv = "end" + i;

	// 		var conn = jsPlumb.connect({
	// 			source:stdiv,
	// 			target:endiv,
	// 			connector:["Bezier", {curviness: 40}],
	// 			endpoint:"Blank"
	// 		});

	// 		nConnections++;
	// 		connections.push(conn);
	// 	}
	// }

	drawConnections();

	$(window).resize(function() {
		console.log("Resizing window");

		if(establishedConnections)
		{
			jsPlumb.detachEveryConnection();
		}
	});
});

