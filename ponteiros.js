
//Function that separates the name of a variable from its type and content
function getNames(varArray){
	
	let type = /(int|float|double|char|short)\s*\**\s*/gi;
	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let names = new Array(varArray.length);
	for (let i = 0; i < varArray.length; ++i){

		//Removes the variable type name and everything after the variable's name
		names[i] = varArray[i].toString().replace(type, "").replace(afterName, "").replace(" ", "");		
	}		

	return names;
}	

/*Function that returns an array with the variables types separated from
 the variables themselves of the varArray*/ 
function getTypes(varArray){

	let type = /(int|float|double|char|short)\s*\**\s*/gi;
	let types = new Array(varArray.length);
	for(let i = 0; i < varArray.length; ++i){
		
		//Matches the variable type name, convert the array to a String 
		types[i] = varArray[i].match(type).toString();
	}

	return types;
}	


/*Function that returns an array with the contents separated from
 the variables of varArray*/ 
function getContents(varArray){

	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let contents= new Array(varArray.length);
	for(let i = 0; i < varArray.length; ++i){
		
		//Matches the variable name that the pointer is pointing to. Removes the ; and = & symbols
		contents[i] = varArray[i].match(afterName).toString().replace(/\s*;/, "").replace(/\=\s*&*/, "");
	}

	return contents;
}


/*This function looks for variables that were declared but not initialized at the same time 
and searches for other occurrences of their names to see if they were initialized afterwards.
If that is the case, the new value is assigned to its content*/
function searchesLaterContents(contents, names, text){

	//Look for every variable declared
	for (let i = 0; i < names.length; i++) {

			/*If the variable wasn't initialized when it was declared, a search is made to see
			if it was initialized somewhere else in the code.*/
			if(!contents[i]){
				
				//While the variable isn't initialized, the value that he is pointing to is "lixo" (garbage)
				contents[i] = "lixo";

				//Searching for other occurrence of the name of variable in the code
				
				/*startIndex is the index to begin the search for the other occurrence. It starts
				just after the index of the first declaration*/
				let startIndex = text.indexOf(names[i])+1;
				let indexOfVar = 1;
				let keep = true;

				/*While keep is true and there is other occurrence of the name in the code 
				(indexOf return a nonnegative number)*/
				while(keep){

					//Gets the index of the next substring with the same name as the variable's name
					indexOfVar = text.indexOf(names[i], startIndex);

					//If no name was found, then the loop ends
					if(indexOfVar < 0){
						break;
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

					/*If subs isn't equal to the names[i], i.e., doesn't end in the same way of 
					names[i] or have a different character in the meddle, then the loop is 
					restarted with a new startIndex. Else, the loop ends.*/
					if(subs != names[i]){
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
						continue;
					}

					/*WARNING: This allows strange errors while the user is typing. Ex.:
					int x;
					x = ...
					int y = 5;
					If the user is typing in the "..." location the code below would 
					take everything until it finds a semicolon, i.e., "int y = 5"*/
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
						contents[i] = varText.replace(/\s*&*/, "");
					}
				}
				
			}
		}
}


