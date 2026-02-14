import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Import gallery photos
import photo1 from "./assets/gallery/photo1.jpg";
import photo2 from "./assets/gallery/photo2.jpg";
import photo3 from "./assets/gallery/photo3.jpg";
import photo4 from "./assets/gallery/photo4.jpg";
import photo5 from "./assets/gallery/photo5.jpg";
import photo6 from "./assets/gallery/photo6.jpg";

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

// Gallery data - EDIT YOUR CAPTIONS HERE
const galleryData = [
  { id: 1, image: photo1, caption: "Caption for photo 1", position: "top" },
  { id: 2, image: photo2, caption: "Caption for photo 2", position: "bottom" },
  { id: 3, image: photo3, caption: "Caption for photo 3", position: "top" },
  { id: 4, image: photo4, caption: "Caption for photo 4", position: "bottom" },
  { id: 5, image: photo5, caption: "Caption for photo 5", position: "top" },
  { id: 6, image: photo6, caption: "Caption for photo 6", position: "bottom" },
];

// Letter text - WRITE YOUR MESSAGE HERE
const letterText = `Dear [Name],

Write your heartfelt message here. This can be multiple paragraphs.

You have space for approximately 500 words. Express your feelings, share memories, or write whatever is in your heart.

Love,
[Your Name]`;

