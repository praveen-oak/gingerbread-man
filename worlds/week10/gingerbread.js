
let cos = t => Math.cos(t);
let sin = t => Math.sin(t);
let identity = ()       => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
let rotateX = t         => [1,0,0,0, 0,cos(t),sin(t),0, 0,-sin(t),cos(t),0, 0,0,0,1];
let rotateY = t         => [cos(t),0,-sin(t),0, 0,1,0,0, sin(t),0,cos(t),0, 0,0,0,1];
let rotateZ = t         => [cos(t),sin(t),0,0, -sin(t),cos(t),0,0, 0,0,1,0, 0,0,0,1];
let scale = (x,y,z)     => [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
let translate = (x,y,z) => [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];
let multiply = (a, b)   => {
   let c = [];
   for (let n = 0 ; n < 16 ; n++)
      c.push( a[n&3     ] * b[    n&12] +
              a[n&3 |  4] * b[1 | n&12] +
              a[n&3 |  8] * b[2 | n&12] +
              a[n&3 | 12] * b[3 | n&12] );
   return c;
}
let fromQuaternion = q => {
   var x = q[0], y = q[1], z = q[2], w = q[3];
   return [ 1 - 2 * (y * y + z * z),     2 * (z * w + x * y),     2 * (x * z - y * w), 0,
                2 * (y * x - z * w), 1 - 2 * (z * z + x * x),     2 * (x * w + y * z), 0,
                2 * (y * w + z * x),     2 * (z * y - x * w), 1 - 2 * (x * x + y * y), 0,  0,0,0,1 ];
}
let inverse = a => {
  let b = [], d = 0, cf = (c, r) => {
     let s = (i, j) => a[c+i & 3 | (r+j & 3) << 2];
     return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
                                 - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
                                 + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
  }
  for (let n = 0 ; n < 16 ; n++) b.push(cf(n >> 2, n & 3));
  for (let n = 0 ; n <  4 ; n++) d += a[n] * b[n << 2];
  for (let n = 0 ; n < 16 ; n++) b[n] /= d;
  return b;
}

let Matrix = function() {
   let topIndex = 0,
       stack = [ identity() ],
       getVal = () => stack[topIndex],
       setVal = m => { stack[topIndex] = m; return this; }

   this.identity  = ()      => setVal(identity());
   this.multiply  = a       => setVal(multiply(getVal(), a));
   this.restore   = ()      => --topIndex;
   this.rotateQ   = q       => setVal(multiply(getVal(), fromQuaternion(q)));
   this.rotateX   = t       => setVal(multiply(getVal(), rotateX(t)));
   this.rotateY   = t       => setVal(multiply(getVal(), rotateY(t)));
   this.rotateZ   = t       => setVal(multiply(getVal(), rotateZ(t)));
   this.save      = ()      => stack[++topIndex] = stack[topIndex-1].slice();
   this.scale     = (x,y,z) => setVal(multiply(getVal(), scale(x,y,z)));
   this.set       = a       => setVal(a);
   this.translate = (x,y,z) => setVal(multiply(getVal(), translate(x,y,z)));
   this.value     = ()      => getVal();
}

////////////////////////////// SUPPORT FOR CREATING 3D SHAPES


let createCubeVertices = () => {
   let V = [], P = [ -1,-1, 1, 0,0, 1, 0,0,   1, 1, 1, 0,0, 1, 1,1,  -1, 1, 1, 0,1, 1, 0,1,
                      1, 1, 1, 0,0, 1, 1,1,  -1,-1, 1, 0,0, 1, 0,0,   1,-1, 1, 0,0, 1, 1,0,
                      1, 1,-1, 0,0,-1, 0,0,  -1,-1,-1, 0,0,-1, 1,1,  -1, 1,-1, 0,0,-1, 1,0,
                     -1,-1,-1, 0,0,-1, 1,1,   1, 1,-1, 0,0,-1, 0,0,   1,-1,-1, 0,0,-1, 0,1 ];
   for (let n = 0 ; n < 3 ; n++)
      for (let i = 0 ; i < P.length ; i += 8) {
         let p0 = [P[i],P[i+1],P[i+2]], p1 = [P[i+3],P[i+4],P[i+5]], uv = [P[i+6],P[i+7]];
   V = V.concat(p0).concat(p1).concat(uv);
   for (let j = 0 ; j < 3 ; j++) {
      P[i   + j] = p0[(j+1) % 3];
      P[i+3 + j] = p1[(j+1) % 3];
         }
      }
   return V;
}

function createMeshVertices(M, N, uvToShape, vars) {
   let vertices = [];
   for (let row = 0 ; row < N-1 ; row++)
      for (let col = 0 ; col < M ; col++) {
         let u = (row & 1 ? col : M-1 - col) / (M-1);
         if (col != 0 || row == 0)
         vertices = vertices.concat(uvToShape(u,  row    / (N-1), vars));
         vertices = vertices.concat(uvToShape(u, (row+1) / (N-1), vars));
      }
   return vertices;
}

let uvToSphere = (u,v,r) => {
   let t = 2 * Math.PI * u;
   let p = Math.PI * (v - .5);

   let x = Math.cos(t) * Math.cos(p);
   let y = Math.sin(t) * Math.cos(p);
   let z = Math.sin(p);

   return [x,y,z, x,y,z, u,v];
}

let uvToHalfSphere = (u,v,r) => {
   let t = Math.PI * u;
   let p = Math.PI * (v - .5);

   let x = Math.cos(t) * Math.cos(p);
   let y = Math.sin(t) * Math.cos(p);
   let z = Math.sin(p);

   return [x,y,z, x,y,z, u,v];
}

let uvToCylinder = (u,v) => {
    let c = Math.cos(2 * Math.PI * u);
    let s = Math.sin(2 * Math.PI * u);
    let z = Math.max(-1, Math.min(1, 10*v - 5));

    switch (Math.floor(5.001 * v)) {
    case 0: case 5: return [ 0,0,z, 0,0,z, u,v]; // center of back/front end cap
    case 1: case 4: return [ c,s,z, 0,0,z, u,v]; // perimeter of back/front end cap
    case 2: case 3: return [ c,s,z, c,s,0, u,v]; // back/front of cylindrical tube
    }
}

let uvToTorus = (u,v,r) => {
   let t = 2 * Math.PI * u;
   let p = 2 * Math.PI * v;

   let x = Math.cos(t) * (1 + r * Math.cos(p));
   let y = Math.sin(t) * (1 + r * Math.cos(p));
   let z = r * Math.sin(p);

   let nx = Math.cos(t) * Math.cos(p);
   let ny = Math.sin(t) * Math.cos(p);
   let nz = Math.sin(p);

   return [x,y,z, nx,ny,nz, u,v];
}

let uvToHalfTorus = (u,v,r) => {
   let t = Math.PI * u;
   let p = 2 * Math.PI * v;

   let x = Math.cos(t) * (1 + r * Math.cos(p));
   let y = Math.sin(t) * (1 + r * Math.cos(p));
   let z = r * Math.sin(p);

   let nx = Math.cos(t) * Math.cos(p);
   let ny = Math.sin(t) * Math.cos(p);
   let nz = Math.sin(p);

   return [x,y,z, nx,ny,nz, u,v];
}

let halfSphere = createMeshVertices(32, 16, uvToHalfSphere);
let cube     = createCubeVertices();
let sphere   = createMeshVertices(32, 16, uvToSphere);
let cylinder = createMeshVertices(32,  6, uvToCylinder);
let torus    = createMeshVertices(32, 16, uvToTorus, 0.3);
let halftorus    = createMeshVertices(32, 16, uvToHalfTorus, 0.3);





const VERTEX_SIZE = 8;
const HEAD_HEIGHT = 4.2;
const FACE_HEIGHT = 1;
const FACE_RADIUS = 0.3;
const HEAD_THICKNESS = 0.2;
const NECK_HEIGHT = 0.3;
const BODY_WIDTH = .7;



//EYE DIMENSIONS
const TOP_TO_EYE_Y_DISTANCE = 0.05;
const EYE_POS_FROM_X_CENTER = 0.1;
const EYE_SIZE = 0.04;


//FACE DIMENSIONS
const FACE_Z_MOVE = 0.05;
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


function drawShape(m, state, color, type, vertices, textureScale){
   let texture = 2;
   gl.uniform3fv(state.uColorLoc, color);
   gl.uniformMatrix4fv(state.uModelLoc, false, m.value());
   gl.uniform1i(state.uTexIndexLoc, texture === undefined ? -1 : texture);
   gl.uniform1f(state.uTexScale, textureScale === undefined ? 1 : textureScale);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   gl.drawArrays(type, 0, vertices.length / VERTEX_SIZE);
}



export function drawGingerbread(m, state, head_position, left_controller, right_controller){

  // m.identity();
  m.translate(head_position[0], head_position[1], head_position[2]);
  body_height = head_position[1];
  m.rotateY(0.0005*Date.now());



  drawFace(m, state);  
  drawTorso(m, state);

  let shoulder = getShoulder(m);
  let z_hand_angle = (Date.now() /1000)%10;
  let y_hand_angle = 0;
  // //right shoulder
  m.save();
    m.translate(BODY_WIDTH/4, shoulder, 0);
    drawLimb(m, state, 0, -1*y_hand_angle,-1*z_hand_angle, false);
  m.restore();
	


  // //left shoulder
  m.save();
    m.translate(-(BODY_WIDTH/4), shoulder, 0);
    drawLimb(m, state, 0, y_hand_angle,z_hand_angle, true);
  m.restore();

  let legs_position = body_height*.58;

  let walk_angle = makeWalk();
  // let walk_angle = 0;
  //right leg
  m.save();

    m.translate(BODY_WIDTH/4, -legs_position, 0);
    drawLegs(m, state, walk_angle, 0,Math.PI);
  m.restore();

  // // //left hip
  m.save();
    m.translate(-(BODY_WIDTH/4), -legs_position, 0);
    drawLegs(m, state, -1*walk_angle, 0,Math.PI);
  m.restore();

}

function makeWalk(){
  let max_angle = toRad(360);
  return getOscillator()*max_angle;
}

function getOscillator(){
  return Math.sin(Date.now()*.005);
}

function drawTorso(m, state){
  //first translate to end of face in y
  m.save();
    m.translate(0, -.4*body_height, 0);
    m.scale(.3,0.6,0.1);
    drawShape(m, state, [1,1,0], gl.TRIANGLE_STRIP, sphere);
  m.restore();
}

function drawFace(m, state){
  m.save();
    m.save();

       m.scale(FACE_RADIUS, FACE_RADIUS, FACE_RADIUS*HEAD_THICKNESS);
       drawShape(m, state, [1,1,0], gl.TRIANGLE_STRIP, sphere);
    m.restore();

    //eyes
    m.save();
      m.translate(0, TOP_TO_EYE_Y_DISTANCE, 0);
      m.save();
        m.translate(EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE); //z is moved slighly ahead to that eye appears as a 3d figure
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE);
        drawShape(m, state, [0,0,0], gl.TRIANGLE_STRIP, sphere);
      m.restore();
      m.save();
        m.translate(-1*EYE_POS_FROM_X_CENTER, 0, FACE_Z_MOVE);
        m.scale(EYE_SIZE,EYE_SIZE,EYE_SIZE);
        drawShape(m, state, [0,0,0], gl.TRIANGLE_STRIP, sphere);
      m.restore();
    m.restore();

    //mouth
    m.save();
      m.rotateZ(Math.PI);
      m.translate(0, TOP_TO_MOUTH_Y_DISTANCE, FACE_Z_MOVE);
      m.scale(1.4*MOUTH_SCALE, MOUTH_SCALE, MOUTH_SCALE);
      drawShape(m, state, [0,0,0], gl.TRIANGLE_STRIP, halftorus);
    m.restore();
  m.restore()
}

function boundVariable(x,min_val,max_val){
  return Math.min(Math.max(x, min_val), max_val);
}

function drawLimb(m, state, x_rotation, y_rotation, z_rotation, is_left_limb){

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

function drawLegs(m, state, x_rotation, y_rotation, z_rotation){
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