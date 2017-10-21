$(document).ready(function() {
	
	var $Form = $('form');
	var qResults;
	$("#noResults").hide();
	var $Container = $('#resultsContainer');
	var $tableContainer = $('#tableContainer');
	$Container.hide();
	$tableContainer.hide();
	
	$Form.on('submit', function(p_oEvent){
		clearOutResults();
		getResults(p_oEvent);     
	});

	/**
	function: getResults
	This function performs the AJAX call to the api
	using the users given input.  Upon success, this
	function calls the fillOutResults function which
	fills out the results table with the data
	*/
	function getResults(p_oEvent){
		var sUrl, sMovie;
		var oData;
	    p_oEvent.preventDefault();
		sMovie = $Form.find('#title').val();
		sUrl = 'https://api.themoviedb.org/3/search/movie?api_key=97058a18f3b899a2e57452cec18ee321&query=' + sMovie;
	    $.ajax(sUrl, {   	
	        complete: function(p_oXHR, p_sStatus){
	            oData = $.parseJSON(p_oXHR.responseText);
				if (oData.Response === "False") {
					$Container.hide();
				}
				else{
					qResults = oData;
					if(qResults.results.length>0){
						$("#noResults").hide();
						fillOutResults(0);
					}
					else{
						$("#noResults").show();
						$Container.hide();
					}
				} 
	        }
	    });
	}

	/*
	function: fillOutResults
	This function takes a starting row number and
	fills out the results table with up to five results
	starting with the given row number.  It fills out
	the table like:
	number - title - score - description - release - add
	*/
	function fillOutResults(row_num) {
		var row = row_num;
		var col = 0;
		
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
					$(this).html(currentResult.vote_average);
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
					$(this).html(currentResult.release_date);
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

	/**
	Function when #nextFive is clicked:
	This function figures out the row number
	based on the last displayed row number + 1
	If the number is less than the amount of results
	returned by the API then it calls fillOutResults
	with the calculated row
	*/
	$("#nextFive").click(function(){
		var row;
		var rOne = $("#resultsOne").find("td:first").text();
		var rTwo = $("#resultsTwo").find("td:first").text();
		var rThree = $("#resultsThree").find("td:first").text();
		var rFour = $("#resultsFour").find("td:first").text();
		var rFive = $("#resultsFive").find("td:first").text();
		//turn this row into a number
		var temp = Number(rFive || rFour || rThree || rTwo || rOne);
		if(temp >= qResults.results.length){
			return;
		}
		else{
				row = temp;
				clearOutResults();
				fillOutResults(row);
		}
	});

	/**
	Function when #prevFive is clicked:
	This function figures out the row number
	based on the first displayed row number - 1
	If the number is greater than 0 then it
	calls fillOutResults with the calculated row
	*/
	$("#prevFive").click(function(){
		var row;
		var rOne = $("#resultsOne").find("td:first").text();
		//turn this row into a number
		var temp = Number(rOne) - 6;
		
		if(temp < 0){
			return;
		}
		else {
			row = temp;
			clearOutResults();
			fillOutResults(row);
		}
	});

	//Handles when clear results is clicked
	$("#clearResults").click(function(){
		clearOutResults(); 
		$Container.hide();
	});

	/**
	Function: clearOutResults()
	Iterates through the results table and 
	sets each td to empty text so that
	a new search, a prev click, and a next click
	will all work without previous data getting in the way
	*/
	function clearOutResults(){
		$("#resultsTable").find("td").each(function() { 
			$(this).html("");
		});
	}

	/**
	Function: addRow clicked
	Ensures that the row the user wants to add
	is not already being displayed.  If it's not
	then it iterates through the cells and adds 
	that information to a new row in the display table
	*/
	$(".addRow").on('click', function(){
		event.stopPropagation();
		var col = 0;
		if(!isDuplicate($(this).parent())){
			var newRow = elt("tr");
			$(this).parent().find("td").each(function(col) {
				var data;
				if(col === 4){
					data = elt("td","dateWidth");
				}
				else{
					data = elt("td");
				}
				col++;
				var node = document.createTextNode($(this).html());
				data.appendChild(node);
				if($(this).html() === "?"){
					data.className="removeThisRow";
					data.onclick = function(){removeRow(data)};		
				}
				newRow.appendChild(data);
			});
			var tc = document.getElementById("displayTable");
			tc.appendChild(newRow);
			setNumbers();
			//console.log($("#displayTable").height())			
			$tableContainer.show();
		}
	});

	/**
	Function: isDuplicate
	Check display table to make sure you don't
	add a movie multiple times by checking to see
	if the date, title, and description don't all match
	*/
	function isDuplicate(row) {
		var dup = false;
		var title = $(':nth-child(2)',row).html();
		var description = $(':nth-child(4)',row).html();
		var date = $(':nth-child(5)',row).html();
		var dt, ddes, dd;
		$("#displayTable").find("tr").each(function() {
			dt = $(':nth-child(2)',this).html();
			dd = $(':nth-child(5)',this).html();
			ddes = $(':nth-child(4)',this).html();
			if(title == dt && description == ddes && date == dd){
				dup = true;
			}
			//$(this).children("td:first").html(s);
		});
		return dup;
	}

	/**
	function: elt
	Given an element name and optional classname
	this function creates a new element and returns it
	*/
	function elt(name, className) {
		var elt = document.createElement(name);
		if(className){
			elt.className = className;
		}
		return elt;
	}

	/**
	Function: removeRow
	This function handles when a user clicks
	to remove a row.  It removes the tr element
	from the table element.  If the resulting table
	is empty then it hides the container, otherwise
	it updates the row numbers
	*/
	function removeRow(data){
		var parent = data.parentElement.parentElement;
		var child = data.parentElement; 
		parent.removeChild(child);
		if(isDisplayTableEmpty()){
			$tableContainer.hide();
		}
		else{
			setNumbers();
		}

	}

	/**
	Function: isDisplayTableEmpty
	This function ensures that there is at least one row of data
	*/
	function isDisplayTableEmpty(){
		var table = document.getElementById("displayTable");
		var rows = table.getElementsByTagName("tr");
		if (rows.length > 1) {
			return false;
		}
		return true;
	}

	/*
	Function: setNumbers
	This function iterates through the rows
	excluding the header and sets the row numbers
	*/
	function setNumbers() {
		var count = 1;
		$("#displayTable").find("tr").each(function(count) {
			var s = count;
			$(this).children("td:first").html(s);
			s++;
			
		});
		count = 1;
	}


	/**
	Function sortTable
	This function is called when one of the sortable columns
	has it's heading clicked.  It iterates through the table
	sorting in asc if unsorted or if it is sorted it switched
	between asc and desc.  As the table is being iterated through
	two rows are compared.  If they should switch places than
	they are marked to switch.  The iteration loop is has a break
	and then the rows are switched.  The loop happens until it
	goes through the table without switching any rows.  
	Afterwards setNumbers is called to update the row numbers
	*/
	$("#titleHeading").click(function(){sortTable(1)});
	$("#ratingHeading").click(function(){sortTable(2)});
	$("#descriptionHeading").click(function(){sortTable(3)});
	$("#yearHeading").click(function(){sortTable(4)});
	function sortTable(n) {
  		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  		table = document.getElementById("displayTable");
  		switching = true;
  		dir = "asc";
 
  		while (switching) {
  		  switching = false;
  		  rows = table.getElementsByTagName("tr");
  		  for (i = 1; i < (rows.length - 1); i++) {
  		    shouldSwitch = false;
  		    x = rows[i].getElementsByTagName("td")[n];
  		    y = rows[i + 1].getElementsByTagName("td")[n];
  		    if (dir == "asc") {
  		      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
  		        shouldSwitch= true;
  		        break;
  		      }
  		    } else if (dir == "desc") {
  		      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
  		        shouldSwitch= true;
  		        break;
  		      }
  		    }
  		  }
  		  if (shouldSwitch) {
  		    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
  		    switching = true;
  		    switchcount ++;
  		  } else {
  		    if (switchcount == 0 && dir == "asc") {
  		      dir = "desc";
  		      switching = true;
  		    }
  		  }
  		}
  		setNumbers();
	}

	/**
	Function: clearDisplay clicked
	This function removes every non-header row
	from the display table and then hides the container
	*/
	$("#clearDisplay").click(function(){
		var table = document.getElementById("displayTable");
		var rows = table.getElementsByTagName("tr");
		for(var i = rows.length-1; i > 0; i--){
			table.removeChild(rows[i]);
		}
		$tableContainer.hide();
	});
});