
var map,
	buffer_infowindows = [];
window.buffer_infowindows = buffer_infowindows;
window._myPosition = null;
window._isTrace = false;
window._walkPath = null;
window._pathPosition = [];

$( document ).ready( function(){
	var idx = 0, item, gMaker, infoWindow,
	innerHeight = $(window).innerHeight();
	googleMap = new GMaps({
			el: '#map',
			lat: 43.067892,
			lng: 141.350591,
			zoomControl : true,
			zoomControlOpt: {
				style : 'LARGE',
				position: 'TOP_LEFT'
			},
		panControl : false,
		streetViewControl : false,
		mapTypeControl: false,
		overviewMapControl: false
	});

	for ( ; idx < makers.length ; idx++ ) {
		item = infos [ makers[ idx ] ];
		gMarker = makeCustomMarker( item );
		googleMap.addMarker ( gMarker );
		infoWindow = makeInfowindow( item );
		makeInfowindowEvent( googleMap, infoWindow, gMarker, item.code );
	}

	$("#dialogPage").css("height", innerHeight + "px");
	$("#steps").css("height", parseInt( innerHeight * 0.5 ) + "px");
	window.googleMap = googleMap;
}).on("vclick", "#searchBtn", function ( event ) {
	var $startPos = $("#startPos"),
		$destPos = $("#endPos"),
		startPos = infos[ $startPos.val() ],
		destPos = infos[ $destPos.val() ];
	window.scrollTop = 0;
	window.googleMap.cleanRoute();
	if ( !startPos && $startPos.val() === "currentPos") {
		getCurrentLocation( destPos );
	} else {
		drawRouteInMap( startPos, destPos );
	}
}).on("vclick", "#centerBtn", function ( event ) {
	var $POIName = $("#endPos"),
		POI = infos[ $POIName.val() ];
	window.googleMap.setCenter( POI.lat, POI.lng );
}).on("vclick", "#traceBtn", function ( event ) {
	if ( !window._isTrace ) {
		window._isTrace = true;
		showCurrentPos( );
	} else {
		stopTrace( );
	}
}).on("vclick", "#reloadBtn", function ( event ) {

});

$( window ).bind ("resize", function ( event ) {
	var innerHeight = $( window ).innerHeight ();
	$("#dialogPage").css("height", innerHeight + "px");
	$("#steps").css("height", parseInt( innerHeight * 0.5 ) + "px");
});

$( document ).bind("pageshow", function (event ) {
	var screenHieght = $( window ).innerHeight() - $(".ui-header").outerHeight(),
		$content = $( ".ui-content" ),
		diffHeight = 0,
		contentHeight = $content.innerHeight();
	console.log(" page show : " + contentHeight + " / " + screenHieght );
	if ( contentHeight < screenHieght ) {
		diffHeight = screenHieght - contentHeight;
		var map = $content.find("#map"),
			height = map.height()  + diffHeight;

		if ( height < screenHieght ) {
			map.height( height );
		}
	}
});

function makeInfowindow( item ) {
	var infoWindow,
		innerHtml = "",
		nameDom = "<p class='info-name'>"+ item.name + "</p>";

	if ( item.jname ) {
		innerHtml += "<span class='info-jname'>" + item.jname + "</span><br>";
	}
	if ( item.desc ) {
		innerHtml += "<span class='info-desc'>" + item.desc + "</span><br>";
	}
	if ( item.b_url ) {
		innerHtml += "<a href='" + item.b_url + "' target='_blank'>Go to blog</a><br>"	;
	}
	innerHtml = "<div style='float:left;top:0px;overflow:hidden;width:70px;padding:0px;'>" + innerHtml + "</div>"
		
	if ( item.img ) {
		innerHtml += "<div style='float:right;padding:0px;margin:0px;'><img src='" + item.img + "' style ='width:50px;height:50px;'></img></div>"
	}

	innerHtml = "<div id='iw_" + item.code+"'  style='width: 140px; height: 120px; overflow: hidden;position:absoulte'> "+
				nameDom + "<div class='info-content'>" +  innerHtml + "</div></div>";

	infoWindow = new google.maps.InfoWindow( {
		content: innerHtml
	});
	return infoWindow;
}

function stepToDom ( step ) {
	var distance,
		duration,
		dom,
		instructions;

	if ( step ) {
		distance = step.distance.text;
		duration = step.duration.text;
		instructions = step.instructions;
		dom = $ ( "<li" +"> " + instructions + "<br>(" + distance +"/" + duration +")" + "</li>");
	}
	return dom;
}

