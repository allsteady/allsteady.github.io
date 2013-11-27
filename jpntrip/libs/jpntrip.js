
var map;
function makeInfowindowEvent( map, infowindow, marker, code ) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}
		$( document ).ready(function(){
			var idx = 0, item, gMaker, infoWindow;
			console.log("ready....")
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


				// var pinColor = "FE7569";
				// var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
				// 	new google.maps.Size(21, 34),
				// 	new google.maps.Point(0,0),
				// 	new google.maps.Point(10, 34));


				gMarker = googleMap.createMarker( {
					lat : item.lat,
					lng : item.lng,
					title : item.name,
					size : 'small',
					// icon : pinImage,
					color : typeColor,
					details : item
				} );
				googleMap.addMarker ( gMarker );
				
				infoWindow = new google.maps.InfoWindow( {
					content:  "<p id='" + item.code+"'>"+ gMarker.title + "</p>"
				});
				
				makeInfowindowEvent( googleMap, infoWindow, gMarker, item.code );
				// gMarker = new google.maps.Marker({
				// 	map: googleMap,
				// 	draggable: true,
				// 	position: new google.maps.LatLng(item.lat, item.lng),
				// 	visible: true
				// });

				// var boxText = document.createElement("div");
				// boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
				// boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";
				// var myOptions = {
				// 	content: boxText,
				// 	disableAutoPan: false,
				// 	maxWidth: 0,
				// 	pixelOffset: new google.maps.Size(-140, 0),
				// 	zIndex: null,
				// 	boxStyle: { 
				// 		background: "url('tipbox.gif') no-repeat",
				// 		opacity: 0.75,
				// 		width: "280px"
				// 	},
				// 	closeBoxMargin: "10px 2px 2px 2px",
				// 	closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				// 	infoBoxClearance: new google.maps.Size(1, 1),
				// 	isHidden: false,
				// 	pane: "floatPane",
				// 	enableEventPropagation: false
				// };
				// infoWindow = new InfoBox(myOptions);
				// makeInfowindowEvent( googleMap, infoWindow, gMarker );
			}

			// google.maps.event.addListener(map, 'click', function() {
			// 	// 3 seconds after the center of the map has changed, pan back to the
			// 	// marker.
			// 	window.setTimeout(function() {
			// 	map.panTo(marker.getPosition());
			// 	}, 3000);
			// });
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
						panel = $("#configPanel");
					if ( e.legs && e.legs.length > 0 ) {
						routeInfos = e.legs [ 0 ];
						panel.find("#startAddr").text( routeInfos.start_address );
						panel.find("#endAddr").text( routeInfos.end_address );
						panel.find("#distance").text( routeInfos.distance.text );
						panel.find("#duration").text( routeInfos.duration.text );

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
