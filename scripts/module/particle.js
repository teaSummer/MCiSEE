export default class Particle {
	container = this.createContainer();

	/**
	 * 粒子效果系统
	 * @param {string} id 粒子效果 uid
	 * @param {object} param1 粒子效果参数
	 * @param {number | undefined} param1.speed 粒子移动速度
	 * @param {string[]} param1.images 粒子图片数组
	 * @param {number | undefined} param1.number 粒子数量
	 */
	constructor(id, { speed = 30, images, number = 64 }) {
		this.id = id;
		this.speed = speed / 10;
		this.images = images;
		this.number = number;
		this.docWidth = window.innerWidth;
		this.docHeight = window.innerHeight;
		this.particleList = [];
		this.init();
	}

	init() {
		for (let i = 0; i < this.number; i++) {
			const particle = this.createParticle();
			this.particleList.push({
				img: particle,
				moveTop: this.randomSpeed(),
				moveLeft: this.randomHorizontalSpeed(),
				rotation: Math.random() * 360,
				rotationSpeed: this.randomRotationSpeed(),
				swingPhase: Math.random() * Math.PI * 2,
				swingSpeed: Math.random() * 0.02 + 0.01
			});
		}
		this.animate();
		this.node.id = this.id;
		document.body.appendChild(this.node);
	}

	createContainer() {
		const node = document.createElement('div');
		this.node = node;
		const shadowRoot = node.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = `
			<style>
				:host {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					pointer-events: none;
					z-index: 99999;
				}
				img {
					image-rendering: pixelated;
					position: absolute;
					z-index: 100000;
				}
			</style>
		`;
		return shadowRoot;
	}

	createParticle() {
		const img = new Image();
		img.src = this.images[Math.floor(Math.random() * this.images.length)];
		img.onload = () => {
			this.setSize(img);
			this.setPosition(img);
			this.setOpacity(img);
			this.container.appendChild(img);
		};
		return img;
	}

	setSize(img) {
		const size = (Math.random() * 0.5 + 0.3).toFixed(2);
		img.style.width = `${size}rem`;
		img.style.height = `${size}rem`;
	}

	setPosition(img) {
		img.style.top = `${Math.random() * this.docHeight}px`;
		img.style.left = `${Math.random() * this.docWidth}px`;
	}

	setOpacity(img) {
		img.style.opacity = (Math.random() * 0.2 + 0.8).toFixed(2);
	}

	randomSpeed() {
		return +(Math.random() * (this.speed - 1) + 1).toFixed(2);
	}

	randomHorizontalSpeed() {
		return +(Math.random() * 0.6 - 0.3).toFixed(2);
	}

	randomRotationSpeed() {
		return +(Math.random() * 2 - 1).toFixed(2);
	}

	animate() {
		requestAnimationFrame(() => {
			this.particleList.forEach(item => {
				item.swingPhase += item.swingSpeed;
				const swingOffset = Math.sin(item.swingPhase) * 0.5;
				item.rotation += item.rotationSpeed;
				item.img.style.top = `${item.img.offsetTop + item.moveTop}px`;
				item.img.style.left = `${item.img.offsetLeft + item.moveLeft + swingOffset}px`;
				item.img.style.transform = `rotate(${item.rotation}deg)`;
				if (item.img.offsetTop > this.docHeight + 50) {
					this.setSize(item.img);
					this.setPosition(item.img);
					this.setOpacity(item.img);
					item.moveTop = this.randomSpeed();
					item.moveLeft = this.randomHorizontalSpeed();
					item.rotationSpeed = this.randomRotationSpeed();
				}
			});
			this.animate();
		});
	}

	destroy() {
		this.node.remove();
	}
}