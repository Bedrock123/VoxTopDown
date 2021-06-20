import * as THREE from 'three';

// ECS
import EntityManager from "@EntityComponentCore/EntityManager";

// Game Core
import GameEnviornment from "@GameCore/GameEnviornment";

// Entities
import { PlayerEntity } from "@GameCore/Entities/PlayerEntity";

class GameEngine extends GameEnviornment {
    constructor()
    {
        super();
        this._entityManager = new EntityManager();
    }

    Init() {
        this._Initialize();
        this._Animate();
        this._SetGridHelper();
        this._LoadPlayer();
    }

    _LoadPlayer() {
        const player = PlayerEntity({
            scene: this._scene, 
            camera: this._camera,
            renderer: this._renderer,
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