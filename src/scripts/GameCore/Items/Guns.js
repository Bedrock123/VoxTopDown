
// Dict of all guns + types
const Guns = {
    peaShooter: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "PeaShooter.fbx",
        rateOfFire: 1,
        damage: 1,
        bulletColor: 'red',
        action: 'bullet',
        accuracy: .9,
        bulletSpeed: 30,
        force: 1,
        reloadTime: 200

    },
    longRifle: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "LongRifle.fbx",
        rateOfFire: 1000,
        damage: 10,
        bulletColor: 'blue',
        action: 'bullet',
        accuracy: 1,
        bulletSpeed: 100,
        force: 1,
        reloadTime: 200
    },
    AK47: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "AK47.fbx",
        rateOfFire: 1,
        damage: 10,
        bulletColor: 'purple',
        action: 'bullet',
        accuracy: .1,
        bulletSpeed: 30,
        force: 1,
        reloadTime: 200
    },
};

export default Guns;
