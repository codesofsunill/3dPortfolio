import * as THREE from 'three';

export class Camera {
    constructor() {
        this.instance = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.instance.position.set(0, 15, -40);
        
        // Shake and offset state
        this.shake = 0;
        this.currentFOV = 60;
    }

    // START STATE: Menu screen par car ke charo taraf cinematic rotation
    orbit(time) {
        const radius = 35;
        this.instance.position.x = Math.sin(time * 0.3) * radius;
        this.instance.position.z = Math.cos(time * 0.3) * radius;
        this.instance.position.y = 12 + Math.sin(time * 0.5) * 5;
        this.instance.lookAt(0, 2, 0);
    }

    // DRIVING STATE: Dynamic follow with Speed Distortion
    follow(delta, car) {
        // 1. DYNAMIC FOV: Speed badhne par camera wide hoga (Speed feel boost)
        const targetFOV = 60 + (car.speed * 400); 
        this.currentFOV = THREE.MathUtils.lerp(this.currentFOV, targetFOV, delta * 2);
        this.instance.fov = this.currentFOV;
        this.instance.updateProjectionMatrix();

        // 2. OFFSET POSITION: Car ke piche aur thoda upar
        const offset = new THREE.Vector3(0, 6, -14);
        offset.applyQuaternion(car.model.quaternion);
        
        const targetPos = car.model.position.clone().add(offset);
        
        // Lag effect for smoother cinematic follow
        this.instance.position.lerp(targetPos, delta * 3.5);

        // 3. CAMERA SHAKE: Engine vibration feel
        if (car.speed > 0.01) {
            this.shake = car.speed * 0.15;
            this.instance.position.x += (Math.random() - 0.5) * this.shake;
            this.instance.position.y += (Math.random() - 0.5) * this.shake;
        }

        // 4. LOOK AT: Car ke aage ka rasta dekhna
        const lookTarget = car.model.position.clone().add(
            new THREE.Vector3(0, 2, 25).applyQuaternion(car.model.quaternion)
        );
        this.instance.lookAt(lookTarget);
    }

    // STOPPED STATE: Jab info card dikhega, side se cinematic view
    dollyIn(delta, car) {
        // Camera side mein move hoke car ko focus karega
        const offset = new THREE.Vector3(12, 4, -5).applyQuaternion(car.model.quaternion);
        const targetPos = car.model.position.clone().add(offset);
        
        this.instance.position.lerp(targetPos, delta * 1.5);
        this.instance.fov = THREE.MathUtils.lerp(this.instance.fov, 50, delta * 2);
        this.instance.updateProjectionMatrix();

        // Focus on car center
        const carCenter = car.model.position.clone().add(new THREE.Vector3(0, 2, 0));
        this.instance.lookAt(carCenter);
    }
}