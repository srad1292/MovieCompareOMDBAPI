$(document).ready(function() {
	var $Form = $('form');
	var $Container = $('#resultsContainer');
	$Container.hide();
	
	$Form.on('submit', function(p_oEvent){
		fillOutResults(p_oEvent);       
	});


	function fillOutResults(p_oEvent) {
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
	            console.log("Results: " + oData.results.length);	
				if (oData.Response === "False") {
					$Container.hide();
				} 
				else {
					var row = 0;
					var col = 0;
					var currentResult = oData.results[row];
					$("#resultsTable").find("td").each(function() {
						if(row < oData.results.length){
							if(col === 0){
								$(this).html((row+1) + "");
								col+=1;
							}
							
							else if(col === 1) {
								$(this).html(currentResult.title);
								col++;
							}
							else if(col === 2) {
								$(this).html(currentResult.release_date);
								col++
							}
							else if(col === 3) {
								$(this).html(currentResult.overview);
								col = 0;
								row += 1;
								if(oData.results.length > row){
									currentResult = oData.results[row];
								}
							}
						}

					});

					//$("#resultsOne:nth-child(2)").text(oData.title);
					
					$Container.show();
					
				}
	        }
	    }); 
	}
});