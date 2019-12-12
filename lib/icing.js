//Functions to run the icing creation



var icingObjects = [];
var drawingPoints = [];
const drawingSampleInterval = 4;

//function is called when RC.isDown() - i.e., we are creating icing


let createIcing = controller => {


	let drawPosition = controller.tip().slice();
	drawingPoints.push(drawPosition);

	// Create an icingObject for every N points that we draw with
	if (drawingPoints.length % drawingSampleInterval == 0){
		let icingShape = {
			shape: "sphere",
			pos: drawPosition,
			size: [.03,.03,.03],
			color: [1,1,1]
		}
		 world.add(icingShape);
	}

}

let createIcingPt = (point,world) => {

	let drawPosition = point;
	drawingPoints.push(drawPosition);

	// Create an icingObject for every N points that we draw with
	if (drawingPoints.length % drawingSampleInterval == 0){
		let icingShape = {
			shape: "sphere",
			pos: drawPosition,
			size: [.03,.03,.03],
			color: [1,1,1]
		}
		 world.add(icingShape);
	}

}

let resetDrawingPath = () =>{
	drawingPoints = [];

}