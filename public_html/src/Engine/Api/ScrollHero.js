/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ScrollHero(xPos,yPos,xSize,ySize,heroText, Map)
{
    this.kText = heroText;
    this.mMap = Map;
    
    this.mXSize = xSize;
    this.mYSize = ySize;
    this.mJump = true;
    
    this.mHero = new TextureRenderable(this.kText);
    this.mHero.getXform().setPosition(xPos,yPos);
    this.mHero.getXform().setSize(xSize,ySize);
}

ScrollHero.prototype.placeHero = function(xPos,yPos)
{
    this.mHero.getXform().setPosition(xPos,yPos);    
};


ScrollHero.prototype.draw = function(aCamera)
{
     this.mHero.draw(aCamera.getVPMatrix());
};


ScrollHero.prototype.update = function()
{
    var hXForm = this.mHero.getXform();
    var groundCheck = parseInt((hXForm.getYPos()-this.mYSize/2)/(this.mYSize/2)) * (this.mYSize/2);
    var oCheck = this.mMap.getTileMapObject(hXForm.getXPos(),groundCheck);;
    if(oCheck === null || oCheck.getPassability())
    {
        this.mJump = false;
        hXForm.incYPosBy(-this.mYSize/30);
    }
    else
    {
        this.mJump = true;
    }
    
};

ScrollHero.prototype.getHeroPosition = function()
{
    return this.mHero.getXform().getPosition();
};

ScrollHero.prototype.MoveLeft = function()
{
    var hXForm = this.mHero.getXform();
    var oCheck;
    var wallCheck = parseInt((hXForm.getYPos())/(this.mYSize/2)) * (this.mYSize/2);
    if(wallCheck % 10 === 0)
    {
        wallCheck += 5;
    }
    if (this.leftBoundJudgement()){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos()-this.mXSize,wallCheck);
        if((oCheck === null || (oCheck !== null && oCheck.getPassability())) && hXForm.getYPos() < wallCheck - 0.5)
        {
            oCheck = this.mMap.getTileMapObject(hXForm.getXPos()-this.mXSize,wallCheck-this.mYSize);
        }
        if(oCheck === null || oCheck.getPassability())
        {
            
            this.mHero.getXform().incXPosBy(-this.mXSize);
        }
        
        
    }
};

ScrollHero.prototype.MoveRight = function()
{
    var hXForm = this.mHero.getXform();
    var oCheck;
    var wallCheck = parseInt((hXForm.getYPos())/(this.mYSize/2)) * (this.mYSize/2);
    if(wallCheck % 10 === 0)
    {
        wallCheck += 5;
    }
    if (this.rightBoundJudgement()){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos()+this.mXSize,wallCheck);
        if((oCheck === null || (oCheck !== null && oCheck.getPassability())) && hXForm.getYPos() < wallCheck - 0.5)
        {
            oCheck = this.mMap.getTileMapObject(hXForm.getXPos()+this.mXSize,wallCheck-this.mYSize);
        }       
        if(oCheck === null || oCheck.getPassability())
        {
            this.mHero.getXform().incXPosBy(this.mXSize);
        }
    }
    
};

ScrollHero.prototype.Jump = function()
{
    var hXForm = this.mHero.getXform();
    var oCheck;
    var headCheck = parseInt((hXForm.getYPos()+this.mYSize*1.5)/(this.mYSize/2)) * (this.mYSize/2);
    if(headCheck % 10 === 0)
    {
        headCheck += 5;
    }
    if (this.topBoundJudgement() && this.mJump){
        
        oCheck = this.mMap.getTileMapObject(hXForm.getXPos(),headCheck);
        if(oCheck === null || oCheck.getPassability())
        {
            this.mHero.getXform().incYPosBy(1.2 * this.mYSize); 
        }
    } 
};


ScrollHero.prototype.leftBoundJudgement = function () {
    return (this.mHero.getXform().getXPos() - this.mHero.getXform().getWidth()/2 > this.mMap.getCenterLocation()[0] - this.mMap.getWidth()/2);
};

ScrollHero.prototype.rightBoundJudgement = function () {
    return (this.mHero.getXform().getXPos() + this.mHero.getXform().getWidth()/2 < this.mMap.getCenterLocation()[0] + this.mMap.getWidth()/2) ;
};

ScrollHero.prototype.topBoundJudgement = function () {
    return (this.mHero.getXform().getYPos() + this.mHero.getXform().getHeight()/2 < this.mMap.getCenterLocation()[1] + this.mMap.getHeight()/2);
};
