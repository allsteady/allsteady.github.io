/**
 * Created by allsteady on 15. 5. 29.
 */

var DataLoader = function () {
	var imgPath = "./images/";
	this.dataSet = {};
	this.addData( "library", "서재_00", imgPath + "library_000.jpg" );
	this.addData( "library", "서재_01", imgPath + "library_001.jpg" );
	this.addData( "library", "서재_02", imgPath + "library_002.jpg" );
	this.addData( "library", "서재_03", imgPath + "library_003.jpg" );
	this.addData( "library", "서재_04", imgPath + "library_004.png" );

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