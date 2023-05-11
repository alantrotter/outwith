var photographycollection = [];
var currentcategory;
var currentcategoryname;
var requestphotonumber;
const urlState = "";


$(document).ready(function() {
	if($('.photograph-container').length != 0) {
		
		addlinkswherewanted();
		initialphotocountsetup();
		navlinkclick();
		setalttext();
	}
	//this is to show all the photo-category containers on the front page for mobile
	if (document.location.pathname.split(/\/(?=.)/).length == 1) {
		console.log('i want to turn on all of the categories for mobile');
		$('style').text("@media (max-width: 768px) {.photograph-container { display: block; }}")
	}

});


function initialphotocountsetup() {
	
	
	//for each photograph container
	$(".photograph-container").each(function(i){
		
		
		//check if this is the first category and save in variable to add to object details
		var isfirst;
		if (i == 0) {
			isfirst = 'yes';
			//turn on the first category
			$(this).addClass('on');
			
		} else {
			isfirst = 'no';
		}
		
		//make an object including name of category, number of photos and current photo as 1
		// nb: number of photos is an index, so 1 less than total
		let collectiondetails = {
			'photocategory': $(this).attr('data-category'),
			'numberofphotos': ($(this).find('img').length - 1),
			'currentphoto': 0,
			'iscurrent': isfirst
		}
				
		//add object with category, number of photos and current photo to array
		photographycollection.push(collectiondetails);
				
	});
	
	//set variable currentcategory to the initial current category
	currentcategory = photographycollection.find(collectiondetails => collectiondetails.iscurrent === 'yes');
	//and set currentcategoryname for ease
	currentcategoryname = currentcategory.photocategory;
	
	//call populatephotoicons function to put in photo icon nav links, using number of photos in current category
	populatephotonavicons(currentcategory.numberofphotos);
	
	console.log('current category is ' + currentcategory.photocategory);
	
	$('a.main-nav-link[data-category="' + currentcategory.photocategory +'"]').addClass('selected');
	
	// localStorage.setItem('category', currentcategory.photocategory);
	// const categoryfromstorage = localStorage.getItem('category');
	// console.log(categoryfromstorage);  
	
	
	getcaption();
		
	manageexternallink();
}

function populatephotonavicons(number) {
	
	//reset to zero
	$('a.photo-icon-link').remove();

	//loop for the number of icons called	
	for (let i = 0; i <= number; i++) {
		
		//if icon number matches current category's current photo number, add current icon, else add normal icon
		if (currentcategory.currentphoto == i) {
			$('.photo-nav').append('<a class="photo-icon-link current" href="#"><img src="/img/photo-icon.svg" class="photo-icon" alt="A small nav icon representing a photo" /></a>');
		} else {
			$('.photo-nav').append('<a class="photo-icon-link" href="#"><img src="/img/photo-icon.svg" class="photo-icon" alt="A small nav icon representing a photo" /></a>');
		}
		
	}
	
	
}

function navlinkclick() {
	$('a.main-nav-link').click(function(e) {
		
		//disable default action
		e.preventDefault();		
		
		//check if clicked category is the same as the current one and if so call change photo function
		if ($(this).attr('data-category') == currentcategory.photocategory) {
			
			//get the current photo and the number of photos in the current category
			var currentphotonumber = currentcategory.currentphoto;
			var numberofphotos = currentcategory.numberofphotos;
			
			
			//if the number of photos is greater than the number of available photos add one 
			//else request the photo zero to go back to the start
			if (numberofphotos > currentphotonumber) {
				requestphotonumber = currentphotonumber + 1;
			} else {
				requestphotonumber = 0;
			}
			
			//call the changephoto function with the correct photo number
			changephoto(requestphotonumber);
		} 
		//else call change category function
		else {
			
			//set a variable 'requestedcategory name based on the clicked category link'
			var requestedcategoryname = $(this).attr('data-category');			
		
			//search with this category name through the photographycollection array and save the requested category object 
			let requestedcategoryobject = photographycollection.find(requestedcategoryobject => requestedcategoryobject.photocategory === requestedcategoryname);
			
			//call the changecategory function, passing it the requestedcategoryobject
			changecategory(requestedcategoryobject);
		}
		
		
	});
	$('.photo-nav').on("click", ".photo-icon-link", function(e) {
		
		//disable default action
		e.preventDefault();
		
		//call the changephoto function with the correct photo number
		changephoto($('.photo-icon-link').index(this));
		
	});
	$('a.next-link').click(function(e) {
		e.preventDefault();
		
		if(currentcategory.currentphoto != currentcategory.numberofphotos) {
			changephoto(currentcategory.currentphoto + 1);
		} else {
			changephoto(0);
		}
	});
	$('a.prev-link').click(function(e) {
		e.preventDefault();
		if(currentcategory.currentphoto != 0) {
			changephoto(currentcategory.currentphoto - 1);
		} else {
			changephoto(currentcategory.numberofphotos);
		}
	});
}

