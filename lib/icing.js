/* Function to create icing with a pressed controller */
var drawLength = 0;
const drawingSampleInterval = 3;

//function is called when RC.isDown() - i.e., we are creating icing
let createIcing = (tipPos,world) => {
	let drawPosition = tipPos;
	if (drawLength % drawingSampleInterval == 0){
		let icingShape = {
				shape: "sphere",
				pos: drawPosition,
				size: [.06,.06,.06],
				color: [1,1,1],
				free:false
		}
		world.add(icingShape);
	}
	drawLength++;

}

let resetDrawingPath = () =>{
	drawLength = 0;
}