window._currencyDataLoad = false;
window._currencyPageLoad = false;
Number.prototype.format = function(){
	if( this == 0 ) {
		return 0;	
	}

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while ( reg.test( n ) ) {
		n = n.replace(reg, '$1' + ',' + '$2');
	}
	return n;
};

// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
String.prototype.format = function(){
	var num = parseFloat(this);
	if( isNaN( num ) ) {
		return "0";
	}

	return num.format();
};

$( document ).bind(" dataload pageshow ", function ( event ) {
	if ( event.type === "dataload" ) {
		window._currencyDataLoad = true;
	}
	if ( event.type === "pageshow" ) {
		window._currencyPageLoad = true;
	}
	if ( window._currencyDataLoad && window._currencyPageLoad  ) {
		
	}
}).on("click", "#calc", function ( event ) {
	var cash = parseInt( $( "#fromA" ).val() ),
		result;
	result  = parseInt (cash * window.currencyData.rate * 100 ) / 100 ;
	console.log ( "%s * %s = %s  ",cash,   window.currencyData.rate , result.format() );

	$( "#toA" ).val( result.format() + "" );
}).on( "click", "#infoIcon", function ( event ) {
	window._currencyDataLoad = false;
	loadCurrency ( );
});

function loadCurrency ( ) {
	console.log("loadCurrency.... ");
	$.ajax ({
		url : "http://rate-exchange.appspot.com/currency?from=JPY&to=KRW",
		// url : " http://finance.yahoo.com/d/quotes.csv?e=.json&f=sl1d1t1&s=USDINR=X",
		// url : "http://finance.yahoo.com/currency-converter/#from=JPY;to=KRW;amt=1",
		// url : "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=JPY&ToCurrency=KRW",
		dataType: "jsonp",
		crossDomain: true,
		error : function ( jqXHR, textStatus, errorThrown ) {
			console.log (" error....." + errorThrown.message);
			$( "#infoIcon" ).css("background-color", "red");
		},
		complete : function ( jqXHR, textStatus ) {
			console.log ("complete : error....." + textStatus );
		},
		statusCode : {
			"503" : serviceUnvaliableErrorHander,
			"503 (Service Unavailable)" : function( ) {console.log("test")},
			404 : serviceUnvaliableErrorHander,
			503 : serviceUnvaliableErrorHander
		},
		success : function ( data ) {
			console.log (" success..... (" + data.from + " -> " + data.to + "): " + data.rate );
			window.currencyData = $.localStorage.set( "exchange_data", { 
				"date"	: new Date(),
				"from"	: data.from,
				"to"		: data.to,
				"rate"	: data.rate
			});
			$( "#infoIcon" ).css("background-color", "blue");
			$( document ).trigger( "dataload" );
		}
	});
	setTimeout(serviceUnvaliableErrorHander, 10000);
}
loadCurrency ( );

$(document).ajaxError(function (event, request, settings, thrownError) {
	console.log(request.status  + ' : ' + thrownError);
});

function serviceUnvaliableErrorHander ( ) {
	console.log(".serviceUnvaliableErrorHander.............500");
	$( "#infoIcon" ).css("background-color", "orange" );
	if ( window._currencyDataLoad === false ) {
		window.currencyData = $.localStorage.get(  "exchange_data" );
		if ( window.currencyData === null  ) {
			$( "#infoIcon" ).css("background-color", "red" );
			window.currencyData = $.localStorage.set( "exchange_data", { 
				"date"	: new Date( 1385701384985),
				"from"	: "JPY",
				"to"		: "KRW",
				"rate"	: 10.3405
			});
		}
		updateCurrencyInfo();
	}
}
function updateCurrencyInfo() {
	$( "#fromN" ).text( window.currencyData.from );
	$( "#toN" ).text( window.currencyData.to );
	$( "#currency" ).val( window.currencyData.rate );
	$( "#currencyDate" ).val( window.currencyData.date );
}

$( document ).ready( function ( event ) {

});
