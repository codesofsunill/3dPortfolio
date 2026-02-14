import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

export class Loader {
    constructor() {
        this.manager = new THREE.LoadingManager();
        
        // 1. SUCCESS: Jab sab load ho jaye tab screen hatao
        this.manager.onLoad = () => {
            console.log("Portfolio Compiled Successfully.");
            this.hideLoader();
        };

        // 2. PROGRESS: Bar update karo
        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            const progressElem = document.getElementById('loading-bar');
            if (progressElem) progressElem.style.width = `${progress}%`;
            
            // Developer style log update
            const statusText = document.getElementById('loading-status');
            if (statusText) statusText.innerHTML = `> FETCHING: ${url.split('/').pop()}... ${Math.round(progress)}%`;
        };

        // 3. ERROR: Agar file missing ho
        this.manager.onError = (url) => {
            console.error('Error loading: ' + url);
            const statusText = document.getElementById('loading-status');
            if (statusText) statusText.innerHTML = `> <span style="color: #ff0055;">ERROR: FAILED TO MOUNT ${url.split('/').pop()}</span>`;
        };

        this.gltfLoader = new GLTFLoader(this.manager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.gltfLoader.setDRACOLoader(dracoLoader);
    }

    async loadAll() {
        return new Promise((resolve, reject) => {
            // Path must be in /public/models/car.glb
            this.gltfLoader.load('/models/car.glb', 
                (gltf) => {
                    this.processCarModel(gltf);
                    resolve({ car: gltf });
                },
                undefined,
                (err) => {
                    reject(err);
                }
            );
        });
    }

    hideLoader() {
        const loaderScreen = document.getElementById('loading-screen');
        const startScreen = document.getElementById('screen-start');
        
        // Smooth transition to start engine
        if (loaderScreen) {
            loaderScreen.style.opacity = '0';
            setTimeout(() => {
                loaderScreen.classList.add('hidden');
                
                if (startScreen) {
                    startScreen.classList.remove('hidden');
                    startScreen.style.opacity = '1';
                }
            }, 800);
        }
    }

    processCarModel(gltf) {
        const model = gltf.scene;
        
        // Auto-center setup
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.x += (model.position.x - center.x);
        model.position.z += (model.position.z - center.z);
        model.position.y -= box.min.y;

        // Material optimization
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                    node.material.envMapIntensity = 2;
                    if (node.name.toLowerCase().includes('neon') || node.name.toLowerCase().includes('light')) {
                        node.material.emissiveIntensity = 10; // High glow for developer vibe
                    }
                }
            }
        });
    }
}