function changecategory(requestedcategoryobject) {
	
	// set the hasbeen category and the new current category. give variables for the names to make easier to work with
	var hasbeencategory = currentcategory;
	hasbeencategory.iscurrent = 'no';
	var hasbeencategoryname = hasbeencategory.photocategory;
	currentcategory = requestedcategoryobject;
	currentcategoryname = currentcategory.photocategory;
	currentcategory.iscurrent = 'yes';
	
	//remove 'selected' class from hasbeen category main nav link
	$('a.main-nav-link[data-category="' + hasbeencategoryname +'"]').removeClass('selected');
	
	//add 'selected' class to requested category main nav link
	$('a.main-nav-link[data-category="' + currentcategoryname +'"]').addClass('selected');
	
	
	//hide photograph container for the old category and reveal the requested one
	$('.photograph-container[data-category="' + hasbeencategoryname + '"]').removeClass('on');
	$('.photograph-container[data-category="' + currentcategoryname + '"]').addClass('on');
	
	//call the function to update the photo nav icons
	populatephotonavicons(currentcategory.numberofphotos);
	
	const urlState = currentcategoryname;
	//update the URL and add the state
	history.replaceState(urlState, '', '/' + urlState);
	
	getcaption();
	
	manageexternallink();
		
}

function changephoto(requestedphoto) {
		
	//set currentphotocontainer based on the current category
	var currentphotographcontainer = $('.photograph-container[data-category="' + currentcategoryname + '"]');
	
	//turn off the current photo and turn on the new one
	currentphotographcontainer.find('img.main-photograph.on').removeClass('on');
	currentphotographcontainer.find('img.main-photograph').eq(requestedphoto).addClass('on');
	
	
	//update the currentphotonumber
	currentcategory.currentphoto = requestedphoto;
		
	getcaption();
	
	//update the photo icon by removing the old current class and adding to the new one
	$('.photo-nav').find('.photo-icon-link.current').removeClass('current');
	$('.photo-nav').children('.photo-icon-link').eq(requestedphoto).addClass('current');
	
	manageexternallink();
	
}



function getcaption() {
	//empty the caption element and add in the new one if there is one
	$('.caption').empty();
	var desiredcaption = $('.photograph-container[data-category="' + currentcategoryname + '"]').find('img.main-photograph').eq(currentcategory.currentphoto).attr('data-caption');
	console.log("desired caption is" + desiredcaption);
	if (desiredcaption) {
		$('.caption').html('<p>' + desiredcaption + '</p>');
		balanceText($('.caption p'));
	}
	
	$('.caption p a').attr('target', 'blank');
}

function setalttext() {
	$(".main-photograph").each(function(i){
	
		//get the caption as a string, make it into HTML and then make that text to get rid of HTML tags. Then set it as the alt attribute
		var caption = $(this).attr('data-caption');
		caption = $.parseHTML(caption);
		caption = $.text(caption);
		$(this).attr('alt', caption);
	
	}); 
}

function addlinkswherewanted() {
	$('.nav-sidebar').after('<a href="#" class="next-link"></><a href="#" class="prev-link"></a>');
	
	// $(".main-photograph").each(function(i){
	// 	if($(this).attr('data-link')) {
	// 		$(this).wrap('<a href="' + $(this).attr('data-link') + '" target="_blank"></a>');
	// 	}
	// 	
	// });
}

function manageexternallink() {
	
	$('a.external-link, .external-link-overlay').remove();
	
	if($('.photograph-container.on .main-photograph.on').attr('data-link')) {
		var linktouse = $('.photograph-container.on .main-photograph.on').attr('data-link');
		var handsomelink = linktouse.replace(/^https?\:\/\//i, "");		
		$('.prev-link').after("<a href='" + linktouse + "' target='_blank' class='external-link'></a><div class='external-link-overlay'><p>" + handsomelink + "</p></div>");
	}

}