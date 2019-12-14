"use strict"


function Reader () {

  this.loadMeshData = (string) =>  {
    var meshObj = new OBJ.Mesh(string);
    var a = [];
    const NUM_COMPONENTS_FOR_VERTS = 3;
    for (var i = 0; i < meshObj.indices.length; i++){
      
      var elementIdx = meshObj.indices[i]; // e.g. 38
      var thisIndex = meshObj.indices[i];

      var x = meshObj.vertices[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 0]
      var y = meshObj.vertices[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 1]
      var z = meshObj.vertices[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 2]
     
      a.push(x); a.push(y); a.push(z);
      
      var n_x = meshObj.vertexNormals[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 0]
      var n_y = meshObj.vertexNormals[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 1]
      var n_z = meshObj.vertexNormals[(elementIdx * NUM_COMPONENTS_FOR_VERTS) + 2]
      
      a.push(n_x); a.push(n_y); a.push(n_z);
      a.push(0);a.push(0);a.push(0);
      var u = meshObj.vertices[(elementIdx * 2) + 0]
      var v = meshObj.vertices[(elementIdx * 2) + 1]
      
      a.push(u); a.push(v);
    }
    return a;
  };

  this.buildAndDrawObject = (string, color, texture, state,m) => {
    gl.uniform3fv(state.uColorLoc, [1,0,0]);
   gl.uniformMatrix4fv(state.uModelLoc, false, m.value());
   gl.uniform1i(state.uTexIndexLoc, texture);
   gl.uniform1f(state.uTexScale, texture);
   let vertices = this.loadMeshData(string);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW);
   gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 11);
  };
}