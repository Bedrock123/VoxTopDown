// ECS
import Entity from "@EntityComponentCore/Entity";

// Gun Components
import GunController from "@GameCore/Components/Gun/GunController";
import ProjectileGenerator from "@GameCore/Components/Gun/ProjectileGenerator";

export const GunEntity = (params) => {
  // Create the gun entity
  const Gun = new Entity();

  // Controls the gun logic
  Gun.AddComponent(new GunController({scene: params.scene, gunDetails: params.gunDetails}), "GunController");

  // Controls the procetile logic
  Gun.AddComponent(new ProjectileGenerator({scene: params.scene, gunDetails: params.gunDetails}), "ProjectileGenerator");

  // Return the Gun
  return Gun;
};;