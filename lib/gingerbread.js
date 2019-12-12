
const VERTEX_SIZE = 8;
const HEAD_HEIGHT = 4.2;
const FACE_RADIUS = 0.2;
const HEAD_THICKNESS = 0.1;
const NECK_HEIGHT = 0.3;
const BODY_WIDTH = .7;



//EYE DIMENSIONS
const TOP_TO_EYE_Y_DISTANCE = 0.05;
const EYE_POS_FROM_X_CENTER = 0.1;
const EYE_SIZE = 0.02;


//FACE DIMENSIONS
const FACE_Z_MOVE = 0.02;
const TOP_TO_MOUTH_Y_DISTANCE = 0.1;
const MOUTH_SCALE = 0.05;



//ARMS DIMENSIONS
const ARMS_LENGTH = 0.6;
let body_height = 0;

function toDeg(radian){
  return radian*180/Math.PI;
}

function toRad(degree){
  return degree*Math.PI/180;
}

function getShoulder(m){
  return -.2*body_height;
}

export function drawGingerbread(m, drawShape, headset, left_contoller, right_controller){

  // m.identity();
  m.save();
  m.rotateY(0.0005*Date.now());
  // m.translate()



  drawFace(m, drawShape);  
  // drawTorso(m, drawShape);

  // let shoulder = getShoulder(m);
  // let z_hand_angle = (Date.now() /1000)%10;
  // let y_hand_angle = 0;
  // // //right shoulder
  // m.save();
  //   m.translate(BODY_WIDTH/4, shoulder, 0);
  //   drawLimb(m, state, 0, -1*y_hand_angle,-1*z_hand_angle, false);
  // m.restore();
	


  // // //left shoulder
  // m.save();
  //   m.translate(-(BODY_WIDTH/4), shoulder, 0);
  //   drawLimb(m, state, 0, y_hand_angle,z_hand_angle, true);
  // m.restore();

  // let legs_position = body_height*.58;

  // let walk_angle = makeWalk();
  // // let walk_angle = 0;
  // //right leg
  // m.save();

  //   m.translate(BODY_WIDTH/4, -legs_position, 0);
  //   drawLegs(m, state, walk_angle, 0,Math.PI);
  // m.restore();

  // // // //left hip
  // m.save();
  //   m.translate(-(BODY_WIDTH/4), -legs_position, 0);
  //   drawLegs(m, state, -1*walk_angle, 0,Math.PI);
  m.restore();

}

function makeWalk(){
  let max_angle = toRad(360);
  return getOscillator()*max_angle;
}

function getOscillator(){
  return Math.sin(Date.now()*.005);
}

function drawTorso(m, drawShape){
  //first translate to end of face in y
  m.save();
    m.scale(.3,0.6,0.1);
    drawShape(CG.sphere, [1, 1, 0], 3 );
  m.restore();
}

function drawFace(m, drawShape){
  // m.save();
    console.log("inside draw face");
    m.save();

       m.scale(FACE_RADIUS, FACE_RADIUS, FACE_RADIUS*HEAD_THICKNESS);
       drawShape(CG.sphere, [1, 1, 0], 3 );
    m.restore();

    //eyes
    m.save();
      m.translate(0, TOP_TO_EYE_Y_DISTANCE, 0);
      m.save();
        m.translate(EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE); //z is moved slighly ahead to that eye appears as a 3d figure
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE*0.1);
        drawShape(CG.sphere, [0, 0, 0], 3 );
      m.restore();
      m.save();
        m.translate(-1*EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE);
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE*0.1);
        drawShape(CG.sphere, [0, 0, 0], 3 );
      m.restore();
    m.restore();

    //mouth
    m.save();
      m.rotateZ(Math.PI);
      m.translate(0, TOP_TO_MOUTH_Y_DISTANCE, FACE_Z_MOVE);
      m.scale(1.4*MOUTH_SCALE, MOUTH_SCALE, MOUTH_SCALE*0.1);
      drawShape(CG.sphere, [0, 0, 0], 3 );
    m.restore();
  m.restore()
}

function boundVariable(x,min_val,max_val){
  return Math.min(Math.max(x, min_val), max_val);
}

function drawLimb(m, drawShape, x_rotation, y_rotation, z_rotation, is_left_limb){

    //bound z rotation
    if(is_left_limb){
      z_rotation = boundVariable(z_rotation, toRad(30), toRad(150));
      y_rotation = boundVariable(y_rotation, toRad(-30), toRad(70));
    }else{
      z_rotation = boundVariable(z_rotation, -1*toRad(150), -1*toRad(30));
      y_rotation = boundVariable(y_rotation, toRad(-70), toRad(30));
    }

    
    m.save();
      m.rotateX(x_rotation);
      m.rotateY(y_rotation);
      m.rotateZ(z_rotation);
      let arms_length = body_height/4;
      m.scale(arms_length/10, arms_length, arms_length/15);
      drawShape(m, state, [1,1,0], gl.TRIANGLE_STRIP, halfSphere);
    m.restore()
}

function drawLegs(m, drawShape, x_rotation, y_rotation, z_rotation){
  //make sure x rotation is in limits
  let max_rad = toRad(30);
  x_rotation = boundVariable(x_rotation,-1*max_rad,max_rad);
  m.save();
    let y_position = m.value()[13];
    m.rotateX(x_rotation);
    m.rotateY(y_rotation);
    m.rotateZ(z_rotation);
    m.scale(.05, .6, .05);    
    drawShape(m, state, [1,1,0], gl.TRIANGLE_STRIP, halfSphere);
  m.restore();
}