export class UI {
    constructor(app) {
        this.app = app;

        this.startScreen = document.getElementById('screen-start');
        this.infoScreen = document.getElementById('screen-info');
        this.btnLink = document.getElementById('info-link');
        this.contactModal = document.getElementById('contactModal');

        /* ===============================
           CONTACT MODAL CLOSE LOGIC
        =============================== */

        const closeBtn = document.getElementById('closeContact');

        // ❌ Close button (X)
        if (closeBtn && this.contactModal) {
            closeBtn.addEventListener('click', () => {
                this.contactModal.style.display = "none";
            });
        }

        // ❌ Click outside modal
        if (this.contactModal) {
            this.contactModal.addEventListener('click', (e) => {
                if (e.target === this.contactModal) {
                    this.contactModal.style.display = "none";
                }
            });
        }

        // ❌ ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && this.contactModal) {
                this.contactModal.style.display = "none";
            }
        });

        /* ===============================
           IGNITION / START DRIVE
        =============================== */
        const ignitionBtn = document.getElementById('btn-ignition');
        if (ignitionBtn) {
            ignitionBtn.addEventListener('click', (e) => {
                e.preventDefault();

                this.enableHeadlights();

                this.startScreen.style.opacity = '0';
                this.startScreen.style.pointerEvents = 'none';

                setTimeout(() => {
                    this.startScreen.classList.add('hidden');
                    this.app.startJourney();
                }, 600);
            });
        }

        /* ===============================
           CONTINUE BUTTON
        =============================== */
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.hideSection();
                this.enableHeadlights();
                this.app.resumeJourney();
            });
        }
    }

    ready() {
        const btn = document.getElementById('btn-ignition');
        if (btn) {
            btn.classList.remove('hidden');
            btn.style.opacity = '1';
            btn.innerText = "START DRIVE";
        }
    }

    enableHeadlights() {
        if (!this.app || !this.app.car) return;

        if (typeof this.app.car.setHeadlights === 'function') {
            this.app.car.setHeadlights(true, 'ultra');
        }

        if (typeof this.app.car.enableHeadlight === 'function') {
            this.app.car.enableHeadlight(true);
        }

        if (this.app.car.headlights !== undefined) {
            this.app.car.headlights = true;
        }
    }

    showSection(wp) {
        if (!this.infoScreen) return;

        const heroPhoto = document.getElementById("hero-photo");

        if (heroPhoto) {
            if (wp.type === "hero") {
                heroPhoto.classList.remove("hidden");
            } else {
                heroPhoto.classList.add("hidden");
            }
        }

        this.infoScreen.classList.remove('hidden');
        this.infoScreen.style.transform = "scale(1)";
        this.infoScreen.style.opacity = "1";

        const title = document.getElementById('info-title');
        const desc = document.getElementById('info-desc');

        if (title) {
            title.innerText = "";
            let i = 0;
            const text = wp.name || "UNNAMED_SECTOR";

            const type = () => {
                if (i < text.length) {
                    title.innerText += text.charAt(i);
                    i++;
                    setTimeout(type, 45);
                }
            };
            type();
        }

        if (desc) desc.innerText = wp.desc || "";

        if (this.btnLink) {

            this.btnLink.onclick = null;
            this.btnLink.removeAttribute('target');

            if (wp.type === 'project') {

                this.btnLink.classList.remove('hidden');
                this.btnLink.style.display = "inline-block";
                this.btnLink.innerText = "LIVE VIEW";

                const url = wp.live || "/projects.html";

                this.btnLink.href = url.startsWith("http")
                    ? url
                    : window.location.origin + url;

                this.btnLink.target = "_blank";
            }

            else if (wp.type === 'contact') {

                this.btnLink.classList.remove('hidden');
                this.btnLink.style.display = "inline-block";
                this.btnLink.innerText = "CONTACT ME";
                this.btnLink.href = "#";

                this.btnLink.onclick = (e) => {
                    e.preventDefault();
                    if (this.contactModal) {
                        this.contactModal.style.display = "flex";
                    }
                };
            }

            else {
                this.btnLink.classList.add('hidden');
                this.btnLink.style.display = "none";
            }
        }

        const hudSection = document.getElementById('val-section');
        if (hudSection) {
            hudSection.innerText =
                ` ${wp.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
    }

    hideSection() {
        if (!this.infoScreen) return;

        this.infoScreen.style.opacity = "0";
        this.infoScreen.style.transform = "scale(0.9)";

        setTimeout(() => {
            this.infoScreen.classList.add('hidden');
        }, 500);
    }

    updateHUD(speed) {
        const speedElem = document.getElementById('val-speed');
        if (!speedElem) return;

        const speedVal = Math.floor(speed * 1200);
        speedElem.innerText = speedVal.toString().padStart(3, '0');

        speedElem.style.color =
            speedVal > 150 ? "#ff0055" : "#00ffff";
    }
}