/*This functions takes 3 arrays (a, b, c) of length Arrlength and append
their elements in a table*/
function appendToTable(a, b, c, Arrlength, table){
	
	for (let i = 0; i < Arrlength; i++){

			//Creating text nodes to append them in tables data (td)
			let newnodeType = document.createTextNode(a[i]);
			let newnodeName = document.createTextNode(b[i]);
			let newnodeContent = document.createTextNode(c[i]);

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








//Function that detects the pointers in the textbox and makes a table with them
function findPointers(){

	//Gets the text typed by the user
	text = document.getElementById("textbox").value;

	//Finds the outputPtr in the HTML body
	let outputPtr = document.getElementById("outputPtr");

	
	//Searches, using regex, for variables that are not pointers
	var variables = /(int|float|double|char|short)\s*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let variablesArray = text.match(variables);


	//Checks, using regex, if a variable is a pointer. Can recognize, for example, "double*  ptr = &new ;" with all its spaces
	var pointers = /(int|float|double|char|short)\s*\*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;

	let pointersArray = text.match(pointers);



	//If there is no pointers and no normal variables
	if(pointersArray == null && variablesArray == null){

		//Checks if outputPtr has a table with the old pointers (if it has, the table is removed)
		if(outputPtr.hasChildNodes()){
			outputPtr.removeChild(outputPtr.firstChild);
		}

		//Get out of the function to avoid pass through pointless pointers processes
		return;
	} 

	//Creates table element to show the normal variables and pointers
	let table = document.createElement("table");

	if(variablesArray != null){
		
		var variablesNames = getNames(variablesArray);
		var variablesTypes = getTypes(variablesArray);
		var variablesContents = getContents(variablesArray);
		let varLength = variablesArray.length;
		searchesLaterContents(variablesContents, variablesNames, text);

		appendToTable(variablesTypes, variablesNames, variablesContents, varLength, table);
	}

	//If there is pointers in the code
	if(pointersArray != null){

		var pointersNames =  getNames(pointersArray);
		var pointersTypes =  getTypes(pointersArray); 
		var pointersVars = getContents(pointersArray);
		let ptrLength = pointersArray.length;
		var pointerDereference = new Array(ptrLength).fill("lixo");
		
		searchesLaterContents(pointersVars, pointersNames, text);

		//Checks if there is at least one normal variable in the code
		if(variablesNames != null){
			//Puts the content of a variable in the "dereferenced pointer" that points to this variable
			for (let i = 0; i < ptrLength; ++i){
				let indexOfVar = variablesNames.indexOf(pointersVars[i]);
				if (indexOfVar >= 0){
					pointerDereference[i] = variablesContents[indexOfVar];
				}
			}
		}

		appendToTable(pointersTypes, pointersNames, pointersVars, ptrLength, table);


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









/*The following lines are made to communicate with the Paiza API, that compiles and executes
 the code typed by the user. This is made by using the jQuery library that can easily 
 communicate with the API through HTTP requests.*/
 
$(document).ready( function(){

	/*In the moment the user clicks the "Compilar e Executar" button the function below
	 is activated. It sends a POST request to the Paiza serve with the code and inputs that 
	 the user has written. After the POST request succeeds, it takes its response and sends 
	 to the getMethod function.*/
	$("#button").click(function(){
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
				getMethod(data);	
			}, "text"); 
	});
});

/*This functions sends a GET request to the Paiza server to get the output of the user code. 
It carries the ID information, passed by the response of the POST request.*/
function getMethod(d){

	/*From the data that was passed by the POST request it's selected only the ID 
	information. This is made by a regular expression that matches whatever is inside
	quotation marks after the "id:" word. Then the quotation marks are "replaced" by
	empty strings.*/
	var getData = new Object();
	var idRegex = /"[^(id):].*?"/i;
	getData.id = d.match(idRegex).toString().replace(/"/g, "");
	getData.api_key = "guest";
    $.get("https://api.paiza.io/runners/get_details", getData, function(data){

    	/*To check if the code has finished compiling, it's searched in the response data,
    	using regular expressions, if the status parameter is still marked as "running".
    	If so, then the getMethod function is called again after 100 milliseconds.*/
		var status = /"status": ".*?"/i;
		if(data.match(status).toString() == "\"status\": \"running\""){
			console.log("again");
			setTimeout(function(){getMethod(d)}, 100);
			return;
		}

		/*If the status is marked as completed, then it's searched in the response data the
		stdout parameter, that contains the output of the user code. Since everything is
		converted in a string, the \n commands will not be read as line breaks in the outputC
		div element. So they are replaced by \n commands. It may be the case that there is no
		stdout data due to errors in compilation or execution. So, before anything, errors 
		messages are searched and, if found, sent to the user*/

		//"build_stderr" is the parameter of errors in compilation
		let build_stderr = /"build_stderr": ".*?"/;
		let compilationError = data.match(build_stderr).toString().replace(/"build_stderr": /, "").replace(/"/g, "").replace(/\\n/g, "\n");
		
		/*The "result" parameter tells if something went wrong on execution. It can have the 
		value "success" when everything went fine, "failure" when something went wrong on
		execution or null when something went wrong before execution, like a compilation
		error*/
		let result =  /"result": (?:"\w+"|null)/;
		let executionError = data.match(result).toString().replace(/"result": /, "").replace(/"/g, "").replace(/\\n/g, "\n");

		//If there is a message of compilation error then it is sent to the outputC element
		if(compilationError != ""){
			document.getElementById("outputC").innerHTML = "ERRO DE COMPILAÇÃO:\n" + compilationError;
		}
		
		/*If an execution error occurred, then it is searched, in the response, the "exit_code"
		parameter. Its value represents the kind of error that happened and it is sent to
		the outputC element*/
		else if(executionError == "failure"){
			let exit_code = /"exit_code": [0-9]*/;
			executionError = data.match(exit_code).toString().replace(/"/g, "").replace(/\\n/g, "\n");
			document.getElementById("outputC").innerHTML = "ERRO DE EXECUÇÃO:\n" + executionError;
		}

		/*If none of the errors occurred, it is sent the value of the "stdout" parameter that
		contains the output of the code*/
		else{
			let stdout = /"stdout": ".*?"/;
			let outputC = data.match(stdout).toString().replace(/"stdout":/, "").replace(/"/g, "").replace(/\\n/g, "\n");
			document.getElementById("outputC").innerHTML = outputC;
		}

    }, "text");  
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
