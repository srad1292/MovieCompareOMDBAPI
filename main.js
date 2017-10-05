$(document).ready(function() {
	var $Form = $('form');
	var $Container = $('#resultsContainer');
	$Container.hide();
	$Form.on('submit', function(p_oEvent){
	    var sUrl, sMovie, oData;
	    p_oEvent.preventDefault();
		sMovie = $Form.find('#title').val();
	    //Get movie by id
	    //sUrl = 'https://api.themoviedb.org/3/movie/330459?api_key=97058a18f3b899a2e57452cec18ee321';
		//Search for movies with given text
		sUrl = 'https://api.themoviedb.org/3/search/movie?api_key=97058a18f3b899a2e57452cec18ee321&query=' + sMovie;
	    $.ajax(sUrl, {
	        complete: function(p_oXHR, p_sStatus){
	            oData = $.parseJSON(p_oXHR.responseText);
	            oData = oData.results[0];
	            console.log(oData);

	
				if (oData.Response === "False") {
					$Container.hide();
				} else {
					console.log("Title: " + oData.title);
					$('.foundTitle').text("Title: " + oData.title);
					$Container.find('.plot').text("Plot: " + oData.overview);
					$Container.find('.year').text("Release: " + oData.release_date);
					$Container.show();
				}
	        }
	    });    
	});
});