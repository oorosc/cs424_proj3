// Patryk Poborca CS 424 UIC
/*
The parser is initiailzed here along with its global variables, any interpretation etc comes through here.
for now just adding functionality, but setting functionality is capable
*/
var parserQueries = []; // 2D array which holds scope in [x]0, and filters in [x][>0]
var pSCOPE; var pFILTER; var pDISPLAY; var pTXT; var parserTable;

function p_initInterp(scope, filterby, display, text)
{//^^ are ID's of html elements, 2 dropdowns, display div, and a text area
pSCOPE = $("#"+scope); pFILTER = $("#"+ filterby); pDISPLAY = $("#"+ display);  pTXT = $("#"+text);

pSCOPE.on('change', function(){if(pSCOPE.val() == "..") return; p_setQuery(); p_upDisplay(); p_upVisualElements();});
pFILTER.on('change',function(){if(pFILTER.val() == "..") return; p_cWrapper($(this).find(":selected").text(), -2);  p_upDisplay();  p_upVisualElements();});
p_initQuery(); 
p_initPTable();

var ii = "appearances";
parserQueries['lookup'] = {"Related Characters":{"i":"appearances","a":"globalCharGroups"},"Characters":{"i":7,"a":"allCharByAppearAmt"},"Writers":{"i":"appearances","a":"globalWriterList"},"Show Runner":{"i":"appearances","a":"globalRunnerList"},"Directors":{"i":"appearances","a":"globalDirectorList"},"Jobs":{"i":"appearances","a":"globalJobs"},"Location":{"i":1,"a":"locationsByAppearAmt"},"Voice Actor":{"i":2,"a":"allVoiceActorsByAppearanceCount"},"Seasons":{"i":"-1","a":"episodesInSeasons"},"All Episodes":{"i":1,"a":"allEpisodesByNumber"},"Season: 1":{"i":1,"a":"allEpisodesByNumber","r":13,"s":0},"Season: 2":{"i":1,"a":"allEpisodesByNumber","r":35,"s":13},"Season: 3":{"i":1,"a":"allEpisodesByNumber","r":59,"s":35},"Season: 4":{"i":1,"a":"allEpisodesByNumber","r":81,"s":59},"Season: 5":{"i":1,"a":"allEpisodesByNumber","r":103,"s":81},"Season: 6":{"i":1,"a":"allEpisodesByNumber","r":128,"s":103},"Season: 7":{"i":1,"a":"allEpisodesByNumber","r":153,"s":128},"Season: 8":{"i":1,"a":"allEpisodesByNumber","r":178,"s":153},"Season: 9":{"i":1,"a":"allEpisodesByNumber","r":203,"s":178},"Season: 10":{"i":1,"a":"allEpisodesByNumber","r":226,"s":203},"Season: 11":{"i":1,"a":"allEpisodesByNumber","r":248,"s":226},"Season: 12":{"i":1,"a":"allEpisodesByNumber","r":269,"s":248},"Season: 13":{"i":1,"a":"allEpisodesByNumber","r":291,"s":269},"Season: 14":{"i":1,"a":"allEpisodesByNumber","r":313,"s":291},"Season: 15":{"i":1,"a":"allEpisodesByNumber","r":335,"s":313},"Season: 16":{"i":1,"a":"allEpisodesByNumber","r":356,"s":335},"Season: 17":{"i":1,"a":"allEpisodesByNumber","r":378,"s":356},"Season: 18":{"i":1,"a":"allEpisodesByNumber","r":400,"s":378},"Season: 19":{"i":1,"a":"allEpisodesByNumber","r":420,"s":400},"Season: 20":{"i":1,"a":"allEpisodesByNumber","r":441,"s":420},"Season: 21":{"i":1,"a":"allEpisodesByNumber","r":464,"s":441},"Season: 22":{"i":1,"a":"allEpisodesByNumber","r":486,"s":464},"Season: 23":{"i":1,"a":"allEpisodesByNumber","r":508,"s":486},"Season: 24":{"i":1,"a":"allEpisodesByNumber","r":530,"s":508},"Season: 25":{"i":1,"a":"allEpisodesByNumber","r":541,"s":530}};

//generating code is at bottom in comments;
pSCOPE.trigger('change');	

$("#pAddFilter").on('click',
function(){
p_changeFilter(pFILTER.find(":selected").text(), -1);
$(pFILTER).trigger('change');
});


}




