// ECS
import EntityManager from "@EntityComponentCore/EntityManager";

// Game Core
import GameEnviornment from "@GameCore/GameEnviornment";
import Guns from "@GameCore/Items/Guns";

// Entities
import { PlayerEntity } from "@GameCore/Entities/PlayerEntity";
import { GunEntity } from "@GameCore/Entities/GunEntity";
import { ProjectileMapEntity } from "@GameCore/Entities/ProjectileMapEntity";
import { EnemyEntity } from "@GameCore/Entities/EnemyEntity";

// ECS
import SpacialHashGrid from "@EntityComponentCore/utils/SpacialHashGrid";

class GameEngine extends GameEnviornment {
    constructor()
    {
        super();
        this._entityManager = new EntityManager();
        this._grid = new SpacialHashGrid([[-2500, -2500], [2500, 2500]], [5000, 5000]);
    }

    Init() {
        this._Initialize();
        this._Animate();
    }

    _LoadProjectileMap() {
        // Create the projectile map entity
        const projectileMap = ProjectileMapEntity({
            scene: this._scene
        });   
        this._entityManager.Add(projectileMap, "ProjectileMap");
    }

    _LoadPlayer() {

        // Create the starting gun
        const subMachineGun = GunEntity({
            scene: this._scene, 
            gunDetails: Guns.AK47
        });
        this._entityManager.Add(subMachineGun, "subMachineGun");

        // Create the starting gun
        const sniperRifle = GunEntity({
            scene: this._scene, 
            gunDetails: Guns.longRifle
        });
        this._entityManager.Add(sniperRifle, "sniperRifle");
    
        // Create the npc gun
        const peaShooter = GunEntity({
            scene: this._scene, 
            gunDetails: Guns.peaShooter
        });
        this._entityManager.Add(peaShooter, "peaShooter");


        // Create the player character
        const player = PlayerEntity({
            scene: this._scene, 
            camera: this._camera,
            renderer: this._renderer,
            startingGun1: subMachineGun,
            startingGun2: sniperRifle,
            grid: this._grid
        });   

        this._entityManager.Add(player, "Player");


        // Create the npc character
        const npc = EnemyEntity({
            scene: this._scene,
            startingGun: peaShooter,
            grid: this._grid
        });   
        this._entityManager.Add(npc, "NPC");
    }

}


export default GameEngine;