const LandingPage = () => {
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);

  // Three complete flowers with stems
  const flower1Ref = useRef(null);
  const flower1PartsRef = useRef([]);

  const flower2Ref = useRef(null);
  const flower2PartsRef = useRef([]);

  const flower3Ref = useRef(null);
  const flower3PartsRef = useRef([]);

  // New sections
  const canvasRef = useRef(null);
  const envelopeRef = useRef(null);
  const sunsetOverlayRef = useRef(null);
  const nightOverlayRef = useRef(null);

  // States
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);

  const visitorRef = useRef(null);

  // Cloud transition elements
  const skyBackgroundRef = useRef(null);
  const cloudLayerRef = useRef(null);

  // Gallery elements
  const galleryContainerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      const flower1Parts = flower1PartsRef.current;
      const flower2Parts = flower2PartsRef.current;
      const flower3Parts = flower3PartsRef.current;

      const visitor = visitorRef.current;
      const skyBackground = skyBackgroundRef.current;
      const cloudLayer = cloudLayerRef.current;

      // Helper function to prepare path for drawing animation
      const preparePath = (path) => {
        if (!path) return 0;
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
        });
        return length;
      };

      // Helper for filled shapes (flower parts) - now using stroke drawing
      const prepareFilledPath = (path) => {
        if (!path) return 0;
        const length = path.getTotalLength ? path.getTotalLength() : 500;

        // Add stroke for drawing effect
        const fill = path.getAttribute("fill");
        const isOutline = path.getAttribute("data-part") === "outline";

        gsap.set(path, {
          stroke: isOutline ? "#37474F" : fill || "#000",
          strokeWidth: isOutline ? 2 : 3,
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
        });

        return length;
      };

      // Prepare all flower parts - EVERYTHING STARTS HIDDEN
      flower1Parts.forEach((part) => {
        if (part.tagName === "path" && part.getAttribute("stroke") !== "none") {
          preparePath(part);
        } else {
          prepareFilledPath(part);
        }
      });

      flower2Parts.forEach((part) => {
        if (part.tagName === "path" && part.getAttribute("stroke") !== "none") {
          preparePath(part);
        } else {
          prepareFilledPath(part);
        }
      });

      flower3Parts.forEach((part) => {
        if (part.tagName === "path" && part.getAttribute("stroke") !== "none") {
          preparePath(part);
        } else {
          prepareFilledPath(part);
        }
      });

      // Hide ALL elements initially - START FROM ZERO
      gsap.set(svgContainerRef.current, { autoAlpha: 1 });

      gsap.set(visitor, { autoAlpha: 0, scale: 0 });

      // Sky and clouds positioned above viewport, will scroll down
      gsap.set(skyBackground, { y: -window.innerHeight });
      gsap.set(cloudLayer, { y: -window.innerHeight });

      // Ensure container starts with pink gradient
      gsap.set(container, {
        background:
          "linear-gradient(135deg, rgb(254, 242, 242), rgb(255, 241, 242), rgb(254, 243, 199))",
      });

      // Create main timeline with extended scroll for complete journey
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=40000", // Extended for sunset, night, fireworks
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Trigger fireworks when reaching night section (85%+)
            if (self.progress > 0.85 && !showFireworks) {
              setShowFireworks(true);
            }
          },
          onLeave: () => {
            console.log("Animation complete - ready to navigate");
          },
        },
      });

      // Animation sequence - THREE COMPLETE FLOWERS GROWING
      let time = 0;

      // 1. FLOWER 1 grows from bottom (left position) - stem first, then bloom
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "stem"),
        {
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: 9,
          ease: "power2.inOut",
        },
        time,
      );

      // Draw petals with stroke animation
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          strokeDashoffset: 0,
          duration: 7.5,
          ease: "power2.inOut",
          stagger: 0.6,
        },
        time + 9,
      );

      // Fill petals after drawing
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          fillOpacity: 1,
          duration: 3,
          stagger: 0.6,
        },
        time + 15,
      );

      // Draw center
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          strokeDashoffset: 0,
          duration: 4.5,
          ease: "power2.inOut",
        },
        time + 18,
      );

      // Fill center
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          fillOpacity: 1,
          duration: 2.4,
        },
        time + 21,
      );

      // Draw outlines
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "outline"),
        {
          strokeDashoffset: 0,
          duration: 4.5,
          ease: "power2.inOut",
          stagger: 0.45,
        },
        time + 22.5,
      );

      // Fill outlines
      tl.to(
        flower1Parts.filter((p) => p.getAttribute("data-part") === "outline"),
        {
          fillOpacity: 0.5,
          duration: 2.4,
          stagger: 0.45,
        },
        time + 25.5,
      );

      time += 30;

      // 2. FLOWER 2 grows from bottom (right position)
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "stem"),
        {
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: 9,
          ease: "power2.inOut",
        },
        time,
      );

      // Draw petals with stroke animation
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          strokeDashoffset: 0,
          duration: 7.5,
          ease: "power2.inOut",
          stagger: 0.6,
        },
        time + 9,
      );

      // Fill petals after drawing
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          fillOpacity: 1,
          duration: 3,
          stagger: 0.6,
        },
        time + 15,
      );

      // Draw center
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          strokeDashoffset: 0,
          duration: 4.5,
          ease: "power2.inOut",
        },
        time + 18,
      );

      // Fill center
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          fillOpacity: 1,
          duration: 2.4,
        },
        time + 21,
      );

      // Draw outlines
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "outline"),
        {
          strokeDashoffset: 0,
          duration: 4.5,
          ease: "power2.inOut",
          stagger: 0.45,
        },
        time + 22.5,
      );

      // Fill outlines
      tl.to(
        flower2Parts.filter((p) => p.getAttribute("data-part") === "outline"),
        {
          fillOpacity: 0.5,
          duration: 2.4,
          stagger: 0.45,
        },
        time + 25.5,
      );

      time += 30;

      // 3. FLOWER 3 grows from bottom (center position - tallest)
      tl.to(
        flower3Parts.filter((p) => p.getAttribute("data-part") === "stem"),
        {
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: 12,
          ease: "power2.inOut",
        },
        time,
      );

      // Draw petals with stroke animation
      tl.to(
        flower3Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          strokeDashoffset: 0,
          duration: 9,
          ease: "power2.inOut",
          stagger: 0.75,
        },
        time + 12,
      );

      // Fill petals after drawing
      tl.to(
        flower3Parts.filter((p) => p.getAttribute("data-part") === "petal"),
        {
          fillOpacity: 1,
          duration: 3.6,
          stagger: 0.75,
        },
        time + 19.5,
      );

      // Draw center
      tl.to(
        flower3Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          strokeDashoffset: 0,
          duration: 5.4,
          ease: "power2.inOut",
        },
        time + 24,
      );

      // Fill center
      tl.to(
        flower3Parts.filter((p) => p.getAttribute("data-part") === "center"),
        {
          fillOpacity: 1,
          duration: 3,
        },
        time + 28.5,
      );

      // Skip outline animation for Flower 3 to prevent dark appearance
      // tl.to(flower3Parts.filter(p => p.getAttribute('data-part') === 'outline'), {
      //   scale: 1,
      //   opacity: 1,
      //   duration: 1,
      //   ease: 'back.out(1.7)',
      //   stagger: 0.08
      // }, time + 3.3);

      time += 33;

      // 4. Bring in the visitor and make it fly
      tl.to(
        visitor,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
        },
        time,
      );

      // Flying path using MotionPathPlugin - lands on left flower
      tl.to(
        visitor,
        {
          motionPath: {
            path: [
              { x: -250, y: 250 },
              { x: -200, y: 100 },
              { x: -180, y: 0 },
              { x: -160, y: -50 },
              { x: -150, y: -80 },
              { x: -140, y: -110 },
              { x: -135, y: -125 },
            ],
            curviness: 1.5,
            autoRotate: true,
          },
          duration: 5.4,
          ease: "power1.inOut",
        },
        time + 0.9,
      );

      // Keep bee on left flower
      tl.to(
        visitor,
        {
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        time + 6.3,
      );
      time += 6.8;

      // Wait before ascent
      time += 2;

      // 6. THE SKYWARD ASCENT - Peaceful upward journey

      // Move flowers down off-screen
      tl.to(
        [flower1Ref.current, flower2Ref.current, flower3Ref.current],
        {
          y: 1500,
          duration: 12,
          ease: "power1.inOut",
        },
        time,
      );

      // Bee flies upward with natural movement - curves, loops, stunts
      tl.to(
        visitor,
        {
          motionPath: {
            path: [
              { x: -135, y: -125 }, // Start from flower
              { x: -100, y: -180 }, // Up and right
              { x: -50, y: -220 }, // Continue up
              { x: 20, y: -240 }, // Drift right
              { x: 80, y: -280 }, // Loop preparation
              { x: 100, y: -340 }, // Loop top
              { x: 60, y: -380 }, // Loop back
              { x: 0, y: -400 }, // Center
              { x: -60, y: -450 }, // Drift left
              { x: -40, y: -520 }, // Zigzag
              { x: 30, y: -580 }, // Zigzag right
              { x: -10, y: -650 }, // Final ascent
              { x: 20, y: -750 }, // Up and away
            ],
            curviness: 1.8,
            autoRotate: true,
          },
          duration: 18,
          ease: "none",
        },
        time,
      );

      // Add speed variations to bee flight
      tl.to(
        visitor,
        {
          scale: 0.8,
          duration: 3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 2,
        },
        time,
      );

      // Sky scrolls down from top (no fading)
      tl.to(
        skyBackground,
        {
          y: 0,
          duration: 12,
          ease: "power1.inOut",
        },
        time,
      );

      // Clouds scroll down with sky (no fading)
      tl.to(
        cloudLayer,
        {
          y: 0,
          duration: 12,
          ease: "power1.inOut",
        },
        time,
      );

      time += 10;

      // Gallery scroll animation - integrated into main timeline
      const clouds = cloudLayer.querySelectorAll(".cloud");
      const galleryContainer = galleryContainerRef.current;

      // Reset cloud positions
      tl.add(() => {
        clouds.forEach((cloud) => {
          gsap.set(cloud, { x: -400 });
        });
      }, time);

      // Make gallery visible - start from left
      tl.set(
        galleryContainer,
        {
          x: -5500,
          opacity: 1,
        },
        time,
      );

      // Animate gallery sliding in from left to right over the remaining scroll
      tl.to(
        galleryContainer,
        {
          x: window.innerWidth,
          duration: 50,
          ease: "none",
          onUpdate: function () {
            const progress = this.progress();
            // Move clouds with parallax (also moving right)
            clouds.forEach((cloud, i) => {
              const speed = 0.4 + i * 0.08;
              const cloudMove = progress * 5500 * speed;
              const xPos = (cloudMove % (window.innerWidth + 800)) - 400;
              gsap.set(cloud, { x: xPos });
            });
          },
        },
        time,
      );

      time += 50;

      // SUNSET TRANSITION - Sky turns orange/pink
      const sunsetOverlay = sunsetOverlayRef.current;
      tl.to(
        sunsetOverlay,
        {
          opacity: 1,
          duration: 20,
          ease: "power2.inOut",
        },
        time,
      );

      // Fade out gallery during sunset
      tl.to(
        galleryContainer,
        {
          opacity: 0,
          duration: 15,
          ease: "power2.out",
        },
        time,
      );

      time += 20;

      // NIGHT TRANSITION - Background turns deep purple/black
      const nightOverlay = nightOverlayRef.current;
      tl.to(
        nightOverlay,
        {
          opacity: 1,
          duration: 25,
          ease: "power2.inOut",
        },
        time,
      );

      // Fade out clouds during night
      tl.to(
        cloudLayer,
        {
          opacity: 0,
          duration: 20,
          ease: "power2.out",
        },
        time + 5,
      );

      time += 25;

      // FIREWORKS SECTION - Canvas fades in
      const canvas = canvasRef.current;
      tl.to(
        canvas,
        {
          opacity: 1,
          duration: 10,
          ease: "power2.in",
        },
        time,
      );

      time += 30; // Let fireworks play

      // ENVELOPE APPEARS - Scale from 0 to 1 with elastic ease
      const envelope = envelopeRef.current;
      tl.fromTo(
        envelope,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 15,
          ease: "elastic.out(1, 0.5)",
        },
        time,
      );
    },
    { scope: containerRef },
  );

  // Fireworks Animation v2.0 - Advanced patterns
  React.useEffect(() => {
    if (!showFireworks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;
    const listFire = [];
    const listFirework = [];
    const lights = [];
    const range = 100;
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const fireNumber = 10;
    let fireTimer = 0;

    // Firework patterns
    const actions = [
      makeHeartFirework,
      makeFullCircleFirework,
      makeDoubleCircleFirework,
      makePlanetCircleFirework,
      makeCircleFirework,
    ];

    function randColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    }

    function makeCircleFirework(fire) {
      const color = randColor();
      const velocity = Math.random() * 2 + 6;
      const max = fireNumber * 5;
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
          ay: 0.04,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 2,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }
      return color;
    }

    function makeDoubleCircleFirework(fire) {
      let color = randColor();
      let velocity = Math.random() * 2 + 8;
      const max = fireNumber * 3;

      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
          ay: 0.04,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }

      color = randColor();
      velocity = Math.random() * 3 + 4;
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
          ay: 0.04,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }
      return color;
    }

    function makePlanetCircleFirework(fire) {
      const color = "#ff6b6b";
      const velocity = Math.random() * 2 + 4;
      let max = fireNumber * 2;

      // Inner ring
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
          ay: 0.04,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }

      // Particles
      max = fireNumber * 4;
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity * Math.random(),
          vy: Math.sin(rad) * velocity * Math.random(),
          ay: 0.04,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }

      // Ellipse ring
      max = fireNumber * 3;
      const ellipseColor = "#ffff99";
      const rotate = Math.random() * Math.PI * 2;
      const vx = velocity * (Math.random() + 2);
      const vy = velocity * 0.6;

      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const cx = Math.cos(rad) * vx + (Math.random() - 0.5) * 0.5;
        const cy = Math.sin(rad) * vy + (Math.random() - 0.5) * 0.5;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: ellipseColor,
          vx: cx * Math.cos(rotate) - cy * Math.sin(rotate),
          vy: cx * Math.sin(rotate) + cy * Math.cos(rotate),
          ay: 0.02,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }
      return color;
    }

    function makeFullCircleFirework(fire) {
      const color = randColor();
      const velocity = Math.random() * 8 + 8;
      let max = fireNumber * 3;

      // Outer ring
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
          ay: 0.06,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }

      // Inner fill
      max = fireNumber * Math.round(Math.random() * 4 + 4);
      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 1.5,
          fill: color,
          vx: Math.cos(rad) * velocity * Math.random(),
          vy: Math.sin(rad) * velocity * Math.random(),
          ay: 0.06,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }
      return color;
    }

    function makeHeartFirework(fire) {
      const color = "#ff1744";
      const velocity = Math.random() * 3 + 3;
      const max = fireNumber * 5;
      const rotate = Math.random() * Math.PI * 2;

      for (let i = 0; i < max; i++) {
        const rad = (i * Math.PI * 2) / max + rotate;
        let v, p;

        if (rad - rotate < Math.PI * 0.5) {
          p = (rad - rotate) / (Math.PI * 0.5);
          v = velocity + velocity * p;
        } else if (rad - rotate > Math.PI * 0.5 && rad - rotate < Math.PI) {
          p = (rad - rotate - Math.PI * 0.5) / (Math.PI * 0.5);
          v = velocity * (2 - p);
        } else if (rad - rotate > Math.PI && rad - rotate < Math.PI * 1.5) {
          p = (rad - rotate - Math.PI) / (Math.PI * 0.5);
          v = velocity * (1 - p);
        } else if (rad - rotate > Math.PI * 1.5 && rad - rotate < Math.PI * 2) {
          p = (rad - rotate - Math.PI * 1.5) / (Math.PI * 0.5);
          v = velocity * p;
        } else {
          v = velocity;
        }

        v = v + (Math.random() - 0.5) * 0.25;
        const firework = {
          x: fire.x,
          y: fire.y,
          size: Math.random() + 2,
          fill: color,
          vx: Math.cos(rad) * v,
          vy: Math.sin(rad) * v,
          ay: 0.02,
          alpha: 1,
          life: Math.round((Math.random() * range) / 2) + range / 1.5,
        };
        firework.base = { life: firework.life, size: firework.size };
        listFirework.push(firework);
      }
      return color;
    }

    // Initialize fires from bottom
    for (let i = 0; i < 5; i++) {
      const fire = {
        x: (Math.random() * range) / 2 - range / 4 + center.x,
        y: Math.random() * range * 2.5 + canvas.height,
        size: Math.random() + 0.5,
        fill: "#ff0",
        vx: Math.random() - 0.5,
        vy: -(Math.random() + 4),
        ax: Math.random() * 0.06 - 0.03,
        alpha: 1,
        far: Math.random() * range + (center.y - range),
      };
      listFire.push(fire);
    }

    function update() {
      // Update fires (rockets going up)
      for (let i = listFire.length - 1; i >= 0; i--) {
        const fire = listFire[i];
        if (fire.y <= fire.far) {
          // Explode
          const action = actions[Math.floor(Math.random() * actions.length)];
          const color = action(fire);

          // Add light effect
          lights.push({
            x: fire.x,
            y: fire.y,
            color: color,
            alpha: 0.03,
            radius: range * 2,
          });

          listFire.splice(i, 1);

          // Launch new fire
          setTimeout(
            () => {
              const newFire = {
                x: (Math.random() * range) / 2 - range / 4 + center.x,
                y: canvas.height + 100,
                size: Math.random() + 0.5,
                fill: "#ff0",
                vx: Math.random() - 0.5,
                vy: -(Math.random() + 4),
                ax: Math.random() * 0.06 - 0.03,
                alpha: 1,
                far: Math.random() * range * 0.5 + center.y - range,
              };
              listFire.push(newFire);
            },
            Math.random() * 1000 + 500,
          );
        } else {
          fire.x += fire.vx;
          fire.y += fire.vy;
          fire.vx += fire.ax;
        }
      }

      // Update fireworks
      for (let i = listFirework.length - 1; i >= 0; i--) {
        const firework = listFirework[i];
        firework.x += firework.vx;
        firework.y += firework.vy;
        firework.vy += firework.ay;
        firework.alpha = firework.life / firework.base.life;
        firework.size = firework.alpha * firework.base.size;
        firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
        firework.life--;

        if (firework.life <= 0) {
          listFirework.splice(i, 1);
        }
      }
    }

    function draw() {
      // Clear with fade
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 0.15;
      c.fillStyle = "#000003";
      c.fillRect(0, 0, canvas.width, canvas.height);

      // Draw
      c.globalCompositeOperation = "screen";

      // Draw fires
      for (let i = 0; i < listFire.length; i++) {
        const fire = listFire[i];
        c.globalAlpha = fire.alpha;
        c.beginPath();
        c.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
        c.closePath();
        c.fillStyle = fire.fill;
        c.fill();
      }

      // Draw fireworks
      for (let i = 0; i < listFirework.length; i++) {
        const firework = listFirework[i];
        c.globalAlpha = firework.alpha;
        c.beginPath();
        c.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
        c.closePath();
        c.fillStyle = firework.fill;
        c.fill();
      }

      // Light effects
      while (lights.length) {
        const light = lights.pop();
        const gradient = c.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          light.radius,
        );
        gradient.addColorStop(0, "#fff");
        gradient.addColorStop(0.2, light.color);
        gradient.addColorStop(0.8, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        c.globalAlpha = light.alpha ? light.alpha : 0.25;
        c.fillStyle = gradient;
        c.fillRect(
          light.x - light.radius,
          light.y - light.radius,
          light.radius * 2,
          light.radius * 2,
        );
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      update();
      draw();
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showFireworks]);

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom right, #FDF2F8, #FFF1F2, #FEF3C7)",
      }}
    >
      <div
        ref={containerRef}
        className="relative w-screen h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, #FDF2F8, #FFF1F2, #FEF3C7)",
        }}
      >
        {/* Main content container - centered */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-visible"
          style={{ zIndex: 1 }}
        >
          {/* Three Complete Flower Structures */}
          <svg
            ref={svgContainerRef}
            viewBox="0 0 800 1000"
            className="w-auto h-auto"
            style={{ maxWidth: "80vw", maxHeight: "90vh" }}
          >
            {/* FLOWER 1 - Left flower (complete structure) */}
            <g ref={flower1Ref} transform="translate(150, 250) scale(0.35)">
              {/* Stem */}
              <path
                ref={(el) => (flower1PartsRef.current[0] = el)}
                data-part="stem"
                d="M320.1289,1010c-9.3042,0-16.8335-7.5293-16.8335-16.833V623.3594c0-9.3047,7.5293-16.834,16.8335-16.834c9.3047,0,16.834,7.5293,16.834,16.834V993.167C336.9629,1002.4707,329.4336,1010,320.1289,1010z"
                fill="#37474F"
                stroke="#16a34a"
                strokeWidth="3"
              />
              {/* Petals */}
              <path
                ref={(el) => (flower1PartsRef.current[1] = el)}
                data-part="petal"
                d="M386.5908,850.4775c-46.374,50.2705-66.4619,142.6895-66.4619,142.6895s90.5283-27.3877,136.9355-77.6738c46.4229-50.2863,50.5333-86.3858,31.1016-104.3369C468.7363,793.2051,432.998,800.2246,386.5908,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower1PartsRef.current[2] = el)}
                data-part="petal"
                d="M253.6504,850.4775c46.3901,50.2705,66.4785,142.6895,66.4785,142.6895s-90.5449-27.3877-136.9678-77.6738c-46.3906-50.2863-50.5166-86.3858-31.0693-104.3369C171.5059,793.2051,207.2436,800.2246,253.6504,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower1PartsRef.current[3] = el)}
                data-part="petal"
                d="M386.5908,671.4922c-46.374,50.2695-66.4619,142.6885-66.4619,142.6885s90.5283-27.3868,136.9355-77.6563c46.4229-50.3027,50.5333-86.4189,31.1016-104.3867C468.7363,614.2187,432.998,621.2227,386.5908,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower1PartsRef.current[4] = el)}
                data-part="petal"
                d="M253.6504,671.4922c46.3901,50.2695,66.4785,142.6885,66.4785,142.6885s-90.5449-27.3868-136.9678-77.6563c-46.3906-50.3027-50.5166-86.4189-31.0693-104.3867C171.5059,614.2187,207.2436,621.2227,253.6504,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower1PartsRef.current[5] = el)}
                data-part="petal"
                d="M544.6504,225.6392c25.6445-36.9219,22.0117-87.9151-10.916-120.7598c-33.1407-33.1406-84.6924-36.4116-121.5645-10.1592c-7.8418-44.4175-46.5713-77.8867-93.2246-77.8867c-46.7847,0-85.646,34.0283-93.208,78.6924c-36.9707-25.5952-88.0298-21.9624-120.8906,10.9316c-33.4204,33.3711-36.4287,85.0547-9.5186,122.0088c-44.664,7.6279-78.4951,45.9468-78.4951,92.7642c0,46.9331,33.979,85.7778,78.6924,93.3725c-25.5786,36.8887-21.8799,87.9312,10.998,120.7925c33.1075,33.0908,84.6592,36.544,121.5811,10.2744c8.0713,44.253,46.7519,77.6895,93.1914,77.6895c46.8018,0,85.7285-33.9961,93.3398-78.6924c36.8389,25.5459,87.8975,21.9785,120.7764-10.9326c33.041-33.107,36.5264-84.7085,10.3398-121.6465c44.17-7.94,77.6729-46.6533,77.6729-93.0928C623.4248,272.062,589.3301,233.2007,544.6504,225.6392z"
                fill="#FFCA72"
                stroke="none"
              />
              {/* Center */}
              <path
                ref={(el) => (flower1PartsRef.current[6] = el)}
                data-part="center"
                d="M320.1455,472.5825c-84.1997,0-152.5361-68.2207-152.5361-152.4531c0-84.1997,68.2544-152.4536,152.4536-152.4536c84.2983,0,152.5522,68.2539,152.5522,152.4536C472.6152,404.3286,404.3613,472.5825,320.1455,472.5825z"
                fill="#FFFFFD"
                stroke="none"
              />
              {/* Outlines */}
              <path
                ref={(el) => (flower1PartsRef.current[7] = el)}
                data-part="outline"
                d="M320.1289,1010c-4.1753,0-8.2686-1.5615-11.4248-4.4717c-4.3731-4.0439-6.2964-10.1094-5.0303-15.9453c0.8711-3.9453,21.6328-97.499,70.5391-150.5137c32.9101-35.6396,63.3056-53.706,90.331-53.706c13.4141,0,25.5293,4.6367,35.0479,13.4306c11.1621,10.3077,41.9512,50.0069-30.166,128.1241c-48.9375,53.0322-140.5508,81.1913-144.4141,82.3584C323.4004,1009.7695,321.7559,1010,320.1289,1010z"
                fill="#37474F"
                stroke="none"
                opacity="0.5"
              />
              <path
                ref={(el) => (flower1PartsRef.current[8] = el)}
                data-part="outline"
                d="M320.1289,1010c-1.6274,0-3.2715-0.2305-4.8657-0.7236c-3.8799-1.1671-95.5098-29.3262-144.4644-82.3584c-72.1006-78.1494-41.2778-117.833-30.1323-128.1241c9.5015-8.7939,21.6167-13.4306,35.0308-13.4306c27.0254,0,57.4209,18.0664,90.3149,53.6894c48.9385,53.0313,69.7007,146.585,70.5718,150.5303c1.2656,5.8359-0.6572,11.9014-5.0303,15.9453C328.3975,1008.4385,324.3047,1010,320.1289,1010z"
                fill="#37474F"
                stroke="none"
                opacity="0.5"
              />
            </g>

            {/* FLOWER 2 - Right flower (complete structure) */}
            <g ref={flower2Ref} transform="translate(550, 300) scale(0.32)">
              {/* Stem */}
              <path
                ref={(el) => (flower2PartsRef.current[0] = el)}
                data-part="stem"
                d="M320.1289,1010c-9.3042,0-16.8335-7.5293-16.8335-16.833V623.3594c0-9.3047,7.5293-16.834,16.8335-16.834c9.3047,0,16.834,7.5293,16.834,16.834V993.167C336.9629,1002.4707,329.4336,1010,320.1289,1010z"
                fill="#37474F"
                stroke="#16a34a"
                strokeWidth="3"
              />
              {/* Petals */}
              <path
                ref={(el) => (flower2PartsRef.current[1] = el)}
                data-part="petal"
                d="M386.5908,850.4775c-46.374,50.2705-66.4619,142.6895-66.4619,142.6895s90.5283-27.3877,136.9355-77.6738c46.4229-50.2863,50.5333-86.3858,31.1016-104.3369C468.7363,793.2051,432.998,800.2246,386.5908,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower2PartsRef.current[2] = el)}
                data-part="petal"
                d="M253.6504,850.4775c46.3901,50.2705,66.4785,142.6895,66.4785,142.6895s-90.5449-27.3877-136.9678-77.6738c-46.3906-50.2863-50.5166-86.3858-31.0693-104.3369C171.5059,793.2051,207.2436,800.2246,253.6504,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower2PartsRef.current[3] = el)}
                data-part="petal"
                d="M386.5908,671.4922c-46.374,50.2695-66.4619,142.6885-66.4619,142.6885s90.5283-27.3868,136.9355-77.6563c46.4229-50.3027,50.5333-86.4189,31.1016-104.3867C468.7363,614.2187,432.998,621.2227,386.5908,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower2PartsRef.current[4] = el)}
                data-part="petal"
                d="M253.6504,671.4922c46.3901,50.2695,66.4785,142.6885,66.4785,142.6885s-90.5449-27.3868-136.9678-77.6563c-46.3906-50.3027-50.5166-86.4189-31.0693-104.3867C171.5059,614.2187,207.2436,621.2227,253.6504,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower2PartsRef.current[5] = el)}
                data-part="petal"
                d="M544.6504,225.6392c25.6445-36.9219,22.0117-87.9151-10.916-120.7598c-33.1407-33.1406-84.6924-36.4116-121.5645-10.1592c-7.8418-44.4175-46.5713-77.8867-93.2246-77.8867c-46.7847,0-85.646,34.0283-93.208,78.6924c-36.9707-25.5952-88.0298-21.9624-120.8906,10.9316c-33.4204,33.3711-36.4287,85.0547-9.5186,122.0088c-44.664,7.6279-78.4951,45.9468-78.4951,92.7642c0,46.9331,33.979,85.7778,78.6924,93.3725c-25.5786,36.8887-21.8799,87.9312,10.998,120.7925c33.1075,33.0908,84.6592,36.544,121.5811,10.2744c8.0713,44.253,46.7519,77.6895,93.1914,77.6895c46.8018,0,85.7285-33.9961,93.3398-78.6924c36.8389,25.5459,87.8975,21.9785,120.7764-10.9326c33.041-33.107,36.5264-84.7085,10.3398-121.6465c44.17-7.94,77.6729-46.6533,77.6729-93.0928C623.4248,272.062,589.3301,233.2007,544.6504,225.6392z"
                fill="#FFCA72"
                stroke="none"
              />
              {/* Center */}
              <path
                ref={(el) => (flower2PartsRef.current[6] = el)}
                data-part="center"
                d="M320.1455,472.5825c-84.1997,0-152.5361-68.2207-152.5361-152.4531c0-84.1997,68.2544-152.4536,152.4536-152.4536c84.2983,0,152.5522,68.2539,152.5522,152.4536C472.6152,404.3286,404.3613,472.5825,320.1455,472.5825z"
                fill="#FFFFFD"
                stroke="none"
              />
              {/* Outlines */}
              <path
                ref={(el) => (flower2PartsRef.current[7] = el)}
                data-part="outline"
                d="M320.1289,831.0146c-4.1753,0-8.2686-1.5615-11.4248-4.4716c-4.3731-4.044-6.2964-10.1094-5.0303-15.9453c0.8711-3.9454,21.6328-97.4991,70.5391-150.5137c32.9101-35.6563,63.3056-53.7227,90.3476-53.7227c13.3975,0,25.5127,4.6367,35.0137,13.3985c11.1797,10.3398,41.9688,50.0556-30.1318,128.1728c-48.9541,53.0313-140.5674,81.1914-144.4307,82.3584C323.4004,830.7842,321.7559,831.0146,320.1289,831.0146z"
                fill="#37474F"
                stroke="none"
                opacity="0.5"
              />
              <path
                ref={(el) => (flower2PartsRef.current[8] = el)}
                data-part="outline"
                d="M320.1289,831.0146c-1.6274,0-3.2715-0.2304-4.8657-0.7236c-3.8799-1.167-95.4932-29.3271-144.4644-82.3418c-72.084-78.167-41.2939-117.8662-30.1323-128.1738c9.5181-8.7774,21.6167-13.4141,35.0146-13.4141c27.0416,0,57.4371,18.0663,90.3311,53.7061c48.9385,53.0312,69.7007,146.5849,70.5718,150.5303c1.2656,5.8359-0.6572,11.9013-5.0303,15.9453C328.3975,829.4531,324.3047,831.0146,320.1289,831.0146z"
                fill="#37474F"
                stroke="none"
                opacity="0.5"
              />
            </g>

            {/* FLOWER 3 - Center flower (complete structure - TALLEST) */}
            <g ref={flower3Ref} transform="translate(350, 200) scale(0.4)">
              {/* Stem - longer for center flower */}
              <path
                ref={(el) => (flower3PartsRef.current[0] = el)}
                data-part="stem"
                d="M320.1289,1010c-9.3042,0-16.8335-7.5293-16.8335-16.833V623.3594c0-9.3047,7.5293-16.834,16.8335-16.834c9.3047,0,16.834,7.5293,16.834,16.834V993.167C336.9629,1002.4707,329.4336,1010,320.1289,1010z"
                fill="#37474F"
                stroke="#16a34a"
                strokeWidth="3"
              />
              {/* Petals */}
              <path
                ref={(el) => (flower3PartsRef.current[1] = el)}
                data-part="petal"
                d="M386.5908,850.4775c-46.374,50.2705-66.4619,142.6895-66.4619,142.6895s90.5283-27.3877,136.9355-77.6738c46.4229-50.2863,50.5333-86.3858,31.1016-104.3369C468.7363,793.2051,432.998,800.2246,386.5908,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower3PartsRef.current[2] = el)}
                data-part="petal"
                d="M253.6504,850.4775c46.3901,50.2705,66.4785,142.6895,66.4785,142.6895s-90.5449-27.3877-136.9678-77.6738c-46.3906-50.2863-50.5166-86.3858-31.0693-104.3369C171.5059,793.2051,207.2436,800.2246,253.6504,850.4775z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower3PartsRef.current[3] = el)}
                data-part="petal"
                d="M386.5908,671.4922c-46.374,50.2695-66.4619,142.6885-66.4619,142.6885s90.5283-27.3868,136.9355-77.6563c46.4229-50.3027,50.5333-86.4189,31.1016-104.3867C468.7363,614.2187,432.998,621.2227,386.5908,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower3PartsRef.current[4] = el)}
                data-part="petal"
                d="M253.6504,671.4922c46.3901,50.2695,66.4785,142.6885,66.4785,142.6885s-90.5449-27.3868-136.9678-77.6563c-46.3906-50.3027-50.5166-86.4189-31.0693-104.3867C171.5059,614.2187,207.2436,621.2227,253.6504,671.4922z"
                fill="#A6DDDD"
                stroke="none"
              />
              <path
                ref={(el) => (flower3PartsRef.current[5] = el)}
                data-part="petal"
                d="M544.6504,225.6392c25.6445-36.9219,22.0117-87.9151-10.916-120.7598c-33.1407-33.1406-84.6924-36.4116-121.5645-10.1592c-7.8418-44.4175-46.5713-77.8867-93.2246-77.8867c-46.7847,0-85.646,34.0283-93.208,78.6924c-36.9707-25.5952-88.0298-21.9624-120.8906,10.9316c-33.4204,33.3711-36.4287,85.0547-9.5186,122.0088c-44.664,7.6279-78.4951,45.9468-78.4951,92.7642c0,46.9331,33.979,85.7778,78.6924,93.3725c-25.5786,36.8887-21.8799,87.9312,10.998,120.7925c33.1075,33.0908,84.6592,36.544,121.5811,10.2744c8.0713,44.253,46.7519,77.6895,93.1914,77.6895c46.8018,0,85.7285-33.9961,93.3398-78.6924c36.8389,25.5459,87.8975,21.9785,120.7764-10.9326c33.041-33.107,36.5264-84.7085,10.3398-121.6465c44.17-7.94,77.6729-46.6533,77.6729-93.0928C623.4248,272.062,589.3301,233.2007,544.6504,225.6392z"
                fill="#FFCA72"
                stroke="none"
              />
              {/* Center */}
              <path
                ref={(el) => (flower3PartsRef.current[6] = el)}
                data-part="center"
                d="M320.1455,472.5825c-84.1997,0-152.5361-68.2207-152.5361-152.4531c0-84.1997,68.2544-152.4536,152.4536-152.4536c84.2983,0,152.5522,68.2539,152.5522,152.4536C472.6152,404.3286,404.3613,472.5825,320.1455,472.5825z"
                fill="#FFFFFD"
                stroke="none"
              />
              {/* Outlines - hidden for Flower 3 to prevent dark appearance */}
              <path
                ref={(el) => (flower3PartsRef.current[7] = el)}
                data-part="hidden-outline"
                d="M321.2959,640.1924c-46.1436,0-86.583-28.1592-103.3672-69.5029c-13.9238,6.082-28.998,9.2382-44.5322,9.2382c-29.7549,0-57.7334-11.5888-78.7754-32.6309c-32.6636-32.6475-41.376-81.1582-24-122.2061C28.6357,408.6685,0,368.0156,0,321.2305c0-46.2749,28.3398-86.5664,69.9795-103.0547c-18.5757-41.3438-10.3067-90.397,22.9648-123.6362c21.042-21.0582,49.0537-32.6475,78.8575-32.6475c15.0908,0,29.8037,2.9756,43.4311,8.7456C231.6226,28.6362,272.21,0,318.9453,0c46.374,0,86.8457,28.2256,103.4824,69.6514c13.9395-6.0826,29.0313-9.2388,44.5655-9.2388c29.7216,0,57.6513,11.5566,78.6435,32.5654c32.6797,32.5982,41.3594,81.0923,23.9346,122.1729c42.0342,16.4062,70.6865,57.0429,70.6865,103.8442c0,46.1929-28.1592,86.6157-69.4863,103.3013c18.0498,41.2944,9.5674,90.2485-23.4414,123.3237c-21.042,21.0752-49.0371,32.6807-78.8242,32.6807c-15.0918-0.0166-29.7715-2.9922-43.3829-8.7461C408.7012,611.5566,368.0478,640.1924,321.2959,640.1924z"
                fill="none"
                stroke="none"
                opacity="0"
              />
              <path
                ref={(el) => (flower3PartsRef.current[8] = el)}
                data-part="hidden-outline"
                d="M320.1455,489.416c-93.3892,0-169.3691-75.9473-169.3691-169.2866c0-93.3398,75.9472-169.2871,169.2866-169.2871c93.4057,0,169.3862,75.9473,169.3862,169.2871C489.4492,413.4687,413.5019,489.416,320.1455,489.416z"
                fill="none"
                stroke="none"
                opacity="0"
              />
            </g>
          </svg>
        </div>

        {/* Visitor - Bee that flies around - MUST BE OUTSIDE main container */}
        <div
          ref={visitorRef}
          className="absolute"
          style={{
            fontSize: "3rem",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            zIndex: 1001,
          }}
        >
          🐝
        </div>

        {/* Sky Background - scrolls down from top with gradient blend */}
        <div
          ref={skyBackgroundRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 500,
            background:
              "linear-gradient(to bottom, rgba(224, 247, 250, 0) 0%, rgba(224, 247, 250, 0.5) 20%, rgba(224, 247, 250, 0.8) 35%, #E0F7FA 50%, #B2EBF2 100%)",
          }}
        />

        {/* Cloud Layer - positioned for horizontal movement */}
        <div
          ref={cloudLayerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1000 }}
        >
          {/* Cloud 1 - Large left cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "10%", top: "20%", width: "300px", height: "150px" }}
            viewBox="0 0 300 150"
          >
            <path
              d="M40,100 Q20,80 40,60 Q50,40 70,40 Q80,20 110,20 Q140,20 150,40 Q180,40 200,50 Q220,60 220,80 Q240,90 230,110 Q220,120 200,120 Q190,130 170,130 H60 Q40,130 40,100Z"
              fill="white"
              opacity="0.95"
            />
          </svg>

          {/* Cloud 2 - Medium center cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "40%", top: "40%", width: "250px", height: "120px" }}
            viewBox="0 0 250 120"
          >
            <path
              d="M30,90 Q15,75 30,60 Q40,45 60,45 Q70,30 90,30 Q115,30 125,45 Q145,45 160,52 Q175,60 175,75 Q185,82 178,95 Q170,105 155,105 H50 Q30,105 30,90Z"
              fill="white"
              opacity="0.9"
            />
          </svg>

          {/* Cloud 3 - Large right cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "60%", top: "15%", width: "320px", height: "160px" }}
            viewBox="0 0 320 160"
          >
            <path
              d="M45,110 Q25,90 45,70 Q55,50 80,50 Q92,28 125,28 Q158,28 170,50 Q205,50 230,62 Q255,74 255,95 Q275,105 265,125 Q255,135 230,135 Q218,145 195,145 H70 Q45,145 45,110Z"
              fill="white"
              opacity="0.95"
            />
          </svg>

          {/* Cloud 4 - Small cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "25%", top: "55%", width: "200px", height: "100px" }}
            viewBox="0 0 200 100"
          >
            <path
              d="M25,75 Q12,62 25,50 Q33,38 50,38 Q58,25 75,25 Q95,25 103,38 Q118,38 130,45 Q142,52 142,65 Q152,72 146,82 Q140,90 128,90 H40 Q25,90 25,75Z"
              fill="white"
              opacity="0.85"
            />
          </svg>

          {/* Cloud 5 - Additional cloud for fuller sky */}
          <svg
            className="cloud absolute"
            style={{ left: "80%", top: "45%", width: "280px", height: "140px" }}
            viewBox="0 0 280 140"
          >
            <path
              d="M35,95 Q18,78 35,62 Q45,48 65,48 Q75,30 95,30 Q120,30 130,48 Q155,48 175,57 Q195,66 195,83 Q210,92 203,108 Q195,118 175,118 H55 Q35,118 35,95Z"
              fill="white"
              opacity="0.88"
            />
          </svg>

          {/* Cloud 6 - Top cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "50%", top: "8%", width: "240px", height: "110px" }}
            viewBox="0 0 240 110"
          >
            <path
              d="M28,82 Q14,70 28,58 Q36,47 52,47 Q60,32 78,32 Q98,32 106,47 Q125,47 142,54 Q158,61 158,75 Q168,82 162,93 Q156,101 142,101 H45 Q28,101 28,82Z"
              fill="white"
              opacity="0.92"
            />
          </svg>

          {/* Cloud 7 - Bottom cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "15%", top: "70%", width: "260px", height: "125px" }}
            viewBox="0 0 260 125"
          >
            <path
              d="M32,92 Q16,77 32,63 Q42,50 60,50 Q70,35 88,35 Q110,35 120,50 Q142,50 160,58 Q178,66 178,80 Q190,88 184,100 Q178,108 162,108 H50 Q32,108 32,92Z"
              fill="white"
              opacity="0.87"
            />
          </svg>

          {/* Cloud 8 - Additional mid cloud */}
          <svg
            className="cloud absolute"
            style={{ left: "70%", top: "60%", width: "220px", height: "105px" }}
            viewBox="0 0 220 105"
          >
            <path
              d="M26,80 Q13,68 26,56 Q34,45 48,45 Q56,32 72,32 Q90,32 98,45 Q114,45 128,51 Q142,57 142,69 Q151,75 146,85 Q141,92 128,92 H42 Q26,92 26,80Z"
              fill="white"
              opacity="0.83"
            />
          </svg>
        </div>

        {/* Sunset Overlay - Orange/Pink gradient */}
        <div
          ref={sunsetOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1100,
            opacity: 0,
            background:
              "linear-gradient(to bottom, #FF6B6B 0%, #FF8E53 30%, #FFA940 60%, #FFD93D 100%)",
          }}
        />

        {/* Night Overlay - Deep purple/black */}
        <div
          ref={nightOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1200,
            opacity: 0,
            background:
              "linear-gradient(to bottom, #1a0033 0%, #2D1B4E 40%, #0a0015 100%)",
          }}
        />

        {/* Fireworks Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            zIndex: 1300,
            opacity: 0,
          }}
        />

        {/* Envelope - appears at the end */}
        <div
          ref={envelopeRef}
          className="absolute"
          style={{
            zIndex: 1400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0,
            cursor: "pointer",
          }}
          onClick={() => setShowLetterModal(true)}
        >
          <svg width="200" height="150" viewBox="0 0 200 150">
            <defs>
              <linearGradient
                id="envelopeGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#FFE5B4", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#FFD580", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            {/* Envelope body */}
            <rect
              x="10"
              y="30"
              width="180"
              height="110"
              fill="url(#envelopeGradient)"
              stroke="#D4A574"
              strokeWidth="2"
              rx="5"
            />
            {/* Envelope flap */}
            <path
              d="M 10 30 L 100 80 L 190 30"
              fill="#FFD580"
              stroke="#D4A574"
              strokeWidth="2"
            />
            {/* Heart seal */}
            <path
              d="M 100 60 C 95 50, 80 50, 80 65 C 80 75, 100 85, 100 85 C 100 85, 120 75, 120 65 C 120 50, 105 50, 100 60 Z"
              fill="#FF6B6B"
            />
            {/* Shine effect */}
            <ellipse
              cx="70"
              cy="60"
              rx="15"
              ry="10"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
          <p
            className="text-white text-center mt-2"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem" }}
          >
            Click to Open
          </p>
        </div>

        {/* Horizontal Photo Gallery - Triggered by vertical scroll */}
        <div
          ref={galleryContainerRef}
          className="absolute top-0 h-full flex items-center pointer-events-none"
          style={{
            width: "5500px",
            zIndex: 1500,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 0,
          }}
        >
          {galleryData.map((item, index) => {
            const rotation = (Math.random() - 0.5) * 6; // Random -3° to +3°
            const isTop = item.position === "top";

            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${(5 - index) * 800 + 1000}px`, // Reversed order
                  top: isTop ? "25%" : "55%",
                  transform: `rotate(${rotation}deg) translateY(-50%)`,
                }}
              >
                {/* Polaroid Frame */}
                <div
                  className="bg-white p-5 pb-16 shadow-2xl"
                  style={{
                    width: "350px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Photo */}
                  <div className="w-full h-80 bg-gray-200 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#999",
                          fontFamily: "'Public Sans', sans-serif",
                          flexDirection: "column",
                          padding: "20px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                          📷
                        </div>
                        <div>Photo {item.id}</div>
                        <div style={{ fontSize: "12px", marginTop: "5px" }}>
                          Add photo{item.id}.jpg to /src/assets/gallery/
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <p
                    className="text-center mt-4 text-gray-700"
                    style={{
                      fontFamily: "'Public Sans', sans-serif",
                      fontSize: "14px",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Letter Modal */}
      {showLetterModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
          onClick={() => setShowLetterModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto m-4 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-3xl font-bold text-gray-800"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                A Letter For You
              </h2>
              <button
                onClick={() => setShowLetterModal(false)}
                className="text-gray-500 hover:text-gray-700 text-4xl font-light leading-none"
              >
                &times;
              </button>
            </div>
            <div
              className="text-gray-700 whitespace-pre-wrap leading-relaxed"
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: "16px",
                lineHeight: "1.8",
              }}
            >
              {letterText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
