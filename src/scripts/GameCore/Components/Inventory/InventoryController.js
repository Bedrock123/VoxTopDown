
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
        
        // If the item is swapped
        this._RegisterHandler('inventory.swapItem', (m) => this._OnInventoryItemSwap(m));
    }

    _OnInventoryAdded(msg) {
        // Add the gun entity into the player inventory
        this._inventory.push(msg.value);
        
        // If the added item should be equipred
        if (msg.equip) {
            this._EquipItem(msg.value);
        }
    }

    _EquipItem(item) {
        // Equip the gun into the player inventory
        this._equippedInventoryItem = (item);

        // Equip the model to the player
        this.Broadcast({
            topic: 'inventory.equipItemModel',
            value: item.GetComponent("GunController")._gunDetails.modelPath,
            added: false,
        });
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

    _OnInventoryItemSwap() {

        // If they have more than 1 item
        if (this._inventory.length > 1) {

            // Get the current index of the gun slot
            const index = this._inventory.indexOf(this._equippedInventoryItem);

            // If there is a next item then equip it, if not equip the firs tiem
            if(index >= 0 && index < this._inventory.length - 1) {
                const nextItem = this._inventory[index + 1];
                if (nextItem) {
                    this._EquipItem(nextItem);
                }
            } else {
                this._EquipItem(this._inventory[0]);
            }
        }
    }
}



export default InventoryController;