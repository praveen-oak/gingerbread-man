//function is called when RC.isDown() - i.e., we are creating icing

var drawLength = 0;
const drawingSampleInterval = 3;
const icingSize = [.05,.05,.05];

var icingObjs = [];

var isValidPath = false;

var icingColor = [1,0,0];
var lastPos = [0,0,0];

let createIcing = (tipPos) => {
	let diff = tipPos[0] - lastPos[0] + tipPos[1] - lastPos[1] + tipPos[2] - lastPos[2];
	if (diff > 0.05 || diff < -0.05) {
		let icingShape = {
			shape: "sphere",
			pos: tipPos,
			size: icingSize,
			color: icingColor,
			free:false
		}
		world.add(icingShape);
		
		// sync
		const response =
		{
		   type: "spawn",
		   uid: world.count,
		   state: {
			  objArgs : icingShape
		   },
		   lockid: MR.playerid,
		};
		MR.syncClient.send(response);	
		lastPos = tipPos.slice();
	}
	// let drawPosition = tipPos;
	// if (drawLength % drawingSampleInterval == 0){
	// 	icingObjs.push(tipPos);
	// 	//[TODO]: Fill in logic for any sphere intersecting with the house here
	// 	if (true){
	// 	// if (world.detectIntersection(tipPos, icingSize[0])){
	// 	isValidPath = true;
	// 	icingColor = [1,1,1];
	// 	}
	// }
	// drawLength++;

}

let resetDrawingPath = () =>{
	
	if (isValidPath){
		//if it's valid, then push all of these to world.add
		for (var i = 0; i < icingObjs.length; i++){
			var thisIcingPos = icingObjs[i];
			let icingShape = {
				shape: "sphere",
				pos: thisIcingPos,
				size: icingSize,
				color: icingColor,
				free:false
			}
			world.add(icingShape);
			
			// sync
			// const response =
			// {
			//    type: "spawn",
			//    uid: world.count,
			//    state: {
			// 	  objArgs : icingShape
			//    },
			//    lockid: MR.playerid,
			// };
			// MR.syncClient.send(response);
		}		
	}

	icingObjs = [];
	drawLength = 0;
	isValidPath = false;
	
}