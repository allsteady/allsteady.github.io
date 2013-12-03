
var map,
	buffer_infowindows = [];
window.buffer_infowindows = buffer_infowindows;
window._myPosition = null;
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
		console.log( "[" + item.name + "] typeColor : " + item.icon );

		gMarker = makeCustomMarker( item );
		googleMap.addMarker ( gMarker );
		
		infoWindow = makeInfowindow( item );
		makeInfowindowEvent( googleMap, infoWindow, gMarker, item.code );
	}

	$("#dialogPage").css("height", innerHeight + "px");
	$("#steps").css("height", parseInt( innerHeight * 0.5 ) + "px");
	// $("#configPanel").find("#steps").css("height", parseInt( innerHeight * 0.8 ) + "px");
	// 
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
	showCurrentPos( ) ;
}).on("vclick", "#reloadBtn", function ( event ) {
	stopTrace( ) ;
});

$( window ).bind ("resize", function ( event ) {
	var innerHeight = $( window ).innerHeight ();
	$("#dialogPage").css("height", innerHeight + "px");
	$("#steps").css("height", parseInt( innerHeight * 0.5 ) + "px");
});

function makeInfowindow( item ) {
	var infoWindow,
		innerHtml = "",
		nameDom = "<p class='info-name'>"+ item.name + "</p>";

	if ( item.img ) {
		innerHtml += "<img src='" + item.img + "' style ='width:50px;height:50px;'></img>"
	}
	if ( item.jname ) {
		innerHtml += "<span>" + item.jname + "</span>"	
	}
	if ( item.b_url ) {
		innerHtml += "<a href='" + item.b_url + "' target='_blank'>Go to blog</a>"	
	}

	innerHtml = "<div id='iw_" + item.code+"'  style='width: 140px; height: 78px; overflow: hidden;'> "+
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
		marker.setIcon('http://allsteady.github.io/jpntrip/resources/icons/' + item.icon +'.png');
	} else {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
	}
	return marker;
}

function startTrace( position ) {
	var option = {
			animation: google.maps.Animation.DROP,
			position : new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),
			title : "내 위치",
			icon : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
		}, marker;
	console.log( "Latitude: "+position.coords.latitude+"\nLongitude: "+position.coords.longitude );
	marker = new google.maps.Marker( option );
	window.googleMap.addMarker ( marker );
	window.googleMap.setCenter( position.coords.latitude, position.coords.longitude );
	window._myPosition = marker;
	window._timerID = setInterval( function(){
		navigator.geolocation.getCurrentPosition( trace, gpsError);
	}, 5000);
}

function trace( position ) {
	var marker = window._myPosition;
	console.log( "setPosition \nLatitude: "+position.coords.latitude+"\nLongitude: "+position.coords.longitude );
	marker.setPosition( new google.maps.LatLng( position.coords.latitude, position.coords.longitude ) );
}

function stopTrace() {
	window.googleMap.removeMarkers( window._myPosition );
	clearInterval( window._timerID );
}

function showCurrentPos( ) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( startTrace, gpsError);
	} else {  
		gpsText.innerText = "No GPS Functionality.";  
	}
}

function drawRouteInMap( startPos, destPos ) {
	window.googleMap.drawRoute({
		origin: [ parseFloat( startPos.lat ), parseFloat( startPos.lng ) ],
		destination: [ parseFloat( destPos.lat ) , parseFloat( destPos.lng )],
		travelMode: $("#travelMode").val(),
		strokeColor: '#131540',
		strokeOpacity: 0.6,
		strokeWeight: 6,
		callback : function ( e ) {
			var routeInfos,
				steps,idx = 0,
				panel = $("#dialogPage"),
				// panel = $("#configPanel"),
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
					// listview.listview( "refresh" );
				}

			}
		}
	});
	window.googleMap.setCenter(parseFloat( startPos.lat ), parseFloat( startPos.lng ));
}

function gpsError(error) {
	alert("GPS Error: "+error.code+", "+error.message);
}

function showGPS(position) {
	var startPos = {
		lat : position.coords.latitude,
		lng : position.coords.longitude
	};
	console.log( "Latitude: "+position.coords.latitude+"\nLongitude: "+position.coords.longitude );
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
					console.log ( "item.POI_code : " + item.POI_code );
					temp.push( item );
				}

			}
			window.buffer_infowindows = temp;
		});

	});
}