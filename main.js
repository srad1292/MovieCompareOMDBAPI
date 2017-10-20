/**

Steps done 

1 - Main Heading
2 - Title Input
3 - Get data through API from title input
4 - Search button works
5 - Display results of the search
6 - Displays five items at a time
7 - Correctly displays even if a movie has an empty field
8 - Searching, prev, next clears first
9 - Previous works only when it should
10 - Next works only when it should
11 - Clear works
12 - Button on a result adds movie to 'your movies'
13 - 'your movies' displays correctly
14 - Removing an item from 'your movies' works
15 - Numbers update accurately
16 - Clicking to add doesn't add something already added
17 - Sort the 'your movies' table
18 - A clear button for 'your movies'

Should - 
1 - A 0 rating be left as 0 or changed to N/A (how does each affect sorting)
2 - Removing the only item on results table hide the table

Steps left
1 - Make tables look nice(maybe use bootstrap)
2 - Clean up UI
3 - Clean up code
*/

$(document).ready(function() {
	
	/**
	Set the maximum for the year picker to 
	the present year + a few years ahead
	*/
	var COLS = 5;
	var currentYear = (new Date()).getFullYear();
	$("#year").attr("max",currentYear+5);
	var $Form = $('form');
	var qResults;
	var $Container = $('#resultsContainer');
	var $tableContainer = $('#tableContainer');
	$Container.hide();
	$tableContainer.hide();
	//initDisplayTable();
	
	$Form.on('submit', function(p_oEvent){
		clearOutResults();
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
					var over = currentResult.overview;
					if(over === ""){
						over = "N/A";
					}
					
					$(this).html(over);
					col++;
				}
				else if(col == 4){
					$(this).html(currentResult.vote_average);
					col++;
				}
				else if(col ==5){
					col = 0;
					row += 1;
					$(this).text("?")
					if(qResults.results.length > row){
						currentResult = qResults.results[row];

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

	/**
	Check display table to make sure you don't
	add a movie multiple times
	*/
	function isDuplicate(row) {
		var dup = false;
		var title = $(':nth-child(2)',row).html();
		var date = $(':nth-child(3)',row).html();
		var description = $(':nth-child(4)',row).html();
		var dt, dd, ddes;
		$("#displayTable").find("tr").each(function() {
			dt = $(':nth-child(2)',this).html();
			dd = $(':nth-child(3)',this).html();
			ddes = $(':nth-child(4)',this).html();
			if(title == dt && date == dd && description == ddes){
				console.log("duplicate");
				dup = true;
			}
			//$(this).children("td:first").html(s);
		});
		return dup;
	}

	$(".addRow").on('click', function(){
		event.stopPropagation();
		if(!isDuplicate($(this).parent())){
			var newRow = elt("tr");
			$(this).parent().find("td").each(function() {
				console.log("Value: " + $(this).html());
				var data = elt("td");
				var node = document.createTextNode($(this).html());
				data.appendChild(node);
				if($(this).html() === "?"){
					data.onclick = function(){removeRow(data)};		
				}
				newRow.appendChild(data);
			});
			var tc = document.getElementById("displayTable");
			tc.appendChild(newRow);
			setNumbers();
			//$tableContainer.append(newRow);
			$tableContainer.show();
		}
		//create a row with data based on the row to add
		//add row to the table
		//display the table
	});


	function elt(name, className) {
		var elt = document.createElement(name);
		if(className){
			elt.className = className;
		}
		return elt;
	}

	function removeRow(data){
		var parent = data.parentElement.parentElement;
		var child = data.parentElement; 
		//console.log()
		console.log(data.parentElement.parentElement);
		parent.removeChild(child);
		if(isDisplayTableEmpty()){
			$tableContainer.hide();
		}
		else{
			setNumbers();
		}

	}

	function isDisplayTableEmpty(){
		var table = document.getElementById("displayTable");
		var rows = table.getElementsByTagName("tr");
		if (rows.length > 1) {
			return false;
		}
		return true;
	}

	function setNumbers() {
		var count = 1;
		$("#displayTable").find("tr").each(function(count) {
			var s = count;
			$(this).children("td:first").html(s);
			s++;
			
		});
		count = 1;
	}



	$("#nextFive").click(function(){fillOutResults("next")});
	$("#prevFive").click(function(){fillOutResults("prev")});
	$("#clearResults").click(function(){
		clearOutResults(); 
		$Container.hide();
	});


	$("#titleHeading").click(function(){sortTable(1)});
	$("#yearHeading").click(function(){sortTable(2)});
	$("#descriptionHeading").click(function(){sortTable(3)});
	$("#ratingHeading").click(function(){sortTable(4)});
	function sortTable(n) {
  		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  		table = document.getElementById("displayTable");
  		switching = true;
  		// Set the sorting direction to ascending:
  		dir = "asc";
  		/* Make a loop that will continue until
  		no switching has been done: */
  		while (switching) {
  		  // Start by saying: no switching is done:
  		  switching = false;
  		  rows = table.getElementsByTagName("tr");
  		  /* Loop through all table rows (except the
  		  first, which contains table headers): */
  		  for (i = 1; i < (rows.length - 1); i++) {
  		    // Start by saying there should be no switching:
  		    shouldSwitch = false;
  		    /* Get the two elements you want to compare,
  		    one from current row and one from the next: */
  		    x = rows[i].getElementsByTagName("td")[n];
  		    y = rows[i + 1].getElementsByTagName("td")[n];
  		    /* Check if the two rows should switch place,
  		    based on the direction, asc or desc: */
  		    if (dir == "asc") {
  		      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
  		        // If so, mark as a switch and break the loop:
  		        shouldSwitch= true;
  		        break;
  		      }
  		    } else if (dir == "desc") {
  		      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
  		        // If so, mark as a switch and break the loop:
  		        shouldSwitch= true;
  		        break;
  		      }
  		    }
  		  }
  		  if (shouldSwitch) {
  		    /* If a switch has been marked, make the switch
  		    and mark that a switch has been done: */
  		    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
  		    switching = true;
  		    // Each time a switch is done, increase this count by 1:
  		    switchcount ++;
  		  } else {
  		    /* If no switching has been done AND the direction is "asc",
  		    set the direction to "desc" and run the while loop again. */
  		    if (switchcount == 0 && dir == "asc") {
  		      dir = "desc";
  		      switching = true;
  		    }
  		  }
  		}
  		setNumbers();
	}


	$("#clearDisplay").click(function(){
		var table = document.getElementById("displayTable");
		var rows = table.getElementsByTagName("tr");
		for(var i = rows.length-1; i > 0; i--){
			table.removeChild(rows[i]);
			//removeRow(rows[i].firstChild);
		}
		$tableContainer.hide();
	});
});







