// ECS
import Component from '@EntityComponentCore/Component';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';




class EquipItemModelManager extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._target = null;
        this._name = null;

        this._triggered = false;
    }

    InitComponent() {
        this._RegisterHandler('load.character', (m) => this._OnCharacterLoaded(m));
        this._RegisterHandler('inventory.equipItemModel', (m) => this._OnEquip(m));
        this._RegisterHandler('gun.shoot', (m) => this._OnItemShoot(m));
    }

    get Name() {
        return this._name;
    }
    
    _OnCharacterLoaded(msg) {
        // When the character is loaded assign their bones to object
        this._bones = msg.bones;

        // Attach the model to t ebones
        this._AttachTarget();
    }

    _AttachTarget() {
        if (this._bones && this._target) {
            this._bones[this._params.anchor].add(this._target);
        }
    }

    _OnEquip(msg) {
        if (msg.value == this._name) {
            return;
        }

        if (this._target) {
            this._UnloadModels();
        }

        // Attach the model to the bones after the model is loaded
        this._name = msg.value;
        this._LoadModels(this._name, () => {
            this._AttachTarget();
        });
    }

    _UnloadModels() {
        if (this._target) {
            this._target.parent.remove(this._target);
            this._target = null;
        }
    }

    _LoadModels(item, attachTarget) {
        const loader = new FBXLoader();
        loader.setPath('/public/guns/');
        loader.load(item, (fbx) => {
            this._target = fbx;
            this._target.scale.setScalar(.007);
            this._target.rotateY(- Math.PI * 2.9 );
            this._target.rotateX(-Math.PI / 3.2);
            this._target.rotateY(-1);

            this._target.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });

            // Attache target
            attachTarget();
        });
    }

    _OnItemShoot(m) {

    
        
    }
};

export default EquipItemModelManager;