$(document).ready(function() {
	
	/**
	Set the maximum for the year picker to 
	the present year + a few years ahead
	*/
	var currentYear = (new Date()).getFullYear();
	$("#year").attr("max",currentYear+5);
	var $Form = $('form');
	var qResults;
	var $Container = $('#resultsContainer');
	$Container.hide();
	
	$Form.on('submit', function(p_oEvent){
		getResults(p_oEvent);     
	});

	function getResults(p_oEvent){
		var sUrl, sMovie;
		var oData;
	    p_oEvent.preventDefault();
		sMovie = $Form.find('#title').val();
	    //Get movie by id
	    //sUrl = 'https://api.themoviedb.org/3/movie/330459?api_key=97058a18f3b899a2e57452cec18ee321';
		//Search for movies with given text
		sUrl = 'https://api.themoviedb.org/3/search/movie?api_key=97058a18f3b899a2e57452cec18ee321&query=' + sMovie;
	    $.ajax(sUrl, {
	    	
	        complete: function(p_oXHR, p_sStatus){
	            oData = $.parseJSON(p_oXHR.responseText);
	            console.log(oData);	
				if (oData.Response === "False") {
					$Container.hide();
				}
				else{
//					setData(oData);
					qResults = oData;
					fillOutResults("search");
				} 
	        }
	    });

	}

	function fillOutResults(callee) {
		var row = 0;
		var col = 0;
	
		if(callee !== "search"){
			var rOne = $("#resultsOne").find("td:first").text();
			var rTwo = $("#resultsTwo").find("td:first").text();
			var rThree = $("#resultsThree").find("td:first").text();
			var rFour = $("#resultsFour").find("td:first").text();
			var rFive = $("#resultsFive").find("td:first").text();
		}
		if(callee === "next"){
			//turn this row into a number
			var temp = Number(rFive || rFour || rThree || rTwo || rOne);
			if(temp >= qResults.results.length) return;
			else{
				row = temp;
				clearOutResults();
			}
		}
		if(callee === "prev"){
			//turn this row into a number
			var temp = Number(rOne) - 6;
			
			if(temp < 0) return;
			else {
				row = temp;
				clearOutResults();
			}

		}
	
		var currentResult = qResults.results[row];
		$("#resultsTable").find("td").each(function() {
			if(row < qResults.results.length){
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
					if(qResults.results.length > row){
						currentResult = qResults.results[row];
						console.log(currentResult);
					}
				}
			}
		}); 
		$Container.show();
	}

	function setData(oData) {
		qResults = oData;
	}

	function clearOutResults(){
		$("#resultsTable").find("td").each(function() { 
			$(this).html("");
		});
	}

	$("#nextFive").click(function(){fillOutResults("next")});
	$("#prevFive").click(function(){fillOutResults("prev")});
	$("#clearResults").click(function(){
		clearOutResults(); 
		$Container.hide();
	});



});







