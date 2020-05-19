class memoryCell{
	constructor(x, y, width, height, radius, element){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.element = element;
	}

	drawCell(){
		//Drawing memory cell 
		fill("#2d2e29");
		stroke("#fd971f");
		strokeWeight(1);
		if(this.element.type != ""){
			this.height *= 2; //types.get(this.element.type);
		}
		rect(this.x, this.y, this.width, this.height , this.radius, this.radius, this.radius, this.radius);

		this.drawContent();
		this.drawName();
		this.drawType();
		this.drawAddress();
	}

	drawContent(){
		//Content
		noStroke();
		fill('#eaeaea');
		textSize(16);
		textAlign(CENTER, CENTER);
		if(this.element.constructor == Pointer){
			if(this.element.content.address != null){
				text("0x"+this.element.content.address.toString(16), this.x + this.width/2, this.height/2+this.y);
			}
			else{
				text("lixo", this.x + this.width/2, this.height/2+this.y);
			}
		}
		else{
			text(this.element.content, this.x + this.width/2, this.height/2+this.y);
		}
	}

	drawName(){
		//Name
		textSize(10);
		textAlign(LEFT, TOP);
		text(this.element.name, this.x+5, this.y+5);
	}

	drawType(){
		//Type
		textAlign(RIGHT);
		text(this.element.type, this.x + this.width-5, this.y+this.height-15);
		
		//Returning the default height for the address be on top
		if(this.element.type != ""){
			this.height /= 2;
		}
	}

	drawAddress(){
		//Address of variable
		fill("#fd971f");
		textSize(12);
		textFont("sans-serif");
		textAlign(LEFT, CENTER);
		text("0x"+this.element.address.toString(16), 0, this.height/2+this.y);
	}


}

//Number of cells showed in screen
var CELLSNUMBER;

var cellsArray = new Array();

//Width of the memory cells plus their addresses
var WIDTH;

//Height of each memory cell
var HEIGHT;

//Width of each cell
var RECTWIDTH;

//Radius of the corners of each cell
var RADIUS;	

//Global variable that will store all pointers and regular variables objects
var allVars;

/*As soon as the site loads allVars receives empty regular variables objects.
Then, each object receives arbitrary memory's addresses. In the end, 
the drawMemory function is called
*/

function prepare(){
	allVars = new Array();
	while(allVars.length != CELLSNUMBER*8){
		allVars.push(new RegularVariable());
	}

	let address = 0x7ffc559ff164;
	for(let element of allVars){
		element.address = address;
		address++;
	}
	setTimeout( ()=> drawMemory(), 100);
}


/*Define, for each object of the varObjs array, an arbitrary memory 
address coming from the addresses already defined in the allVars
array*/
function setMemoryAddresses(varObjs){
	for(let obj of varObjs){

		//Searching if the object already exists in allVars
		let allVarsObj = allVars.find(y => y.name == obj.name);
		
		/*If so, the content in allVarsObj is updated because
		allVars is a global array but the object of varObjs is
		created and destroyed all the time. The same is done
		with the obj of varObjs receiving the address of the
		allVarsObj*/
		if(allVarsObj){
			allVarsObj.content = obj.content;
			obj.address = allVarsObj.address;
			continue;
		}

		/*A random and empty index is defined to the new
		object be inserted in the allVars array*/
		let randIndex;
		let keep = false;

		/*Counter that prevents an infinite loop in case there
		is no more space for a new variable in the memory*/
		let count = 0;
		
		do{
			keep = false;
			count++;
			randIndex = Math.floor(Math.random()*(CELLSNUMBER-1));

			/*Checking if the next index is bigger than the number of cells*/
			if(randIndex + 1 > CELLSNUMBER){
				keep = true;
			 	continue;
			}

			//Checking if the next memory addresses are not occupied 
			for(let i = randIndex; i < randIndex + types.get(obj.type); i++) {
				if(allVars[i].name != ""){
					keep = true;
			 		break;
				}
			}
					

		}while(keep && (count < 200));

		if(count == 200) continue;
		
		//Giving the obj its new address
		obj.address = allVars[randIndex].address;

		/*Setting all the memory cells that will be occupied with
		the obj properties*/
		for(let i = randIndex; i < randIndex + types.get(obj.type); i++){
			allVars[i] = obj;
		}

		/*Increasing the number of cells by the size that the obj
		occupies in memory minus its actual size on screen*/
		CELLSNUMBER += types.get(obj.type)-2;
	}	
}



