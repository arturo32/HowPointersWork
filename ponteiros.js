
let pointers;
let regVars;
let allVars;



//Class to construct a regular variable object
class RegularVariable{
	constructor(){
		this.type = "";
		this.name = "";
		this.content = "lixo";
		this.adress = null;
	}
}

//Class to construct a regular variable object
	class Pointer{
		constructor(){
			this.type = null;
			this.name = null;

			//To receive afterwards a reference to the variable that it's pointing to
			this.content = new RegularVariable(); 
		}
	}



/*Function that separates the contents from the elements of varArray
and put them in the content properties of the objects in varObjs*/ 
function getContent(varObj, contentFound, codeText, regVars = null){

		//If the elements of varObjs are pointer objects
		if(varObj.constructor == Pointer){

			/*If the variable wasn't initialized in the moment it was declared,
			the function searchesLaterContent is called to find out it was 
			initialized later*/
			if(contentFound == null){
				contentFound = searchLaterContent(varObj, codeText);
			}

			//If the pointer was initialized at any moment in the code
			if(contentFound != "lixo"){
				
				/*A regular variable object with the same name of contentFound
				is searched in the reVars array*/
				let ptrContent = regVars.find(x => x.name == contentFound.replace(/\&*/, ""));
				
				/*If found, the content of varObjs[i] receive a reference to
				such object*/
				if(ptrContent) varObj.content = ptrContent;
			}
		}

		//If the elements of varObjs are regular variable objects
		else{

			/*If contentFound is not empty then the content of the variable
			receives the contentFound. Else, it receives what searchesLaterContent
			returns ("lixo", i.e. garbage, or the last value assigned to it in the
			code*/
			varObj.content = contentFound ? contentFound : searchLaterContent(varObj, codeText);
		}

}


/*This function looks for variables that were declared but not initialized at the same time 
and searches for other occurrences of their names to see if they were initialized afterwards.
If that is the case, the new value is returned*/
function searchLaterContent(varObj, codeText){

	//RegEx in a string format for looking for assignments of variables
	let assignment = "(\\s*\\=\\s*(\\w+|\\&\\w+)\\s*;)";

	/*Match all lines that have the (whole) name of varObj and ends with
	an assignment. Prevents getting dereferencing pointers using the
	"[^\\*]". The result is an iterator*/
	let contentsIterator = codeText.matchAll(new RegExp("[^\\*]\\b" + varObj.name + "\\b" + assignment, 'g'));


	/*Getting the first item matched. It is an object with an attribute
	("value") that is an array with its first element being the entire
	match of the line and the other being the capturing groups of the
	assignment RegEx*/
	let contentObj = contentsIterator.next();

	//If no match was found
	if(contentObj.done) return "lixo";

	//The final content that will be returned
	let laterContent; 

	//While there are still elements to iterate with the iterator
	while(!contentObj.done){

		/*Getting the third element of the matched array
		(the capturing group that matches only the content)*/
		laterContent = contentObj.value[2];

		//Going for the next item
		contentObj = contentsIterator.next();
	}

	//Returning the value found without spaces or the "address of" operator
	return laterContent.replace(/\s*&*/, "");

}

/*Finds dereferenced pointers that are receiving a value and updates
the value of the variable that the pointer is pointing to*/
function findDereferencing(pointers, codeText){

	/*There are two capturing groups in this RegEx: the first one
	is the name of the pointer and the second one is the value 
	assigned to the dereferenced pointer*/
	let dereferencesRegex =  /\n*\s*\*\s*(\w+)\s*\=\s*(\w+)\s*;/gi;

	/*matchAll returns an iterator that can be seen as an array of
	arrays. Each outer array is a match of the RegEx in an array format:
	the element 0 is the full match, the element 1 is the first capturing
	group and the element 2 is the second capturing group*/
	let dereferences = codeText.matchAll(dereferencesRegex);

	//If no dereferenced pointer was found, the function ends
	if(dereferences == null) return;

	/*For each match of deferences iterator it's found a corresponding 
	pointer name and then the value assigned to the pointer dereferenced
	is assigned to the variable pointed by this pointer*/
	for(const def of dereferences){
		pointers.find(ptr => ptr.name == def[1]).content.content = def[2];
	}
}



