import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;

        // 🌑 Dark cinematic background (cyan hint removed)
        const bgColor = 0x050505;
        this.scene.background = new THREE.Color(bgColor);

        // 🌫️ Fog tuned – mystery but no glow
        this.scene.fog = new THREE.FogExp2(bgColor, 0.0012);

        this.setupLights();
        this.addRoadsideLamps();
    }

    setupLights() {

        // 3️⃣ AMBIENT LIGHT
        // Cyan hataya, intensity low – car clean rahegi
        const hemiLight = new THREE.HemisphereLight(
            0xffffff,   // sky
            0x080808,   // ground
            0.25        // LOW intensity
        );
        this.scene.add(hemiLight);


        // 4️⃣ MAIN DIRECTIONAL ("Moon light")
        // Road/buildings ke liye, car ko blast nahi karega
        const sun = new THREE.DirectionalLight(0xffffff, 0.55);
        sun.position.set(120, 200, 100);
        sun.castShadow = false;
        this.scene.add(sun);


        // 5️⃣ RIM LIGHT
        // Cyan removed, intensity heavily reduced
        const rimLight = new THREE.PointLight(0xffffff, 0.25, 180);
        rimLight.position.set(0, 60, -120);
        rimLight.castShadow = false;
        this.scene.add(rimLight);
    }

    // 6️⃣ ROAD LAMPS – REALISTIC (NO NEON)
    addRoadsideLamps() {

        for (let z = 0; z <= 2600; z += 250) {

            const side = (z % 500 === 0) ? 1 : -1;

            // 🌕 Warm realistic highway light
            const pLight = new THREE.PointLight(
                0xfff1cc, // warm white
                0.4,      // LOW intensity
                140       // limited range
            );

            pLight.position.set(42 * side, 18, z);
            pLight.castShadow = false;
            this.scene.add(pLight);


            // Lamp pole (NON glowing)
            const lampGeom = new THREE.BoxGeometry(1, 25, 1);
            const lampMat = new THREE.MeshStandardMaterial({
                color: 0x141414,
                metalness: 0.7,
                roughness: 0.6,
                emissive: 0x000000
            });

            const lampMesh = new THREE.Mesh(lampGeom, lampMat);
            lampMesh.position.set(42 * side, 12.5, z);
            this.scene.add(lampMesh);
        }
    }
}