function p_upDisplay()
{
pDISPLAY.empty();
 var sTring = "";
	for(var a = 1; a < parserQueries.length; a++)
			{sTring = "";
			sTring+= "<span class = 'pRemove' id = 'pp"+a+"'> ";
			for(var b =1; b < parserQueries[a].length; b++)
				for(key in parserQueries[a][b])
					{
					if(b ==1)
					sTring+=  "Scope = " + parserQueries[a][b][key] + "<br>"; 
					else
					sTring+=  "Filter"+ (b-1) + " = " + parserQueries[a][b][key] + "<br>"; 
					//if(a != 0 && b != 0)
						//{console.log(parserQueries[a][b][key]); console.log(parserQueries['lookup'][parserQueries[a][b][key]]);}
						}
			sTring+= "</span>";
			pDISPLAY.append(sTring);
		}
}


function p_mergeTable(arr, AND, type) // smushes a table into a filter. AND or OR
{
if(arr.length == 2) return arr;

var magnitude = 0;//mag of change based on and/or
var before = false;

var r_val = [];
r_val.push([]);
for(var a = 0; a < arr[0].length; a++) //save header data
	r_val[0][a] = arr[0][a];



	
var filterRow = [];
filterRow[0] = type;
filterRow[1] = arr[1][1];
	for(var a = 1; a < arr.length-1; a ++ ) // avoid headers
	{
	magnitude = 0;
		for(var b= 2; b < arr[a].length; b++) //avoid count/row names
		{
			
			if(a != 1)
			{	before = filterRow[b];
				
				if(AND)
					filterRow[b] = filterRow[b] && arr[a][b];
				else
					filterRow[b] = filterRow[b] || arr[a][b];
				
				if(before != arr[a][b])
				magnitude = (before == false) ? magnitude-1 : magnitude +1; //basically add or subtract one based on whether we went true->false or false ->true
			}
			else
				filterRow[b] = arr[a][b];
			
		}
	filterRow[1] += magnitude; //add or subtract based on prior operations	
	}
r_val.push(filterRow);	

return r_val;//returns added
}

function p_remerge(arr)//2d array filled with headers...
{
var r_val = []; r_val.push(arr[0]); //overall header
for(var a=1; a< arr.length; a+=2)
 r_val.push(arr[a]);
 
 console.log(r_val);

}

/*
#################################################################################################################################################
#################################################################################################################################################
#################################################################################################################################################
#################################################################################################################################################
*/


var test;
function p_upVisualElements(query)
{
var arr = p_grabArrays(); //gets initial 'dirty' arrays, just holding bare data
test = p_cLogicTable(arr[2]);
var newArr =[];

var whichColumns = p_mergeTable(p_cLogicTable(arr[1]), false, arr['lookup'][1], false); // basically will create a table which decides which columns will be kept....
whichColumns = truthToInt(whichColumns);

for(var a=2; a < arr.length; a++) //grab all filters
	newArr.push(p_mergeTable(p_cLogicTable(arr[a]), false, arr['lookup'][a], whichColumns)); //switch false for global and operator... TODO

console.log('here');
console.log(arr);
//iterate through arr, checking to see if scope is different, which then converts the arrays, 

tempFilterStorage[p_F()] = arr[p_F()];

$("#todo").click(function(){
var HOLD = wrapForTable(newArr[0]);
$("#genTable").empty();
initTable(HOLD.length, HOLD[0].length, "genTable", HOLD, true, false);

	});

}
/*
#################################################################################################################################################
#################################################################################################################################################
#################################################################################################################################################
#################################################################################################################################################
*/


/*
console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");	
console.log(arr);
console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");	*/

