
// Dict of all guns + types
const Guns = {
    peaShooter: {
        maxAmmoCapacity: 500,
        magazineCapacity: 50,
        modelPath: "PeaShooter.fbx",
        rateOfFire: 1,
        damage: 1,
        bulletColor: 'black',
        action: 'bullet',
        accuracy: .74,
        bulletSpeed: 40,
        force: 1,
        reloadTime: 200

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
        bulletSpeed: 1,
        force: 1,
        reloadTime: 200
    },
};

export default Guns;
