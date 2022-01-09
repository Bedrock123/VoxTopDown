
class EntityManager {
  constructor() {
    this._ids = 0; // 
    this._entitiesMap = {};
    this._entities = [];
  }

  // Private
  _GenerateName() {
    this._ids += 1;
    return '__name__' + this._ids;
  }

  // Gets entity based on entity generated or custom name
  Get(customName) {
    return this._entitiesMap[customName];
  }

  // Pass in a custom filter function to get a specific list of entities
  Filter(filterFunction) {
    return this._entities.filter(filterFunction);
  }

  // Pass in an entity and custom name
  Add(entity, customName) {
    if (!customName) {
      customName = this._GenerateName();
    }
    this._entitiesMap[customName] = entity;
    this._entities.push(entity);

    entity.SetParent(this);
    entity.SetName(customName);
  }

  // Update each component with delta time
  Update(deltaTime) {
    for (let e of this._entities) {
      e.Update(deltaTime);
    }
  }
}

export default EntityManager;