function p_cLogicTable(arr)
{

// if bottom level, just one element. 1 = index, 0 = name, lookup
var table = []; //collection of rows
var singleRow = []; singleRow[0] = ""; //filler
singleRow.push("Count");
for(var a=0; a < arr[0][1].length; a++) //initialize season #'s
singleRow.push(a+1);
table.push(singleRow);

var count = 0; isN = false;

for(var a = 0; a < arr.length; a++) //iterate through the first array, which holds the [0][1]
{
singleRow = [];
singleRow.push(arr[a][0]);//push the name
singleRow.push("");//reserving spot for count
	for(var b = 0; b < arr[a][1].length; b++) //push the t/f tables
		{ 
			isN = (isNaN(arr[a][1][b])) ? arr[a][1][b] : (arr[a][1][b] >0);
			if(isN) count++;
			singleRow.push(isN);
			/*if(isNaN(arr[a][1][b])) //checking for voice actors basically.
			singleRow.push(arr[a][1][b]);
			else
			singleRow.push(arr[a][1][b] >0); //convert num to bool...*/
		}
		singleRow[1] = count; //set reserved spot to count total.
		count = 0;
table.push(singleRow);
}
/*
console.log("------------------------------");
//console.log(table);
console.log("------------------------------");

var HOLD = wrapForTable(table);
$("#genTable").empty();
initTable(HOLD.length, HOLD[0].length, "genTable", HOLD, true, false);
*/
return table;
}

var tempDrop; //temporary drop down holder global.
var tempFilterStorage = [];
// grabs the CURRENT selection by iterating through where the current query pointer is..
function p_grabArrays() // returns a array of scope and its filters
{
console.log ("temppp");
console.log(tempFilterStorage);
var temp;
var parent;
var quer = []; // 0 -> scope, 0< filters 'lookup' = types
quer['lookup'] = [];
	for(var a = 1; a < parserQueries[p_Q()].length; a ++)
	{
		
		
		//console.log(parserQueries[p_Q()]);
		temp = parserQueries['lookup'][parserQueries[p_Q()][a]['term']];
		if(temp == null)
			{
			for(key in tempFilterStorage)
				{temp = (tempFilterStorage[key] == parserQueries['lookup'][parserQueries[p_Q()][a]['term']]) ? key : null; console.log("->>>> " + key); //fix if comparisson TODO on these guys, tempFilter[key] is a DB
				if(temp != null) {quer[a] = tempFilterStorage[key]; temp  = -999;}
				}
				if( temp == -999) continue;
			}
		
		if(temp == null)
		{
		
		var finalChoice = $(tempDrop).find(":selected").attr('current'); // 'previous' division (despite
		var value = $(tempDrop).find(":selected").text();
		temp = parserQueries['lookup'][$(tempDrop).find(":selected").attr('current')];
		
		
				
		//console.log(value + " = "+ value.indexOf('-Ep')  + " -> " + finalChoice);
		
		quer[a] =(isNaN(temp['i'])) ? p_fetchAnon(temp['a'], ['name', temp['i']], -1, -1) : p_populateArr(temp['a'], [0, temp['i']]);
		
		var spFlag = false; //for episode to_array
		if(value.indexOf('-Ep') != -1) 
			{value = value.substring(0, value.indexOf('-Ep')); //cut off extra string
			spFlag = true;
			}
		var crazy = quer[a].length;
		
		value = (value[value.length-1] == ' ') ? value.substring(0, value.length-1) : value;
		//alert("hhhh " +quer[a].length);
		for(var aa = 0; aa < crazy; aa ++) //look for segment, grab the cut... we only care about ONE cause this is nitty gritty choice
			{
				if(quer[a][aa][0] == value)
					{
					if(spFlag) //create t/f table for element, basically iterate through, set everything to false BUT the episode chosen
						{	var tempH = quer[a][aa][1];
							quer[a][aa][1] = [];
							
							var flagHold = p_fetchAnon("allEpisodesByNumber", 1, -1, -1);
							for(var zet= 0; zet < flagHold.length; zet++)
							{
							quer[a][aa][1][zet] = (tempH-1 == zet) ? true : false;
							}
						}
					quer[a] = [quer[a][aa]];
					//console.log("freak");
					//console.log(quer[a]);
					crazy = true; //used as flag
					break;
					}
			}
		if(crazy === true)
			{
			quer['lookup'][a] = temp['a'];
			continue;
			}
		console.log("vallll =@#QRE$#$@$#@ " );
		
		break;		//exit state, when at bottom level of iteration...
		}
		
	//////////////////////////===================================================================================================
	//////////////////////////===================================================================================================
	//////////////////////////===================================================================================================
		
		//alert(temp);
		if(parserQueries[p_Q()][a]['term'] != 'Seasons')
			{
			
			if(parserQueries[p_Q()][a]['term'].substring(0,7) == "Season:")
				{
				quer[a] = [];
				quer[a][1] = getSeasonTF(Number(parserQueries[p_Q()][a]['term'].substring(8)));
				quer[a][0] = parserQueries[p_Q()][a]['term'];		
				console.log(quer[a]);
				}
			else
			quer[a] =(isNaN(temp['i'])) ? p_fetchAnon(temp['a'], ['name', temp['i']], -1, -1) : p_populateArr(temp['a'], [0, temp['i']]); // is the index a number, if so, cut from different things
						
			if(parserQueries[p_Q()][a]['term'] == 'Location')
				{
					for(var loc = 0; loc < quer[a].length; loc++)
					{quer[a][loc][1] = fetchTF(quer[a][loc][1]);}
				}
			
			
			}
		else
				{
					quer[a]=[];
					var tempHold = eval(temp['a']); // number of season, aka name
					
						for(var zz = 0; zz < tempHold.length; zz++)
							quer[a].push([tempHold[zz], getSeasonTF(zz+1)]);
						
						
				
				}
		
		
		if(temp['r'] != null) //cuts away a range
			{	
				
				quer[a].splice(0, temp['s']);
				quer[a].splice(temp['r']);	
				
			}
			quer['lookup'][a] = temp['a'];
	}	
	
return quer; //returns at least quer[0] = scope, quer[1+] = filter
}



