YUI().use( 'node' , function ( Y ) {
  
  'use strict' ;

  var iframeBottomMargin = 25;

  var topOffsetHeight = Y.one('.header').get('offsetHeight');
  
  var footerHeight = Y.one('footer').get('offsetHeight') ;
 
  var viewport = Y.DOM.viewportRegion() ;
  var  iframeheight = viewport.height - topOffsetHeight - footerHeight - iframeBottomMargin;
  Y.one('.nyup-iframe').setStyles ( {
    top: topOffsetHeight,
    height: iframeheight,
  } ) ;
} ) ;
