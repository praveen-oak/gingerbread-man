"use strict"


function Reader () {

  this.loadMeshData = (string) =>  {
    var meshObj = new OBJ.Mesh(string);
    var a = [];
    const num = meshObj.vertices.length/3;
    const NUM_COMPONENTS_FOR_VERTS = 3;
    for (var i = 0; i < num; i++){

      // We will have to change this function to include more vertices if we're going to do bump mapping
      

      var x = meshObj.vertices[(i * NUM_COMPONENTS_FOR_VERTS) + 0]
      var y = meshObj.vertices[(i * NUM_COMPONENTS_FOR_VERTS) + 1]
      var z = meshObj.vertices[(i * NUM_COMPONENTS_FOR_VERTS) + 2]
     
      a.push(x); a.push(y); a.push(z);
      
      var n_x = meshObj.vertexNormals[(i * NUM_COMPONENTS_FOR_VERTS) + 0]
      var n_y = meshObj.vertexNormals[(i * NUM_COMPONENTS_FOR_VERTS) + 1]
      var n_z = meshObj.vertexNormals[(i * NUM_COMPONENTS_FOR_VERTS) + 2]
      
      a.push(n_x); a.push(n_y); a.push(n_z);
      
      a.push(0);a.push(0);a.push(0);
      var u = meshObj.vertices[(i * 2) + 0]
      var v = meshObj.vertices[(i * 2) + 1]
      
      a.push(u); a.push(v);
    }
    
    return a;
  };

  this.buildAndDrawObject = (string, color, texture, state,m) => {
    gl.uniform3fv(state.uColorLoc, [1,0,0]);
   gl.uniformMatrix4fv(state.uModelLoc, false, m.value());
   gl.uniform1i(state.uTexIndexLoc, -1);
   gl.uniform1f(state.uTexScale, texture);
   let vertices = this.loadMeshData(string);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW);
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 11);
  };
}