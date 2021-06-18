import * as THREE from 'three'
import Component from './base/Component'

export const AnimalEntity = (() => {
    class StaticModelComponent extends Component {
        constructor(params) {
            super();

            this._Init(params)
        }

        _Init(params) {
            this._params = params
            this._LoadStaticModel()
        }

        InitComponent() {
            this._RegisterHandler('update.position', (m) => { this._OnPosition(m); });
        }

        _OnPosition(m) {
            if (this._target) {
                this._target.position.copy(m.value);
            }
        }

        _LoadStaticModel() {
            // Animal Model Grouping
            const animalModelGroup = new THREE.Group()

            // ANIMAL BODY
            // Construct the animal geometry + material
            const animalBodyGeometry = new THREE.BoxGeometry( .4, .4, .4 )
            const animalBodyMaterial = new THREE.MeshStandardMaterial({color: "red", roughness: .8, metalness: 0})

            const animalBodyMesh = new THREE.Mesh(animalBodyGeometry, animalBodyMaterial)
            animalModelGroup.add(animalBodyMesh)
            
            animalModelGroup.rotation.x = Math.PI / 2

            // Add the full animal model to the scene
            this._params.scene.add(animalModelGroup)

            // Set the animal group as the component target
            this._target = animalModelGroup
        }

        SetColor(color) {
            if (!color) {
                color = "blue"
            }
            this._target.children[0].material.color = new THREE.Color(color)
        }

        Update() {
            const grid = this.GetComponent('GridController');
            const nearby = grid.FindNearbyEntities(10).filter(c => c.entity.Name === 'Player');      
            if (nearby.length != 0) {
                this.SetColor("yellow")
                this._target.children[0].scale.set(2, 2, 2 )
            } else {
                this.SetColor("red")
                this._target.children[0].scale.set(1, 1, 1.2 )
            }
        }

    };

    return {
        StaticModelComponent: StaticModelComponent,
    };

})();