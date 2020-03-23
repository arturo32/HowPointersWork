
//Function that separetes the name of a varible from its type and content
function getNames(varArray){
	
	let type = /(int|float|double|char|short)\s*\**\s*/gi;
	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let names = new Array(varArray.length);
	for (let i = 0; i < varArray.length; ++i){

		//Removes the variable type name and everything after the variable's name
		names[i] = varArray[i].toString().replace(type, "").replace(afterName, "");		
	}		

	return names;
}	

/*Function that returns an array with the variables types separeted from
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


/*Function that returns an array with the contents separeted from
 the variables of varArray*/ 
function getContents(varArray){

	let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let contents= new Array(varArray.length);
	for(let i = 0; i < varArray.length; ++i){
		
		//Matches the variable name that the pointer is pointing to. Removes the ; and = & symbols
		contents[i] = varArray[i].match(afterName).toString().replace(/;/, "").replace(/\=\s*&/, "");
	}

	return contents;
}


///////////////////NEEDS CHANGE IN COMMENTS
function searchesLaterContents(contents, names, text){
	for (let i = 0; i < names.length; i++) {
			/*If the pointer wasn't inicialized when it was declared, a search is made to see
			if it was inicialized somewhere else in the code.*/
			if(!contents[i]){
				
				//While the pointer isn't inicialized, the value that he is pointing to is "lixo" (garbage)
				contents[i] = "lixo";

				//Gets the index of the next substring with the same name as the pointer's name
				let indexOfVar = text.indexOf(names[i], text.indexOf(names[i])+1);

				/*If there is another name of the pointer in the code, a search is made to find
				the variable name that it is pointing to.*/
				if(indexOfVar > 0){
					let varText = "";
					let j = indexOfVar;
					let found = true;
					while(text[j] != '=' || text[j] == ' '){
						j++;
						if(j > text.length){
							notFound = false; 
							break;
						}
					}
					j++;
					while(text[j] != ';'){
						varText += text[j];
						j++;
						if(j > text.length){
							found = false;
							break;
						} 
					}
					if(found){
						contents[i] = varText.replace("&", "");
					}
				}
				
			}
		}
}








//Function that detects the pointers in the textbox and makes a table with them
function findPointers(){

	//Gets the text typed by the user
	text = document.getElementById("textbox").value;

	//Finds the outputPtr in the HTML body
	let outputPtr = document.getElementById("outputPtr");

	
	//Searches, using regex, for varibles that are not pointers
	var variables = /(int|float|double|char|short)\s*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;
	let variablesArray = text.match(variables);


	//Checks, using regex, if a varible is a pointer. Can recognize, for example, "double*  ptr = &new ;" with all its spaces
	var pointers = /(int|float|double|char|short)\s*\*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;

	let pointersArray = text.match(pointers);



	//If there is no pointers and no normal variables
	if(pointersArray == null && variablesArray == null){

		//Checks if outputPtr has a table with the old pointers (if it has, the table is removed)
		if(outputPtr.hasChildNodes()){
			outputPtr.removeChild(outputPtr.firstChild);
		}

		//Get out of the function to avoid pass through poitless pointers processes
		return;
	} 

	//Creates table element to show the normal variables and pointers
	let table = document.createElement("table");

	if(variablesArray != null){
		
		let variablesNames = getNames(variablesArray);
		let variablesTypes = getTypes(variablesArray);
		let variablesContents = getContents(variablesArray);
		let varLength = variablesArray.length;
		searchesLaterContents(variablesContents, variablesNames, text);

		for (let i = 0; i < varLength; i++){
			let newnodeType = document.createTextNode(variablesTypes[i]);
			let newnodeName = document.createTextNode(variablesNames[i]);
			let newnodeContent = document.createTextNode(variablesContents[i]);
			let newtr = document.createElement("tr");
			let newtd = document.createElement("td");
			let newtd2 = document.createElement("td");
			let newtd3 = document.createElement("td");
			newtd.appendChild(newnodeType);
			newtd2.appendChild(newnodeName);
			newtd3.appendChild(newnodeContent);
			newtr.appendChild(newtd);
			newtr.appendChild(newtd2);
			newtr.appendChild(newtd3);
			table.appendChild(newtr);
		}
	}

	//If there is pointers in the code
	if(pointersArray != null){

		let pointersNames =  getNames(pointersArray);
		let pointersTypes =  getTypes(pointersArray); 
		let pointersVars = getContents(pointersArray);
		let ptrLength = pointersArray.length;
		searchesLaterContents(pointersVars, pointersNames, text);

		/*Creates rows for the table with three collumns each: the "pointers types",
		 the pointers names and the variable names that the pointers point to*/
		for (let i = 0; i < ptrLength; i++){
			let newnodeType = document.createTextNode(pointersTypes[i]);
			let newnodeName = document.createTextNode(pointersNames[i]);
			let newnodeVar = document.createTextNode(pointersVars[i]);
			let newtr = document.createElement("tr");
			let newtd = document.createElement("td");
			let newtd2 = document.createElement("td");
			let newtd3 = document.createElement("td");
			newtd.appendChild(newnodeType);
			newtd2.appendChild(newnodeName);
			newtd3.appendChild(newnodeVar);
			newtr.appendChild(newtd);
			newtr.appendChild(newtd2);
			newtr.appendChild(newtd3);
			table.appendChild(newtr);
		}
	}


	/*If one or more pointers were alredy detected in the last call of this function,
	 "outputPtr" will alredy have a "child", i.e., it will have a table "inside" it and
	 we just have to replace it with the new updated table. Otherwise, we append the new 
	 table to the outputPtr div element.*/ 
	if(outputPtr.hasChildNodes()){
		outputPtr.replaceChild(table, outputPtr.firstChild);
	}
	else{
		outputPtr.appendChild(table);
	}
} 








