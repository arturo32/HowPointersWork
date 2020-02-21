function findPointers(){
	//Gets the text typed by the user
	var text = document.getElementById("textbox").value;

	//Finds the output in the HTML body
	var output = document.getElementById("output");

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

	var table = document.createElement("table");
	for (let i = 0; i < pointersArray.length; i++){
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

	if(output.hasChildNodes()){
		output.replaceChild(table, output.firstChild);
	}
	else{
		output.appendChild(table);
	}
} 
