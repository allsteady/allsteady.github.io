
var map;

$( document ).ready(function(){
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
		typeColor = item.type === "res" ? 'blue'  : 'red';
		console.log(item.name + "] typeColor : " + typeColor);

		gMarker = makeCustomMarker( item );
		googleMap.addMarker ( gMarker );
		
		infoWindow = new google.maps.InfoWindow( {
			content:  "<p id='" + item.code+"'>"+ gMarker.title + "</p>"
		});
		
		makeInfowindowEvent( googleMap, infoWindow, gMarker, item.code );

	}

	$("#configPanel").css("height", innerHeight + "px");
	$("#configPanel").find("#steps").css("height", parseInt( innerHeight * 0.8 ) + "px");
	window.googleMap = googleMap;
}).on("vclick", "#searchBtn", function ( event ) {
	var $startPos = $("#startPos"),
		$destPos = $("#endPos"),
		startPos = infos[ $startPos.val() ],
		destPos = infos[ $destPos.val() ];

	// console.log (" startPos [ name %s, lat %s, lng :%s ]",startPos.name, parseFloat( startPos.lat ), parseFloat( startPos.lng ) );
	// console.log (" destPos [ name %s, lat %s, lng :%s ]", destPos.name, parseFloat( destPos.lat ), parseFloat( destPos.lng ) );
	
	window.googleMap.cleanRoute()
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
				panel = $("#configPanel"),
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
					listview.listview("refresh", "true");
				}

			}
		}
	});
	window.googleMap.setCenter(parseFloat( startPos.lat ), parseFloat( startPos.lng ));
}).on("vclick", "#testBtn", function ( event ) {
	var service = new google.maps.DirectionsService(),
		$startPos = $("#startPos"),
		$destPos = $("#endPos"),
		startPos = infos[ $startPos.val() ],
		destPos = infos[ $destPos.val() ],
		reqOptions = {
			origin: "Seoul station",
			destination: "Incheon Airport",
			travelMode: google.maps.TravelMode.TRANSIT,
			transitOptions: {
			departureTime: new Date()
			},
			unitSystem: google.maps.UnitSystem.IMPERIAL
		};

		// reqOptions = {
		// 	origin: [ startPos.lat , startPos.lng  ],
		// 	destination: [ destPos.lat , destPos.lng ],
		// 	origin: "Sapporo+Station%2C+Hokkaido+Prefecture%2C+Japan",
			// destination: "New+Chitose+Airport%2C+Chitose%2C+Hokkaido+Prefecture%2C+Japan",
		// 	travelMode: google.maps.TravelMode.TRANSIT,
		// 	transitOptions: {
		// 	departureTime: new Date(1337675679473)
		// 	},
		// 	unitSystem: google.maps.UnitSystem.IMPERIAL
		// };
	// reqOptions.origin = /string/.test(typeof reqOptions.origin) ? reqOptions.origin : new google.maps.LatLng(reqOptions.origin[0], reqOptions.origin[1]);
// 		reqOptions.destination = /string/.test(typeof reqOptions.destination) ? reqOptions.destination : new google.maps.LatLng(reqOptions.destination[0], reqOptions.destination[1]);
	service.route( reqOptions, function ( result, status ) {
		console.log("callback status : " + status );
		if (status === google.maps.DirectionsStatus.OK) {

		} else {

		}
	});
});

function makeInfowindow( item ) {

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
	if ( item.type == "res" ) {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
	} else if ( item.type == "shop") {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
	} else if ( item.type == "see" ) {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
	} else {
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
	}
	return marker;
}

function makeInfowindowEvent( map, infowindow, marker, code ) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}