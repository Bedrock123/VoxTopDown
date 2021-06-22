// ECS
import Entity from "@EntityComponentCore/Entity";

// Gun Components
import GunController from "@GameCore/Components/Gun/GunController";
import ProjectileController from "@GameCore/Components/Gun/ProjectileController";

export const GunEntity = (params) => {
  // Create the gun entity
  const Gun = new Entity();

  // Controls the gun logic
  Gun.AddComponent(new GunController({gunDetails: params.gunDetails}), "GunController");

  // Controls the procetile logic
  Gun.AddComponent(new ProjectileController({scene: params.scene, gunDetails: params.gunDetails}), "ProjectileController");

  // Return the Gun
  return Gun;
};;