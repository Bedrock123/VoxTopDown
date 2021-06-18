import '../styles/index.css';

import * as THREE from 'three'
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


// Dungeon system
// Enemeyies like enter teh gungeon 


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

    SetScene() {
        {
            const player = new Entity();
            player.AddComponent(new PlayerInput.Controller({
                scene: this._scene,
                inputManager: this._inputManager,
                grid: this._grid,
                camera: this._camera,
                cameraControls: this._cameraControls,
                parent: player,
                scene: this._scene,
                resourcePath: '/man/',
                resourceName: "roboto12.gltf",
                scale: 0.4,
                emissive: new THREE.Color("white"),
                specular: new THREE.Color("white"),
                receiveShadow: true,
                castShadow: true,
            }));  
            player.AddComponent( new SpacialGridControllerEntity.GridController({grid: this._grid}))
            this._entityManager.Add(player, "Player");
        }
        
        {
            for (let i = 0; i < 100; ++i) {
                const animalNPC = new Entity()
                animalNPC.AddComponent(new AnimalEntity.StaticModelComponent({
                    scene: this._scene,
                }));
                animalNPC.AddComponent( new SpacialGridControllerEntity.GridController({grid: this._grid}))
                this._entityManager.Add(animalNPC)
                animalNPC.SetPosition(
                    (Math.random() * 200) - 100,
                    0,
                    (Math.random() * 200) - 100
                )
            }
        }
    }
}


// Create Game
const Game = new GameEngine()
Game.Initialize()
Game.Animate()
Game.SetScene()
Game.SetGridHelper()

