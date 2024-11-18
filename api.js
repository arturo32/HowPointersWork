
/*The following lines are made to communicate with the Paiza API, that compiles and executes
 the code typed by the user. This is made by using the jQuery library that can easily 
 communicate with the API through HTTP requests.*/



//Variable to set interval of a compiling message
var compiling;

/*Variable to be used in the POST request to specify the
language that will be compiled. Default is C.*/
var lang = "c";

//Selecting the div element with "arrow" class
var arrow = document.querySelector(".arrow");

//Selecting the div element with "language" ID
var lang_options = document.querySelector("#lang_options");

/*When the lang_options box is clicked, its height is changed,
showing the options available (or hiding them if it was already
clicked). The rotation and location of the arrow also changes*/
lang_options.onclick = function(){
	if(window.getComputedStyle(lang_options).getPropertyValue("height") == "29px"){
		lang_options.style.height = "84px";
		arrow.style.transform = "rotate(-135deg)";
		arrow.style.top = "10px";

	}
	else{
		lang_options.style.height = "29px";
		arrow.style.transform = "rotate(45deg)";
		arrow.style.top = "7px";
	}
}	


//Selecting the items of the lang_options
var lang_selected = document.querySelector("#lang_selected");
var lang_C = document.querySelector("#lang_C");
var lang_Cpp = document.querySelector("#lang_Cpp");

/*If the option that contains "C" is clicked, the lang_selected
content is change to "C" and the language send to the POST
request is changed to "c". The same happens with the "C++"
option*/
lang_C.onclick = function(){
	lang_selected.innerHTML = "C";
	lang = "c";
}
lang_Cpp.onclick = function(){ 
	lang_selected.innerHTML = "C++";
	lang = "cpp";
}



 
$(document).ready( function(){


	/*In the moment the user clicks the "Compilar e Executar" button the function below
	 is activated. It sends a POST request to the Paiza serve with the code and inputs that 
	 the user has written. After the POST request succeeds, it takes its response and sends 
	 to the getMethod function.*/
	// $("#button").click(function(){
	//
	//
	//
	// 	//Shows the user, in the outputC box, that the code is compiling
	// 	document.getElementById("outputC").innerHTML = "Compilando...";
	//
	// 	//Adding a dot in the ouputC every second
	// 	//In case the user press the button more than once, the previous interval is cleared
	// 	clearInterval(compiling);
	// 	compiling = setInterval(function(){
	// 		document.getElementById("outputC").innerHTML += ".";
	//  	}, 1000);
	//
	//
  	// 	var inputText = document.getElementById("inputC").value;
	//   	var strings = document.getElementById("textbox").value;
	//     $.post("https://api.paiza.io/runners/create",
	//     	{
	// 	    	source_code: strings,
	// 	    	language: lang,
	// 	    	input: inputText,
	// 	    	api_key: "guest"
	//     	},
	//
	//    		function(data) {
	// 			getMethod(data.id);
	// 		}, "json");
	// });
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


