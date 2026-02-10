import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        
        this.sections = [
            { t: 0.05, name: "HI — I'M SUNIL", desc: "Driving the future of the web with immersive and high-speed experiences.  Scroll is boring — so I built a journey instead. ", type: "hero", done: false },
            { t: 0.20, name: "SKILLS", desc: "HTML, CSS, JavaScript, React, Three.js, and Python — building responsive and interactive Web applications.", type: "skills", done: false },
            { t: 0.35, name: "ABOUT ME", desc: "I design and develop user-friendly websites with modern technologies .", type: "experience", done: false },
            { t: 0.55, name: "PROJECTS", desc: "Click LIVE VIEW to explore my projects and see my work in action.", github: "#", live: (typeof window !== 'undefined') ? (window.location.origin + '/projects.html') : '/projects.html', buttonText: "LIVE VIEW", type: "project", done: false },
            { t: 0.75, name: "SERVICES", desc: "From lightning-fast landing pages to immersive full-stack platforms — I build web products that stand out.", type: "services", done: false },
            { t: 0.92, name: "CONTACT ME", desc: "Have a project in mind? Let's work together.", buttonText: "CONTACT ME", action: "openContact", type: "contact", done: false }
        ];

        this.createPath();
        this.initWorld();
    }

    createPath() {
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(40, 0, 600),
            new THREE.Vector3(-40, 0, 1200),
            new THREE.Vector3(20, 0, 1800),
            new THREE.Vector3(0, 0, 2500)
        ]);
    }

    initWorld() {

        // ⭐ SKY BOUNCE LIGHT
        const hemi = new THREE.HemisphereLight(0xbfdfff, 0x080808, 0.45);
        this.scene.add(hemi);

        // ⭐ Directional moon light (FORZA style contrast)
        const moon = new THREE.DirectionalLight(0xdfefff, 1.2);
        moon.position.set(120, 180, 100);
        moon.castShadow = true;

        moon.shadow.mapSize.width = 2048;
        moon.shadow.mapSize.height = 2048;

        this.scene.add(moon);

        // ⭐⭐⭐⭐⭐ FORZA LEVEL ROAD

        const roadGeom = new THREE.PlaneGeometry(65, 2600, 256, 256);

        // procedural roughness variation
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "#2b2b2b";
        ctx.fillRect(0,0,512,512);

        for(let i=0;i<8000;i++){
            const x = Math.random()*512;
            const y = Math.random()*512;
            const shade = Math.random()*40;
            ctx.fillStyle = `rgb(${60+shade},${60+shade},${60+shade})`;
            ctx.fillRect(x,y,2,2);
        }

        const asphaltTex = new THREE.CanvasTexture(canvas);
        asphaltTex.wrapS = asphaltTex.wrapT = THREE.RepeatWrapping;
        asphaltTex.repeat.set(20,80);

        const roadMat = new THREE.MeshPhysicalMaterial({

            map: asphaltTex,

            color: 0x111111,

            roughness: 0.48,
            metalness: 0.12,

            clearcoat: 1,
            clearcoatRoughness: 0.18,

            reflectivity: 0.65,

        });

        const road = new THREE.Mesh(roadGeom, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.z = 1250;
        road.receiveShadow = true;

        this.scene.add(road);


        // ⭐ WET CENTER STRIP (very subtle — looks INSANE with headlights)

        const wetGeom = new THREE.PlaneGeometry(18, 2600);

        const wetMat = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            roughness: 0.18,
            metalness: 0.3,
            clearcoat: 1,
            reflectivity: 0.9,
            transparent:true,
            opacity:0.55
        });

        const wet = new THREE.Mesh(wetGeom, wetMat);
        wet.rotation.x = -Math.PI / 2;
        wet.position.set(0,0.01,1250);

        this.scene.add(wet);



        // ⭐ ROAD SHOULDER (dirt edge)

        const shoulderGeom = new THREE.PlaneGeometry(140, 2600);

        const shoulderMat = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 1,
            metalness: 0
        });

        const shoulder = new THREE.Mesh(shoulderGeom, shoulderMat);
        shoulder.rotation.x = -Math.PI/2;
        shoulder.position.set(0,-0.03,1250);

        this.scene.add(shoulder);



        // ⭐ EDGE FADE (depth illusion)

        const edgeGeom = new THREE.PlaneGeometry(180, 2600);
        const edgeMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent:true,
            opacity:0.45
        });

        const edges = new THREE.Mesh(edgeGeom, edgeMat);
        edges.rotation.x = -Math.PI/2;
        edges.position.set(0,-0.05,1250);

        this.scene.add(edges);



        // 2. SHARP ROAD LINES
        const lineGeom = new THREE.PlaneGeometry(0.8, 2600);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); 
        
        const l1 = new THREE.Mesh(lineGeom, lineMat);
        l1.rotation.x = -Math.PI / 2;
        l1.position.set(-0.7, 0.06, 1250);
        
        const l2 = new THREE.Mesh(lineGeom, lineMat);
        l2.rotation.x = -Math.PI / 2;
        l2.position.set(0.7, 0.06, 1250);
        
        this.scene.add(l1, l2);


        // Sections
        this.sections.forEach(sec => {
            const point = this.path.getPointAt(sec.t);
            const tangent = this.path.getTangentAt(sec.t);
            
            this.createGantry(point, tangent, sec);
            this.createBuildings(point);
        });
    }

    // REST OF YOUR FILE EXACT SAME — ZERO DELETE

    createBuildings(centerPos) {

        const canvas = document.createElement('canvas');
        canvas.width = 128; 
        canvas.height = 256;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000808'; 
        ctx.fillRect(0,0,128,256);

        ctx.fillStyle = '#00ffff'; 
        
        for(let i=0; i<35; i++) {
            const x = Math.floor(Math.random()*4)*32 + 5; 
            const y = Math.floor(Math.random()*8)*32 + 5;
            ctx.fillRect(x, y, 12, 18);
        }
        
        const tex = new THREE.CanvasTexture(canvas);
        tex.magFilter = THREE.NearestFilter;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

        const buildingMat = new THREE.MeshStandardMaterial({ 
            color: 0x020202,
            map: tex,
            emissive: 0x008888,
            emissiveMap: tex,
            emissiveIntensity: 0.5
        });

        for(let i=0; i<18; i++) {

            const h = 70 + Math.random() * 200;
            const w = 25 + Math.random() * 15;
            const d = 25 + Math.random() * 15;
            
            const geom = new THREE.BoxGeometry(w, h, d);
            const mesh = new THREE.Mesh(geom, buildingMat);
            
            const xOffset = (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 100);
            const zSpread = (Math.random() - 0.5) * 500;
            
            mesh.position.set(centerPos.x + xOffset, h/2, centerPos.z + zSpread);
            this.scene.add(mesh);

            const edges = new THREE.EdgesGeometry(geom);
            const wireframe = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.3
                })
            );

            wireframe.position.copy(mesh.position);
            this.scene.add(wireframe);
        }
    }

    createGantry(pos, tangent, sec) {

        const canvas = document.createElement('canvas');
        canvas.width = 1024; 
        canvas.height = 256;

        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#001a1a'; 
        ctx.fillRect(0,0,1024,256);

        ctx.strokeStyle = '#00ffff'; 
        ctx.lineWidth = 15; 
        ctx.strokeRect(10,10,1004,236);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 45px Arial'; 
        ctx.textAlign = 'center';
        ctx.fillText("", 512, 80);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 100px Courier New';
        ctx.fillText(sec.name, 512, 190);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 16;
        
        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(55, 14),
            new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
        );

        board.userData = { section: sec };

        const boardPos = pos.clone().add(new THREE.Vector3(0, 32, 0));
        board.position.copy(boardPos);
        board.lookAt(pos.clone().add(tangent).add(new THREE.Vector3(0, 32, 0)));
        board.rotateY(Math.PI);

        const poleGeom = new THREE.BoxGeometry(2.5, 40, 2.5);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
        
        const sideVector = tangent.clone().cross(new THREE.Vector3(0,1,0)).normalize();
        
        const leftPole = new THREE.Mesh(poleGeom, poleMat);
        leftPole.position.copy(boardPos).add(sideVector.clone().multiplyScalar(28));
        leftPole.position.y = 20;

        const rightPole = new THREE.Mesh(poleGeom, poleMat);
        rightPole.position.copy(boardPos).add(sideVector.clone().multiplyScalar(-28));
        rightPole.position.y = 20;

        this.scene.add(board, leftPole, rightPole);
    }

    checkWaypoints(progress) {

        for (let wp of this.sections) {

            if (Math.abs(progress - wp.t) < 0.004 && !wp.done) {
                wp.done = true; 
                return wp;
            }

            if (Math.abs(progress - wp.t) > 0.04)
                wp.done = false;
        }

        return null;
    }
}
