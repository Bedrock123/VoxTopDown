// ECS
import Entity from "@EntityComponentCore/Entity";

// NPC Components
import NPCController from "@GameCore/Components/NPC/NPCController";

// Common Components
import {ModelLoader} from "@GameCore/Components/Common/ModelLoader";
import Health from "@GameCore/Components/Common/Health";
import HitBox from "@GameCore/Components/Common/HitBox";

// Inventory Components
import InventoryController from "@GameCore/Components/Inventory/InventoryController";

export const NPCEntity = (params) => {
    const NPC = new Entity();
    
    NPC.AddComponent(new ModelLoader.StaticModelComponent({
        scene: params.scene,
        resourcePath: '/public/npc/',
        resourceName: 'peasant_girl.fbx',
        scale: 0.035,
        receiveShadow: true,
        castShadow: true,
    }), "StaticModel");

    NPC.AddComponent(new HitBox({
        scene: params.scene,
        size: {
            x: 2,
            y: 14,
            z: 2
        }
    }), "HitBox");

    NPC.AddComponent(new Health({
        health: 100,
        maxHealth: 100,
    }), "Health");

    NPC.AddComponent(new NPCController({
    }), "NPCController");

    // Handle initial player inventory
    NPC.AddComponent(new InventoryController(), "InventoryController");

    NPC.Broadcast({
        topic: 'inventory.add',
        value: params.startingGun,
        equip: true
      });  

    NPC.SetPosition(Math.random() * 5, 0, Math.random() * 7);
    
    // Return the npc
    return NPC;
};;