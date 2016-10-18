YUI().use( 'node' , function ( Y ) {
  
  'use strict' ;

  var iframeBottomMargin = 25;

  var topOffsetHeight = Y.one('.header').get('offsetHeight');
  
  var footerHeight = Y.one('footer').get('offsetHeight') ;
 
  var viewport = Y.DOM.viewportRegion() ;

  Y.one('iframe').setStyles ( {
    top: topOffsetHeight,
    height: viewport.height - topOffsetHeight - footerHeight - iframeBottomMargin
  } ) ;

} ) ;
