var wordlist = new Array();
var boardlist = new Array();
var boardstring = "", boardstring_uncolored = "", downloadString = "";
var passes = 1, round = 1, current_first_team;
var initialDiv, currentRoundDiv;

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
    initialDiv = document.getElementById("resultsDiv");
	var idx, itr_string;
	wordlist = wordstring.split("\n");
	// TODO - check for empty lines
	if (wordlist.length < 25) {
		alert("Error - Table generation attempted on wordlist of less than 25 words");
	} else if (wordlist.length < 75 && document.getElementById('all-rounds').checked) {
	    alert("Error - 3 Table generation attempted on wordlist of less than 75 words");
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

    clearResults();

    if (document.getElementById('all-rounds').checked) {
         passes = 3
    }

    selectInitialTeam();

    for (var i = 0; i < passes; i++) {

	    pickWords(createColorMap());
	
	    currentRoundDiv = document.createElement("round" + round);
	    initialDiv.appendChild(currentRoundDiv);

	    var roundh1 = document.createElement('h1');
	    var roundText = document.createTextNode('Grid for Round ' + round);
	    roundh1.appendChild(roundText);
	    currentRoundDiv.appendChild(roundh1);

	    displayBoard();
	    displayCopyOptions();

	    current_first_team++; //switches starting color
	    round++;
    }
    
    createDownloadSelectionBox()

}

//function to determine which team is going first
//moved out of createColorMap to facilitate 3-grid generation
function selectInitialTeam() {
    var radio_buttons = document.getElementsByName('team-select');
    for (var i = 0; i < radio_buttons.length; i++) {
        if (radio_buttons[i].checked) {
            current_first_team = radio_buttons[i].value;
        }
    }
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
	var color_teams = ["red", "blue", "red", "blue"]; //sloppy hardcoding, but not necessary to abstract with two teams.
	var current_color;
	var color_map = [];
	
    // determine which team is going first
	current_color = current_first_team;

	// create color map with number of colors we want
	var i;
	
	// 0-8: first team's color
	for (var i = 0; i < 9; i++) {
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

    var resultsDiv = document.createElement("resultsDiv" + round);

	var num_rows = 5;
	var num_cols = 5;
	var board_list_idx = -1;
	
	// forum code generation setup
	boardstring = "[size=x-large][b][Table=30]";
	boardstring_uncolored = "[size=x-large][b][Table=30]";
	
	var results_table = document.createElement('table');
	results_table.style.border = "1px solid black";
	
	var results_tbody = document.createElement('tbody');
	results_tbody.style.fontSize = "32px";
	results_tbody.style.fontWeight = "bold";
	
	for (var i = 0; i < num_rows; i++) {
		var results_tr = document.createElement('tr');
		boardstring += "[TR]";
		boardstring_uncolored += "[TR]";
		for (var j = 0; j < num_cols; j++) {
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
			boardstring_uncolored += "[TD]" + boardlist[board_list_idx].word + "[/TD]";
		}
		results_tbody.appendChild(results_tr);
		boardstring += "[/TR]";
		boardstring_uncolored += "[/TR]";
	}
	results_table.appendChild(results_tbody);
	resultsDiv.appendChild(results_table);
	currentRoundDiv.appendChild(resultsDiv)
	boardstring += "[/Table][/b][/size]";
	boardstring_uncolored += "[/Table][/b][/size]";
	addToDownload()
}

// generates string of text to use in myBB forum software
function displayCopyOptions() {
	
    var copyDiv = document.createElement('copy-options' + round);
	
	// instructions for copying
	var promptP = document.createElement('p');
	var promptText = document.createTextNode('Copy the following code for use in forum posts:');
	promptP.appendChild(promptText);
	copyDiv.appendChild(promptP);
	
	var whiteP = document.createElement('p');
	var whiteText = document.createTextNode('1.  Uncolored grid for guessing:');
	whiteP.appendChild(whiteText);
	copyDiv.appendChild(whiteP);
	
	var copy_textarea_blank = document.createElement('textarea');
	copy_textarea_blank.cols = "120";
	copy_textarea_blank.rows = "4";
	copy_textarea_blank.value = boardstring_uncolored;
	
	copyDiv.appendChild(copy_textarea_blank);
	
	var colorP = document.createElement('p');
	var colorText = document.createTextNode('2.  Colored grid with answers:');
	colorP.appendChild(colorText);
	copyDiv.appendChild(colorP);
	
	// textbox that generates code
	var copy_textarea = document.createElement('textarea');
	copy_textarea.cols = "120";
	copy_textarea.rows = "4";
	copy_textarea.value = boardstring;
	
	copyDiv.appendChild(copy_textarea);
	currentRoundDiv.appendChild(copyDiv)
}

// Adds Boardstrings to download string
function addToDownload() {
    downloadString = downloadString + "Round " + round + "\n\n" + boardstring + "\n\n" + boardstring_uncolored + "\n\n"
}

// clears out all data with each button press
function clearResults() {
    round = 1;
    downloadString = "";
    if (initialDiv){
        while (initialDiv.firstChild) {
            initialDiv.removeChild(initialDiv.firstChild);
        }
    }
}

//function to create text box with all text for download
function createDownloadSelectionBox() {
    var downloadH1 = document.createElement('h1');
    var downloadHtext = document.createTextNode('Output for all rounds');
    downloadH1.appendChild(downloadHtext);
    initialDiv.appendChild(downloadH1);

    var downloadP = document.createElement('p');
    var downloadText = document.createTextNode('Copy the following code and save to a text file.');
    downloadP.appendChild(downloadText);
    initialDiv.appendChild(downloadP);

    var copy_textarea_all = document.createElement('textarea');
    copy_textarea_all.cols = "120";
    copy_textarea_all.rows = "4";
    copy_textarea_all.value = downloadString;

    initialDiv.appendChild(copy_textarea_all);
}

