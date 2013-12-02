
var map;

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
						listview.listview( "refresh" );
				}

			}
		}
	});
	window.googleMap.setCenter(parseFloat( startPos.lat ), parseFloat( startPos.lng ));
}).on("vclick", "#centerBtn", function ( event ) {
	var $POIName = $("#endPos"),
		POI = infos[ $POIName.val() ];
	window.googleMap.setCenter( POI.lat, POI.lng );
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

function makeInfowindowEvent( map, infowindow, marker, code ) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map, marker);
	});
}