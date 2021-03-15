/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyScrollGame() {

    //Main Camera
    this.mCamera = null;
   
    //Textures for Center Selector
    this.kBound= "assets/Bound.png";
    this.kDelete = "assets/delete.png";
    
    //Texture for the Hero
    this.kHero = "assets/Hero2.png";

    //Textures for Terrain
    this.kCaveBack1 = "assets/MapTextures/caveback1.png";
    this.kCaveBack2 = "assets/MapTextures/caveback2.png";
    this.kCaveDirt = "assets/MapTextures/cavedirt1.png";
    this.kCaveDirtGrass = "assets/MapTextures/cavegrassdirt1.png";
    this.kCaveRock = "assets/MapTextures/caverock1.png";
    this.kCaveFlowers = "assets/scrollFlowers.png";
    
    

    //The Map
    this.mMap = null;
    
    this.mScrollHero = null;
    
}


MyScrollGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.kBound);
    gEngine.Textures.loadTexture(this.kDelete);

    gEngine.Textures.loadTexture(this.kHero);
    
    gEngine.Textures.loadTexture(this.kCaveBack1);
    gEngine.Textures.loadTexture(this.kCaveBack2);
    gEngine.Textures.loadTexture(this.kCaveDirt);
    gEngine.Textures.loadTexture(this.kCaveDirtGrass);
    gEngine.Textures.loadTexture(this.kCaveRock);
    gEngine.Textures.loadTexture(this.kCaveFlowers);

};

MyScrollGame.prototype.unloadScene = function () {
    
    gEngine.Textures.unloadTexture(this.kBound);
    gEngine.Textures.unloadTexture(this.kDelete);

    gEngine.Textures.unloadTexture(this.kHero);
    
    gEngine.Textures.unloadTexture(this.kCaveBack1);
    gEngine.Textures.unloadTexture(this.kCaveBack2);
    gEngine.Textures.unloadTexture(this.kCaveDirt);
    gEngine.Textures.unloadTexture(this.kCaveDirtGrass);
    gEngine.Textures.unloadTexture(this.kCaveRock);
    gEngine.Textures.unloadTexture(this.kCaveFlowers);
};

MyScrollGame.prototype.initialize = function () {

//Camera values dependent on the Map values
    this.mCamera = new Camera(
            vec2.fromValues(50, 50),
            100, 
            [0, 0, 600, 600]);
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mMap = new Map(10,10,vec2.fromValues(50,50) ,10, 10, this.kCaveBack1);//Creates a 10x10 Map Centered at 50,50
    
    //Tells the map what type of terrain the texture is
    //Reccommend using a file for large amounts of terrains
    this.mMap.addTerrainType(this.kCaveBack1, true);
    this.mMap.addTerrainType(this.kCaveBack2, true);
    
    //Tells the map what type of Map object it is
    //Same reccomendation as the terrains
    this.mMap.addObjectType(this.kCaveDirt, false);
    this.mMap.addObjectType(this.kCaveDirtGrass, false);
    this.mMap.addObjectType(this.kCaveRock, false);
    this.mMap.addObjectType(this.kCaveFlowers,true);
    
    
};

MyScrollGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.23, 0.40, 0.65, 1.0]);
    this.mCamera.setupViewProjection(); 

    this.mMap.draw(this.mCamera);

    if(this.mScrollHero !== null)
    {
        this.mScrollHero.draw(this.mCamera);
    }
   
};

MyScrollGame.prototype.update = function () {

    this.mMap.update();  
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.C))
    {
        this.mMap.clearMap();
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.mMap.toggleDelete();
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.T))
    {
        this.mMap.toggleTerrain();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.E))
    {
        this.mMap.toggleEdit();
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.mMap.modifySpace();
    }
    
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.H))
    {
        var mapSelectorXForm = this.mMap.mMapSelector.selector.getXform();
        var tObject = this.mMap.getTileMapObject(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
        if((tObject === null || tObject.getPassability()) && 
                this.mMap.getTileTerrain(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos()).getTraversability())
        {
            if(this.mScrollHero === null)
            {   
                this.mScrollHero = new ScrollHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos(),this.mMap.mXCellSize,this.mMap.mYCellSize,this.kHero,this.mMap);
                this.mMap.addUserUnit(this.mScrollHero.mHero.getXform());
            }
            else
            {
                this.mScrollHero.placeHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
            }
        }
    }
    if(!this.mMap.mEditMode)
    {
        if(this.mScrollHero !== null)
        {
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
            {
                this.mScrollHero.Jump();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.A))
            {
                this.mScrollHero.MoveLeft();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.D))
            {
                this.mScrollHero.MoveRight();
            }
            this.mScrollHero.update();
        }
    }
    
};



