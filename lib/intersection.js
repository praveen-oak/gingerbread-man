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
    let shapeType = ["gumdrop", "ornament", "peppermint", "treelimb", "candycane", "sphere", "house", "candystrip", "gummybear", "wreath"];

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
        let detectShapeArr = (shapeArr) => {
            for (let i=0; i<shapeArr.length; ++i) {
                let o = shapeArr[i];
                if (o.free) {
                    if (o.detect(this.envObjects)) {
                        o.free = false;
                    }
                    else {
                        o.drop();
                    }
                }
            }
        };
        mapToPlayerShapeList(detectShapeArr);
        
    }
    this.draw = (m, drawShape) => {
        let drawObject = (o) => {
            m.save();
            m.translate(o.pos[0], o.pos[1], o.pos[2]);
            m.scale(o.size[0], o.size[1], o.size[2]);
            // m.scale(10,10,10);
            let shapeVertices;
            if (o.shape == "cube") shapeVertices = CG.cube; 
            else if (o.shape == "sphere") shapeVertices = CG.sphere; 
            else if (o.shape == "cylinder") shapeVertices = CG.cylinder; 
            else if (o.shape == "torus") shapeVertices = CG.torus;
            else if (o.shape == "gumdrop") shapeVertices =  CG.gumdrop;
            else if (o.shape == "wreath") shapeVertices = CG.wreath;
            else if (o.shape == "treelimb") shapeVertices = CG.treelimb;
            else if (o.shape == "peppermint") shapeVertices = CG.peppermint;
            else if (o.shape == "house") shapeVertices = CG.house;
            else if (o.shape == "candystrip") shapeVertices = CG.candystrip;
            else if (o.shape == "ornament") {
                m.rotateX(-1.5);
                m.scale(.03,.03,.03);
               shapeVertices = CG.ornament;
            }
            else if (o.shape == "gummybear") {
                m.scale(.05,.05,.05);
                shapeVertices = CG.gummybear;
            }
            else if (o.shape == "candycane") {
                m.rotateZ(Math.PI/2);
                m.scale(.025,.05,.05);
                shapeVertices = CG.candycane;
            }

            else shapeVertices == "cube"; // default

            drawShape(shapeVertices, o.color, o.texture, o.textureScale );
            
            m.restore();
        }

        let drawShapeArr = (shapeArr) => {
            for (let i=0; i<shapeArr.length; ++i) {
                drawObject(shapeArr[i]);
            }
        }

        // let drawIcingArr = (icingArr) => {
        //     for (let i=0; i<icingArr.length; ++i) {
        //         drawIcingObj(icingArr[i]);
        //     }
        // }

        // let drawIcingObj = (drawIcingObj) => {
        //     for (let i=0; i<icingObj.length; ++i) {
        //         m.save();
        //         m.translate(o.pos[0], o.pos[1], o.pos[2]);
        //         m.scale(o.size[0], o.size[1], o.size[2]);
        //         m.scale(10,10,10);
        //         drawShape(CG.sphere, [1,1,1]);
        //     }
        // }


        mapToPlayerShapeList(drawShapeArr);
        drawShapeArr(this.envObjects);
        // drawIcingArr(this.icingObjects);
    }
    this.detectIntersection = (position, radius) => {
        let args = {
            shape : "sphere",
            pos : position,
            size : [radius, radius, radius]
        }
        let o = new myObject(args);
        return o.detect(this.envObjects);
    }
    
    this.getIcingStartingPos = () => {
        return playerObjects["sphere"].length;
    }

    this.isLastIcingIntersect = () => {
        let l = playerObjects["sphere"];
        return l[l.length-1].detect();
    }

    this.resetLastIcing = (resetPos) => {
        playerObjects["sphere"].length = resetPos;        
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
    let x = () => this.pos[0];
    let y = () => this.pos[1];
    let z = () => this.pos[2];
    
    this.minx = () => this.pos[0] - this.size[0]/2;// + eps;
    this.miny = () => this.pos[1] - this.size[1]/2;// + eps;
    this.minz = () => this.pos[2] - this.size[2]/2;// + eps;
    this.maxx = () => this.pos[0] + this.size[0]/2;// - eps;
    this.maxy = () => this.pos[1] + this.size[1]/2;// - eps;
    this.maxz = () => this.pos[2] + this.size[2]/2;// - eps;

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

        return [x0, x1, y0, y1, z0, z1];
    };
    this.AABB = this.getAABBParams();

    this.drop = () => {
        this.pos[1] -= 0.03;
        this.AABB = this.getAABBParams();
    }

    this.detect = (envObjects) => {
        if (this.detectFloor()) return true;
        if (this.detectHouse()) return true;
        // for (let i=0; i<envObjects.length; ++i) {
        //     if (this.AABBIntersect(envObjects[i])) return true;
        // }
        return false;
    };

    this.detectFloor = () => {
        return (this.miny() < -1.75);
    }

    this.detectHouse = () => {
        // let z_inner = 0.25;
        // let z_outer = 0.28;
        // let x_outer = 0.38;
        // let y_roof = -0.66;
        // let y_mid = -1.27;
        if (this.minx() > 0.38) return false;
        if (this.maxx() < -0.38) return false;
        if (this.miny() > -0.66) return false;
        if (this.minz() > 0.28) return false;
        if (this.maxz() < -0.28) return false;

        if (this.miny() < -1.27) {
            // intersect base
            return (this.minz() < 0.25 || this.minz() > -0.25);
        }

        // right roof
        if (this.pos[2] > 0) {
            return ((this.miny() + 1.27) / 0.4 + this.minz() / 0.28) < 1;
        }
        // left roof
        else {
            return ((this.miny() + 1.27) / 0.4 - this.maxz() / 0.28) < 1;
        }
    }

    this.AABBIntersect = (obj) => {
        let p0 = this.getAABBParams();    
        let p1 = obj.getAABBParams();  
        let i = axisIntersect(p0[0], p0[1], p1[0], p1[1]) 
             && axisIntersect(p0[2], p0[3], p1[2], p1[3]) 
             && axisIntersect(p0[4], p0[5], p1[4], p1[5]);
        return i;
    }
}

let world = new World();
