
//Function that detects the pointers in the textbox and makes a table with them
function findPointers(){

	//Gets the text typed by the user
	text = document.getElementById("textbox").value;

	//Finds the outputPtr in the HTML body
	var outputPtr = document.getElementById("outputPtr");

	//Checks, using regex, if a varible is a pointer. Can recognize, for example, "double*  ptr = &new ;" with all its spaces
	var pointers = /(int|float|double|char|short)\s*\*\s*\w+\s*(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;

	var pointersArray = text.match(pointers);
	var pointersNames = new Array(pointersArray.length);
	var pointersTypes = new Array(pointersArray.length);

	for (let i = 0; i < pointersArray.length; i++) {
		let type = /(int|float|double|char|short)\s*\*\s*/gi;
		let afterName = /(\=\s*(\w+|\&\w+)\w*\s*\;|\;)/gi;

		//Removes the variable type name and everything after the variable's name
		pointersNames[i] = pointersArray[i].replace(type, "").replace(afterName, "");

		//Matches the variable type name, convert the array to a String and then removes the * symbol
		pointersTypes[i] = pointersArray[i].match(type).toString().replace(/\*/g, "");
	}

	//Creates a table element and each one of its rows with two collumns each: the "pointers types" and the pointers names
	var table = document.createElement("table");
	var arrlength = pointersArray.length;
	for (let i = 0; i < arrlength; i++){
		let newnodeType = document.createTextNode(pointersTypes[i]);
		let newnodeName = document.createTextNode(pointersNames[i]);
		let newtr = document.createElement("tr");
		let newtd = document.createElement("td");
		let newtd2 = document.createElement("td");
		newtd.appendChild(newnodeType);
		newtd2.appendChild(newnodeName);
		newtr.appendChild(newtd);
		newtr.appendChild(newtd2);
		table.appendChild(newtr);
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
 
//I will comment them with more detail in the future
$(document).ready( function(){
  $("#button").click(function(){
  	var strings = document.getElementById("textbox").value;
    $.post("http://api.paiza.io/runners/create",
    {
      source_code: `${strings}`,
      language: "c",
      api_key: "guest"
    },
   		function(data) {
    		console.log(data);
			getMethod(data);	
		}, "text"); 
	});
});

function getMethod(dd){
	var newstring = new Object();
	var id_data = /"[^(id):].*?"/i;
	newstring.id = dd.match(id_data).toString().replace(/"/g, "");
	newstring.api_key = "guest";
    $.get("http://api.paiza.io/runners/get_details", newstring, function(datas){
      var status = /"status": ".*?"/;

      if(datas.match(status).toString() == "\"status\": \"running\""){
      	console.log("novamente");
      	setTimeout(function(){getMethod(dd)}, 100);
      	return;
      }

      console.log(datas);
      var stdout = /"stdout": ".*?"/;

      var outputC = datas.match(stdout).toString().replace(/"stdout":/, "").replace(/"/g, "");
      document.getElementById("outputC").innerHTML = outputC.replace(/\\n/g, "\n");
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
