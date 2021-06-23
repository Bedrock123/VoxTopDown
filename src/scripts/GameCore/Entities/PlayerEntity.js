// ECS
import Entity from "@EntityComponentCore/Entity";

// Player Components
import PlayerModel from "@GameCore/Components/Player/PlayerModel";
import TopDownCamera from "@GameCore/Components/Player/TopDownCamera";
import DebugCamera from "@GameCore/Components/Player/DebugCamera";
import PlayerInput from "@GameCore/Components/Player/PlayerInput";
import PlayerController from "@GameCore/Components/Player/PlayerController";
import EquipItemModelManager from "@GameCore/Components/Player/EquipItemModelManager";
import HitBox from "@GameCore/Components/Common/HitBox";

// Common
import GridController from "@GameCore/Components/Common/GridController";
import Health from "@GameCore/Components/Common/Health";

// Inventory Components
import InventoryController from "@GameCore/Components/Inventory/InventoryController";

export const PlayerEntity = (params) => {
  const Player = new Entity();

  // Add in Equip weapon model manager
  Player.AddComponent(new EquipItemModelManager({
    anchor: 'mixamorigRightHandIndex1'
  }), "EquipItemModelManager");

  // Add in the grid controller
  Player.AddComponent( new GridController({
    grid: params.grid
  }), "GridController");
    
  Player.AddComponent(new PlayerModel({
      scene: params.scene,
      resourcePath: '/public/ybot/',
      resourceName: 'ybot.fbx',
  }), "PlayerModel");

  Player.AddComponent(new TopDownCamera({
      camera: params.camera,
      renderer: params.renderer,
      scene: params.scene
  }), "TopDownCamera");

  // Receives keyboard and mouse movement
  Player.AddComponent(new PlayerInput({
    camera: params.camera
  }), "PlayerInput");

  // Interprets mouse and keyboard into player action
  Player.AddComponent(new PlayerController({
    scene: params.scene,
      camera: params.camera
  }), "PlayerController");

  // Handles the player hit box
  Player.AddComponent(new HitBox({
    scene: params.scene,
    size: {
      x: 2,
      y: 8,
      z: 2
    },
    zOffset: 1
  }), "HitBox");

  // Set the player to ground level
  Player.SetPosition(0, 0, 0);
  Player.SetRotation(0, 0, 0);

  // Handle initial player inventory
  Player.AddComponent(new InventoryController(), "InventoryController");

  // Add health to the player
  Player.AddComponent(new Health({
      health: 100,
      maxHealth: 100,
  }), "Health");


  if (params.startingGun1) {
    // Get the starting gun from the player
    // The startng gun is passed in through the platform
    Player.Broadcast({
      topic: 'inventory.add',
      value: params.startingGun1,
      equip: true
    });  
  }

  if (params.startingGun2) {
    Player.Broadcast({
      topic: 'inventory.add',
      value: params.startingGun2,
    });  
  }

  // Return the player
  return Player;
};;