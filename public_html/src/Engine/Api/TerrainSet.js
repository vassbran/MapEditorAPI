/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function TerrainSet()
{
    this.mSet = [];
}

TerrainSet.prototype.size = function () { return this.mSet.length; };

TerrainSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

TerrainSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

TerrainSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};

TerrainSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};
