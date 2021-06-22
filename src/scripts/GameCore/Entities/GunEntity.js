// ECS
import Entity from "@EntityComponentCore/Entity";

// Gun Components
import GunController from "@GameCore/Components/Gun/GunController";

export const GunEntity = (params) => {

  // Create the gun entity
  const Gun = new Entity();

  // Controls the bullet flows
  Gun.AddComponent(new GunController({scene: params.scene, gunPath: params.gunPath}), "GunController");

  // Return the Gun
  return Gun;
};;