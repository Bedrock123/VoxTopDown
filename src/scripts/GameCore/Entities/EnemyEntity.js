// ECS
import Entity from "@EntityComponentCore/Entity";

// Enemy Components
import EnemyController from "@GameCore/Components/Enemy/EnemyController";

// Common Components
import {ModelLoader} from "@GameCore/Components/Common/ModelLoader";
import Health from "@GameCore/Components/Common/Health";
import HitBox from "@GameCore/Components/Common/HitBox";
import GridController from "@GameCore/Components/Common/GridController";

// Inventory Components
import InventoryController from "@GameCore/Components/Inventory/InventoryController";

export const EnemyEntity = (params) => {
    const Enemy = new Entity();
    
    Enemy.AddComponent(new ModelLoader.StaticModelComponent({
        scene: params.scene,
        resourcePath: '/public/Enemy/',
        resourceName: 'peasant_girl.fbx',
        scale: 0.035,
        receiveShadow: true,
        castShadow: true,
    }), "StaticModel");

    Enemy.AddComponent(new HitBox({
        scene: params.scene,
        size: {
            x: 2,
            y: 14,
            z: 2
        }
    }), "HitBox");

    Enemy.AddComponent(new Health({
        health: 100
    }), "Health");

      // Add in the grid controller
    Enemy.AddComponent( new GridController({
        grid: params.grid
    }), "GridController");

    Enemy.AddComponent(new EnemyController({
    }), "EnemyController");

    // Handle initial player inventory
    Enemy.AddComponent(new InventoryController(), "InventoryController");

    Enemy.Broadcast({
        topic: 'inventory.add',
        value: params.startingGun,
        equip: true
    });  

    Enemy.SetPosition(Math.random() * 10, 0, Math.random() * 10);
    
    // Return the Enemy
    return Enemy;
};;