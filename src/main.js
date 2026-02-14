import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { Loader } from './Loader.js';
import { World } from './World.js';
import { Car } from './Car.js';
import { Camera } from './Camera.js';
import { Environment } from './Environment.js';
import { UI } from './UI.js';
import { Controls } from './Controls.js';

class App {
    constructor() {
        this.canvas = document.querySelector('#canvas-container');
        
        // 1. Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: false,
            powerPreference: "high-performance"
        });

        // ⭐⭐⭐⭐⭐ HEADLIGHT FIX ENGINE SETTINGS
        this.renderer.physicallyCorrectLights = true;
        this.renderer.useLegacyLights = false;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // ⭐ reduce exposure (VERY IMPORTANT)
        this.renderer.toneMappingExposure = 1.05;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000505); 
        this.clock = new THREE.Clock();
        
        // Initial State
        this.state = 'START'; 

        this.init();
        this.handleResize();
    }

    async init() {
        this.loader = new Loader();
        this.ui = new UI(this);
        
        // Assets Loading
        const assets = await this.loader.loadAll();
        
        // Module Initialization
        this.world = new World(this.scene);
        this.cameraMan = new Camera();
        this.controls = new Controls(this);
        this.env = new Environment(this.scene);
        
        // Car initialization with path from World
        this.car = new Car(this.scene, assets.car, this.world.path);

        this.setupPostProcessing();

        // UI Ready state
        this.ui.ready();
        
        // Start Loop
        this.animate();
    }

    setupPostProcessing() {
        const renderScene = new RenderPass(this.scene, this.cameraMan.instance);

        // ⭐⭐⭐ BLOOM FIX (HEADLIGHT FRIENDLY)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 
            0.45,   // strength ↓
            0.2,    
            1.4     // threshold ↑ (only very bright things glow)
        );

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
        this.composer.addPass(new OutputPass());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.renderer.setSize(w, h);
            this.composer.setSize(w, h);
            this.cameraMan.instance.aspect = w / h;
            this.cameraMan.instance.updateProjectionMatrix();
        });
    }

    // --- State Control (Inhe UI.js call karega) ---
    startJourney() {
        console.log("Mission Started: Driving Mode Active");
        this.state = 'DRIVING';
        if (this.car.ignite) this.car.ignite();
    }

    stopAtWaypoint(wp) {
        this.state = 'STOPPED';
        this.ui.showSection(wp);
    }

    resumeJourney() {
        this.state = 'DRIVING';
        this.ui.hideSection();
    }

    // --- Core Animation Loop ---
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = Math.min(this.clock.getDelta(), 0.1);
        const elapsed = this.clock.getElapsedTime();

        if (!this.car || !this.cameraMan) return;

        switch(this.state) {
            case 'START':
                this.cameraMan.orbit(elapsed);
                break;

            case 'DRIVING':
                this.car.update(delta, this.controls, 'DRIVING');
                this.cameraMan.follow(delta, this.car);
                
                const wp = this.world.checkWaypoints(this.car.progress);
                if (wp) this.stopAtWaypoint(wp);
                break;

            case 'STOPPED':
                this.cameraMan.dollyIn(delta, this.car);
                this.car.update(delta, this.controls, 'STOPPED'); 
                break;
        }

        if (this.ui) this.ui.updateHUD(this.car.speed);
        
        this.composer.render();
    }
}

// Kickstart
new App();
