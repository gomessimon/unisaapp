// Pannel script 
var panel = '<div data-role="panel" id="mypanel" data-display="reveal" data-tap-toggle="false" style="background:#BC242A;">' + '<ul class="panel_nav"><li><a href="#homePage">Home</a></li><li><a href="#admissionPage">Admissions</a></li><li><a href="#news_events_page">News, Events &amp; Notice</a></li><li><a href="#photo_page">Photo Gallery</a></li><li><a href="http://103.17.37.71/elearning/">eLearning</a></li><li><a href="http://103.17.37.71/index.php">South Asia Connect</a></li><li><a href="#map_page">Map</a></li><li><a href="#contact_page">Contact Us</a></li></ul><div class="social-links"><a class="fb" href="https://www.facebook.com/pages/University-of-South-Asia/384978734950628">Facebook</a><a class="yt" href="https://www.youtube.com/channel/UCxezjINjUWgwQ62NZbomRpw">Youtube</a><a class="vm" href="https://vimeo.com/user19719682">Vimeo</a></div></div>';
$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend( panel );
    $("#mypanel").panel();
});
$( document ).on( "pageinit", function() {
    $( document ).on( "swiperight", function( e ) {       
	    if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
	        if ( e.type === "swiperight" ) {
	            $( "#mypanel" ).panel( "open" );
	        }
	    }
    });
});

$(function() {
    FastClick.attach(document.body);
});

// Photo Gallery swiper script
// Fetching data from the server using ajax call
var dataURL = "http://www.southasia-uni.org/includes/mobileappcontent/photo_page.php";
$.getJSON( dataURL,  function( photoObj ) {
	var counter = 0;
	$.each( photoObj, function(index, val) {
		if( photoObj[index].img_active == "yes" ){
			counter++;
			$('#photo_page .image_gallery').append("<a id='" + photoObj[index].img_id + "'' rel='gallery' href='http://www.southasia-uni.org/files/photos/" + photoObj[index].img_filename + ".hdq." + photoObj[index].img_extension + "'class='swipebox'><img src='http://www.southasia-uni.org/files/photos/" + photoObj[index].img_filename + ".mid." + photoObj[index].img_extension + "'></a>" );	
			if( counter == 5 ) return false;
		}			
	});
}) // Photo Gallery swiper script
.done(function() {
	$("#photo_page .load-more-img").css( 'visibility', 'visible' );
	( function( $ ){
		$( '.swipebox' ).swipebox({
			hideBarsOnMobile : false
		});
	})( jQuery );
});

// News and Events script
dataURL = "http://www.southasia-uni.org/includes/mobileappcontent/news_events.php";
$.getJSON( dataURL, function( newsObj ) {
	counter = 0;
	var news_desc = '';
	//var img_src = null;
	$.each( newsObj, function(index, val) {
		/*$.get( 'http://www.southasia-uni.org/files/photos/' + newsObj[index].news_img + '.mid.jpg' )
		    .done(function() { 
		        img_src = 'http://www.southasia-uni.org/files/photos/' + newsObj[index].news_img + '.mid.jpg';
		    }).fail(function() { 
		       img_src = 'http://www.southasia-uni.org/files/photos/' + newsObj[index].news_img + '.sml.jpg';
		   	})*/
		if( !newsObj[index].news_desc ) news_desc = '';
		else news_desc = newsObj[index].news_desc ;

		$("#news_events_page #news").append(
			"<li><h3 class='title'><a href='#full_news_page' id='" + 
			newsObj[index].news_id + 
			"'>" + newsObj[index].news_title + 
			"</a></h3><img class='news-img' src='http://www.southasia-uni.org/files/photos/" + $.trim( newsObj[index].news_img ) + ".mid.jpg'/>" + 
			"<p class='news-desc'>" + news_desc + "</p><a href='#full_news_page' id='" + 
			newsObj[index].news_id + "' class='read-more ui-btn ui-btn-b'>Read More</a></li>"
		)
		counter++;
		if( counter == 5 ) return false;
	});
})
.done(function(){
	$("#news_events_page .load-more-news").css( 'visibility', 'visible' );

	$("#news_events_page #news li a").on( 'touchstart click', function(){
		$("#full_news_page .news_content .content").hide();
		$("#full_news_page .news_content").append('<div class="loading"><div class="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>');	
		var newsID = $(this).attr( "id" );
		$.getJSON( dataURL, function( newsObj ) {
			$.each( newsObj, function( index, val ) {
				if( newsObj[index].news_id == newsID ){
					$("#full_news_page .news_content .news_title").text( newsObj[index].news_title );
					$("#full_news_page .news_content .news_img").attr("src","http://www.southasia-uni.org/files/photos/" + $.trim( newsObj[index].news_img ) + ".mid.jpg");
					$("#full_news_page .news_content .news_desc").html( newsObj[index].news_content );
					var htmlStr = $("#full_news_page .news_content .news_desc").text();
					$("#full_news_page .news_content .news_desc").html( htmlStr );
					return false;
				}
			})
		})
		.done( function(){				
			$("#full_news_page .news_content .content").fadeIn( 'fast' );
			$('.loading').fadeOut('fast');
			$('.loading').remove();
		})	
	})
})

