import '../styles/index.css';

import * as THREE from 'three'

console.log("hi")
import EntityManager from "./game/base/EntityManager"
import Entity from "./game/base/Entity"


import GameEnviornment from "./game/base/utils/GameEnviornment";
import InputManager from "./game/base/utils/InputManager"
import SpacialHashGrid from "./game/base/utils/SpacialHashGrid"

import {PlayerEntity} from "./game/PlayerEntity"
import {PlayerInput} from "./game/PlayerInput"
import {AnimalEntity} from "./game/AnimalEntity"
import {SpacialGridControllerEntity} from "./game/SpacialGridControllerEntity"
import {gltf_component} from "./game/GltfEntity"
import Stats from "stats.js"

import GenerateMap from "./utils/map/generate"

console.log( PlayerEntity)


// // Dungeon system
// // Enemeyies like enter teh gungeon 


class GameEngine extends GameEnviornment {
    constructor()
    {
        super()
        this._entityManager = new EntityManager();
        this._inputManager = new InputManager()
        this._grid = new SpacialHashGrid([[-2500, -2500], [2500, 2500]], [5000, 5000])
    }

    SetGridHelper() {
        const size = 50;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper( size, divisions );
        gridHelper.position.y = -.5
        this._scene.add( gridHelper );

    }
}


// // Create Game
const Game = new GameEngine()
Game.Initialize()
Game.Animate()
// Game.SetScene()
Game.SetGridHelper()

