/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MapHero(xPos,yPos,xSize,ySize,heroText, Map)
{
    this.kText = heroText;
    this.mMap = Map;
    
    this.mXSize = xSize;
    this.mYSize = ySize;
    
    this.mHero = new TextureRenderable(this.kText);
    this.mHero.getXform().setPosition(xPos,yPos);
    this.mHero.getXform().setSize(xSize,ySize);
}

MapHero.prototype.placeHero = function(xPos,yPos)
{
this.mHero.getXform().setPosition(xPos,yPos);    
};


MapHero.prototype.draw = function(aCamera)
{
     this.mHero.draw(aCamera.getVPMatrix());
};


MapHero.prototype.update = function()
{

};

MapHero.prototype.getHeroPosition = function()
{
    return this.mHero.getXform().getPosition();
};

MapHero.prototype.MoveLeft = function(){
    var hXForm = this.mHero.getXform();
    var tCheck;
    var oCheck;
    
    if (this.leftBoundJudgement()){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos()-this.mXSize,hXForm.getYPos());
        if(oCheck === null || oCheck.getPassability())
        {
            tCheck = this.mMap.getTileTerrain(hXForm.getXPos()-this.mXSize,hXForm.getYPos());
            if(tCheck !== null && tCheck.getTraversability())
            {
                this.mHero.getXform().incXPosBy(-this.mXSize);
            }
        }
        
        
    }
};

MapHero.prototype.MoveRight = function(){
    var hXForm = this.mHero.getXform();
    var tCheck;
    var oCheck;
    
    if (this.rightBoundJudgement()){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos()+this.mXSize,hXForm.getYPos());
        if(oCheck === null || oCheck.getPassability())
        {
            tCheck = this.mMap.getTileTerrain(hXForm.getXPos()+this.mXSize,hXForm.getYPos());
            if(tCheck !== null && tCheck.getTraversability())
            {
                this.mHero.getXform().incXPosBy(this.mXSize);
            }
        }
    }
    
};

MapHero.prototype.MoveUp = function(){
    var hXForm = this.mHero.getXform();
    var tCheck;
    var oCheck;
    
    if (this.topBoundJudgement()){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos(),hXForm.getYPos()+this.mYSize);
        if(oCheck === null || oCheck.getPassability())
        {
            tCheck = this.mMap.getTileTerrain(hXForm.getXPos(),hXForm.getYPos()+this.mYSize);
            if(tCheck !== null && tCheck.getTraversability())
            {
                this.mHero.getXform().incYPosBy(this.mYSize);
            }
        }
    } 
};

MapHero.prototype.MoveDown = function(){
    var hXForm = this.mHero.getXform();
    var tCheck;
    var oCheck;
    
    if (this.bottomBoundJudgement()){
         oCheck = this.mMap.getTileMapObject(hXForm.getXPos(),hXForm.getYPos()-this.mYSize);
        if(oCheck === null || oCheck.getPassability())
        {
            tCheck = this.mMap.getTileTerrain(hXForm.getXPos(),hXForm.getYPos()-this.mYSize);
            if(tCheck !== null && tCheck.getTraversability())
            {
                this.mHero.getXform().incYPosBy(-this.mYSize);
            }
        }
    }
};


MapHero.prototype.leftBoundJudgement = function () {
    return (this.mHero.getXform().getXPos() - this.mHero.getXform().getWidth()/2 > this.mMap.getCenterLocation()[0] - this.mMap.getWidth()/2);
};

MapHero.prototype.rightBoundJudgement = function () {
    return (this.mHero.getXform().getXPos() + this.mHero.getXform().getWidth()/2 < this.mMap.getCenterLocation()[0] + this.mMap.getWidth()/2) ;
};

MapHero.prototype.topBoundJudgement = function () {
    return (this.mHero.getXform().getYPos() + this.mHero.getXform().getHeight()/2 < this.mMap.getCenterLocation()[1] + this.mMap.getHeight()/2);
};

MapHero.prototype.bottomBoundJudgement = function () {
    return (this.mHero.getXform().getYPos() - this.mHero.getXform().getHeight()/2 > this.mMap.getCenterLocation()[1] - this.mMap.getHeight()/2) ;
};
