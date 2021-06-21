// ECS
import Component from '@EntityComponentCore/Component';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
class EquipWeaponManager extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._target = null;
        this._name = null;
    }

    InitComponent() {
        this._RegisterHandler('load.character', (m) => this._OnCharacterLoaded(m));
        this._RegisterHandler('inventory.equip', (m) => this._OnEquip(m));
    }

    get Name() {
        return this._name;
    }

    _OnCharacterLoaded(msg) {
        this._bones = msg.bones;
        this._AttachTarget();
        console.log(msg);
    }

    _AttachTarget() {
        if (this._bones && this._target) {
            console.log(this._bones);
            console.log(this._params.anchor);
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
            this._target.scale.setScalar(.2);
            this._target.rotateY(- Math.PI * 2.9 );
            this._target.rotateX(-Math.PI / 2.2);
            this._target.rotateY(-1);

            this._target.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });

            attachTarget();

            this.Broadcast({
                topic: 'load.weapon',
                model: this._target,
                bones: this._bones,
            });
        });
    }
};

export default EquipWeaponManager;