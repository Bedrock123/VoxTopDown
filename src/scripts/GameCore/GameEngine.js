import * as THREE from 'three';

// ECS
import EntityManager from "@EntityComponentCore/EntityManager";

// Game Core
import GameEnviornment from "@GameCore/GameEnviornment";
import Guns from "@GameCore/Items/Guns";

// Entities
import { PlayerEntity } from "@GameCore/Entities/PlayerEntity";
import { GunEntity } from "@GameCore/Entities/GunEntity";

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
        this._SetGridHelper();
        this._LoadPlayer();
    }

    _LoadPlayer() {

        // Create the starting gun
        const subMachineGun = GunEntity({
            scene: this._scene, 
            gunDetails: Guns.peaShooter
        });
        this._entityManager.Add(subMachineGun, "subMachineGun");

        // Create the starting gun
        const sniperRifle = GunEntity({
            scene: this._scene, 
            gunDetails: Guns.longRifle
        });
        this._entityManager.Add(sniperRifle, "sniperRifle");


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
    }

    _SetGridHelper() {
        const size = 500;
        const divisions = 500;
        const gridHelper = new THREE.GridHelper( size, divisions );
        gridHelper.position.y = -.5;
        this._scene.add( gridHelper );
    }
}


export default GameEngine;