"use strict"

const FACE_RADIUS = 0.2;



//EYE DIMENSIONS
const TOP_TO_EYE_Y_DISTANCE = 0.05;
const EYE_POS_FROM_X_CENTER = 0.1;
const EYE_SIZE = 0.02;


//FACE DIMENSIONS
const FACE_Z_MOVE = 0.018;
const TOP_TO_MOUTH_Y_DISTANCE = 0.1;
const MOUTH_SCALE = 0.05;


const THICKNESS = 0.02;


//ARMS DIMENSIONS
const ARMS_LENGTH = 0.6;


const body_height = 1.6;
const GINGERBREAD_TEXTURE = 2;

function roundCoordinates(position){
  position[0] = Math.round(position[0]*1000)/1000;
  position[1] = Math.round(position[1]*1000)/1000;
  position[2] = Math.round(position[2]*1000)/1000;
  return position;
}

function isChange(value1, value2){
  return Math.abs(value1 - value2) > 0.01;
}

function isMoving(position, prev_position){
  if(position === null || prev_position === null){
    return false;
  }
  let x_move = Math.abs(position[0] - prev_position[0]);
  if(x_move > 0.01){
    return true;
  }
  let z_move = Math.abs(position[2] - prev_position[2]);
  if(z_move > 0.01){
    return true;
  }
  return false;

}
function Gingerbread(){
  this.prev_position = null;
  this.drawGingerbread = (m, drawShape, headPosition, orientation, leftController, rightController) => {
    let walk_angle = 0;
    headPosition = roundCoordinates(headPosition);
    let moving = isMoving(headPosition, this.prev_position);
    if(moving === true){
      walk_angle = makeWalk();
    }
    this.prev_position = headPosition;
    
    let reader = new Reader();
    m.save();
      m.identity();
      // if(isMoving){
        m.translate(headPosition[0], 0, headPosition[2]);
        // console.log(orientation);
        orientation[0] = 0;
        orientation[2] = 0;
        m.rotateY(Math.PI);
        m.rotateQ(orientation);
      // }
      
      drawFace(m, drawShape);
      m.save();
        m.translate(0, -.75, 0);
        drawTorso(m, drawShape);
      m.restore();
       let z_hand_angle = (Date.now() /1000)%10;
      let y_hand_angle = 0;
      m.save();
        m.translate(-0.22, -0.4, 0);
        drawLimb(m, drawShape, 0, toDeg(leftController.orientation[1]),toDeg(leftController.orientation[2]), true);
      m.restore();

      m.save();
        m.translate(0.22, -0.4, 0);
        drawLimb(m, drawShape, 0, toDeg(rightController.orientation[1]),toDeg(rightController.orientation[2]), false);
      m.restore();

  
  
      // //right leg
      m.save();

        m.translate(-.22, -1, 0);
        drawLegs(m, drawShape, toDeg(walk_angle), 0,Math.PI);
      m.restore();

      // // //left hip
      m.save();
        m.translate(.22, -1, 0);
        drawLegs(m, drawShape, -1*toDeg(walk_angle), 0,Math.PI);
      m.restore();

    m.restore();
  };
}

function toDeg(radian){
  return radian*180/Math.PI;
}

function toRad(degree){
  return degree*Math.PI/180;
}


function drawFace(m, drawShape){

    m.save();

       m.scale(FACE_RADIUS, FACE_RADIUS, THICKNESS);
       drawShape(CG.sphere, [1, 1, 1], GINGERBREAD_TEXTURE );
    m.restore();

    //eyes
    m.save();
      m.translate(0, TOP_TO_EYE_Y_DISTANCE, 0);
      m.save();
        m.translate(EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE); //z is moved slighly ahead to that eye appears as a 3d figure
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE*0.1);
        drawShape(CG.sphere, [0, 0, 0], GINGERBREAD_TEXTURE );
      m.restore();
      m.save();
        m.translate(-1*EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE);
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE*0.1);
        drawShape(CG.sphere, [0, 0, 0], GINGERBREAD_TEXTURE );
      m.restore();
    m.restore();

  //   //mouth
    m.save();
      m.rotateZ(Math.PI);
      m.translate(0, TOP_TO_MOUTH_Y_DISTANCE, FACE_Z_MOVE);
      m.scale(1.4*MOUTH_SCALE, MOUTH_SCALE, MOUTH_SCALE*0.1);
      drawShape(CG.halftorus, [0, 0, 0], GINGERBREAD_TEXTURE );
    m.restore();
}
function drawTorso(m, drawShape){
  //first translate to end of face in y
  m.save();
    m.scale(.3,0.6,THICKNESS*2.5);
    drawShape(CG.sphere, [1, 1, 1], GINGERBREAD_TEXTURE);
  m.restore();
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
      let arms_length = 0.4;
      m.scale(arms_length/15, arms_length, THICKNESS*2);
      drawShape(CG.halfsphere,[1,1,1], GINGERBREAD_TEXTURE);
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
    m.scale(.03, .6, .03);    
    drawShape(CG.halfsphere,[1,1,1], GINGERBREAD_TEXTURE);
  m.restore();
}


function makeWalk(){
  return (Math.round(Date.now()*.001) %60 - 30);
}
