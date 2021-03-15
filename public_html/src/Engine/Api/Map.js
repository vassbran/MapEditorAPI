/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */



//Accepts dimensions to determine what size map and the location of the Map in WC
//For Example testing is done with a 10x10 map at (50,50)
//The size of each map block is 10x10 WC
function Map(xDimensions, yDimensions, centerLocation,xCellSize, yCellSize , startTerrain)
{
    //Temp, Should probably have some better way to group objTextures
   this.mDefaultTerrain = startTerrain;
   
   
    this.mObjectSource = null; //The Texture source for new map Objects
    this.mTerrainSource = startTerrain; //The Texture source for new Terrain
    
    this.mXCellSize = xCellSize;
    this.mYCellSize = yCellSize;
    
    
    //Setting up the Maps physical dimensions
    this.mHeight = this.mYCellSize * xDimensions;
    this.mWidth = this.mXCellSize * yDimensions;
    this.mCenterLocation = centerLocation;
    
    
    //Creating the Maps Map Selector
    this.mMapSelector = new MapSelector(this,this.mXCellSize,this.mYCellSize);
    
    //Whether the map is in deletion mode
    this.mDeleteMode = false;
    
    //Whether the map is in terrain mode
    this.mTerrainMode = false;
    
    //Whether the map is in edit mode
    this.mEditMode = true;
    
    //Map Object Set for all map objects to be held
    this.mMapObjects = new MapObjectSet(); 
    
    //Terrain Object Set for the Maps Terrain to be held
    this.mTerrainSet = new TerrainSet();
    
    //Arrays for traversability and passability
    this.mTerrainTypes = [];
    this.mObjectTypes = [];
    
    //Holds any and all User defined units' Xform
    this.mUserUnits = [];
    
    this.initMap();
}


Map.prototype.update = function()
{
  this.mMapObjects.update();
  if(this.mEditMode)
  {
      this.mMapSelector.update();  
  }
};

Map.prototype.draw = function(aCamera)
{
    //Always draw terrain first
    this.mTerrainSet.draw(aCamera);
    
    //Then draw the objects
    this.mMapObjects.draw(aCamera);
    
    //Always draw the selector last
    if(this.mEditMode)
    {
        this.mMapSelector.draw(aCamera);
    }
    
};

//Add new UserUnit Xform
Map.prototype.addUserUnit = function(newUnit)
{
    this.mUserUnits.push(newUnit);
};

Map.prototype.getWidth = function()
{
    return this.mWidth;
};

Map.prototype.getHeight = function()
{
    return this.mHeight;
};

Map.prototype.getCenterLocation = function()
{
    return this.mCenterLocation;
};

Map.prototype.toggleDelete = function()
{
    if(this.mEditMode)
        {
            
        
        if(this.mDeleteMode)
        {
            this.mDeleteMode = false;
        }
        else
        {
            this.mDeleteMode = true;
            this.mTerrainMode = false;
        }
        this.mMapSelector.changeMode();
        
        }
};

Map.prototype.toggleTerrain = function()
{
    if(this.mEditMode){
        if(this.mDeleteMode)
        {
            this.mDeleteMode = false;
            this.mMapSelector.changeMode();
        }
        
        //This behaviour is weird, should probably think of a better way
        if(this.mTerrainMode)
        {
            this.mTerrainMode = false;
        }
        else
        {
            this.mTerrainMode = true;
        }
    }
};

Map.prototype.toggleEdit = function()
{
    if(this.mEditMode)
    {
        this.mEditMode = false;
    }
    else
    {
        this.mEditMode = true;
    }
};

Map.prototype.modifySpace = function()
{
    //MapSelector location
    var selectorXform = this.mMapSelector.selector.getXform(); 
    
    
    
    if(this.mEditMode)
    {
        if(this.mDeleteMode) //Remove object
        {
            this.removeMapObject(selectorXform.getXPos(), selectorXform.getYPos());
        }
        else if(this.mTerrainMode) //Place new Terrain
        {
            this.placeTerrain(selectorXform.getXPos(),selectorXform.getYPos());
        }
        else //Add new Object
        {
            this.addMapObject(selectorXform.getXPos(),selectorXform.getYPos()); //Object placement based upon 
        }
    }
    
};

//Selects the source texture for new map objects
Map.prototype.selectObject = function()
{ 
    this.mObjectSource = localStorage.getItem('picSource');
};

//Adds new map object to the map object set
Map.prototype.addMapObject = function(xPos, yPos)
{   
    var placeable = true;
    for(let object of this.mMapObjects.mSet)
    {
        if(object.object.getXform().getXPos() === xPos
                && object.object.getXform().getYPos() === yPos){
            placeable = false;
            break;
        }
    }
    
    if(placeable)
    {
    for(let terrain of this.mTerrainSet.mSet)
    {
        if(terrain.mTerrain.getXform().getXPos() === xPos
                && terrain.mTerrain.getXform().getYPos() === yPos){
                if(!terrain.getTraversability())
                {
                    placeable = false;
                    break;
                }
        }
    }
    }
    
    if(placeable)
    {
        for (let unit of this.mUserUnits)
        {
            if(unit.getXPos() === xPos
                    && unit.getYPos() === yPos)
            {
                placeable = false;
                break;
            }
        }
    }
    
    if(placeable)
    {
        this.selectObject();
        var newObject = new MapObject(this.mObjectSource, xPos, yPos,this.mXCellSize,this.mYCellSize);
    
        for(let oType of this.mObjectTypes)
        {
            if(oType.path === this.mObjectSource)
            {
                newObject.setPassability(oType.pass);
                break;
            }
        }  
        this.mMapObjects.addToSet(newObject);
    }
};

