// ECS
import Entity from "@EntityComponentCore/Entity";

// Projectile Components
import ProjectileController from "@GameCore/Components/ProjectileMap/ProjectileController";

// Takes in all the projetiles fire and updates them across the Z axis
// Consoldes the creation of the hit boxes and distirbutes what damage or nothing 
export const ProjectileMapEntity = (params) => {
    
    const ProjectileMap = new Entity();

    // Controls the gun logic
    ProjectileMap.AddComponent(new ProjectileController({scene: params.scene}), "ProjectileController");

    // Return the Gun
    return ProjectileMap;
};;