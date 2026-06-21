import { useEffect, useRef, useState } from 'react';

const IMAGES = [
  '/assets/res/particles/snow0.png',
  '/assets/res/particles/snow1.png',
  '/assets/res/particles/snow2.png',
];

interface Snowflake {
  img: HTMLImageElement;
  moveTop: number;
  moveLeft: number;
  rotation: number;
  rotationSpeed: number;
  swingPhase: number;
  swingSpeed: number;
}

function getStoredEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const value = localStorage.getItem('let-it-snow');
  return value === null ? true : value === 'true';
}

export function SnowEffect() {
  const [enabled, setEnabled] = useState(() => getStoredEnabled());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'let-it-snow') {
        setEnabled(e.newValue === null ? true : e.newValue === 'true');
      }
    };
    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'boolean') setEnabled(detail);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('mcisee:let-it-snow', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mcisee:let-it-snow', handleCustom);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      flakesRef.current = [];
      return;
    }

    if (containerRef.current) return;

    const node = document.createElement('div');
    node.style.position = 'fixed';
    node.style.top = '0';
    node.style.left = '0';
    node.style.width = '100%';
    node.style.height = '100%';
    node.style.pointerEvents = 'none';
    node.style.zIndex = '9999';
    document.body.appendChild(node);
    containerRef.current = node;

    const updateDimensions = () => {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    updateDimensions();

    const speed = 3;
    const number = 64;

    const randomSpeed = () => +(Math.random() * (speed - 1) + 1).toFixed(2);
    const randomHorizontalSpeed = () => +(Math.random() * 0.6 - 0.3).toFixed(2);
    const randomRotationSpeed = () => +(Math.random() * 2 - 1).toFixed(2);

    const setSize = (img: HTMLImageElement) => {
      const size = (Math.random() * 0.5 + 0.3).toFixed(2);
      img.style.width = `${size}rem`;
      img.style.height = `${size}rem`;
    };

    const setPosition = (img: HTMLImageElement) => {
      img.style.top = `${Math.random() * dimensionsRef.current.height}px`;
      img.style.left = `${Math.random() * dimensionsRef.current.width}px`;
    };

    const setOpacity = (img: HTMLImageElement) => {
      img.style.opacity = (Math.random() * 0.2 + 0.8).toFixed(2);
    };

    const createFlake = (): Snowflake => {
      const img = new Image();
      img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
      img.style.position = 'absolute';
      img.style.imageRendering = 'pixelated';
      setSize(img);
      setPosition(img);
      setOpacity(img);
      img.onload = () => {
        if (containerRef.current && !img.parentElement) {
          containerRef.current.appendChild(img);
        }
      };
      return {
        img,
        moveTop: randomSpeed(),
        moveLeft: randomHorizontalSpeed(),
        rotation: Math.random() * 360,
        rotationSpeed: randomRotationSpeed(),
        swingPhase: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
      };
    };

    flakesRef.current = Array.from({ length: number }, createFlake);

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      flakesRef.current.forEach((item) => {
        item.swingPhase += item.swingSpeed;
        const swingOffset = Math.sin(item.swingPhase) * 0.5;
        item.rotation += item.rotationSpeed;
        const top = item.img.offsetTop + item.moveTop;
        const left = item.img.offsetLeft + item.moveLeft + swingOffset;
        item.img.style.top = `${top}px`;
        item.img.style.left = `${left}px`;
        item.img.style.transform = `rotate(${item.rotation}deg)`;

        if (top > height + 50) {
          setSize(item.img);
          setPosition(item.img);
          setOpacity(item.img);
          item.moveTop = randomSpeed();
          item.moveLeft = randomHorizontalSpeed();
          item.rotationSpeed = randomRotationSpeed();
        }
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      flakesRef.current = [];
    };
  }, [enabled]);

  return null;
}
