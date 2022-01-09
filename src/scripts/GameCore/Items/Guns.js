
// Dict of all guns + types
const Guns = {
    peaShooter: {
        maxAmmoCapacity: 300,
        magazineCapacity: 12,
        modelPath: "PeaShooter.fbx",
        rateOfFire: 100,
        damage: 1,
        bulletColor: 'black',
        action: 'bullet',
        accuracy: 1,
        bulletSpeed: 30,
        force: 1,
        reloadTime: 200,
        bulletRange: 100

    },
    longRifle: {
        maxAmmoCapacity: 15,
        magazineCapacity: 3,
        modelPath: "LongRifle.fbx",
        rateOfFire: 300,
        damage: 1,
        bulletColor: 'blue',
        action: 'bullet',
        accuracy: 1,
        bulletSpeed: 100,
        force: 1,
        reloadTime: 500,
        bulletRange: 140
    },
    AK47: {
        maxAmmoCapacity: 500000,
        magazineCapacity: 20000,
        modelPath: "Revolver_4.fbx",
        rateOfFire: .2,
        damage: 1,
        bulletColor: 'red',
        action: 'bullet',
        accuracy: .1,
        bulletSpeed: 30,
        force: 1,
        reloadTime: 1500,
        bulletRange: 40
    },
};

export default Guns;
