"use strict"


let axisIntersect = (a0, a1, b0, b1) => {
    return (a0 <= b0 && b0 <= a1) 
        || (a0 <= b1 && b1 <= a1)
        || (b0 <= a0 && a0 <= b1) 
        || (b0 <= a1 && a1 <= b1); 
};



/* usage:

let world = new World();
let args = {
    shape : "sphere",
    pos : [1, 2, 3],
    size : [.1, .1, .1],
    color : [1, 1, 1],
    texture : 0,
    textureScale : 1
};
world.add(args); 

*/
function World () {


    //let shapeType = ["cube", "sphere", "cylinder", "torus"];
    let shapeType = ["gumdrop", "wreath", "peppermint", "treelimb", "candycane", "sphere", "house"];

    this.playerObjects = {};
    this.envObjects = [];
    this.count = 0;

    let mapToPlayerShapeList = (f) => {
        if (this.count == 0) return;
        for (let i=0; i<shapeType.length; ++i) {
            if (this.playerObjects[shapeType[i]] == undefined) continue;
            f (this.playerObjects[shapeType[i]]);
        }
    };

    this.add = (args) => {
        if (this.playerObjects[args.shape] == undefined)
            this.playerObjects[args.shape] = [];
        this.playerObjects[args.shape].push(new myObject(args));
        ++this.count;
    }

    this.addEnv = (args) => {
        this.envObjects.push(new myObject(args));
    }
    
    this.tick = () => {
        // console.log(this.playerObjects);
        let sweepShapeArr = (shapeArr) => {
            for (let i=0; i<shapeArr.length; ++i) {
                let o = shapeArr[i];
                if (o.free) {
                    if (o.sweep(this.envObjects)) {
                        o.free = false;
                    }
                    else {
                        o.drop();
                    }
                }
            }
        };
        mapToPlayerShapeList(sweepShapeArr);
        
    }
    this.draw = (m, drawShape) => {

        let drawObject = (o) => {
            m.save();
            m.translate(o.pos[0], o.pos[1], o.pos[2]);
            m.scale(o.size[0], o.size[1], o.size[2]);
            m.scale(10,10,10);
            let shapeVertices;
            if (o.shape == "cube") shapeVertices = CG.cube; 
            else if (o.shape == "sphere") shapeVertices = CG.sphere; 
            else if (o.shape == "cylinder") shapeVertices = CG.cylinder; 
            else if (o.shape == "torus") shapeVertices = CG.torus;
            else if (o.shape == "gumdrop") shapeVertices =  CG.gumdrop;
            else if (o.shape == "wreath") shapeVertices = CG.wreath;
            else if (o.shape == "candycane") shapeVertices = CG.candycane;
            else if (o.shape == "treelimb") shapeVertices = CG.treelimb;
            else if (o.shape == "peppermint") shapeVertices = CG.peppermint;
            else if (o.shape == "house") shapeVertices = CG.house;
            else shapeVertices == "cube"; // default

            drawShape(shapeVertices, o.color, o.texture, o.textureScale );
            
            m.restore();
        }

        let drawShapeArr = (shapeArr) => {
            for (let i=0; i<shapeArr.length; ++i) {
                drawObject(shapeArr[i]);
            }
        }


        mapToPlayerShapeList(drawShapeArr);
        drawShapeArr(this.envObjects);
    
    }
}

function myObject (args) {
    this.shape = args.shape;
    this.free = args.free;
    this.pos = args.pos;
    this.size = args.size;
    // this.rotate = args.rotate;
    this.color = args.color;
    this.texture = args.texture;
    this.textureScale = args.textureScale;

    let eps = 0.0001;
    this.minx = () => this.pos[0] - this.size[0] - eps;
    this.miny = () => this.pos[1] - this.size[1] - eps;
    this.minz = () => this.pos[2] - this.size[2] - eps;
    this.maxx = () => this.pos[0] + this.size[0] + eps;
    this.maxy = () => this.pos[1] + this.size[1] + eps;
    this.maxz = () => this.pos[2] + this.size[2] + eps;

    this.getAABBParams = () => { 
        // return [this.minx(), this.maxx(), 
        //         this.miny(), this.maxy(), 
        //         this.minz(), this.maxz()];
        let x0 = this.minx();
        let y0 = this.miny();
        let z0 = this.minz();
        let x1 = this.maxx();
        let y1 = this.maxy();
        let z1 = this.maxz();

        if (this.shape == "cube") {
            return [x0, x1, y0, y1, z0, z1];
        }
        if (this.shape == "sphere") {
            let r = 1; // some ratio, prob needs to be fine-tuned
            return [x0/r, x1/r, y0/r, y1/r, z0/r, z1/r];
        }
        // default:
        return [x0, x1, y0, y1, z0, z1];
    };
    this.AABB = this.getAABBParams();

    this.drop = () => {
        this.pos[1] -= 0.03;
        this.AABB = this.getAABBParams();
    }

    this.sweep = (envObjects) => {
        if (this.miny() < -1) return true;
        for (let i=0; i<envObjects.length; ++i) {
            if (this.AABBIntersect(envObjects[i])) return true;
        }
        return false;
    };

    this.AABBIntersect = (obj) => {
        let p0 = this.getAABBParams();    
        let p1 = obj.getAABBParams();  
        let i = axisIntersect(p0[0], p0[1], p1[0], p1[1]) 
             && axisIntersect(p0[2], p0[3], p1[2], p1[3]) 
             && axisIntersect(p0[4], p0[5], p1[4], p1[5]);
        return i;
    }
}
