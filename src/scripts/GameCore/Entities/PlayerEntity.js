// ECS
import Entity from "@EntityComponentCore/Entity";

// Player Components
import PlayerModel from "@GameCore/Components/Player/PlayerModel";
import TopDownCamera from "@GameCore/Components/Player/TopDownCamera";
import PlayerInput from "@GameCore/Components/Player/PlayerInput";
import PlayerController from "@GameCore/Components/Player/PlayerController";

// Inventory Components
import InventoryController from "@GameCore/Components/Inventory/InventoryController";

export const PlayerEntity = (params) => {
  const Player = new Entity();

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

  // Set the player to ground level
  Player.SetPosition(0, 4.5, 0);
  Player.SetRotation(0, 0, 0);

  // Handle initial player inventory
  Player.AddComponent(new InventoryController(), "InventoryController");

  // Get the starting gun from the player
  // The startng gun is passed in through the platform
  Player.Broadcast({
    topic: 'inventory.add',
    value: params.startingGun,
  });  

  // Return the player
  return Player;
};;