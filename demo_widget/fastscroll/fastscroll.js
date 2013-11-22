var testIndexString = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z:ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ";
// For test js
( function ($, window, document, undefined) {

	jQuery.widget (  "mobile.listview", $.mobile.listview, {
		options: {
			fastscroll : null
		},

		_primaryLanguage: null,
		_secondLanguage: null,
		_dividerMap: {},
		_charSet: null,

		_create: function () {
			var self = this,
				$el = self.element,
				$popup,
				page = $el.closest( ':jqmData(role="page")' );

			if ( this.options.fastscroll != null && /true/i.test( this.options.fastscroll ) ) {
				this.$lastListItem = $el.children( "li" ).last();
				this.$shortcutsContainer = $( "<div class='ui-fastscroll' />" );
				this.$shortcutsList = $( "<ul aria-hidden='true'></ul>" );
				this.$popup = $el.append($( "<div class='ui-fastscroll-popup'></div>" ) );

				this.$shortcutsContainer	.append( this.$shortcutsList );
				$el.prepend( this.$shortcutsContainer );

				this.indexString( testIndexString );

				this.jumpToDivider = function ( divider ) {
					// get the vertical position of the divider (so we can scroll to it)
					var dividerY = $( divider ).position().top,
						// find the bottom of the last list item
						bottomOffset = self.lastListItem.outerHeight( true ) + self.lastListItem.position().top,
						scrollviewHeight = $el.height(),

					// check that after the candidate scroll, the bottom of the
					// last item will still be at the bottom of the scroll view
					// and not some way up the page
						maxScroll = bottomOffset - scrollviewHeight,
						dstOffset;

					dividerY = ( dividerY > maxScroll ? maxScroll : dividerY );

					// don't apply a negative scroll, as this means the
					// divider should already be visible
					dividerY = Math.max( dividerY, 0 );

					// apply the scroll
					// self.scrollview.scrollview( 'scrollTo', 0, -dividerY );

					dstOffset = self.scrollview.offset();
				};

				$(  window ).bind( "pageshow resize", function ( event ) {
					console.log("Start : pageshow || resize ");
					self._updateFastscollLayout( event ) ;
					console.log("Stop : pageshow || resize ")	
				} );

				this.$shortcutsList
				// bind mouse over so it moves the scroller to the divider
					.bind( 'touchstart mousedown vmousedown touchmove vmousemove vmouseover', function ( e ) {
						/*
						// Get coords relative to the element
						var coords = $.mobile.tizen.targetRelativeCoordsFromEvent( e ),
							shortcutsListOffset = self.$shortcutsList.offset();

						self.shortcutsContainer.addClass( "ui-fastscroll-hover" );

						// If the element is a list item, get coordinates relative to the shortcuts list
						if ( e.target.tagName.toLowerCase() === "li" ) {
							coords.x += $( e.target ).offset().left - shortcutsListOffset.left;
							coords.y += $( e.target ).offset().top  - shortcutsListOffset.top;
						}

						if ( e.target.tagName.toLowerCase() === "span" ) {
							coords.x += $( e.target ).parent().offset().left - shortcutsListOffset.left;
							coords.y += $( e.target ).parent().offset().top  - shortcutsListOffset.top;
						}

						self.shortcutsList.find( 'li' ).each( function () {
							var listItem = $( this );
							$( listItem )
								.removeClass( "ui-fastscroll-hover" )
								.removeClass( "ui-fastscroll-hover-down" );
						});
						// Hit test each list item
						self.shortcutsList.find( 'li' ).each( function () {
							var listItem = $( this ),
								l = listItem.offset().left - shortcutsListOffset.left,
								t = listItem.offset().top  - shortcutsListOffset.top,
								r = l + Math.abs(listItem.outerWidth( true ) ),
								b = t + Math.abs(listItem.outerHeight( true ) ),
								unit,
								baseTop,
								baseBottom,
								omitSet,
								i;

							if ( coords.x >= l && coords.x <= r && coords.y >= t && coords.y <= b ) {
								if ( listItem.text() !== "." ) {
									self._hitItem( listItem );
								} else {
									omitSet = listItem.data( "omitSet" );
									unit = ( b - t ) / omitSet.length;
									for ( i = 0; i < omitSet.length; i++ ) {
										baseTop = t + ( i * unit );
										baseBottom = baseTop + unit;
										if ( coords.y >= baseTop && coords.y <= baseBottom ) {
											self._hitOmitItem( listItem, omitSet.charAt( i ) );
										}
									}
								}
								return false;
							}
							return true;
						} );

						*/
						e.preventDefault();
						e.stopPropagation();
					} )
					// bind mouseout of the fastscroll container to remove popup
					.bind( 'touchend mouseup vmouseup vmouseout', function ( e ) {
						// $popup.hide();
						// $( ".ui-fastscroll-hover" ).removeClass( "ui-fastscroll-hover" );
						// $( ".ui-fastscroll-hover-first-item" ).removeClass( "ui-fastscroll-hover-first-item" );
						// $( ".ui-fastscroll-hover-down" ).removeClass( "ui-fastscroll-hover-down" );
						// self.shortcutsContainer.removeClass( "ui-fastscroll-hover" );
						e.preventDefault();
						e.stopPropagation();
					} );

/*
				if ( page && !( page.is( ':visible' ) ) ) {
					page.bind( 'pageshow', function () { self.refresh(); } );
				} else {
					self.refresh();
				}

				// refresh the list when dividers are filtered out
				$el.bind( 'updatelayout', function () {
					self.refresh();
				} );
*/
			}
			// find the bottom of the last item in the listview
/*
				this.scrollview = $el.addClass( 'ui-fastscroll-target' ).closest( '.ui-scrollview-clip' );

				// popup for the hovering character
				$popup = this.scrollview.find( '.ui-fastscroll-popup' );

				this.shortcutsContainer.append( this.shortcutsList );
				this.scrollview.append( this.shortcutsContainer );


				// remove scrollbars from scrollview
				this.scrollview.find( '.ui-scrollbar' ).hide();
*/

			// make a listview
			this._super();
		},

		_setOptions : function ( options ) {
			if ( options.fastscroll ) {

			}
			return this._super( options );
		},

		_updateShortcutList : function ( create ) {
			var self = this,
				// TODO : rename to itemTemplate
				shapItem = $( '<li tabindex="0" aria-label="double to move Number list"><span aria-hidden="true">#</span><span aria-label="Number"/></li>' ),
				primaryCharacterSet = self._primaryLanguage ? self._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = self._secondLanguage ? self._secondLanguage.replace( /,/g, "" ) : null,
				contentHeight = self.$shortcutsContainer.height(),
				containerHeight,
				omitIndex = 0,
				dividers,
				listItems,
				emptySize,
				containerHeight,
				makeCharacterSet,
				minHeight,
				maxNumOfItems,
				numOfItems,
				maxNumOfItems,
				makeOmitSet;

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			makeOmitSet = function ( index, length ) {
				var count,
					omitSet = "";

				for ( count = 0; count < length; count++ ) {
					omitSet += primaryCharacterSet[ index + count ];
				}

				return omitSet;
			};

			this._createDividerMap();
			self.$shortcutsList.find( 'li' ).remove();

			// get all the dividers from the list and turn them into shortcuts
			dividers = self.element.find( '.ui-li-divider:visible' );

			// get all the list items
			listItems = self.element.find('li:visible').not('.ui-li-divider');

			if ( dividers.length < 2 ) {
				self.$shortcutsList.hide();
				return;
			}

			self.$shortcutsList.show();
			self.$lastListItem = listItems.last();
			self.$shortcutsList.append( shapItem );
			self._focusItem( shapItem );

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			minHeight = shapItem.outerHeight( true );
			maxNumOfItems = parseInt( contentHeight / minHeight - 1, 10 );
			numOfItems = primaryCharacterSet.length;

			console.log("\t[_updateShortcutList] contentHeight : " + contentHeight );
			console.log("\t[_updateShortcutList] minHeight : " + minHeight );
			console.log("\t[_updateShortcutList] numOfItems : " + maxNumOfItems );

			maxNumOfItems = secondCharacterSet ? maxNumOfItems - 2 : maxNumOfItems;

			if ( maxNumOfItems < 3 ) {
				shapItem.remove();
				return;
			}

			omitInfo = self._omit( numOfItems, maxNumOfItems );

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

				self._focusItem( shortcutItem );

				if ( typeof omitInfo !== "undefined" && omitInfo[ omitIndex ] > 1 ) {
					shortcutItem = $( '<li>.</li>' );
					shortcutItem.data( "omitSet",  makeOmitSet( i, omitInfo[ omitIndex ] ) );
					i += omitInfo[ omitIndex ] - 1;
				}

				self.$shortcutsList.append( shortcutItem );
				omitIndex++;
			}

			if ( secondCharacterSet !== null ) {
				lastIndex = secondCharacterSet.length - 1;
				seconds = [];

				seconds.push( secondCharacterSet.charAt( 0 ) );
				seconds.push( secondCharacterSet.charAt( lastIndex ) );

				for ( i = 0; i < seconds.length; i++ ) {
					indexChar = seconds[ i ];
					shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

					self._focusItem( shortcutItem );
					// shortcutItem.bind( 'vclick', itemHandler );
					self.$shortcutsList.append( shortcutItem );
				}
			}

			containerHeight = self.$shortcutsContainer.innerHeight( );
			// emptySize = contentHeight - containerHeight;
			shortcutsItems = self.$shortcutsList.children();
			size = parseInt( containerHeight / shortcutsItems.length, 10 ) - 3;
			correction = emptySize - ( shortcutsItems.length * size );
			console.log("\t[_updateShortcutList] shortcutsItems :  " + shortcutsItems.length + " - containerHeight : " + containerHeight + ", size : "+ size  );
			
			shortcutsItems.css( {
				height: size,
				lineHeight: size + "px"
			} );

			// if ( emptySize > 0 ) {
			// 	shortcutsItems.each( function ( index, item ) {
			// 		height = $( item ).height() + size;
			// 		if ( correction !== 0 ) {
			// 			height += 1;
			// 			correction -= 1;
			// 		}
			// 		$( item ).css( {
			// 			height: height,
			// 			lineHeight: height + "px"
			// 		} );
			// 		console.log(" corrent size : " + height)
			// 	} );
			// }
		},

		// this function is must be called in pageshow & resize.
		_updateFastscollLayout : function ( event ) {
			var $el = this.element,
				viewPortHeight = $( window ).innerHeight() > $el.parent().innerHeight() ? $el.parent().innerHeight() : $( window ).innerHeight(),
				fastscrollHeight = viewPortHeight,
				$header, $footer,
				$container = $el.parent();

			if ( event ) {
				console.log("event type : ---- " + event.type );
			}
			
			// set shortcutsContainer height.
			console.log("before viewPortHeight : %s ", viewPortHeight );
			if ( $container.has( ".ui-content" ) ) {
				// recalculate fastscollHeight;
				 $header = $container.siblings( ".ui-header" );
				 if ( $header.length > 0 ) {
				 	viewPortHeight -=  $header.outerHeight( true );
				 }
				 $footer = $container.siblings( ".ui-footer" );
				 if ( $footer.length > 0 ) {
				 	viewPortHeight -=  $footer.outerHeight( true );
				 }
			}
			console.log("after viewPortHeight : %s ", viewPortHeight );
			this.$shortcutsContainer.css( "height", viewPortHeight +"px");
			// this.$shortcutsContainer.css( "width", 30 +"px");

			this._updateShortcutList();
		},

		_findClosestDivider: function ( targetChar ) {
			var i,
				dividerMap = this._dividerMap,
				charSet = this._charSet,
				charSetLen = charSet.length,
				targetIdx = charSet.indexOf( targetChar ),
				lastDivider,
				subDivider = null;

			for ( i = 0; i < targetIdx; ++i ) {
				lastDivider = dividerMap[ charSet.charAt( i ) ];
				if ( lastDivider !== undefined ) {
					subDivider = lastDivider;
				}
			}
			if ( !subDivider ) {
				for ( ++i; i < charSetLen; ++i ) {
					lastDivider = dividerMap[ charSet.charAt( i ) ];
					if ( lastDivider !== undefined ) {
						subDivider = lastDivider;
						break;
					}
				}
			}
			return subDivider;
		},

		_hitOmitItem: function ( listItem, text ) {
			var $popup = this.element.find( ".ui-fastscroll-popup" ),
				divider;

			divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}

			$popup.text( text ).show();

			$( listItem ).addClass( "ui-fastscroll-hover" );
			if ( listItem.index() === 0 ) {
				$( listItem ).addClass( "ui-fastscroll-hover-first-item" );
			}
			$( listItem ).siblings().eq( listItem.index() ).addClass( "ui-fastscroll-hover-down" );
		},

		_hitItem: function ( listItem  ) {
			var $popup = this.element.find( '.ui-fastscroll-popup' ),
				text = listItem.text(),
				divider;

			if ( text === "#" ) {
				divider = this._dividerMap.number;
			} else {
				divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			}

			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}

			$popup.text( text ).show();

			$( listItem ).addClass( "ui-fastscroll-hover" );
			if ( listItem.index() === 0 ) {
				$( listItem ).addClass( "ui-fastscroll-hover-first-item" );
			}
			$( listItem ).siblings().eq( listItem.index() ).addClass( "ui-fastscroll-hover-down" );
		},

		_focusItem: function ( listItem ) {
			var self = this,
				$popup = self.element.find( '.ui-fastscroll-popup' );

			listItem.focusin( function ( e ) {
				self.$shortcutsList.attr( "aria-hidden", false );
				self._hitItem( listItem );
			}).focusout( function ( e ) {
				self.$shortcutsList.attr( "aria-hidden", true );
				$popup.hide();
				$( ".ui-fastscroll-hover" ).removeClass( "ui-fastscroll-hover" );
				$( ".ui-fastscroll-hover-first-item" ).removeClass( "ui-fastscroll-hover-first-item" );
				$( ".ui-fastscroll-hover-down" ).removeClass( "ui-fastscroll-hover-down" );
			});
		},

		_contentHeight: function () {
			var self = this,
				$content = $( '.ui-scrollview-clip' ),
				header = null,
				footer = null,
				paddingValue = 0,
				clipSize = $( window ).height();

			if ( $content.hasClass( "ui-content" ) ) {
				paddingValue = parseInt( $content.css( "padding-top" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt( $content.css( "padding-bottom" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				header = $content.siblings( ".ui-header:visible" );
				footer = $content.siblings( ".ui-footer:visible" );

				if ( header ) {
					if ( header.outerHeight( true ) === null ) {
						clipSize = clipSize - ( $( ".ui-header" ).outerHeight() || 0 );
					} else {
						clipSize = clipSize - header.outerHeight( true );
					}
				}
				if ( footer ) {
					clipSize = clipSize - footer.outerHeight( true );
				}
			} else {
				clipSize = $content.height();
			}
			return clipSize;
		},

		_omit: function ( numOfItems, maxNumOfItems ) {
			var maxGroupNum = parseInt( ( maxNumOfItems - 1 ) / 2, 10 ),
				numOfExtraItems = numOfItems - maxNumOfItems,
				groupPos = [],
				omitInfo = [],
				groupPosLength,
				group,
				size,
				i;

			if ( ( maxNumOfItems < 3 ) || ( numOfItems <= maxNumOfItems ) ) {
				return;
			}

			if ( numOfExtraItems >= maxGroupNum ) {
				size = 2;
				group = 1;
				groupPosLength = maxGroupNum;
			} else {
				size = maxNumOfItems / ( numOfExtraItems + 1 );
				group = size;
				groupPosLength = numOfExtraItems;
			}

			for ( i = 0; i < groupPosLength; i++ ) {
				groupPos.push( parseInt( group, 10 ) );
				group += size;
			}

			for ( i = 0; i < maxNumOfItems; i++ ) {
				omitInfo.push( 1 );
			}

			for ( i = 0; i < numOfExtraItems; i++ ) {
				omitInfo[ groupPos[ i % maxGroupNum ] ]++;
			}

			return omitInfo;
		},

		_createDividerMap: function () {
			var primaryCharacterSet = this._primaryLanguage ? this._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = this._secondLanguage ? this._secondLanguage.replace( /,/g, "" ) : null,
				numberSet = "0123456789",
				dividers = this.element.find( '.ui-li-divider' ),
				map = {},
				matchToDivider,
				makeCharacterSet,
				indexChar,
				i;

			matchToDivider = function ( index, divider ) {
				if ( $( divider ).text() === indexChar ) {
					map[ indexChar ] = divider;
				}
			};

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				dividers.each( matchToDivider );
			}

			if ( secondCharacterSet !== null ) {
				for ( i = 0; i < secondCharacterSet.length; i++ ) {
					indexChar = secondCharacterSet.charAt( i );
					dividers.each( matchToDivider );
				}
			}

			dividers.each( function ( index, divider ) {
				if ( numberSet.search( $( divider ).text() ) !== -1  ) {
					map.number = divider;
					return false;
				}
			});

			this._dividerMap = map;
			this._charSet = primaryCharacterSet + secondCharacterSet;
		},

		indexString: function ( indexAlphabet ) {
			var self = this,
				characterSet = [];

			if ( typeof indexAlphabet === "undefined" ) {
				return self._primaryLanguage + ":" + self._secondLanguage;
			}

			characterSet = indexAlphabet.split( ":" );
			self._primaryLanguage = characterSet[ 0 ];
			if ( characterSet.length === 2 ) {
				self._secondLanguage = characterSet[ 1 ];
			}
		},

		refresh: function ( create ) {
			this._super( create );
			if ( this.options.fastscroll != null && /true/i.test( this.options.fastscroll ) ) {
				console.log("Start - fastscroll refresh..... ");
				// console.log("Widget [%s] height : %s, width : %s", this.element.attr("data-role"), this.element.height(), this.element.width() );
				// this._updateFastscollLayout();
				console.log("Stop - fastscroll refresh..... ");
			}
			/*
			var self = this,
				primaryCharacterSet = self._primaryLanguage ? self._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = self._secondLanguage ? self._secondLanguage.replace( /,/g, "" ) : null,
				contentHeight = self._contentHeight(),
				shapItem = $( '<li tabindex="0" aria-label="double to move Number list"><span aria-hidden="true">#</span><span aria-label="Number"/></li>' ),
				$popup = this.scrollview.find( '.ui-fastscroll-popup' ),
				omitIndex = 0,
				makeCharacterSet,
				makeOmitSet,
				itemHandler,
				containerHeight,
				shortcutsItems,
				shortcutItem,
				shortcutsTop,
				minClipHeight,
				maxNumOfItems,
				numOfItems,
				minHeight,
				omitInfo,
				dividers,
				listItems,
				emptySize,
				correction,
				indexChar,
				lastIndex,
				seconds,
				height,
				size,
				i;

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			makeOmitSet = function ( index, length ) {
				var count,
					omitSet = "";

				for ( count = 0; count < length; count++ ) {
					omitSet += primaryCharacterSet[ index + count ];
				}

				return omitSet;
			};

			self._createDividerMap();

			self.shortcutsList.find( 'li' ).remove();

			// get all the dividers from the list and turn them into shortcuts
			dividers = self.element.find( '.ui-li-divider' );

			// get all the list items
			listItems = self.element.find('li').not('.ui-li-divider');

			// only use visible dividers
			dividers = dividers.filter( ':visible' );
			listItems = listItems.filter( ':visible' );

			if ( dividers.length < 2 ) {
				self.shortcutsList.hide();
				return;
			}

			self.shortcutsList.show();
			self.lastListItem = listItems.last();
			self.shortcutsList.append( shapItem );
			self._focusItem( shapItem );

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			minHeight = shapItem.outerHeight( true );
			maxNumOfItems = parseInt( contentHeight / minHeight - 1, 10 );
			numOfItems = primaryCharacterSet.length;

			maxNumOfItems = secondCharacterSet ? maxNumOfItems - 2 : maxNumOfItems;

			if ( maxNumOfItems < 3 ) {
				shapItem.remove();
				return;
			}

			omitInfo = self._omit( numOfItems, maxNumOfItems );

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

				self._focusItem( shortcutItem );

				if ( typeof omitInfo !== "undefined" && omitInfo[ omitIndex ] > 1 ) {
					shortcutItem = $( '<li>.</li>' );
					shortcutItem.data( "omitSet",  makeOmitSet( i, omitInfo[ omitIndex ] ) );
					i += omitInfo[ omitIndex ] - 1;
				}

				self.shortcutsList.append( shortcutItem );
				omitIndex++;
			}

			if ( secondCharacterSet !== null ) {
				lastIndex = secondCharacterSet.length - 1;
				seconds = [];

				seconds.push( secondCharacterSet.charAt( 0 ) );
				seconds.push( secondCharacterSet.charAt( lastIndex ) );

				for ( i = 0; i < seconds.length; i++ ) {
					indexChar = seconds[ i ];
					shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

					self._focusItem( shortcutItem );
					shortcutItem.bind( 'vclick', itemHandler );
					self.shortcutsList.append( shortcutItem );
				}
			}

			containerHeight = self.shortcutsContainer.outerHeight( true );
			emptySize = contentHeight - containerHeight;
			shortcutsItems = self.shortcutsList.children();
			size = parseInt( emptySize / shortcutsItems.length, 10 );
			correction = emptySize - ( shortcutsItems.length * size );

			if ( emptySize > 0 ) {
				shortcutsItems.each( function ( index, item ) {
					height = $( item ).height() + size;
					if ( correction !== 0 ) {
						height += 1;
						correction -= 1;
					}
					$( item ).css( {
						height: height,
						lineHeight: height + "px"
					} );
				} );
			}

			// position the shortcut flush with the top of the first list divider
			shortcutsTop = dividers.first().position().top;
			self.shortcutsContainer.css( 'top', shortcutsTop );

			// make the scrollview clip tall enough to show the whole of the shortcutslist
			minClipHeight = shortcutsTop + self.shortcutsContainer.outerHeight() + 'px';
			self.scrollview.css( 'min-height', minClipHeight );

			$popup.text( "M" ) // Popup size is determined based on "M".
				.width( $popup.height() )
				.css( { marginLeft: -( $popup.outerWidth() / 2 ),
					marginTop: -( $popup.outerHeight() / 2 ) } );
			*/
		}
	} );
/*
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.fastscroll.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.fastscroll();
	} );

	$( window ).bind( "resize orientationchange", function ( e ) {
		$( ".ui-page-active .ui-fastscroll-target" ).fastscroll( "refresh" );
	} );
*/
} (jQuery, window, document) );