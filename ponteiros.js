//Function that separates the name of a variable from its type and content
function getNames(varArray, regVars){
	let type = /(int|float|double|char|short)\s*\**\s*/gi;
	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	for (let i = 0; i < varArray.length; ++i){

		//Removes the variable type name and everything after the variable's name
		regVars[i].name = varArray[i].toString().replace(type, "").replace(afterName, "").replace(" ", "");		
	}		
}


/*Function that returns an array with the variables types separated from
 the variables themselves of the varArray*/ 
function getTypes(varArray, regVars){
	let type = /(int|float|double|char|short)\s*\**\s*/gi;
	for(let i = 0; i < varArray.length; ++i){
		
		//Matches the variable type name, convert the array to a String 
		regVars[i].type = varArray[i].match(type).toString();
	}
}	


/*Function that returns an array with the contents separated from
 the variables of varArray*/ 
function getContents(varArray, regVars, text){
	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	for(let i = 0; i < varArray.length; ++i){

		//Matches the variable name that the pointer is pointing to. Removes the ; and = & symbols
		let contentFound = varArray[i].match(afterName).toString().replace(/\s*;/, "").replace(/\=\s*&*/, "");
		
		/*If the variable wasn't initialized in the moment it was declared,
		the function searchesLaterContent is called to find out it was 
		initialized later or if it was never initialized, i.e., it contains
		only "lixo" (garbage)*/
		if(contentFound == ""){
			regVars[i].content = searchesLaterContent(regVars[i], text); 
		}
		else{	
			regVars[i].content = contentFound;
		}
	}

}


/*This function looks for variables that were declared but not initialized at the same time 
and searches for other occurrences of their names to see if they were initialized afterwards.
If that is the case, the new value is assigned to its content*/
function searchesLaterContent(varObj, text){
	
	/*startIndex is the index to begin the search for the other occurrence. It starts
	just after the index of the first declaration*/
	let startIndex = text.indexOf(varObj.name)+1;
	let indexOfVar = 1;
	let keep = true;

	/*While keep is true and there is other occurrence of the name in the code 
	(indexOf return a nonnegative number)*/
	while(keep){

		//Gets the index of the next substring with the same name as the variable's name
		indexOfVar = text.indexOf(varObj.name, startIndex);

		//If no name was found, then "lixo" (garbage) is returned
		if(indexOfVar < 0){
			return "lixo";
		}
		
		/*Checks if the occurrence is a whole word (doesn't have letter characters 
		before the beginning or after the end)*/

		/*If before the beginning of the name there is not a space, a new line character
		or a semicolon, then the occurrence found isn't a whole word and the 
		loop is	restarted with a new startIndex, after this occurrence*/
		if(text[indexOfVar-1].match(/[\s\n;]/) == null){
			startIndex = indexOfVar+1;
			continue;
		}

		/*subs stores the substring that goes from the indexOfVar until the end of the
		name (ended with a space or = sign)*/
		let subs = text[indexOfVar];
		let counter = indexOfVar + 1;
		
		/*While the character in text[counter] is not a space or equal sign, i.e., is not
		the end of the word, or is not the end of the text, keep adding character to the
		subs string*/
		while(text[counter] != " " && text[counter] != "=" && counter < text.length){
			subs += text[counter];
			counter++;
		}

		/*If subs isn't equal to the variable's name, i.e., doesn't end in the same way of 
		varObj.name or have a different character in the meddle, then the loop is 
		restarted with a new startIndex. Else, the loop ends.*/
		if(subs != varObj.name){
			startIndex = indexOfVar+1;
		}
		else{
			keep = false;
		}
	}
	

	/*If there is another name of the pointer in the code, a search is made to find
	the variable name that it is pointing to.*/
	if(indexOfVar >= 0){
		let varText = "";
		let j = indexOfVar;
		let found = true;
		while(text[j] != '=' &&  j < text.length){
			j++;
		}

		/*j is incremented. If the end of the text is reached, the for loop continue
		for the next iteration*/
		if(++j >= text.length){
			return "lixo";
		}

		//While the ";" is not reached, keep adding characters to varText
		while(text[j] != ';'){
			varText += text[j];
			j++;
			if(j >= text.length){
				found = false;
				break;
			} 
		}

		/*In the end, if the variable indeed receives a new value, its content is
		modified to this value*/
		if(found){
			return varText.replace(/\s*&*/, "");
		}
	}

	return "lixo";	
}


