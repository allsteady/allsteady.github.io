window._currencyDataLoad = false;
window._currencyPageLoad = false;
window._isRecently = false;
window._refreshTime = 3600000;

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
	if ( ( window._currencyDataLoad && window._currencyPageLoad ) || window._isRecently ) {
		updateCurrencyInfo( "green" );
	}
}).on("click", "#calc, #keyEquals", function ( event ) {
	var cash = parseInt( $( "#fromA" ).val() ),
		count = parseInt( $( "#itemCount" ).val() ),
		color = "black",	result;
	result  = parseInt (cash * window.currencyData.rate *  count * 100 ) / 100 ;

	console.log ( "%s * %s = %s (%s)  ",cash,   window.currencyData.rate , result.format(), Math.round(result).format() );
	if ( result >= 100000 ) {
		color = "red";
	} else if ( result >= 50000 ){
		color = "orange";
	}  else if ( result >= 30000 ){
		color = "yellow";
	} else {
		color = "blue";
	}

	$( "#toA" ).val( Math.round( result ).format() ).css( "color", color );

}).on( "click", "#infoIcon", function ( event ) {
	window._currencyDataLoad = false;
	loadCurrency();
}).on( "focus", "#fromA", function ( event ) {
	window._$inputValue.val( "" );
}).on( "click" , "#keyC", function( event ) {
	 window._$inputValue.val( "" );
	 event.preventDefault();
});

function loadCurrency ( fromN, toN ) {
	var exchangeData = $.localStorage.get( "exchange_data" ),
		curTime = ( new Date ),
		fromCurrency = fromN ? fromN : "JPY",
		toCurrency = toN ? toN : "KRW";
	if ( exchangeData && ( curTime - new Date( exchangeData.date ) ) < window._refreshTime  ) {
		window._isRecently = true;
		return ;
	}
	$.ajax ({
		url : "http://rate-exchange.appspot.com/currency?from="+fromCurrency+"&to="+toCurrency,
		dataType: "jsonp",
		crossDomain: true,
		error : function ( jqXHR, textStatus, errorThrown ) {
			console.log (" error....." + errorThrown.message);
			$( "#infoIcon" ).css("background-color", "red");
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
	updateCurrencyInfo( color );
}
function updateCurrencyInfo( color ) {
	$( "#fromN" ).text( window.currencyData.from );
	$( "#toN" ).text( window.currencyData.to );
	$( "#currency" ).val( window.currencyData.rate );
	$( "#currencyDate" ).val( new Date( window.currencyData.date ) );
	$( "#infoIcon" ).css("background-color", color );
}

$( document ).ready( function ( event ) {
	window._$inputValue = $( "#fromA" );

	$( ".ui-grid-c .btn-block" ).bind( "click" , function( event ) {
		var value = $( this ).children( "button" ).attr( "data-val" ),
			current = window._$inputValue.val();
		if ( value ) {
			if ( current && current.length > 0 ) {
				window._$inputValue.val( current + "" + value );
			} else {
				window._$inputValue.val( value );
			}
		}
		event.preventDefault();
		event.stopPropagation();
	});
});