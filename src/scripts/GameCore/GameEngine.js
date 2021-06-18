import * as THREE from 'three';

import EntityManager from "@EntityComponentCore/EntityManager";
import GameEnviornment from "@GameCore/GameEnviornment";

import Entity from "@EntityComponentCore/Entity";

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
        const player = new Entity();
        this._entityManager.Add(player, "Player");

        console.log(this._entityManager);
    }

    _SetGridHelper() {
        const size = 50;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper( size, divisions );
        gridHelper.position.y = -.5;
        this._scene.add( gridHelper );
    }
}


export default GameEngine;