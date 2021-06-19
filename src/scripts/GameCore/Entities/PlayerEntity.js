import * as THREE from 'three';

// ECS
import Entity from "@EntityComponentCore/Entity";

// Commmon Components
import {ModelLoader} from "@GameCore/Components/Common/ModelLoader";

// Player Components
import DebugCamera from "@GameCore/Components/Player/DebugCamera";
import PlayerInput from "@GameCore/Components/Player/PlayerInput";
import PlayerController from "@GameCore/Components/Player/PlayerController";

export const PlayerEntity = (params) => {
  const Player = new Entity();

  Player.AddComponent(new ModelLoader.StaticModelComponent({
      scene: params.scene,
      resourcePath: '/public/man/',
      resourceName: 'roboto12.gltf',
      scale: .1,
      emissive: new THREE.Color(0x808080),
  }), "StaticModelComponent");
  
  Player.AddComponent(new DebugCamera({
      camera: params.camera,
      renderer: params.renderer,
      scene: params.scene
  }), "DebugCamera");

  Player.AddComponent(new PlayerInput(), "PlayerInput");

  Player.AddComponent(new PlayerController(), "PlayerController");
  
  // Set the player to ground level
  Player.SetPosition(0, 4, 0);

  // Return the player
  return Player;
};;