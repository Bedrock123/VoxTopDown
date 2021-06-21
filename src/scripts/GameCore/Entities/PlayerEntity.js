import * as THREE from 'three';

// ECS
import Entity from "@EntityComponentCore/Entity";

// Player Components
import DebugCamera from "@GameCore/Components/Player/DebugCamera";
import PlayerModel from "@GameCore/Components/Player/PlayerModel";
import TopDownCamera from "@GameCore/Components/Player/TopDownCamera";
import PlayerInput from "@GameCore/Components/Player/PlayerInput";
import PlayerController from "@GameCore/Components/Player/PlayerController";

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

  // Player.AddComponent(new DebugCamera({
  //     camera: params.camera,
  //     renderer: params.renderer,
  //     scene: params.scene
  // }), "DebugCamera");

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

  // Return the player
  return Player;
};;