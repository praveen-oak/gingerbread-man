/* Function to create icing with a pressed controller */
var drawLength = 0;
const drawingSampleInterval = 3;
const icingSize = [.05,.05,.05];

var icingObjs = [];

var isValidPath = false;

//function is called when RC.isDown() - i.e., we are creating icing
let createIcing = (tipPos,world) => {
	let drawPosition = tipPos;
	if (drawLength % drawingSampleInterval == 0){
		icingObjs.push(tipPos);
		//Fill in code for tip pos intersecting with world
		if (true){
		isValidPath = true;
		}
	}
	drawLength++;

}

let resetDrawingPath = (world) =>{
	
	if (isValidPath){
		//if it's valid, then push all of these to world.add
		for (var i = 0; i < icingObjs.length; i++){
			var thisIcingPos = icingObjs[i];
			let icingShape = {
				shape: "sphere",
				pos: thisIcingPos,
				size: icingSize,
				color: [1,1,1],
				free:false
			}
			world.add(icingShape);
		}		
	}

	icingObjs = [];
	drawLength = 0;
	isValidPath = false;
	
}