Map.prototype.removeMapObject = function(xPos,yPos)
{
    for(let object of this.mMapObjects.mSet)
    {
        if(object.object.getXform().getXPos() === xPos
                && object.object.getXform().getYPos() === yPos){
            object.setDelete();
        }
    }
};

Map.prototype.addObjectType = function (textPath, passability)
{
  var newObject = {path: textPath, pass: passability};
  this.mObjectTypes.push(newObject);
};

//Return the object at the given position. Returns null if no Object in that space
Map.prototype.getTileMapObject = function(xPos, yPos)
{
    for(let object of this.mMapObjects.mSet)
    {
        if(object.object.getXform().getXPos() === xPos
                && object.object.getXform().getYPos() === yPos ){
            return object;
        }
    }
    return null;
};

Map.prototype.selectTerrain = function()
{
    this.mTerrainSource = localStorage.getItem('terrainSource');
};

Map.prototype.placeTerrain = function(xPos, yPos)
{
    this.selectTerrain();
    
    var placeable = true;
    var occupied = false;
    for(let object of this.mMapObjects.mSet)
    {
        if(object.object.getXform().getXPos() === xPos
                && object.object.getXform().getYPos() === yPos ){
            occupied = true;
            break;
        }
    }
    
    if(placeable)
    {
        for (let unit of this.mUserUnits)
        {
            if(unit.getXPos() === xPos
                    && unit.getYPos() === yPos)
            {
                occupied = true;
                break;
            }
        }
    }
    
    if(occupied)
    { 
    for(let tType of this.mTerrainTypes)
    {
        if(tType.path === this.mTerrainSource)
        {
            if(!tType.trav)
            {
                placeable = false;
                break;
            }
            
        }
    }   
    }  
    
    
    
    if(placeable)
    {
    
    for(let terrain of this.mTerrainSet.mSet)
    {
        if(terrain.mTerrain.getXform().getXPos() === xPos
                && terrain.mTerrain.getXform().getYPos() === yPos){
            
                terrain.mTerrain = new TextureRenderable(this.mTerrainSource);
                terrain.mTerrain.getXform().setPosition(xPos,yPos);
                terrain.mTerrain.getXform().setSize(this.mXCellSize,this.mYCellSize);
                
                for(let tType of this.mTerrainTypes)
                {
                    if(tType.path === this.mTerrainSource)
                    {
                        terrain.setTraversability(tType.trav);
                        break;
                    }
                }       
                break;
        }
    }
}
};

Map.prototype.addTerrainType = function(textPath, traversability)
{
    var newTerrain = {path: textPath, trav: traversability};
    this.mTerrainTypes.push(newTerrain);
};

//Returns the Terrain at the given position
Map.prototype.getTileTerrain = function(xPos,yPos)
{
    for(let terrain of this.mTerrainSet.mSet)
    {
        if(terrain.mTerrain.getXform().getXPos() === xPos
                && terrain.mTerrain.getXform().getYPos() === yPos){
                
                return terrain;
        }
    }
    return null;
};

//Initilize the map to have a default terrain
Map.prototype.initMap = function()
{
    var tXPos = this.mXCellSize/2 + this.mCenterLocation[0] - this.mWidth/2;
    var tYPos = this.mYCellSize/2 + this.mCenterLocation[1] - this.mHeight/2;
    var xDim = this.mWidth / this.mXCellSize;
    var yDim = this.mHeight/ this.mYCellSize;
    var i,j;
    for(i = 0; i < xDim; i++)
    {
        for(j = 0; j < yDim; j++)
        {
            var baseTerrain = new Terrain(this.mTerrainSource, true, tXPos + (this.mXCellSize * i),tYPos + (this.mYCellSize * j),this.mXCellSize,this.mYCellSize);
            this.mTerrainSet.addToSet(baseTerrain);
        }
    }
};

Map.prototype.clearMap = function()
{
    this.mTerrainSet = null;
    this.mMapObjects = null;
    
    this.mMapObjects = new MapObjectSet(); 
    this.mTerrainSet = new TerrainSet();
    
    this.mTerrainSource = this.mDefaultTerrain;
    
    this.initMap();
};

Map.prototype.saveMap = function (mapName)
{
  gEngine.ResourceMap.saveMap(mapName, this);  
};

Map.prototype.loadMap = function (mapName)
{
    if(gEngine.ResourceMap.isAssetLoaded(mapName))
    {
        return gEngine.ResourceMap.retrieveAsset(mapName);
    }
    else
    {
        return this;
    }
};