
/*
REQUIRES the global from interactiveTable.js

var dkGlobalOverviewTable = {};

dkGlobalOverviewTable.popupInfoPasser = "";
dkGlobalOverviewTable.showIconInPopup = true;
dkGlobalOverviewTable.arrayOfEpisodesInSeasons = 
     [13, 22, 24, 22, 22, 25, 25,25, 25, 23, 22, 21, 22, 22, 22, 21, 22, 22, 20, 21, 23, 22, 22, 22, 11];
     // 1  2   3    4  5   6   7  8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25
dkGlobalOverviewTable.inEpsColor = '#278627';
dkGlobalOverviewTable.notInEpsColor = '#2B2B2B';
dkGlobalOverviewTable.inEpsColor3 = '#389738';
dkGlobalOverviewTable.notInEpsColor3 = '#3C3C3C';
dkGlobalOverviewTable.inEpsColorHi = '#006345';
dkGlobalOverviewTable.notInEpsColorHi = '#005234';

*/


//Assumes that season is a number 
//Will probably need more parameters and functionality to interact with the control panel.
//For example, this will currently grab all valid characters and pass them, but that doesn't fit on the screen.
function findCharactersInGivenSeasonAndPopulateInteractiveTable(divIdToFill, season) {
	//hidePopupControlBox(); //because there is a good chance got here from the overview.
	console.log("attempting to create the season only view with:" + divIdToFill + "," + season);
	dkGlobalOverviewTable.divPassing = divIdToFill;
	document.getElementById(divIdToFill).innerHTML= "";
	createDivsForSeass(divIdToFill);

	var charsInThisSeason = [];
	var beginEpisodeRange = -1;
	var endEpisodeRange = -1;

	var maxCharDisplay = 25;
	var counterForCharDisplay = 0;

	dkGlobalOverviewTable.totalEps = allCharByAppearAmt[0][7].length;
	console.log("Double check this, the total eps should be 541:" + dkGlobalOverviewTable.totalEps);

	for(var e = 0; e < dkGlobalOverviewTable.totalEps; e++){
		if(season == getSeasonOfEpisodeNumber(e + 1) && beginEpisodeRange == -1){ beginEpisodeRange = e;}
		if(season != getSeasonOfEpisodeNumber(e + 1) && beginEpisodeRange >= 0){ endEpisodeRange = e-1; break;}
	}
	if(endEpisodeRange == -1){
		endEpisodeRange = allCharByAppearAmt[0][7].length -1;
	}

	console.log("The following episodes are in this season:" +  (beginEpisodeRange+1) + " to " + (endEpisodeRange+1));

	//for each character
	for(var c = 0; c < allCharByAppearAmt.length; c++){
		for(var e = beginEpisodeRange; e <= endEpisodeRange; e++){
			if(allCharByAppearAmt[c][7][e]){
				charsInThisSeason.push(allCharByAppearAmt[c]);
				counterForCharDisplay++;
				break;
			}
		}
		if(counterForCharDisplay == maxCharDisplay){break;} //stop grabbing more when hit limit.
	}//end for each characer

	console.log("There are "+charsInThisSeason.length + " characters in this season.");


	//try and render the characters now, but with an episode width change.
	fillSeasonInteractTable(divIdToFill, charsInThisSeason, false, season,beginEpisodeRange+1, endEpisodeRange+1);


	//edit the top lvl description. Edit2: actually, unsure how to proceed at the moment.
	//may need to be removed if doesn't exist in the end app.
	document.getElementById('seassName').innerHTML =
		'<h1>Season '+season+'(episodes '+  (beginEpisodeRange+1) + " to " + (endEpisodeRange+1)+')</h1>';
	document.getElementById('seassToOverviewButton').innerHTML = '<button onclick="backToOverviewFromSeason(\''+divIdToFill+'\')">Return to overview.</button></p>';

} //end findCharactersInGivenSeasonAndPopulateInteractiveTable

function createDivsForSeass(divIdToFill) {

	document.getElementById(divIdToFill).innerHTML = '<div id="seassToOverviewButton"></div>\n';
	document.getElementById(divIdToFill).innerHTML += 
		'<div id="seassName" style="position:absolute;top:20;left:50;"></div>\n';
	document.getElementById(divIdToFill).innerHTML +=
		'<div id="seassInteractTable" style="position:absolute;top:100;left:50;border: 1px solid black"></div>\n';
	document.getElementById(divIdToFill).innerHTML += 
		'<div id="seassMouseOverPanel" style="position:absolute;top:500;left:1000;visibility: hidden;border: 1px solid black;"></div>\n';
	document.getElementById(divIdToFill).innerHTML += 
		'<div id="seassMouseClickPanel" style="position:absolute;top:500;left:850;visibility: hidden;border: 1px solid black;"></div>\n';
} // end createDivsForSeass



