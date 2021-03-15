/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {

    //Main Camera
    this.mCamera = null;
   
    //Textures for Center Selector
    this.kBound= "assets/Bound.png";
    this.kDelete = "assets/delete.png";
    
    //Textures for Map Objects
    this.kTree = "assets/tree.png";
    this.kHouse = "assets/house.png";
    this.kFlowers = "assets/flowers.png";

    //Texutre for the Hero
    this.kHero = "assets/MapHero.png";
    this.kHero2 = "assets/Hero2.png";

    //Textures for Terrain
    this.kDirt = "assets/MapTextures/dirt2.png";
    this.kGrass = "assets/MapTextures/grass1.png";
    this.kLava = "assets/MapTextures/lava1.png";
    this.kStone = "assets/MapTextures/stone1.png";
    this.kWater = "assets/MapTextures/water1.png";
    

    //The Map
    this.mMap = null;
    
    this.mHero = null;
    this.mHero2 = null;
    
}


MyGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.kBound);
    gEngine.Textures.loadTexture(this.kTree);
    gEngine.Textures.loadTexture(this.kDelete);
    gEngine.Textures.loadTexture(this.kHouse);
    gEngine.Textures.loadTexture(this.kFlowers);
    gEngine.Textures.loadTexture(this.kDirt);
    gEngine.Textures.loadTexture(this.kGrass);
    gEngine.Textures.loadTexture(this.kHero);
    gEngine.Textures.loadTexture(this.kHero2);
    gEngine.Textures.loadTexture(this.kWater);
    gEngine.Textures.loadTexture(this.kLava);
    gEngine.Textures.loadTexture(this.kStone);
    document.myGame = this;
};

MyGame.prototype.unloadScene = function () {
    
    gEngine.Textures.unloadTexture(this.kBound);
    gEngine.Textures.unloadTexture(this.kTree);
    gEngine.Textures.unloadTexture(this.kDelete);
    gEngine.Textures.unloadTexture(this.kHouse);
    gEngine.Textures.unloadTexture(this.kFlowers);
    gEngine.Textures.unloadTexture(this.kDirt);
    gEngine.Textures.unloadTexture(this.kGrass);
    gEngine.Textures.unloadTexture(this.kHero);
    gEngine.Textures.unloadTexture(this.kHero2);
    var nextLevel = new MyGame();
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {

//Camera values dependent on the Map values
    this.mCamera = new Camera(
            vec2.fromValues(50, 50),
            100, 
            [0, 0, 600, 600]);
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mMap = new Map(10,10,vec2.fromValues(50,50) ,10, 10 , this.kGrass);//Creates a 10x10 Map Centered at 50,50
    
    //Tells the map what type of terrain the texture is
    //Reccommend using a file for large amounts of terrains
    this.mMap.addTerrainType(this.kGrass, true);
    this.mMap.addTerrainType(this.kDirt, true);
    this.mMap.addTerrainType(this.kStone, true);
    this.mMap.addTerrainType(this.kLava, false);
    this.mMap.addTerrainType(this.kWater, false);
    
    //Tells the map what type of Map object it is
    //Same reccomendation as the terrains
    this.mMap.addObjectType(this.kTree, false);
    this.mMap.addObjectType(this.kHouse, false);
    this.mMap.addObjectType(this.kFlowers, true);
    
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.23, 0.40, 0.65, 1.0]);
    this.mCamera.setupViewProjection(); 

    this.mMap.draw(this.mCamera);

    if(this.mHero !== null)
    {
        this.mHero.draw(this.mCamera);
    }
    if(this.mHero2 !== null)
    {
        this.mHero2.draw(this.mCamera);
    }
   
};

MyGame.prototype.update = function () {

    this.mMap.update();
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.J))
    {
        this.mMap.saveMap("map1");
        //gEngine.GameLoop.stop();
    }
    
    if(gEngine.Input.isKeyClicked((gEngine.Input.keys.L)))
    {
        
        this.mMap = this.mMap.loadMap("map1");
    
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.M))
    {
        //this.mMap.saveMap("map1");
        gEngine.GameLoop.stop();
    }
    
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
    
    
    
    //CODE FOR TESTING FUNCTIONALITY
    //IT IS WRITTEN TO SHOW OFF FUNCTIONALITY, NOT FOR ACTUAL USE
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.H))
    {
        var mapSelectorXForm = this.mMap.mMapSelector.selector.getXform();
        var tObject = this.mMap.getTileMapObject(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
        if((tObject === null || tObject.getPassability()) && 
                this.mMap.getTileTerrain(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos()).getTraversability())
        {
            if(this.mHero === null)
            {   
                this.mHero = new MapHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos(),this.mMap.mXCellSize,this.mMap.mYCellSize,this.kHero,this.mMap);
                this.mMap.addUserUnit(this.mHero.mHero.getXform());
            }
            else
            {
                this.mHero.placeHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
            }
        }
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P))
    {
        var mapSelectorXForm = this.mMap.mMapSelector.selector.getXform();
        var tObject = this.mMap.getTileMapObject(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
        if((tObject === null || tObject.getPassability()) && 
                this.mMap.getTileTerrain(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos()).getTraversability())
        {
            if(this.mHero2 === null)
            {   
                this.mHero2 = new MapHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos(),this.mMap.mXCellSize,this.mMap.mYCellSize,this.kHero2,this.mMap);
                this.mMap.addUserUnit(this.mHero2.mHero.getXform());
            }
            else
            {
                this.mHero2.placeHero(mapSelectorXForm.getXPos(),mapSelectorXForm.getYPos());
            }
        }
    }
    
    
    //Controls for first Hero
    if(!this.mMap.mEditMode)
    {
        if(this.mHero !== null)
        {
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.W))
            {
                this.mHero.MoveUp();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.A))
            {
                this.mHero.MoveLeft();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.S))
            {
                this.mHero.MoveDown();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.D))
            {
                this.mHero.MoveRight();
            }
        }
        
        if(this.mHero2 !== null)
        {
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Up))
            {
                this.mHero2.MoveUp();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Left))
            {
                this.mHero2.MoveLeft();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))
            {
                this.mHero2.MoveDown();
            }
            if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Right))
            {
                this.mHero2.MoveRight();
            }
        }
        
    }
    
    
};



