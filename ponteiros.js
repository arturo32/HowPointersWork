//Class to construct a regular variable object
class RegularVariable {
	constructor(){
		this.type = "";
		this.name = "";
		this.address = null;
		this.content = "lixo";
	}

}

//Class to construct a regular variable object
class Pointer {
	constructor(){
		this.type = "";
		this.name = "";
		this.address = null;

		//To receive afterwards a reference to the variable that it's pointing to
		this.content = new RegularVariable(); 
	}

}

const types = new Map([['char', 1], ['short', 2], ['int', 4], ['float', 4],
 ['double', 8], ['int*', 1], ['char*', 1], ['short*', 1], ['float*', 1], ['double*', 1] ]);



/*Redraws the memory each time the window of the browser is resized.
A time of 100 milliseconds is set to wait for the values of the new
size be updated*/
window.addEventListener("resize", ()=> setTimeout( ()=> drawMemory(), 100 ));

//Selecting the element with ID textbox (where the user types their code)
var textbox = document.querySelector("#textbox");

/*Adding two event listeners to the textbox: one that recognizes every
change in the text of texbox and other that recognizes every time the
user pastes something in the textbox. Both call the keyChecker function*/
textbox.addEventListener("input", keyChecker);
textbox.addEventListener("paste", keyChecker);

/*Function that calls the findPointer function if the user have typed a
semicolon, the "enter" key or have pasted something in the textbox*/
function keyChecker(e){

	/*If the event that triggered this function was a paste event then
	it is set a timeout to wait the text be placed in the textbox and,
	finally, the findPointers function is called*/
	if(e.type == "paste"){
		setTimeout(function(){findPointers()}, 100);
		return;
	}

	/*The keyword "this" points to the object that invoked the function
	that called THIS function (keyChecker). In this case, is the textbox
	element.*/ 
	/*The property selectionEnd is the index that points to the 
	location of the insertion point (text cursor, caret). So, subtracting
	one	from it, it's possible to know the last character typed by the
	user.*/
	let index = this.selectionEnd - 1;

	/*If the character typed by the user was a semicolon or a break line
	character, the findPointers function is called*/
	let regex = /;|\n/;
	if(regex.test(this.value[index])){
		findPointers();
	}
}


/*Function that separates the contents from the elements of varArray
and put them in the content properties of the objects in varObjs*/ 
function getContent(varObj, regVars = null){

		//If the elements of varObjs are pointer objects
		if(varObj.constructor == Pointer){

			/*If the variable wasn't initialized in the moment it was declared,
			the function searchesLaterContent is called to find out it was 
			initialized later*/
			
			let contentFound = searchLaterContent(varObj);

			//If the pointer was initialized at any moment in the code
			if(contentFound != "lixo"){
				
				/*A regular variable object with the same name of contentFound
				is searched in the regVars array*/
				let ptrContent = regVars.find(x => x.name == contentFound.replace(/\&*/, ""));
				
				/*If found, the content of varObj receive a reference to
				such object*/
				if(ptrContent) varObj.content = ptrContent;
			}
		}

		//If varObj is a regular variable object
		else{

			/*If contentFound is not empty then the content of the variable
			receives the contentFound. Else, it receives what searchesLaterContent
			returns ("lixo", i.e. garbage, or the last value assigned to it in the
			code*/
			varObj.content = searchLaterContent(varObj);
		}

}


/*This function looks for variables that were declared but not initialized at the same time 
and searches for other occurrences of their names to see if they were initialized afterwards.
If that is the case, the new value is returned*/
function searchLaterContent(varObj){

	//RegEx in a string format for looking for assignments of variables
	let assignment = "(\\s*\\=\\s*(\\w+|\\&\\w+)\\s*;)";

	/*Match all lines that have the (whole) name of varObj and ends with
	an assignment. Prevents getting dereferencing pointers using the
	"[^\\*]" option. The result is an iterator*/
	let contentsIterator = textbox.value.matchAll(new RegExp("(?:\\w\\s*\\**|[^\\*])\\b" + varObj.name + "\\b" + assignment, 'g'));

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
function findDereferencing(pointers){

	/*There are two capturing groups in this RegEx: the first one
	is the name of the pointer and the second one is the value 
	assigned to the dereferenced pointer*/
	let dereferencesRegex =  /[^\w]\n*\s*\*\s*(\w+)\s*\=\s*(\w+)\s*;/gi;

	/*matchAll returns an iterator that can be seen as an array of
	arrays. Each outer array is a match of the RegEx in an array format:
	the element 0 is the full match, the element 1 is the first capturing
	group and the element 2 is the second capturing group*/
	let dereferences = textbox.value.matchAll(dereferencesRegex);

	//If no dereferenced pointer was found, the function ends
	if(dereferences == null) return;

	/*For each match of deferences iterator it's found a corresponding 
	pointer name and then the value assigned to the pointer dereferenced
	is assigned to the variable pointed by this pointer*/
	for(let def of dereferences){
		let ptrObj = pointers.find(ptr => ptr.name == def[1]);
		if(ptrObj) ptrObj.content.content = def[2];
	}
}



function setProperties(objConstructor, regex, regVars = null){

	//Creating an array to store the objects
	let varObjs = new Array();

	/*Iterator that iterates over objects that contains all matches in the
	text*/
	let varIterator = textbox.value.matchAll(regex);
	
	/*Iterating over the values of the objects of the variableIterator. Each
	value is an array that have 4 elements: the first one is the entire match
	and the following ones are the capturing groups in the same other explained
	in the findPointers function*/
	for(const matchArray of varIterator){
		
		//Creating new object of type objContructor
		let newObj =  new objConstructor();

		//Setting its properties
		newObj.type = matchArray[1].replace(/\s*/g, "");
		newObj.name = matchArray[2];

		//getContent searches for contents beyond declarations 
		getContent(newObj, regVars); 

		//Putting newObj as the last element of the varObjs array 
		varObjs.push(newObj);
	}

	//Returning the array of objects
	return varObjs;
}


var pointers;
var regVars;


/*Function that detects the pointers and regular variables in the textbox
and makes a table with them*/
function findPointers(){
	

	/*RegEx that matches all possible types of regular variables declarations
	that may or may not have initializations. It has three capturing groups:
	the first one is the type, the second, the name, and the third (not the 
	non-capturing group with ?: in the beginning), the value/content*/
	let variablesRegEx = /(int|float|double|char|short)\s+(\w+)\s*(?:\=\s*(\w+|\&\w+)\w*\s*\;|\;)/g;

	/*setProperties, if it finds variables in the text as defined by the
	RegEx above, returns an array filled with objects of type
	RegularVariable. If	none were found, it returns a null array*/
	regVars = setProperties(RegularVariable, variablesRegEx);


	//Same RegEx as variablesRegEx but with an asterisk just after the type
	let pointersRegEx = /((?:int|float|double|char|short)\s*\*)\s*(\w+)\s*(?:\=\s*(\w+|\&\w+)\s*\;|\;)/g;
	
	/*setProperties, if it finds pointers in the text as defined by the
	RegEx above, returns an array filled with objects of type
	Pointer. If	none were found, it returns a null array*/
	pointers = setProperties(Pointer, pointersRegEx, regVars);


	//If at least one pointer was found
	if(pointers.length){
		
		/*Updates the regular variables contents if there are pointers
		dereferenced that are being assigned a value*/
		findDereferencing(pointers);
	}

	//Setting the memory's addresses of the variables
	setMemoryAddresses(regVars);
	setMemoryAddresses(pointers);

	//Calling the function that draws the memory representation
	drawMemory();

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


 