//Function declaration to make functions of the p5.js library work
function setup(){
	

	//Width of the memory cells plus their addresses
	WIDTH = 280;

	//Width of each cell
	RECTWIDTH = WIDTH*0.65;

	//Radius of the corners of each cell
	RADIUS = 5;	

	CELLSNUMBER = 26;


	prepare();



	/*Creating canvas with the cells+address width plus the space
	required by the arrows that connect pointers to regular variables.
	Its height is of the entire site*/
	createCanvas(WIDTH+50, windowHeight);

	


}

//Function that draws the memory representation using p5.js functions
function drawMemory(){

	//Height of each memory cell
	HEIGHT = windowHeight/26;

	
	//Color of the titles of the page coming from a CSS variable
	let titlesColor = getComputedStyle(document.documentElement).getPropertyValue('--titlesColor');
    
	//Cumulative height that increases each iteration of the for loop below
	let totalHeight = 0;


	cellsArray.push(new memoryCell());
	cellsArray.length=0;


	background('#272822');
	
	/*Cumulative space between arrow and the cells. In each iteration
	it grows so that the arrow lines don't become indistinguishable
	from one another*/
	let arrowSpace = 9;

	for(let i = 0; i < CELLSNUMBER; ++i){
		let element = allVars[i];


		let cell = new memoryCell(WIDTH-RECTWIDTH, totalHeight, RECTWIDTH, HEIGHT, RADIUS, element);
		cellsArray.push(cell);

		if(element.type != ""){
			totalHeight += HEIGHT; //(types.get(element.type)-1);
		}

		//Incrementing totalHeight by a height of a memory cell
		totalHeight += HEIGHT;
		if(element.type != ""){
			i += types.get(element.type)-1;
		}
	}

    //Drawing all the cells with all the elements of allVars
    for(cell of cellsArray){

        	
    	cell.drawCell();
    	
		//Arrow
		if(cell.element.constructor == Pointer && cell.element.content.address != null){
			
			//Line of arrow
			stroke("#fd971f");

			/*Difference between the heights of the pointer and the variable that
			it points to*/
			let varHeight = (cell.y - cellsArray.find(x => x.element.name == cell.element.content.name).y); 

			//Middle of the pointer memory cell
			let pointerMiddle = cell.y+HEIGHT;
			noFill();

			/*Variable that is -1 when the arrow comes from the top to the bottom
			and 1 when the arrow comes from the bottom to the top*/
			let c = (varHeight < 0)? -1 : 1;
			
			beginShape();
				vertex(WIDTH, pointerMiddle);
				vertex(WIDTH+arrowSpace, pointerMiddle - arrowSpace*c);
				vertex(WIDTH+arrowSpace, pointerMiddle - varHeight + arrowSpace*c);
				vertex(WIDTH, pointerMiddle - varHeight);	
			endShape();

			/*Point of arrow. Its sides have a size of 10 and they form a angle
			of 20° from the arrow line*/
			angleMode(DEGREES);
			fill("#fd971f");
			beginShape();
				vertex(WIDTH+sin(45-20)*10, pointerMiddle - varHeight + cos(45-20)*10*c);

				noStroke();
				vertex(WIDTH, pointerMiddle - varHeight);
				stroke("#fd971f");

				vertex(WIDTH+sin(45+20)*10, pointerMiddle - varHeight + cos(45+20)*10*c);			
			endShape(CLOSE);
			arrowSpace += 9;
		}
		
	}
 	
}


