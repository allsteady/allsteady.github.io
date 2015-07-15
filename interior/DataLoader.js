/**
 * Created by allsteady on 15. 5. 29.
 */

var DataLoader = function () {
	var imgPath = "./images/";
	this.dataSet = {};
	this.addData( "library", "서재_00", imgPath + "library_000.jpg" );
	this.addData( "library", "서재_01", imgPath + "library_005.jpg" );
	this.addData( "library", "서재_02", imgPath + "library_004.png" );
	this.addData( "library", "서재_03", imgPath + "library_002.jpg" );
	this.addData( "library", "서재_04", imgPath + "library_003.jpg" );

	this.addData( "fur", "클라인3 거실장 1600", imgPath + "fur_000.jpg", "너비 160 x 깊이 40 x 높이 53" );
//	this.addData( "fur", "소파", imgPath + "fur_001.jpg", "너비 160 x 깊이 40 x 높이 53" );
	this.addData( "fur", "클라인 애쉬 소파테이블", imgPath + "fur_002.jpg", "너비 95 x 깊이 40 x 높이 48" );
	this.addData( "fur", "비트윈 식탁 세트", imgPath + "fur_003.jpg", "너비 120 x 깊이 75 x 높이 75" );
	this.addData( "fur", "폴린 침대 Q", imgPath + "fur_004.jpg", "너비 120 x 깊이 214.7 x 높이 104.7" );
	this.addData( "fur", "폴린 오크 4단 서랍장", imgPath + "fur_005.jpg", "너비 80 x 깊이 78.5 x 높이 95.3" );
	this.addData( "fur", "폴린 협탁", imgPath + "fur_006.png", "" );
	this.addData( "fur", "폴린 테이블램프", imgPath + "fur_007.jpg");

	this.addData( "fur", "지플랜 B3 책장", imgPath + "fur_008.jpg", "너비 80 x 깊이 30 x 높이 124" );
	this.addData( "fur", "팀버나인 책장", imgPath + "fur_009.jpg", "너비 119 x 깊이 30 x 높이 98.6" );
	this.addData( "fur", "팀버나인 책상", imgPath + "fur_010.jpg", "너비 160 x 깊이 85 x 높이 74");
	this.addData( "fur", "폴린  붙박이 장", imgPath + "fur_011.jpg", "");

}

DataLoader.prototype = {
	dataSet: {},
	init: function( ) {

	},

	addData: function( ctg, name, path, desc ) {
		var self = this, items,
			item = {
			"name": name,
			"path": path,
			"desc": desc
			};

		ctg = ctg.toLowerCase();
		items = self.dataSet[ ctg ];
		if ( !items ) {
			items = [];
			self.dataSet[ ctg ] = items;
		}

		items.push( item );
	},

	_makeElem: function( item ) {
		var $elem,
			alt = item.name ? "alt=\"" + item.name + "\"" : " ",
			desc = item.desc ? "data-description=\"" +item.desc +  "\" ": " ";

		// example
		// <li><img src="paris.jpg" alt="Paris, France" data-description="Eiffel Tower and Champ de Mars"></li>
		$elem = $( "<li><img src='"+ item.path + "' " + alt + " " + desc + "></li>" );
		return $elem;
	},

	writeData: function( $elem, ctg ) {
		var self = this,
			items, len, i, item;

		ctg = ctg.toLowerCase();
		items = self.dataSet[ ctg ];
		for ( i = 0 , len = items.length ; i < len ; i++ ) {
			item = items[ i ];
			$elem.append ( self._makeElem( item ) );
		}
	}
};

window.DataLoader = new DataLoader();