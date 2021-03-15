/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Terrain(terrainTexture,traversability, xPos, yPos, xSize,ySize)
{
    this.mTraversable = traversability;
    this.mTerrain = new TextureRenderable(terrainTexture);
    
    this.mTerrain.getXform().setPosition(xPos,yPos);
    this.mTerrain.getXform().setSize(xSize,ySize);
    
}


Terrain.prototype.setTraversability = function(trav)
{
    this.mTraversable = trav;
};

Terrain.prototype.getTraversability = function()
{
    return this.mTraversable;
};


Terrain.prototype.draw = function(aCamera)
{
  this.mTerrain.draw(aCamera.getVPMatrix());  
};