function setProperties(objConstructor, regex, codeText, regVars = null){

	//Creating an array to store the objects
	let varObjs = new Array();

	/*Iterator that iterates over objects that contains all matches in the
	text*/
	let varIterator = codeText.matchAll(regex);
	
	/*Iterating over the values of the objects of the variableIterator. Each
	value is an array that have 4 elements: the first one is the entire match
	and the following ones are the capturing groups in the same other explained
	in the findPointers function*/
	for(const matchArray of varIterator){
		
		//Creating new object of type objContructor
		let newObj =  new objConstructor();

		//Setting its properties
		newObj.type = matchArray[1].replace(/\s*/, "");
		newObj.name = matchArray[2];

		//getContent searches for contents beyond declarations 
		getContent(newObj, matchArray[3], codeText, regVars); 

		//Putting newObj as the last element of the varObjs array 
		varObjs.push(newObj);
	}

	//Returning the array of objects
	return varObjs;
}




/*Function that detects the pointers and regular variables in the textbox
and makes a table with them*/
function findPointers(){

	//Gets the text typed by the user
	codeText = document.getElementById("textbox").value;

	/*RegEx that matches all possible types of regular variables declarations
	that may or may not have initializations. It has three capturing groups:
	the first one is the type, the second, the name, and the third (not the 
	non-capturing group with ?: in the beginning), the value/content*/
	let variablesRegEx = /(int|float|double|char|short)\s+(\w+)\s*(?:\=\s*(\w+|\&\w+)\w*\s*\;|\;)/g;

	/*setProperties, if it finds variables in the text as defined by the
	RegEx above, returns an array filled with objects of type
	RegularVariable. If	none were found, it returns a null array*/
	regVars = setProperties(RegularVariable, variablesRegEx, codeText);


	//Same RegEx as variablesRegEx but with an asterisk just after the type
	let pointersRegEx = /((?:int|float|double|char|short)\s*\*)\s*(\w+)\s*(?:\=\s*(\w+|\&\w+)\s*\;|\;)/g;
	
	/*setProperties, if it finds pointers in the text as defined by the
	RegEx above, returns an array filled with objects of type
	Pointer. If	none were found, it returns a null array*/
	pointers = setProperties(Pointer, pointersRegEx, codeText, regVars);


	//If at least one pointer was found
	if(pointers.length){
		
		/*Updates the regular variables contents if there are pointers
		dereferenced that are being assigned a value*/
		findDereferencing(pointers, codeText);
	}

	for(let x of regVars){
		if(allVars.find(y => y.name == x.name)) continue;
		let randIndex = Math.floor(Math.random()*11)+1;
		while(allVars[randIndex].name != ""){
			randIndex = Math.floor(Math.random()*11)+1;
		}
			x.adress = allVars[randIndex].adress;
			allVars[randIndex] = x;
	}
	for(let x of pointers){
		if(allVars.find(y => y.name == x.name)) continue;
		let randIndex = Math.floor(Math.random()*11)+1;
		while(allVars[randIndex].name != ""){
			randIndex = Math.floor(Math.random()*11)+1;
		}
			x.adress = allVars[randIndex].adress;
			allVars[randIndex] = x;
	}
	console.log(allVars);




} 







/*The following lines are made to communicate with the Paiza API, that compiles and executes
 the code typed by the user. This is made by using the jQuery library that can easily 
 communicate with the API through HTTP requests.*/



//Variable to set interval of a compiling message
var compiling;
 
$(document).ready( function(){

	allVars = new Array();
	while(allVars.length != 12){
	allVars.push(new RegularVariable());
	}

	let adress = 0x7ffc559ff164;
	for(let element of allVars){
		element.adress = adress;
		adress++;
	}



	/*In the moment the user clicks the "Compilar e Executar" button the function below
	 is activated. It sends a POST request to the Paiza serve with the code and inputs that 
	 the user has written. After the POST request succeeds, it takes its response and sends 
	 to the getMethod function.*/
	$("#button").click(function(){

		//Shows the user, in the outputC box, that the code is compiling
		document.getElementById("outputC").innerHTML = "Compilando...";

		//Adding a dot in the ouputC every second
		compiling = setInterval(function(){
			document.getElementById("outputC").innerHTML += ".";
	 	}, 1000);


  		var inputText = document.getElementById("inputC").value;
	  	var strings = document.getElementById("textbox").value;
	    $.post("https://api.paiza.io/runners/create",
	    	{
		    	source_code: `${strings}`,
		    	language: "c",
		    	input: `${inputText}`,
		    	api_key: "guest"
	    	},

	   		function(data) {
				getMethod(data.id);	
			}, "json"); 
	});
});



