var wordlist = new Array();
var boardlist = new Array();
var boardstring = "";

// define board cell object (holds word and color parameters)
var BoardCell = function(word, color) {
	this.color = color;
	this.word = word;
}

// define colors
var forum_color_map = {
	'red': '#FF0000',
	'blue': '#1E90FF',
	'grey': '#A9A9A9',
	'black': '#000000'
}

// function called by clicking 'Create!'
function createTable() {
	var wordstring = document.getElementById('wordlist').value;
	wordlist = wordstring.split(/\s/);
	if (wordlist.length < 25) {
		alert("Error - Table generation attempted on wordlist of less than 25 words");
	} else {
		createBoard();
	}
}

// function for displaying error message to user
function giveError(errorMsg) {
	var resultsDiv = document.getElementById('resultsDiv');
	
	// remove all previously entered child nodes
	while (resultsDiv.firstChild) {
		resultsDiv.removeChild(resultsDiv.firstChild);
	}
	
	var errorSpan = document.createElement('span');
	var errorP = document.createElement('p');
	var errorText = document.createTextNode(errorMsg);
	
	errorSpan.style.fontSize = "20px";
	errorSpan.style.color = "red";
	errorSpan.style.fontWeight = "strong";
	errorP.appendChild(errorText);
	errorSpan.appendChild(errorP);
	resultsDiv.appendChild(errorSpan);
}

// generate randomized board
function createBoard() {
	pickWords(createColorMap());
	
	displayBoard();
	displayCopyOptions();
}

// function to randomly pick words from inputed listStyleType
function pickWords(color_map) {

	
	var board_idx = 0;
	var words_to_pick = 25;
	var picked_word = "";
	var idx = -1;
	
	while (words_to_pick > 0) {
		idx = Math.floor(Math.random() * wordlist.length);
		picked_word = wordlist.splice(idx, 1);
		boardlist[board_idx] = new BoardCell(picked_word[0], color_map[board_idx]);    // initially all words are set to grey
		board_idx += 1;
		words_to_pick -= 1;
	}
}

// function to set colors randomly for words
function createColorMap() {
	var color_bomb = "black";
	var color_teams = ["red", "blue"];
	var current_color;
	var color_map = [];
	
	// determine which team is going first
	var radio_buttons = document.getElementsByName('team-select');
	for (var i = 0; i < radio_buttons.length; i++) {
		if (radio_buttons[i].checked) {
			current_color = radio_buttons[i].value;
		}
	}
	
	// create color map with number of colors we want
	var i;
	
	// 0-8: first team's color
	for (i = 0; i < 9; i++) {
		color_map[i] = forum_color_map[color_teams[current_color]];
	}
	
	// change color index
	current_color++;
	if (current_color >= color_teams.length) {
		current_color = 0;
	}
	
	// 9-16: second team's color
	for (i = 9; i < 17; i++) {
		color_map[i] = forum_color_map[color_teams[current_color]];
	}
	
	
	// 17: black
	color_map.push(forum_color_map[color_bomb]);
	
	// 18-24: grey
	for (i = 18; i < 25; i++) {
		color_map[i] = forum_color_map["grey"];
	}
	
	// randomize order of color map
	shuffle(color_map);
	
	return color_map;
	
}

// helper function for shuffling elements in array
// taken from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


// function to create DOM elements to display board of picked words
// also generates ForumCode as it loops
function displayBoard() {
	var resultsDiv = document.getElementById('resultsDiv');
		
	// clear results div
	while (resultsDiv.firstChild) {
		resultsDiv.removeChild(resultsDiv.firstChild);
	}
	var num_rows = 5;
	var num_cols = 5;
	var board_list_idx = -1;
	
	// forum code generation setup
	boardstring = "[size=x-large][b][Table=30]";
	
	var results_table = document.createElement('table');
	results_table.style.border = "1px solid black";
	
	var results_tbody = document.createElement('tbody');
	results_tbody.style.fontSize = "32px";
	results_tbody.style.fontWeight = "bold";
	
	for (i = 0; i < num_rows; i++) {
		var results_tr = document.createElement('tr');
		boardstring += "[TR]";
		for (j = 0; j < num_cols; j++) {
			board_list_idx = (i * 5) + j;
			var results_td = document.createElement('td');
			var results_word = document.createTextNode(boardlist[board_list_idx].word);
			results_td.style.color = boardlist[board_list_idx].color;
			results_td.style.padding = "5px";
			results_td.style.border = "2px solid black";
			results_td.appendChild(results_word);
			results_tr.appendChild(results_td);
			
			// generate forum text
			boardstring += "[TD]";
			boardstring += "[color=" + boardlist[board_list_idx].color + "]";
			boardstring += boardlist[board_list_idx].word;
			boardstring += "[/color][/TD]"
		}
		results_tbody.appendChild(results_tr);
		boardstring += "[/TR]";
	}
	results_table.appendChild(results_tbody);
	resultsDiv.appendChild(results_table);
	
	boardstring += "[/Table][/b][/size]";
}

// generates string of text to use in myBB forum software
function displayCopyOptions() {
	
	var copyDiv = document.getElementById('copy-options');
	copyDiv.innerHTML = "";
	
	// instructions for copying
	var promptP = document.createElement('p');
	var promptText = document.createTextNode('Copy this code for use in forums:');
	
	promptP.appendChild(promptText);
	copyDiv.appendChild(promptP);
	
	// textbox that generates code
	var copy_textarea = document.createElement('textarea');
	copy_textarea.cols = "120";
	copy_textarea.rows = "4";
	copy_textarea.value = boardstring;
	
	copyDiv.appendChild(copy_textarea);
}