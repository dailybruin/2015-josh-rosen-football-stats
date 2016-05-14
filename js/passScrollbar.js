var getPos = function(el) 
{
    for (var lx=0, ly=0; el != null;
         	lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);

    return {x: lx,y: ly};
}

$(document).ready(function() {
	var field = $("#field");
	for (var g = 0; g < 2650; g++){
		var x = (g % 53) + 1;
		var y = (51 - (Math.floor(g/53) + 1)) - 10;
		var p;
		if( x == 1 && y == 53) {
			p = $('<div class="flex-item" id="' + x + "-" + y + "\"" + "><svg height=\"2\" width=\"2\"><circle cx=\"1\" cy=\"1\" r=\"5\" fill=\"red\"></svg></div>");

		} else {
			p = $('<div class="flex-item" id="' + x + "-" + y + "\"" + "> </div>");	
		}
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

    // Add a hoverbox to html on hoverover of div 
	$("#bob").mouseover(function() {
		var html = "", styling = "", content = "";
		var pass = gamePasses[2];

		// Get data from JSON
		var receiver 	= pass["Receiver"], 
			result  	= pass["Result of pass"], 
			ex_comp  	= pass["Extraneous Incompletions"];

		// Get coords of div the user hoverd over
		var div 		= document.getElementById("bob"), 
			pos 		= getPos(div);

		// Define styling (coords) of hoverbox - more styling in css file
		styling = 	"<div id=\"fred\" class=\"hoverbox\" style=\"" + 
					"top:" + pos.y + "px; " + 
					"left:" + pos.x + "px;" +  
					"\">";

		// Pull JSON data into hoverbox
		content = 	"<p>" +
					"<b>PASS DATA</b><br>" + 
					"Receiver: "					+ receiver 	+ "<br>" + 
					"Result: " 						+ result 	+ "<br>" + 
					"Extraneous Incompletions: " 	+ ex_comp 	+ 
					"</p></div>";
		
		html = styling;
		html += content;

  		$("#hoverContainer").append(html);
	});

	// Hide any existing hoverboxes when mouse leaves them
		// DO NOT change from on function - need to use on because it binds the handler hoverContainer
		// Cannot bind to dynamically generated hoverboxes before they exist
	$("#hoverContainer").on("mouseleave", ".hoverbox", function() {
	   $(this).hide(); 
	});

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