/*This functions sends a GET request to the Paiza server to get the output of the user code. 
It carries the ID information, passed by the response of the POST request.*/
function getMethod(api_id){

	var getData = new Object();
	getData.id = api_id;
	getData.api_key = "guest";
    $.get("https://api.paiza.io/runners/get_details", getData, function(data){

    	/*To check if the code has finished compiling, it's checked if the status parameter
    	is still marked as "running". If so, then the getMethod function is called again
    	after 100 milliseconds.*/
		if(data.status == "running"){
			console.log("again");
			setTimeout(function(){getMethod(api_id)}, 100);

			//Don't allow the earlier calls continue after this point
			return;
		}

		//Clearing interval that shows the user the code is compiling
		clearInterval(compiling);

		/*If the status is marked as completed, then is used the stdout parameter, that contains
		the output of the user code. It may be the case that there is no stdout data due to errors
		in compilation or execution. So, before anything, errors messages are searched and, if
		found, sent to the user*/

		//"build_stderr" is the parameter of errors in compilation
		let compilationError = data.build_stderr;
		
		/*The "result" parameter tells if something went wrong on execution. It can have the 
		value "success" when everything went fine, "failure" when something went wrong on
		execution or null when something went wrong before execution, like a compilation
		error*/
		let executionError = data.result;

		//If there is a message of compilation error then it is sent to the outputC element
		if(compilationError != ""){
			document.getElementById("outputC").innerHTML = "ERRO DE COMPILAÇÃO:\n" + compilationError;
		}
		
		/*If an execution error occurred, then the "exit_code" parameter will be used. Its value
		represents the kind of error that happened and it is sent to the outputC element*/
		else if(executionError == "failure"){
			executionError = data.exit_code;
			document.getElementById("outputC").innerHTML = "ERRO DE EXECUÇÃO:\n" + executionError;
		}

		/*If none of the errors occurred, it is sent the value of the "stdout" parameter that
		contains the output of the code*/
		else{
			let outputC = data.stdout;
			document.getElementById("outputC").innerHTML = outputC;
		}

    }, "json");  
}



//This code block was entirely copied from the Internet just to make tabs work in the textbox
  $("textarea").keydown(function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
            end = this.selectionEnd;

        var $this = $(this);

        // set textarea value to: text before caret + tab + text after caret
        $this.val($this.val().substring(0, start)
                    + "\t"
                    + $this.val().substring(end));

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
});


function setup() {
  createCanvas(350, windowHeight);
}



function draw() {
  const WIDTH = 350;
  const HEIGHT = 50;
  const RADIUS = 5;
  let i = 0;
  if(allVars){
    for(let element of allVars){
      fill('#165112');
      stroke('#eaeaea');
      rect(WIDTH/2, i, WIDTH/2, HEIGHT , RADIUS, RADIUS, RADIUS, RADIUS);
      noStroke();
      fill('#eaeaea');
      textSize(20);
      textAlign(CENTER, CENTER);
      if(element.constructor == Pointer){
      	text("0x"+element.content.adress.toString(16), WIDTH-WIDTH/4, HEIGHT/2+i);
      }
      else{
      	text(element.content, WIDTH-WIDTH/4, HEIGHT/2+i);
      }
      
      textSize(12);
      textAlign(LEFT, TOP);
      text(element.name, 5+WIDTH/2, i+5);
      textAlign(LEFT);
      text(element.type, 5+WIDTH/2, i+HEIGHT- 15);
      textAlign(CENTER, CENTER);
      text("0x"+element.adress.toString(16), WIDTH/4, HEIGHT/2+i);
      i+=50;
    }
  }
  
}

 