/*This functions takes the array of variables and append their elements
attributes in a table*/
function appendToTable(regVars, arrLength, table){
	
	for(let i = 0; i < arrLength; ++i){

			//Creating text nodes to append them in tables data (td)
			let newnodeType = document.createTextNode(regVars[i].type);
			let newnodeName = document.createTextNode(regVars[i].name);
			let newnodeContent = document.createTextNode(regVars[i].content);

			//Creating a table row to append the tables data in it 
			let newtr = document.createElement("tr");

			//Creating the tables data
			let newtd = document.createElement("td");
			let newtd2 = document.createElement("td");
			let newtd3 = document.createElement("td");

			//Appending the text nodes in the tables data
			newtd.appendChild(newnodeType);
			newtd2.appendChild(newnodeName);
			newtd3.appendChild(newnodeContent);

			//Appending the tables data in the table row
			newtr.appendChild(newtd);
			newtr.appendChild(newtd2);
			newtr.appendChild(newtd3);

			//Appending the new table row in the table
			table.appendChild(newtr);
		}
}








/*Function that detects the pointers and regular variables in the textbox
and makes a table with them*/
function findPointers(){

	//Gets the text typed by the user
	text = document.getElementById("textbox").value;

	//Finds the outputPtr in the HTML body
	let outputPtr = document.getElementById("outputPtr");

	//Searches, using ReGex, for variables that are not pointers
	var variables = /(int|float|double|char|short)\s*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let variablesArray = text.match(variables);


	/*Checks, using ReGex, if a variable is a pointer. Can recognize, for example,
	"double*  ptr = &new ;" with all its spaces*/
	var pointers = /(int|float|double|char|short)\s*\*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let pointersArray = text.match(pointers);

	//If there is no pointers and no regular variables
	if(pointersArray == null && variablesArray == null){

		/*Checks if outputPtr has a table with the old variables
		(if it has, the table is removed)*/
		if(outputPtr.hasChildNodes()){
			outputPtr.removeChild(outputPtr.firstChild);
		}

		//Get out of the function to avoid pass through pointless pointers processes
		return;
	} 

	//Creates table element to show the regular variables and pointers
	let table = document.createElement("table");




	//Class to construct a regular variable object
	class RegularVariable{
		constructor(){
			this.type = null;
			this.name = null;

			//Its value
			this.content = null;
		}
	}

	//If at least one regular variable was found 
	if(variablesArray != null){

		//varLength is the number of regular variables found
		let varLength = variablesArray.length;
		
		//Creating an array to store regularVariable's objects
		var regVars = new Array(varLength);

		//Transforming each element of regVars into a regularVariable's object
		for(let i = 0; i < varLength; ++i){
			regVars[i] = new RegularVariable();
		}

		//Setting all the attributes of the objects in regVars
		getNames(variablesArray, regVars);
		getTypes(variablesArray, regVars);
		getContents(variablesArray, regVars, text);

		//Appending all the elements and its attributes of regVars in the table
		appendToTable(regVars, varLength, table);
		
	}



	//Class to construct a regular variable object
	class Pointer{
		constructor(){
			this.type = null;
			this.name = null;

			//Name of variable that it's pointing to
			this.content = null; 
		}
	}

	//If at least one pointer was found
	if(pointersArray != null){
		
		let ptrLength = pointersArray.length;

		//Creating an array to store regularVariable's objects
		var pointers = new Array(ptrLength);

		//Transforming each element of regVars into a regularVariable's object
		for(let i = 0; i < ptrLength; ++i){
			pointers[i] = new Pointer();
		}

		//Setting all the attributes of the objects in pointers
		getNames(pointersArray, pointers);
		getTypes(pointersArray, pointers);
		getContents(pointersArray, pointers, text);

		//Appending all the elements and its attributes of pointers in the table
		appendToTable(pointers, ptrLength, table);

	}


	/*If one or more pointers were already detected in the last call of this function,
	 "outputPtr" will already have a "child", i.e., it will have a table "inside" it and
	 we just have to replace it with the new updated table. Otherwise, we append the new 
	 table to the outputPtr div element.*/ 
	if(outputPtr.hasChildNodes()){
		outputPtr.replaceChild(table, outputPtr.firstChild);
	}
	else{
		outputPtr.appendChild(table);
	}
} 





//Variable to set interval of a compiling message
var compiling;

/*The following lines are made to communicate with the Paiza API, that compiles and executes
 the code typed by the user. This is made by using the jQuery library that can easily 
 communicate with the API through HTTP requests.*/
 
$(document).ready( function(){

	/*In the moment the user clicks the "Compilar e Executar" button the function below
	 is activated. It sends a POST request to the Paiza serve with the code and inputs that 
	 the user has written. After the POST request succeeds, it takes its response and sends 
	 to the getMethod function.*/
	$("#button").click(function(){

		//Shows the user, in the outputC box, that the code is compiling
		document.getElementById("outputC").innerHTML = "Compilando...";
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
