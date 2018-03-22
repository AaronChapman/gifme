//giphy api query url base string
var query_url_base = "https://api.giphy.com/v1/gifs/search?q=";
//giphy api key
var api_key = "d4yPfpaYz2cEvmJp1Mrg40WSQT3Vrwy8";
//variables that holds the current category of gifs being displayed
var category_input = "hayao miyazaki";
//default categories
var initial_categories = ["studio ghibli", "hayao miyazaki", "spirited away", "my neighbor totoro", "howl's moving castle", "princess mononoke", "ponyo", "the wind rises", "kiki's delivery service", "nausicaa valley of the wind", "porco rosso", "the secret world of arrietty", "hoshi o katta hi"];

//when the document is ready to be modified
$(document).ready(function() {
	//if a category button is clicked
	$(".category_buttons").on("click", ".category_button", function() {
		//set the current category to the value of whichever button was clicked
		category_input = $(this).val();

		//populate gifs
		populate_gif_board();
	});

	//when the add category button is clicked
	$(".add_category").on("click", function() {
		//if the user has typed anything in the category_addition_input text field
		if ($(".category_addition_input").val()) {
			//set the current gif category to the value of whatever has been typed there
			category_input = $(".category_addition_input").val();

			//create a new button and give it the appropriate attirbutes
			var category_button = $("<input>");

			category_button.prop('type', 'button').prop('value', category_input).addClass("category_button");

			//add the new button the category_buttons container
			$(".category_buttons").append(category_button);

			//and populate gifs
			populate_gif_board();
		} else
			$(".status_message").text("enter a gif category to add");
	});

	//when the remove current category button is clicked
	$(".remove_category").on("click", function() {
		//safety check
		if (category_input !== "") {
			//scan through category buttons and remove any that have a value matching the category to be removed
			$('.category_buttons :input[type=button]').each(function() {
				if ($(this).val() === category_input)
					$(this).remove();
			});

			//reset category variable
			category_input = "";

			//empty the gif_board container and update the application status
			$(".gif_board").empty();
			$(".status_message").text("choose or add a category of gifs");
		} else
			$(".status_message").text("no category selected");
	});

	//when a gif element is clicked inside the gif_board container
	$(".gif_board").on("click", ".gif", function() {
		//get instance of clicked element
		var clicked_gif = $(this)[0];

		//determine if clicked element's animation state is still or animated, then sets properties accordingly
		if ($(clicked_gif).data('state') === "still")
			$(clicked_gif).data('state', "animate").attr('src', $(clicked_gif).data('animated')).css('opacity', 1);
		else
			$(clicked_gif).data('state', "still").attr('src', $(clicked_gif).data('still')).css('opacity', 0.5);
	});

});

//initializes category buttons from initial_categories array
function populate_categories() {
	for (var i = 0; i < initial_categories.length; i++) {
		//creating % referencing html elements
		var the_button = $("<input>");
		var category_buttons = $(".category_buttons");

		//setting the new button's attributes and appending it to the category_buttons container
		the_button.attr('type', 'button').attr('value', initial_categories[i]).addClass("category_button");
		category_buttons.append(the_button);
	}
}

//populates the gif_board container with gifs
function populate_gif_board() {
	//remove current child elements, reset the category input field, and update the application status
	$(".gif_board").empty();
	$(".category_addition_input").val("");
	$(".status_message").text("click a gif to animate (it might take a second to load)");

	//reset, then build the giphy api query_url string
	query_url = "";
	query_url = query_url_base + category_input + "&rating=pg-13&limit=9&api_key=" + api_key;

	//ajax call to query_url
	$.ajax({
		url: query_url,
		method: "GET"
	}).done(function(response) {
		//store response from giphy in a 'results' variable
		var results = response.data;

		//loop to append gifs to the gif_board container
		for (var i = 0; i < 9; i++) {
			//store the still and animated gif urls returned from the api query
			var still_url = results[i].images.fixed_width_still.url, 
				animated_url = results[i].images.fixed_width.url;
			//create html elements for the gif panel, which houses the gif, and the rating containers
			var the_gif = $("<img>");
			var gif_rating = $("<p>");
			var gif_panel = $("<div>");
			//reference to the gif_board container
			var gif_board = $(".gif_board");

			//add appropriate attributes (initial source, animated & still image urls, and their animation state) to the gif's container
			the_gif.addClass("gif")
				.attr('src', still_url)
				.data('still', still_url)
				.data('animated', animated_url)
				.data('state', "still");

			//add appropriate attirbutes to the gif rating container
			gif_rating.addClass("gif_rating")
				.text(results[i].rating);

			//add appropriate attirbutes to the gif panel container
			gif_panel.addClass("gif_panel")
				.append(gif_rating)
				.append(the_gif);

			//append the newly constructed gif panel to the gif_board container
			gif_board.append(gif_panel);
		}
	});
}