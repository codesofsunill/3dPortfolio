import * as THREE from 'three';

export class Car {
    constructor(scene, gltf, path) {

        this.model = gltf.scene;
        this.path = path;

        this.model.scale.set(4, 4, 4);

        this.progress = 0;
        this.speed = 0;
        this.maxSpeed = 0.05;
        this.steering = 0;

        scene.add(this.model);

        /* ✅ GROUND OFFSET */
        const box = new THREE.Box3().setFromObject(this.model);
        this.groundOffset = -box.min.y; // ⭐ MUCH BETTER than size/2

        this.setupLights();
    }

    setupLights() {

        const createHeadlight = (x) => {

            const light = new THREE.SpotLight(
                0xffffff,
                0,
                120,
                Math.PI / 5,
                0.9,
                1.4
            );

            light.position.set(x, 0.85, 2.5);

            const target = new THREE.Object3D();
            target.position.set(x, 0.2, 25);

            this.model.add(target);
            light.target = target;

            light.castShadow = true;
            light.shadow.mapSize.width = 512;
            light.shadow.mapSize.height = 512;

            this.model.add(light);

            return light;
        };

        this.leftLight = createHeadlight(-0.75);
        this.rightLight = createHeadlight(0.75);

        this.brakeLight = new THREE.PointLight(0xff2200, 0, 25);
        this.brakeLight.position.set(0, 0.8, -2.9);
        this.model.add(this.brakeLight);
    }

    ignite() {

        console.log("REAL HEADLIGHTS ON 🚗");

        this.leftLight.intensity = 1800;
        this.rightLight.intensity = 1800;
    }

    update(delta, controls, state) {

        if (!this.path) return;

        const targetSpeed = state === 'DRIVING' ? this.maxSpeed : 0;
        this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed, delta * 2.5);

        const braking = state !== 'DRIVING';
        this.brakeLight.intensity = braking ? 6 : 0;

        this.progress += this.speed * delta;
        if (this.progress >= 1) this.progress = 0;

        const pos = this.path.getPointAt(this.progress);
        const tangent = this.path.getTangentAt(this.progress);

        /* ✅ POSITION */
        this.model.position.copy(pos);
        this.model.position.y += this.groundOffset;

        /* =====================================
           ⭐ PRO ROTATION (NO NOSE DIVE)
        ===================================== */

        // calculate heading angle ONLY on flat plane
        const angle = Math.atan2(tangent.x, tangent.z);

        // smooth rotation
        this.model.rotation.y = THREE.MathUtils.lerp(
            this.model.rotation.y,
            angle,
            delta * 5
        );

        // steering
        const targetSteer = THREE.MathUtils.clamp(controls.steering * 10, -12, 12);
        this.steering = THREE.MathUtils.lerp(this.steering, targetSteer, delta * 3);
        this.model.translateX(this.steering);

        // small visual tilt only
        this.model.rotation.z = -this.steering * 0.04;

        // ⭐ LOCK THESE (VERY IMPORTANT)
        this.model.rotation.x = 0;
    }
}