function makeCustomMarker( item ) {
	var marker,
		markerOption = {
			position : new google.maps.LatLng( item.lat, item.lng ),
			title : item.name,
			details : item
		};
	marker = new google.maps.Marker( markerOption );
	if ( item.icon ) {
		marker.setIcon('http://allsteady.github.io/tour/icons/' + item.icon +'.png');
	} else {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
	}
	return marker;
}

function startTrace( position ) {
	var curPos = new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),
		option = {
			animation: google.maps.Animation.DROP,
			position : curPos,
			title : "내 위치",
			icon : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
		}, marker;

	marker = new google.maps.Marker( option );
	window.googleMap.addMarker ( marker );
	window.googleMap.setCenter( position.coords.latitude, position.coords.longitude );
	window._myPosition = marker;

	window._pathPosition.push( curPos );
	window._walkPath = window.googleMap.drawPolyline( {
		path: window._pathPosition,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2
	});

	window._timerID = setInterval( function(){
		navigator.geolocation.getCurrentPosition( trace, gpsError);
	}, 5000 );
}

function trace( position ) {
	var marker = window._myPosition,
		path = window._walkPath,
		latlng = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
	marker.setPosition( latlng );
	window._pathPosition.push( latlng );
	path.setPath( window._pathPosition );
}

function stopTrace() {
	window.googleMap.removeMarkers( window._myPosition );
	window._myPosition.setMap( null );
	window._walkPath.setMap( null );
	if ( window._timerID != null ) {
		clearInterval( window._timerID );
	}
	window._isTrace = false;
	window._timerID = null;

	delete window._myPosition;
	window._myPosition = null;
	delete window._walkPath;
	window._walkPath = null;
	delete window._pathPosition;
	window._pathPosition = [];
}

function showCurrentPos( ) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( startTrace, traceError);
		window._isTrace = true;
	} else {  
		gpsText.innerText = "No GPS Functionality.";  
	}
}

function drawRouteInMap( startPos, destPos ) {
	window.googleMap.drawRoute({
		origin: [ startPos.lat,  startPos.lng ],
		// origin: new google.maps.LatLng( startPos.lat , startPos.lng ),
		destination: [ destPos.lat, destPos.lng ],
		travelMode: $( "#travelMode" ).val(),
		strokeColor: '#131540',
		strokeOpacity: 0.6,
		strokeWeight: 6,
		error : function ( e ) {
			console.log( "error... : " + e.status );
		},
		callback : function ( e ) {
			var routeInfos,
				steps,idx = 0,
				panel = $("#dialogPage"),
				listview;
			if ( e.legs && e.legs.length > 0 ) {
				routeInfos = e.legs [ 0 ];
				panel.find("#startAddr").text( routeInfos.start_address );
				panel.find("#endAddr").text( routeInfos.end_address );
				panel.find("#distance").text( routeInfos.distance.text );
				panel.find("#duration").text( routeInfos.duration.text );
				if ( routeInfos.steps ) {
					listview = panel.find("#stepInfos");
					for ( idx = 0 ; idx < routeInfos.steps.length ; idx ++ ) {
						dom = stepToDom (routeInfos.steps[idx]);
						listview.append( dom );
					}
				}
			}
		}
	});
	window.googleMap.setCenter( startPos.lat, startPos.lng );
}

function gpsError(error) {
	alert("GPS Error: "+error.code+", "+error.message);
}

function traceError( error ) {
	alert("GPS Error: "+error.code+", "+error.message);
	stopTrace();
}

function showGPS(position) {
	var startPos = {
		lat : position.coords.latitude,
		lng : position.coords.longitude
	};
	drawRouteInMap( startPos, window._destPos );
}

function getCurrentLocation( destPos ) {
	if (navigator.geolocation) {
		window._destPos = destPos;
		navigator.geolocation.getCurrentPosition( showGPS, gpsError);
	} else {  
		gpsText.innerText = "No GPS Functionality.";  
	}
}

function makeInfowindowEvent( map, infowindow, marker, code ) {
	google.maps.event.addListener(marker, 'click', function() {
		if ( window.buffer_infowindows && (  window.buffer_infowindows.length === 3 ) ) {
			var oldInfoWindow = window.buffer_infowindows.shift();
			oldInfoWindow.close();
		}
		infowindow.POI_code = code;
		infowindow.open(map, marker);
		window.buffer_infowindows.push( infowindow );
		google.maps.event.addListener(infowindow, 'closeclick', function() { 
			var index = 0, temp = [], item;
			for ( ; index <  window.buffer_infowindows.length ; index++ ) {
				item = window.buffer_infowindows[ index ];
				if (  item.POI_code !== infowindow.POI_code ){
					temp.push( item );
				}
			}
			window.buffer_infowindows = temp;
		});
	});
}