/*
Given a div to fill, array of character, highlight, and episode size, then can make div.
enableHighlight should be a boolean.

*/
function fillSeasonInteractTable(divIdToFill, arrayOfCharacters, enableHighlight, season, bEpRange, eEpRange) {

	var contents = "<table onmouseout='shideInfoBox()' onmousemove='sshowInfoBox()'>\n";
	contents += '<tr><th colspan="3">Name</th><th>#ofEp</th>';
	var lineContent = "";

	//determine how many episodes are being tracked to figure out how big to make the table.
	var totaleps = allCharByAppearAmt[0][7].length;

	//one season.
	lineContent += '<th colspan="' + dkGlobalOverviewTable.arrayOfEpisodesInSeasons[season-1] + '">' + (season) + "</th>\n";
	contents += lineContent + "</tr>";

	lineContent = "";

	for(var i = 0; i < arrayOfCharacters.length; i++){

		var appearCounter = 0;
		for(var epc = bEpRange-1; epc < eEpRange;epc++){  //weird math going on here due to index position vs < vs ep number
			if(arrayOfCharacters[i][7][epc]){appearCounter++;}
		}

		//contain the names on one line
		var shorterName = arrayOfCharacters[i][0];
		if(shorterName.search(" ") != -1){ shorterName = shorterName.substring(0, shorterName.search(" "));	}
		if(shorterName.length > 12) { shorterName = shorterName.substring(0,12);}

		lineContent += '<tr><th class="name" colspan="3">' + shorterName +
		'</th><th>'+appearCounter+'</th>\n';
		

		//fill out that array for the character.
		//chars [  name, full, first appear, alias, jobs, relatives, voice actors, episode appearances   ]

		//for each of the possible episodes being shown.
		for(var e = bEpRange; e <= eEpRange; e++ ){

			lineContent+= '<td id="ovtIDr' + i + 'c' + e + '" ';

			//this would be a check if char is in that eps.
			if(arrayOfCharacters[i][7][e -1]){  lineContent += '<td class="sinThatEps '; }
			else{ lineContent += '<td class="snotInThatEps '; }

			lineContent += 'ovtRow' + i;
			lineContent += ' ovtCol' + getSeasonOfEpisodeNumber(e); //this needs to be season
			lineContent += '" onmouseout="shideInfoBox('+i+','+e+')" onmousemove="sshowInfoBox(\''+ arrayOfCharacters[i][0] +'\',\'' + e;

			var highlightRow = -1; //highlight start disabled.
			var highlightCol = -1; //if true then give it the char and episode row/column.
			if(enableHighlight){ highlightRow = i; highlightCol = e; }

			if(arrayOfCharacters[i][7][e -1]){  lineContent += '\', true,'+i+','+e+')"'; }
			else{ lineContent += '\', false,'+i+','+e+')"'; }

			lineContent += 'onclick="seassShowMouseClickPanel(\''+ arrayOfCharacters[i][0] +'\', '+e+', -1 )"'+ '></th>\n';
			

		}
		lineContent += "</tr>\n";
	}

	contents += lineContent;
	contents += "</table>\n";

	document.getElementById('seassInteractTable').innerHTML = contents;

	//seed the color
	for(var row = 0; row < arrayOfCharacters.length; row++){
		for(var col = bEpRange; col <= eEpRange; col++){
			if(row %2 == 0){
				if(document.getElementById('ovtIDr' + row + 'c' + col).className.search('snotInThatEps') >= 0){
					document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.notInEpsColor;
				}
				else{  document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.inEpsColor;}
			}
			else{
				if(document.getElementById('ovtIDr' + row + 'c' + col).className.search('snotInThatEps') >= 0){
					document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.notInEpsColor3;
				}
				else{  document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.inEpsColor3;}
			}
		}
	}


} //end filloverview table