//////////////////////////////Backbone logic holding below

// Query Holder
function p_initQuery() 
{ 
	var spot = (parserQueries.length == 0) ? 1 : parserQueries.length -1;
	if(spot == 1)
		parserQueries[0] = {}; // keeps track of current querry
		
	parserQueries[spot] =[];
	parserQueries[spot][0] = {currentFilter : 2}; // keeps track of the filter we're currently working on.
	parserQueries[spot][1]=({term: pSCOPE.find(":selected").text()});
	parserQueries[spot][2] =({term: pFILTER.find(":selected").text()});
	
	parserQueries[0] =  {currentQuery : parserQueries.length-1}; //initing a new query, changes workign directory 
}

function p_Q(){ return parserQueries[0]["currentQuery"];}
function p_F() { return parserQueries[p_Q()][0]["currentFilter"];} //get functions RE : LITERAL!!!
function p_SF(pos)//set filter (pos)
 {
 pos=(pos ==-1)? parserQueries[p_Q()].length-1 : pos;
 parserQueries[p_Q()][0]["currentFilter"] = pos; }
 
 function p_cWrapper(str, pos){ p_changeFilter({term : str}, pos);} // wrapper for pure strings
 
function p_changeFilter(str, pos) // changes certain filter, -1 to "push" another filter, -2 to mod current filter
{
	if(pos == -1)
	{
	parserQueries[p_Q()].push(str); p_SF(-1);
	}
	else if(pos == -2)
	{parserQueries[p_Q()][p_F()] = (str);}
	else {parserQueries[p_Q()][pos] = (str); p_SF(pos);}
}

function p_clearFilters(pos)
{pos = (pos == -1) ? p_Q() : pos;
parserQueries[pos].splice(2, parserQueries[pos].length);	
}
function p_changeQuery(id){parserQueries[0] = { currentQuery : id};}//changes pointer to cur Query

