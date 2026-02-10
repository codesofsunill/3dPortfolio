import * as THREE from 'three';

export class Controls {
    constructor(app) {
        this.app = app;
        this.steering = 0;
        this.targetSteering = 0;
        this.isAccelerating = false;

        // ⭐ Prevent key spam / repeat bug
        this.keys = {};

        // Desktop Events
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));

        this.setupTouchControls();
    }

    setupTouchControls() {

        const bLeft = document.getElementById('ctrl-left');
        const bRight = document.getElementById('ctrl-right');

        if (!bLeft || !bRight) return;

        const startLeft = (e) => { 
            e.preventDefault(); 
            this.targetSteering = 1; 
        };

        const startRight = (e) => { 
            e.preventDefault(); 
            this.targetSteering = -1; 
        };

        const stopSteer = () => { 
            this.targetSteering = 0; 
        };

        bLeft.addEventListener('touchstart', startLeft, { passive:false });
        bLeft.addEventListener('touchend', stopSteer);

        bRight.addEventListener('touchstart', startRight, { passive:false });
        bRight.addEventListener('touchend', stopSteer);

        // ⭐ tap anywhere to start
        window.addEventListener('touchstart', () => {

            if (this.app.state === 'START') {
                this.app.startJourney();
            }
            else if (this.app.state === 'STOPPED') {
                this.app.resumeJourney();
            }

        }, { passive:true });
    }

    handleKey(e, isDown) {

        const key = e.key.toLowerCase();

        // ⭐ Ignore auto-repeat (VERY IMPORTANT)
        if (isDown && this.keys[key]) return;
        this.keys[key] = isDown;

        // ===== STEERING =====
        if (key === 'a' || key === 'arrowleft') {
            this.targetSteering = isDown ? 1 : 0;
        } 
        
        else if (key === 'd' || key === 'arrowright') {
            this.targetSteering = isDown ? -1 : 0;
        }

        // ===== ACCELERATION / START =====
        if (key === 'w' || key === 'arrowup' || key === ' ') {

            this.isAccelerating = isDown;

            if (isDown) {

                // ⭐ ignition trigger
                if (this.app.state === 'START') {
                    this.app.startJourney();
                }

                else if (this.app.state === 'STOPPED') {
                    this.app.resumeJourney();
                }
            }
        }
    }

    update(delta) {

        // ⭐ slightly smoother than before
        const sensitivity = 5.5;

        this.steering = THREE.MathUtils.lerp(
            this.steering,
            this.targetSteering,
            delta * sensitivity
        );
    }
}
