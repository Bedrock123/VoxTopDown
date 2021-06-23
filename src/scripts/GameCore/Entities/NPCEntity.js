// ECS
import Entity from "@EntityComponentCore/Entity";

// Player Components
import {ModelLoader} from "@GameCore/Components/Common/ModelLoader";

// Common Components
import HitBox from "@GameCore/Components/Common/HitBox";

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

    NPC.SetPosition(4, 0, 7);
    
    // Return the npc
    return NPC;
};;