function p_setQuery()
{
	p_clearFilters(-1);//clears all filters of our current direct
	parserQueries[p_Q()][1] = {term : pSCOPE.find(":selected").text() }; //change the scope
	p_cWrapper(pFILTER.find(":selected").text(), -1);//change the filter
	
}

function p_initPTable()
{
parserTable = {};
parserTable["$"] = "scope";
parserTable["C"] = "allCharByAppearAmt"; //"Character";
//parserTable["#"] = 
parserTable["+"] =  "" //"filter";
parserTable["v"] = //"Voice Actor";
parserTable["s"] = "Seasons";
parserTable["g"] = "Related Characters";
parserTable["l"] = "Location";
parserTable["="] = "done";
parserTable["!"] = "!";
parserTable["*"] = "*";
parserTable["e"] = ""
//"Related Characters", "Location", "Voice Actor", "Show Runner", "Writers", "Directors", "Jobs"];
}


//todo, advanced feature... probably not going to make this.
function relationShip(scope, filter)
{
/*
idea: each array holder has a category, a listing of all episodes meaning to be compared is say "0", 
scope = listing in x axis -> y axis is their existance, e.g. all seasons, each season has x episodes in the y direction
filter = quantity which limits the y axis

so if we choose season 10, it has x episodes, but only 1 / 0 values. obviously all 1, but then the filter comes into play. 
*/

}
var zk= 0;
// converts array of episode names for a entity into a t/f table of appearnces
function fetchTF(arr)
{

var t = p_fetchAnon("allEpisodesByNumber", 0, -1, -1);
var r_val =[];
for(var a =0; a < t.length; a++) r_val.push(false);

for(var a=0; a < arr.length; a++)
	{
	if(t.indexOf(arr[a]) != -1 ) r_val[t.indexOf(arr[a])] = true;
	//else console.log(" -> " +arr[a]);
	}

return r_val;
}

function getSeasonTF(num)
{
var hold = parserQueries['lookup']["Season: " + num];
var t = p_fetchAnon("allEpisodesByNumber", 1, -1, -1);
var r_val = [];

for(var a = 0; a < t.length; a++)
	r_val.push(false);
	
for(var a =hold['s']; a < hold['r']; a++)
	r_val[a] = true;

return r_val;
}

//takes 1d array of a row, iterates over and tells which 
function truthToInt(arr)
{
var r_val = [];
r_val[0] = 0; //we need the count column to be kept
r_val[1] = 1; // same with name
for(var a=2; a < arr.length; a++)
	if(arr[a]) r_val.push(a)
return r_val;
}

/*

= {   
"Related Characters" : {"i" : ii, a: "globalCharGroups"}, 
"Characters" : { "i" : 7, "a" : "allCharByAppearAmt" }, 
"Writers" : { "i" : ii, "a" : "globalWriterList"},
"Show Runner" : {"i" : ii, "a" : "globalRunnerList"},
"Directors" : {"i" : ii, "a" : "globalDirectorList"}, 
"Jobs" : {"i": ii, "a" : "globalJobs"},
"Location" : {'i': 1, 'a' : 'locationsByAppearAmt'},
'Voice Actor' : {'i': 2, 'a': 'allVoiceActorsByAppearanceCount'},
'Seasons' : {'i' : '-1', 'a' : 'episodesInSeasons'},
'All Episodes' : {'i' : 1, 'a' : 'allEpisodesByNumber'}
}//["Characters", "Seasons","Related Characters", "Location", "Voice Actor", "Show Runner", "Writers", "Directors", "Jobs"];



var starting = 0;
var count =0;
for(var aa= 0; aa < episodesInSeasons.length; aa++)
	{
	if(aa != 0) starting = parserQueries['lookup']['Season: '+(aa)]['r'];
	
	count += episodesInSeasons[aa];
	parserQueries['lookup']['Season: '+(aa+1)] = {
	'i' : 1,
	'a' : 'allEpisodesByNumber',
	'r' : count,
	's' : starting};
	
	}
*/

