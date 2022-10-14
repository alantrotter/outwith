$(document).ready(function() {
	selectcategory()
});

function selectcategory() {

	//when clicking one of the category links
	$('a.main-nav').click(function(e) {
	
		//this line just stops it visiting the href which is always #
		e.preventDefault();
	
		var category = $(this).attr('data-category');
		var currentcontainer = $('.' + category);
		var currentphoto;
		var nextphoto;
		
		//for cycling through pictures in the currently selected category
		if ($(this).hasClass('selected')) {

			currentphoto = currentcontainer.find('.on');
			
			if (currentphoto.next().length != 0) {
				nextphoto = currentphoto.next();
			} else {
				console.log('I am at the end');
				nextphoto = currentcontainer.children(":first");
			}
			
			nextphoto.addClass('on');
			currentphoto.removeClass('on');
			
		} 
		//if selecting a different category
		else {
			$('a.main-nav').removeClass('selected');
			$(this).addClass('selected');
			
			$('.photograph-container').removeClass('on');
			currentcontainer.addClass('on');
		
			
			if (currentcontainer.find('.on').attr('data-contrast') == 'light') {
				console.log('wants light');
				$('a.main-nav, a.secondary-nav').addClass('light');
			} else {
				$('a.main-nav, a.secondary-nav').removeClass('light');
			}
			
		}
	
	  });

}