function seassShowMouseClickPanel(characterOfClick, epOfClick, seasonOfClick) {
	var infoTextAsOne = "";

	infoTextAsOne += "&nbsp<button onclick=\"seassHideMouseClickPanel()\">X</button><br>";
	infoTextAsOne += "&nbsp&nbspSearch by character&nbsp<button onclick=\"seassMouseClickCharacter(\'"+characterOfClick+"\')\">"+characterOfClick+"</button><br>";
	infoTextAsOne += "&nbsp&nbspSearch by episode&nbsp&nbsp&nbsp<button onclick=\"seassMouseClickEp("+epOfClick+")\">"+epOfClick+"</button><br>";

	document.getElementById("seassMouseClickPanel").innerHTML = infoTextAsOne;
	document.getElementById("seassMouseClickPanel").style.visibility = 'visible';
	document.getElementById("seassMouseClickPanel").style.backgroundColor = '#BF5B30';
	document.getElementById("seassMouseClickPanel").style.top = event.clientY + 10;
	document.getElementById("seassMouseClickPanel").style.left = event.clientX + 10;
}

function seassHideMouseClickPanel() {
	document.getElementById("seassMouseClickPanel").style.visibility = 'hidden';
}

function seassMouseClickCharacter(characterToUse) {
	console.log("Clicked on character:" + characterToUse);
	givenACharacterNameFilloutTheView(dkGlobalOverviewTable.divPassing, characterToUse);
}

function seassMouseClickEp(epsToUse) {
	console.log("Clicked on ep:" + epsToUse);
	givenAnEpisodeFillADiv(dkGlobalOverviewTable.divPassing, (epsToUse-1)); //-1 for index
}


function shideInfoBox(row, col) {

	if(row != null){
		document.getElementById("seassMouseOverPanel").style.visibility = 'hidden';
		document.getElementById("seassMouseOverPanel").style.top = 0;
		document.getElementById("seassMouseOverPanel").style.left = 0;

		document.getElementById("seassMouseOverPanel").innerHTML = "";

		if(row %2 == 0){
			if(document.getElementById('ovtIDr' + row + 'c' + col).className.search('snotInThatEps') >= 0){
				document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.notInEpsColor;
			}
			else{  document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.inEpsColor;}
		}
		else{
			if(document.getElementById('ovtIDr' + row + 'c' + col).className.search('snotInThatEps') >= 0){
				document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.notInEpsColor3;
			}
			else{  document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = dkGlobalOverviewTable.inEpsColor3;}
		}
	}

}


function sshowInfoBox(iname, iepisode, inEps, row, col) {

	if(iname != null){
		var infoTextAsOne = "&nbsp&nbsp" + iname + "<br>";
		//console.log("Before the print:");
		//console.log("Inside of the show info:" + infoTextAsOne);

		if(inEps){
			document.getElementById("seassMouseOverPanel").style.backgroundColor = dkGlobalOverviewTable.inEpsColor;
			infoTextAsOne += "&nbsp&nbspIS in ";
		}
		else{
			document.getElementById("seassMouseOverPanel").style.backgroundColor = dkGlobalOverviewTable.notInEpsColor;
			infoTextAsOne += "&nbsp&nbspNOT in ";
		}
		infoTextAsOne +=  "Episode:" + iepisode + "<br>&nbsp&nbsp";
		infoTextAsOne +=  allEpisodesByNumber[iepisode-1][0] + "<br>";


		infoTextAsOne += "<img width='200px' height='200px' src='" + fetchImgUrlOfChar(iname) + "'></img>";

		document.getElementById("seassMouseOverPanel").innerHTML = infoTextAsOne;
		document.getElementById("seassMouseOverPanel").style.visibility = 'visible';
		document.getElementById("seassMouseOverPanel").style.top = 200;
		document.getElementById("seassMouseOverPanel").style.left =
			300 + 30* dkGlobalOverviewTable.arrayOfEpisodesInSeasons[getSeasonOfEpisodeNumber(iepisode)-1];
		document.getElementById("seassMouseOverPanel").style.backgroundColor = "white";
			//console.log(document.getElementById("seassMouseOverPanel").style.left);

		//highlight only that particular episode on that particular character
		document.getElementById('ovtIDr' + row + 'c' + col).style.backgroundColor = '#A61000';


	} //end if params were not null
} //end show info box


//temporary function to return back to overview. assumes first 10 character grab
function backToOverviewFromSeason(divIdToFill){
	var charList = [];
	for(var i =0; i < 40; i++){
		charList.push(allCharByAppearAmt[i]);
	}
	fillOverviewTable(divIdToFill, charList, true);
} //end