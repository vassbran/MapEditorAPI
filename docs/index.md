
###Module description:
The Map Editor API is designed to give the user the ability to create a map editor that is suitable for the game they want to integrate it in.

It provides functions that will allow for users to create and delete interactable map objects as well as modify the terrain in the map. There are also multiple functions that manage whether or not a map object and terrain texture can be traversable or not. Additionally, this API will allow for the user to change the size of the map they are working with.  

Map.js is a map object that sets the dimensions and center of the map, allowing the user to be able to select what size of map they want to work with. This also handles all user inputs of creating/deleting objects and allows for the user to save/load a certain map.

MapObject.js is a texture renderable that acts as an object that can be placed anywhere on the map, dependending on the traversability of the terrain. This handles where they are placed on the map and whether or not they are passable.

MapObjectSet.js is used to keep track of all the map objects placed on the map.

MapSelector.js is a selector object that is an indicator on the map portraying where the selected map object or terrain will be created/deleted. This selector is bounded by the map.

Terrain.js is a texture renderable that acts as a terrain object and can be placed anywhere on the map. This handles where they are placed on the map and whether or not they are traversable.

TerrainSet.js is used to keep track of all the terrain objects placed on the map.
