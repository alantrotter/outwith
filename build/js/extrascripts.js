var photographycollection = [];
var currentcategory;
var currentcategoryname;
var requestphotonumber


$(document).ready(function() {
	initialphotocountsetup();
	navlinkclick();
});


function initialphotocountsetup() {
	
	//for each photograph container
	$(".photograph-container").each(function(i){

		//check if this is the first category and save in variable to add to object details
		var isfirst;
		if (i == 0) {
			isfirst = 'yes';
		} else {
			isfirst = 'no';
		}
		
		//make an object including name of category, number of photos and current photo as 1
		// nb: number of photos is an index, so 1 less than total
		let collectiondetails = {
			'photocategory': $(this).attr('data-category'),
			'numberofphotos': ($(this).children('img').length - 1),
			'currentphoto': 0,
			'iscurrent': isfirst
		}
				
		//add object with category, number of photos and current photo to array
		photographycollection.push(collectiondetails);
				
	});
	
	//set variable currentcategory to the initial current category (the first given)
	currentcategory = photographycollection.find(collectiondetails => collectiondetails.iscurrent === 'yes');
	//and set currentcategoryname for ease
	currentcategoryname = currentcategory.photocategory;
	
	//call populatephotoicons function to put in photo icon nav links, using number of photos in current category
	populatephotonavicons(currentcategory.numberofphotos);
	
	console.log('current category is ' + currentcategory.photocategory);
	
}

function populatephotonavicons(number) {
	
	//reset to zero
	$('a.photo-icon').remove();

	//loop for the number of icons called	
	for (let i = 0; i <= number; i++) {
		
		//if icon number matches current category's current photo number, add current icon, else add normal icon
		if (currentcategory.currentphoto == i) {
			$('.photo-nav').append('<a class="photo-icon current" href="#"></a>');
		} else {
			$('.photo-nav').append('<a class="photo-icon" href="#"></a>');
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
	$('.photo-nav').on("click", ".photo-icon", function(e) {
		
		//disable default action
		e.preventDefault();
		
		//call the changephoto function with the correct photo number
		changephoto($('.photo-icon').index(this));
		
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
	
	//call the function to change link colours if necessary
	changecoloursforlegibility();
}

function changephoto(requestedphoto) {
		
	//set currentphotocontainer based on the current category
	var currentphotographcontainer = $('.photograph-container[data-category="' + currentcategoryname + '"]');
	
	//turn off the current photo and turn on the new one
	currentphotographcontainer.find('img.main-photograph.on').removeClass('on');
	currentphotographcontainer.children('img.main-photograph').eq(requestedphoto).addClass('on');
	
	//update the currentphotonumber
	currentcategory.currentphoto = requestedphoto;
	
	//update the photo icon by removing the old current class and adding to the new one
	$('.photo-nav').find('.photo-icon.current').removeClass('current');
	$('.photo-nav').children('.photo-icon').eq(requestedphoto).addClass('current');
	
}

function changecoloursforlegibility(desiredcolours) {
	console.log('checking that colours are right!' + desiredcolours);
}
