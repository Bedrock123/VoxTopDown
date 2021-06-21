
// ECS
import Component from '@EntityComponentCore/Component';

// Holds all of the inventory items which controls weapon entities
class InventoryController extends Component {
    constructor() {
        super();
        this._inventory = [];
        this._equippedInventoryItem = null;
    }

    InitComponent() {
        // Player entities broadcast out what 
        this._RegisterHandler('inventory.add', (m) => this._OnInventoryAdded(m));

        // Look to see if the current inventory item is activated
        this._RegisterHandler('inventory.triggerItem', (m) => this._OnInventoryItemTriggered(m));
    }

    _OnInventoryAdded(msg) {
        // Add the gun entity into the player inventory
        this._inventory.push(msg.value);
        
        // Equip the gun into the player inventory
        this._equippedInventoryItem = (msg.value);
    }

    //  Trigger the current equipped inventory item 
    _OnInventoryItemTriggered(m) {
        // If there is an equipped weapon entity
        if (this._equippedInventoryItem) {
            this._equippedInventoryItem.Broadcast({
                topic: 'item.trigger',
                playerPosition: m.playerPosition,
                playerRotation: m.playerRotation
            });
        };
    }
}



export default InventoryController;