/*The following lines are made to comunicate with the Paiza API, that compiles and executes
 the code typed by the user. This is made by using the jQuery library that can easily 
 comunicate with the API through HTTP requests.*/
 
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
	quototion marks after the "id:" word. Then the quotation marks are "replaced" by
	empty strings.*/
	var getData = new Object();
	var idRegex = /"[^(id):].*?"/i;
	getData.id = d.match(idRegex).toString().replace(/"/g, "");
	getData.api_key = "guest";
    $.get("https://api.paiza.io/runners/get_details", getData, function(data){

    	/*To check if the code has finished compiling, it's searched in the response data,
    	using regular expressions, if the status parameter is still marked as "running".
    	If so, then the getMethod function is called again after 100 miliseconds.*/
		var status = /"status": ".*?"/i;
		if(data.match(status).toString() == "\"status\": \"running\""){
			console.log("again");
			setTimeout(function(){getMethod(d)}, 100);
			return;
		}

		/*If the status is marked as completed, then it's searched in the reponse data the
		stdout parameter, that contains the output of the user code. Since everything is
		converted in a string, the \n commands will not be read as line breaks in the outputC
		div element. So they are replaced by \n commands. It may be the case that there is no
		stdout data due to errors in compilation or execution. So, before anything, errors 
		menssages are searched and, if found, sent to the user*/

		//"build_stderr" is the parameter of errors in compilation
		let build_stderr = /"build_stderr": ".*?"/;
		let compilationError = data.match(build_stderr).toString().replace(/"build_stderr": /, "").replace(/"/g, "").replace(/\\n/g, "\n");
		
		/*The "result" parameter tells if something went wrong on execution. It can have the 
		value "sucess" when everything went fine, "failure" when somenthing went wrong on
		execution or null when something went wrong before execution, like a compilation
		error*/
		let result =  /"result": (?:"\w+"|null)/;
		let executionError = data.match(result).toString().replace(/"result": /, "").replace(/"/g, "").replace(/\\n/g, "\n");

		//If there is a menssage of compilation error then it is sent to the outputC element
		if(compilationError != ""){
			document.getElementById("outputC").innerHTML = "ERRO DE COMPILAÇÃO:\n" + compilationError;
		}
		
		/*If an execution error ocurred, then it is searched, in the response, the "exit_code"
		parameter. Its value represents the kind of error that happened and it is sent to
		the outputC element*/
		else if(executionError == "failure"){
			let exit_code = /"exit_code": [0-9]*/;
			executionError = data.match(exit_code).toString().replace(/"/g, "").replace(/\\n/g, "\n");
			document.getElementById("outputC").innerHTML = "ERRO DE EXECUÇÃO:\n" + executionError;
		}

		/*If none of the errors ocurred, it is sent the value of the "stdout" parameter that
		contains the output of the code*/
		else{
			let stdout = /"stdout": ".*?"/;
			let outputC = data.match(stdout).toString().replace(/"stdout":/, "").replace(/"/g, "").replace(/\\n/g, "\n");
			document.getElementById("outputC").innerHTML = outputC;
		}

    }, "text");  
}



//This code block was entirely copied from the internet just to make tabs work in the textbox
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
