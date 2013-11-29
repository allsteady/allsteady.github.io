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
		serviceUnvaliableErrorHander( );

	}
	if ( window._currencyDataLoad && window._currencyPageLoad  ) {
		serviceUnvaliableErrorHander( );
	}
}).on("click", "#calc", function ( event ) {
	var cash = parseInt( $( "#fromA" ).val() ),
		count = parseInt( $( "#itemCount" ).val() ),
		result;
	result  = parseInt (cash * window.currencyData.rate *  count * 100 ) / 100 ;

	console.log ( "%s * %s = %s (%s)  ",cash,   window.currencyData.rate , result.format(), Math.round(result).format() );

	$( "#toA" ).val( Math.round(result).format() );
}).on( "click", "#infoIcon", function ( event ) {
	window._currencyDataLoad = false;
	loadCurrency ( );
}).on( "focus", "#fromA", function (event ) {
	$( "#fromA" ).val("");
});

function loadCurrency () {
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
		success : function ( data ) {
			console.log (" success..... (" + data.from + " -> " + data.to + "): " + data.rate );
			window._currencyDataLoad = true;
			window.currencyData = $.localStorage.set( "exchange_data", { 
				"date"	: new Date(),
				"from"	: data.from,
				"to"		: data.to,
				"rate"	: data.rate
			});
			$( document ).trigger( "dataload" );
		}
	});
}

 loadCurrency ();

function serviceUnvaliableErrorHander ( ) {
	var color = "orange";
	if ( window._currencyDataLoad === false ) {
		window.currencyData = $.extend( {}, $.localStorage.get(  "exchange_data" ) );
		if ( window.currencyData === null  ) {
			color = "red";
			window.currencyData = $.localStorage.set( "exchange_data", { 
				"date"	: new Date( 1385701384985),
				"from"	: "JPY",
				"to"		: "KRW",
				"rate"	: 10.3405
			});
		}
	}
	console.log( "serviceUnvaliableErrorHander : " + color  );
	updateCurrencyInfo( color );
}
function updateCurrencyInfo( color ) {
	$( "#fromN" ).text( window.currencyData.from );
	$( "#toN" ).text( window.currencyData.to );
	$( "#currency" ).val( window.currencyData.rate );
	$( "#currencyDate" ).val( window.currencyData.date );
	$( "#infoIcon" ).css("background-color", color );
}

$( document ).ready( function ( event ) {

});