$('#load-news').on('touchstart click', function(e) {
	e.preventDefault();
	var flag  = false;
	var counter = 0;
	var lastID = $('#news_events_page #news li:last-child .title a').attr('id');
	$('#news_events_page #news').append( '<div class="loading"><div class="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>' );
	$.getJSON( dataURL, function( newsObj ) {
		$.each( newsObj, function(index, val) {
			if(  newsObj[index].news_id == lastID ){
				flag = true;
				return;
			}
			if( flag == true ){
				$("#news_events_page #news").append(
					"<li><h3 class='title'><a href='#full_news_page' id='" + 
					newsObj[index].news_id + 
					"'>" + newsObj[index].news_title + 
					"</a></h3><img class='news-img' src='http://www.southasia-uni.org/files/photos/" + $.trim( newsObj[index].news_img ) + ".mid.jpg'/>" + 
					"<p class='news-desc'>" + newsObj[index].news_desc + "</p><a href='#full_news_page' id='" + 
					newsObj[index].news_id + "' class='read-more ui-btn ui-btn-b'>Read More</a></li>"
				)
				counter++;
				if( counter == 5 ) return false;
			}
		});
	})
	.done( function(){
		$('.loading').fadeOut('fast');
		$('.loading').remove();
		$("#news_events_page #news li a").on( 'touchstart click', function(){
			$("#full_news_page .news_content .content").hide();
			$("#full_news_page .news_content").append('<div class="loading"><div class="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>');			
			var newsID = $(this).attr( "id" );
			$.getJSON( dataURL, function( newsObj ) {
				$.each( newsObj, function(index, val) {
					if( newsObj[index].news_id == newsID ){
						$("#full_news_page .news_content .news_title").text( newsObj[index].news_title );
						$("#full_news_page .news_content .news_img").attr("src","http://www.southasia-uni.org/files/photos/" + $.trim( newsObj[index].news_img ) + ".mid.jpg");
						$("#full_news_page .news_content .news_desc").html( newsObj[index].news_content );
						var htmlStr = $("#full_news_page .news_content .news_desc").text();
						$("#full_news_page .news_content .news_desc").html( htmlStr );
						return false;
					}
				})
			})
			.done( function(){						
				$("#full_news_page .news_content .content").fadeIn( 'fast' );
				$('.loading').fadeOut('fast');
				$('.loading').remove();
			})	
		})
	})
});

$('#load-img').on('touchstart click', function(e) {
	e.preventDefault();	
	var flag  = false;
	var counter = 0;
	var lastID = $('#photo_page .image_gallery a:last-child').attr('id');
	$('#photo_page .image_gallery').append( '<div class="loading"><div class="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>' );
	var dataURL = "http://www.southasia-uni.org/includes/mobileappcontent/photo_page.php";
	$.getJSON( dataURL,  function( photoObj ) {		
		$.each( photoObj, function(index, val) {
			if( photoObj[index].img_id == lastID ){
				flag = true;
				return;
			}
			if( flag == true ){
				if( photoObj[index].img_active == "yes" ){					
					$('#photo_page .image_gallery').append("<a id='" + photoObj[index].img_id + "'' rel='gallery' href='http://www.southasia-uni.org/files/photos/" + photoObj[index].img_filename + ".hdq." + photoObj[index].img_extension + "'class='swipebox'><img src='http://www.southasia-uni.org/files/photos/" + photoObj[index].img_filename + ".mid." + photoObj[index].img_extension + "'></a>" );					
					counter++;
					if( counter == 5 ) return false;
				}				
			}		
		});
	}) // Photo Gallery swiper script
	.done( function() {
		$('.loading').fadeOut('fast');
		$('.loading').remove();
		$( '.swipebox' ).swipebox({
				hideBarsOnMobile : false
		});
	});
})
// This function checks if the passed url exist or not. We used to it to check the images exist
/*var urlExists = function(url, callback) {

    if ( ! $.isFunction(callback)) {
       throw Error('Not a valid callback');
    }   

    $.ajax({
        type: 'HEAD',
        url: url,
        success: $.proxy(callback, this, true),
        error: $.proxy(callback, this, false)      
    });

};*/

// Google Map script [Using Google Map API]
// Initializing the google map function and it's options
var mapinit = function(){
	var mapOptions = {
          center: new google.maps.LatLng( 23.7947705, 90.4029254 ),
          zoom: 19,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };    
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions );
}

$(document).ready( function() {	
	// Setting the canvas size for google map
	$('#map-canvas').height( $( '[data-role="page"]' ).height() );
	$('#map-canvas').width( $( '[data-role="page"]' ).width() );

	google.maps.event.addDomListener( window, 'load', mapinit );
	//google.maps.event.trigger($('#map-canvas'), 'resize');
	$('[href="#map_page"]').on( 'touchstart click', function(){
		setTimeout( function(){
			window.location.reload();
			window.location.href = 'main.html#map_page';
		}, 100 );
	})
});