var connections = new Array;
var nConnections = 0;
var establishedConnections = false;
var idMap = {};

var getPos = function(el) 
{
    for (var lx=0, ly=0; el != null;
         	lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);

    return {x: lx,y: ly};
}

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
		if (pass.hasOwnProperty('Result of pass')) {
			p.attr("passResult", pass["Result of pass"]);
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

		var passResult = pass["Result of pass"];
		if(passResult === "Complete") {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-lg');
		} else if(passResult === "Incomplete") {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-r');
		} else {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-o');
		}

		$("#" + xstart + "-" + ystart).attr('class', 'flex-item-o');

		//p.append("Distance Of Pass: " + absoluteDistance + " yards" + "<br><hr>");
		p.append("<hr>");		
		scrollbar.append(p);

		var start = xstart + "-" + ystart,
				end = xend + "-" + yend;

		if (establishedConnections)
		{
			jsPlumb.connect({
				source:start,
				target:end,
				connector:["Bezier", {curviness: 15}],
				endpoint:"Blank",
				overlays:[
    				[ "Label", {label:"FOO", id:"label", cssClass:"lineLabel"}]
  				] 
			});
		}

		createHoverBox(pass);
		// On mouseover of a receive point, show hoverbox
		$('.flex-item-r, .flex-item-o, .flex-item-lg').mouseover(function() {
			var hid = "#" + this.id + "hbox";
			var receivePt = document.getElementById(this.id);
			pos = getPos(receivePt);

			$(hid).css('top', pos.y + "px");
			$(hid).css('left', pos.x + "px");
			$(hid).show();

			var id = idMap[this.id];
			connections[id].showOverlay("label");
		});

		// Hide any existing hoverboxes when mouse leaves them
			// DO NOT change from on function - need to use on because it binds the handler hoverContainer
			// Cannot bind to dynamically generated hoverboxes before they exist
		$("#hoverContainer").on("mouseleave", ".hoverbox", function() {
			$(this).hide(); 

		   	// Extract id of pass receive point
		   	var hid, pid, pos;
		   	hid = $(this).attr('id');
		   	pos = hid.indexOf("hbox");

		   	if (pos != -1)
		   	{
				pid = hid.substring(0, hid.indexOf("hbox"));

				// Hide connection mapped to receive point
				var conn = connections[idMap[pid]];
				conn.hideOverlay("label");
		   	}
		});
	}
	
});

function createHoverBox(pass) {
	var html = "", header = "", content = "";

	// Find names of relevant divs
	var xend = pass["Receive X"], yend = pass["Receive Y"];
	var pt_id = "#" + xend + "-" + yend,
		h_id = xend + "-" + yend + "hbox";

	// Get data from JSON
	var receiver 	= pass["Receiver"], 
		result  	= pass["Result of pass"], 
		ex_comp  	= pass["Extraneous Incompletions"], 
		yac 		= pass["YAC"];

	// Define styling (coords) of hoverbox - more styling in css file
	header = 	"<div id=\"" + h_id + "\" class=\"hoverbox\">";

	// Pull JSON data into hoverbox
	content = 	"<p>" +
				"<b>PASS DATA</b><br>" + 
				"Receiver: "					+ receiver 	+ "<br>" + 
				"Result: " 						+ result 	+ "<br>" + 
				"Extraneous Incompletions: " 	+ ex_comp 	+ "<br>" + 
				"YAC: "							+ yac 		+ "<br>" + 
				"<a href=\"https://www.youtube.com/watch?v=IFfLCuHSZ-U\">Test link do not click death</a>" + 
				"</p></div>";
	
	html = header;
	html += content;

	$("#hoverContainer").append(html);
	$('.hoverbox').hide();
};

function getPos(el) 
{
    for (var lx=0, ly=0; el != null;
         	lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);

    return {x: lx,y: ly};
}

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
		var passResult = obj.getAttribute("passResult");

		$("#" + xstart + "-" + ystart).attr('class', 'flex-item-o');
		if(passResult === "Complete") {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-lg');
		} else if(passResult === "Incomplete") {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-r');
		} else {
			$("#" + xend + "-" + yend).attr('class', 'flex-item-o');
		}

		$("#" + xend + "-" + yend).attr('class', 'flex-item-o');

		if (qDSelectedVal !== "" && qDSelectedVal !== "all") {		
			if (filtersDown) {
				//check downs
				var downFilter = obj.getAttribute("down");
				if (downFilter !== qDSelectedVal) {
					$(obj).hide();
					$("#" + xstart + "-" + ystart).attr('class', 'flex-item');
					$("#" + xend + "-" + yend).attr('class', 'flex-item');
				}
			} else {
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


jsPlumb.ready(function() {
	establishedConnections = true;

	jsPlumb.bind("connection", function(info) {
		idMap[info.connection.target.id] = nConnections;	// Map id of endpoint to connection 
   		nConnections++;
		connections.push(info.connection);
		info.connection.hideOverlay("label");
	});

	$(window).resize(function() {
		if(establishedConnections)
			jsPlumb.repaintEverything();
	});
});

function drawConnections()
{
	var gamePasses = virginia;

	for (var i = 0, len = gamePasses.length; i < len; i++) {
		var pass = gamePasses[i];
		var xstart = pass["Pass X"], ystart = pass["Pass Y"];
		var xend = pass["Receive X"], yend = pass["Receive Y"];

		var start = xstart + "-" + ystart,
			end = xend + "-" + yend;

		var connection;
		connection = jsPlumb.connect({
				source:start,
				target:end,
				connector:["Bezier", {curviness: 15}],
				endpoint:"Blank",
				overlays:[
    				[ "Label", {label:"FOO", id:"label", cssClass:"lineLabel"}]
  				] 
			});
	}
}