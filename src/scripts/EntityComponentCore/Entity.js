import * as THREE from 'three';


class Entity {
  constructor() {
    this._name = null;
    this._components = {};

    this._position = new THREE.Vector3();
    this._rotation = new THREE.Euler();
    this._handlers = {};
    this._parent = null;
  }

  _RegisterHandler(n, h) {
    if (!(n in this._handlers)) {
      this._handlers[n] = [];
    }
    this._handlers[n].push(h);
  }

  SetParent(p) {
    this._parent = p;
  }

  SetName(n) {
    this._name = n;
  }

  get Name() {
    return this._name;
  }

  SetActive(b) {
    this._parent.SetActive(this, b);
  }

  AddComponent(c, name) {
    c.SetParent(this);
    this._components[name] = c;

    c.InitComponent();
  }

  GetComponent(n) {
    return this._components[n];
  }

  FindEntity(n) {
    return this._parent.Get(n);
  }

  Broadcast(msg) {
    if (!(msg.topic in this._handlers)) {
      return;
    }

    for (let curHandler of this._handlers[msg.topic]) {
      curHandler(msg);
    }
  }

  SetPosition(x, y, z) {
    // Create a new vector 3
    const pos = new THREE.Vector3(
      x,
      y,
      z
    );
    
    // Set the entity to that vector 3
    this._position.copy(pos);

    // Broadcase the new Vector 3 position to all components who need to hear
    this.Broadcast({
        topic: 'update.position',
        value: this._position,
    });
  }

  SetRotation(r) {
    this._rotation.copy(r);
    this.Broadcast({
        topic: 'update.rotation',
        value: this._rotation,
    });
  }

  Update(deltaTime) {
    for (let k in this._components) {
      this._components[k].Update(deltaTime);
    }
  }
};

export default Entity;