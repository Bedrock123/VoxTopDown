
// Dict of all guns + types
const Guns = {
    peaShooter: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "PeaShooter.fbx",
        rateOfFire: 20,
        damage: 1,
        bulletColor: 'black',
        action: 'bullet',
        accuracy: 1,
        bulletSpeed: 30,
        force: 1,
        reloadTime: 200,
        bulletRange: 50

    },
    longRifle: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "LongRifle.fbx",
        rateOfFire: 300,
        damage: 10,
        bulletColor: 'blue',
        action: 'bullet',
        accuracy: 1,
        bulletSpeed: 100,
        force: 1,
        reloadTime: 200,
        bulletRange: 140
    },
    AK47: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "AK47.fbx",
        rateOfFire: 1,
        damage: 10,
        bulletColor: 'purple',
        action: 'bullet',
        accuracy: .8,
        bulletSpeed: 40,
        force: 1,
        reloadTime: 200,
        bulletRange: 200
    },
};

export default Guns;
