/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MapSelector(map,xSize,ySize) {

    this.kBound= "assets/Bound.png";
    this.kDelete = "assets/delete.png";

    this.mMap = map;
    this.delete_mode = false;
    this.selector = new TextureRenderable(this.kBound);
    
    this.mXSize = xSize;
    this.mYSize = ySize;
    
    if((this.mMap.getWidth()/xSize) % 2 === 0 && this.mMap.getHeight()/ySize % 2 === 0)
    {
        this.selector.getXform().setPosition(this.mMap.getCenterLocation()[0]+xSize/2,this.mMap.getCenterLocation()[1]+ySize/2);
    }
    else if ((this.mMap.getWidth()/xSize) % 2 === 0)
    {
        this.selector.getXform().setPosition(this.mMap.getCenterLocation()[0]+xSize/2,this.mMap.getCenterLocation()[1]);
    }
    else if(this.mMap.getHeight()/ySize % 2 === 0)
    {
        this.selector.getXform().setPosition(this.mMap.getCenterLocation()[0],this.mMap.getCenterLocation()[1]+ySize/2);
    }
    else
    {
        this.selector.getXform().setPosition(this.mMap.getCenterLocation()[0],this.mMap.getCenterLocation()[1]);
    }
    this.selector.getXform().setSize(xSize,ySize);

}

MapSelector.prototype.update = function(){

    this.MoveDown();
    this.MoveLeft();
    this.MoveUp();
    this.MoveRight();
};

MapSelector.prototype.changeMode = function(){
    
    var selectorLocation = this.selector.getXform().getPosition();
    
    if (!this.delete_mode) {
        this.delete_mode = true;
        this.selector = new TextureRenderable(this.kDelete);
        this.selector.getXform().setPosition(selectorLocation[0], selectorLocation[1]);
        this.selector.getXform().setSize(this.mXSize,this.mYSize);
    }else if (this.delete_mode) {
        this.delete_mode = false;
        this.selector = new TextureRenderable(this.kBound);
        this.selector.getXform().setPosition(selectorLocation[0], selectorLocation[1]);
        this.selector.getXform().setSize(this.mXSize,this.mYSize);
    }

};

MapSelector.prototype.draw = function(mCamera){
    this.selector.draw(mCamera.getVPMatrix());
};


MapSelector.prototype.MoveLeft = function(){
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A) && this.leftBoundJudgement()){
        this.selector.getXform().incXPosBy(-this.mXSize);
    }
};

MapSelector.prototype.MoveRight = function(){
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D) && this.rightBoundJudgement()){
        this.selector.getXform().incXPosBy(this.mXSize);
    }
    
};

MapSelector.prototype.MoveUp = function(){
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W) && this.topBoundJudgement()){
        this.selector.getXform().incYPosBy(this.mYSize);
    }
    
};

MapSelector.prototype.MoveDown = function(){
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S) && this.bottomBoundJudgement() ){
        this.selector.getXform().incYPosBy(-this.mYSize);
    }
};


MapSelector.prototype.leftBoundJudgement = function () {
    return (this.selector.getXform().getXPos() - this.selector.getXform().getWidth()/2 > this.mMap.getCenterLocation()[0] - this.mMap.getWidth()/2);
};

MapSelector.prototype.rightBoundJudgement = function () {
    return (this.selector.getXform().getXPos() + this.selector.getXform().getWidth()/2 < this.mMap.getCenterLocation()[0] + this.mMap.getWidth()/2) ;
};

MapSelector.prototype.topBoundJudgement = function () {
    return (this.selector.getXform().getYPos() + this.selector.getXform().getHeight()/2 < this.mMap.getCenterLocation()[1] + this.mMap.getHeight()/2);
};

MapSelector.prototype.bottomBoundJudgement = function () {
    return (this.selector.getXform().getYPos() - this.selector.getXform().getHeight()/2 > this.mMap.getCenterLocation()[1] - this.mMap.getHeight()/2) ;
};
