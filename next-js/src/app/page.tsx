"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    globalLenis: any;
  }
}

// Custom SplitText implementation to avoid requiring GSAP Club membership
class CustomSplitText {
  elements: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  chars: HTMLElement[] = [];

  constructor(target: any, options: { type?: string; linesClass?: string; charsClass?: string } = {}) {
    if (typeof target === 'string') {
      this.elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof HTMLElement) {
      this.elements = [target];
    } else if (target && target.length) {
      this.elements = Array.from(target);
    }

    const types = options.type || "lines";
    const doLines = types.includes("lines");
    const doChars = types.includes("chars");

    this.elements.forEach(el => {
      const originalText = el.textContent || "";
      el.innerHTML = ""; // Clear

      if (doLines) {
        const wordsArr = originalText.split(/\s+/);
        const tempContainer = document.createElement("div");
        tempContainer.style.display = "inline";
        tempContainer.style.whiteSpace = "normal";

        const wordSpans = wordsArr.map(w => {
          const s = document.createElement("span");
          s.textContent = w + " ";
          s.style.display = "inline-block";
          tempContainer.appendChild(s);
          return s;
        });

        el.appendChild(tempContainer);

        const linesMap = new Map<number, HTMLElement[]>();
        wordSpans.forEach(span => {
          const top = span.offsetTop;
          if (!linesMap.has(top)) {
            linesMap.set(top, []);
          }
          linesMap.get(top)!.push(span);
        });

        el.removeChild(tempContainer);

        linesMap.forEach((spans) => {
          const lineDiv = document.createElement("div");
          lineDiv.className = options.linesClass || "line";
          
          if (doChars) {
            spans.forEach(wordSpan => {
              const wordText = wordSpan.textContent || "";
              wordText.split("").forEach(c => {
                const charSpan = document.createElement("span");
                charSpan.className = options.charsClass || "char";
                if (c === " ") {
                  charSpan.innerHTML = "&nbsp;";
                } else {
                  charSpan.textContent = c;
                }
                lineDiv.appendChild(charSpan);
                this.chars.push(charSpan);
              });
            });
          } else {
            const lineText = spans.map(s => s.textContent).join("").trim();
            const innerSpan = document.createElement("span");
            innerSpan.textContent = lineText;
            lineDiv.appendChild(innerSpan);
          }
          
          el.appendChild(lineDiv);
          this.lines.push(lineDiv);
        });

      } else if (doChars) {
        originalText.split("").forEach(c => {
          const charSpan = document.createElement("span");
          charSpan.className = options.charsClass || "char";
          if (c === " ") {
            charSpan.innerHTML = "&nbsp;";
          } else {
            charSpan.textContent = c;
          }
          el.appendChild(charSpan);
          this.chars.push(charSpan);
        });
      }
    });
  }

  revert() {
    // Revert logic
  }
}

export default function Home() {
  useEffect(() => {
    // Register plugins
    gsap.registerPlugin(Flip, Draggable, ScrollTrigger);

    window.scrollTo(0, 0);

    const setupTextSplitting = () => {
      const textElements = document.querySelectorAll(
        ".hero h1, .hero h2, .hero p, .hero a:not(.cta a), .header h1, .site-info p, .hero-footer h2"
      );

      textElements.forEach((element) => {
        new CustomSplitText(element, {
          type: "lines",
          linesClass: "line",
        });

        const lines = element.querySelectorAll(".line");

        lines.forEach((line) => {
          const textContent = line.textContent;
          line.innerHTML = `<span>${textContent}</span>`;
        });

        gsap.set(element, { opacity: 1 });
      });
    };

    const createCounterDigits = () => {
      const counter1 = document.querySelector(".counter-1");
      if (counter1) {
        const num0 = document.createElement("div");
        num0.className = "num";
        num0.textContent = "0";
        counter1.appendChild(num0);

        const num1 = document.createElement("div");
        num1.className = "num num1offset1";
        num1.textContent = "1";
        counter1.appendChild(num1);
      }

      const counter2 = document.querySelector(".counter-2");
      if (counter2) {
        for (let i = 0; i <= 10; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = i === 1 ? "num num1offset2" : "num";
          numDiv.textContent = i === 10 ? "0" : String(i);
          counter2.appendChild(numDiv);
        }
      }

      const counter3 = document.querySelector(".counter-3");
      if (counter3) {
        for (let i = 0; i < 30; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = "num";
          numDiv.textContent = String(i % 10);
          counter3.appendChild(numDiv);
        }
        const finalNum = document.createElement("div");
        finalNum.className = "num";
        finalNum.textContent = "0";
        counter3.appendChild(finalNum);
      }
    };

    const animateCounter = (counter: HTMLElement | null, duration: number, delay = 0) => {
      if (!counter) return;
      const firstNum = counter.querySelector(".num");
      if (!firstNum) return;
      const numHeight = firstNum.clientHeight;
      const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;

      gsap.to(counter, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
      });
    };

    function animateImages() {
      const images = document.querySelectorAll(".img");
      images.forEach((img) => {
        img.classList.remove("animate-out");
      });

      const state = Flip.getState(images);
      images.forEach((img) => img.classList.add("animate-out"));

      const mainTimeline = gsap.timeline();
      mainTimeline.add(
        Flip.from(state, {
          duration: 1,
          stagger: 0.1,
          ease: "power3.inOut",
        })
      );

      images.forEach((img, index) => {
        const scaleTimeline = gsap.timeline();
        scaleTimeline
          .to(
            img,
            {
              scale: 2.5,
              duration: 0.45,
              ease: "power3.in",
            },
            0.025
          )
          .to(
            img,
            {
              scale: 1,
              duration: 0.45,
              ease: "power3.out",
            },
            0.5
          );

        mainTimeline.add(scaleTimeline, index * 0.1);
      });

      return mainTimeline;
    }

    // Run setup immediately
    setupTextSplitting();
    createCounterDigits();

    animateCounter(document.querySelector(".counter-3"), 2.5);
    animateCounter(document.querySelector(".counter-2"), 3);
    animateCounter(document.querySelector(".counter-1"), 2, 1.5);

    const tl = gsap.timeline();
    gsap.set(".img", { scale: 0 });

    tl.to(".hero-bg", {
      scaleY: "100%",
      duration: 3,
      ease: "power2.inOut",
      delay: 0.25,
    });

    tl.to(
      ".img",
      {
        scale: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power3.out",
      },
      "<"
    );

    tl.to(".counter", {
      opacity: 0,
      duration: 0.3,
      ease: "power3.out",
      delay: 0.3,
      onStart: () => {
        animateImages();
      },
    });

    tl.to(
      ".logo",
      {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      },
      "+=1.8"
    );

    tl.to(
      [".logo-name a span", ".links a span", ".links p span", ".cta a"],
      {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      },
      "<+=0.2"
    );

    tl.to(
      ".links",
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onStart: () => {
          initNavPill();
        }
      },
      "<"
    );

    tl.to(
      ".video-bg",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      [".header span", ".site-info span", ".hero-footer span"],
      {
        y: "0%",
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      },
      "<+=0.2"
    );

    tl.to(
      ".play-btn",
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "<"
    );

    tl.eventCallback("onComplete", () => {
      initInteractiveFeatures();
      initScrollAnimations();
    });

    // ----------------------------------------------------
    // Interactive & Scroll Animations
    // ----------------------------------------------------
    let mouseMoveHandler: any = null;
    let clockInterval: any = null;
    let lenisInstance: any = null;
    let tickerFollowerFn: any = null;
    let tickerSliderFn: any = null;
    let tickerLenisFn: any = null;
    let tickerMarqueeFn: any = null;

    const initInteractiveFeatures = () => {
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const cursor = document.querySelector(".custom-cursor");
      const follower = document.querySelector(".custom-cursor-follower");
      const followerText = follower ? follower.querySelector(".follower-text") : null;

      if (!isTouchDevice) {
        document.body.classList.add("custom-cursor-active");

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        mouseMoveHandler = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          gsap.set(cursor, { x: mouseX, y: mouseY });
        };
        window.addEventListener("mousemove", mouseMoveHandler);

        tickerFollowerFn = () => {
          const dt = 1.0 - Math.exp(-gsap.ticker.deltaRatio() * 0.12);
          const currentX = (gsap.getProperty(follower, "x") as number) || mouseX;
          const currentY = (gsap.getProperty(follower, "y") as number) || mouseY;

          const nextX = currentX + (mouseX - currentX) * dt;
          const nextY = currentY + (mouseY - currentY) * dt;

          const dx = nextX - currentX;
          const dy = nextY - currentY;
          const speed = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;

          const scaleX = 1 + Math.min(speed * 0.04, 0.4);
          const scaleY = 1 - Math.min(speed * 0.04, 0.25);

          gsap.set(follower, {
            x: nextX,
            y: nextY,
            rotation: angle,
            scaleX: scaleX,
            scaleY: scaleY
          });

          gsap.set(followerText, {
            rotation: -angle
          });
        };

        gsap.ticker.add(tickerFollowerFn);

        const setupHover = (selectors: string, bodyClass: string, text?: string) => {
          document.querySelectorAll(selectors).forEach((el) => {
            el.addEventListener("mouseenter", () => {
              document.body.classList.add(bodyClass);
              if (text && followerText) followerText.textContent = text;
            });
            el.addEventListener("mouseleave", () => {
              document.body.classList.remove(bodyClass);
              if (text && followerText) followerText.textContent = "drag";
            });
          });
        };

        setupHover("a, button, .magnetic", "hovering-link");
        setupHover(".img", "hovering-image", "zoom");

        document.querySelectorAll(".magnetic").forEach((el) => {
          el.addEventListener("mousemove", magneticMove);
          el.addEventListener("mouseleave", magneticLeave);

          function magneticMove(e: Event) {
            const mouseEvent = e as MouseEvent;
            const rect = el.getBoundingClientRect();
            const x = mouseEvent.clientX - (rect.left + rect.width / 2);
            const y = mouseEvent.clientY - (rect.top + rect.height / 2);
            gsap.to(el, {
              x: x * 0.35,
              y: y * 0.35,
              duration: 0.3,
              ease: "power2.out"
            });
          }

          function magneticLeave() {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)"
            });
          }
        });

        const tiltMove = (e: MouseEvent) => {
          const normX = (e.clientX / window.innerWidth) - 0.5;
          const normY = (e.clientY / window.innerHeight) - 0.5;
          gsap.to(".header, .site-info", {
            x: normX * 25,
            y: normY * 25,
            duration: 1,
            ease: "power2.out"
          });
        };
        window.addEventListener("mousemove", tiltMove);
      }

      let isZoomed = false;
      const viewer = document.querySelector(".fullscreen-viewer");
      const viewerContent = viewer?.querySelector(".viewer-content");
      const viewerTitle = viewer?.querySelector(".viewer-title");
      const viewerHelp = viewer?.querySelector(".viewer-help");
      const imagesContainer = document.querySelector(".images-container");
      const allImages = Array.from(document.querySelectorAll(".img")) as HTMLElement[];

      const IMAGE_TITLES = [
        "Clear Gaze", "Wild Essence", "Silent Canopy", "Ethereal Shadow", "Urban Oasis",
        "Serene Drift", "Crimson Peak", "Velvet Rhythm", "Rust Decadence", "Solar Wind",
        "Sublime Aura", "Golden Horizon", "Neon Dream", "Mystic Crest", "Arctic Silence"
      ];

      let sliderTargetProgress = 0;
      let sliderCurrentProgress = 0;

      const updateSliderPosition = (progress: number) => {
        if (!viewerTitle) return;
        const N = allImages.length;
        const halfN = N / 2;
        const R = Math.max(window.innerHeight * 0.9, 700);
        const angleStep = 24;

        allImages.forEach((img, idx) => {
          const diff = idx - progress;
          const offset = ((diff + halfN) % N + N) % N - halfN;
          const angle = offset * angleStep;
          const angleRad = angle * Math.PI / 180;
          const x = Math.sin(angleRad) * R;
          const y = (1 - Math.cos(angleRad)) * R;

          gsap.set(img, {
            x: x,
            y: y,
            rotation: angle,
            scale: 1 - Math.min(Math.abs(offset) * 0.08, 0.35),
            opacity: Math.max(1 - Math.abs(offset) * 0.35, 0),
            zIndex: Math.round(100 - Math.abs(offset)),
            pointerEvents: Math.abs(offset) < 0.5 ? "all" : "none"
          });
        });

        const roundedIndex = Math.round(progress);
        const wrappedIndex = (roundedIndex % N + N) % N;
        const targetTitle = IMAGE_TITLES[wrappedIndex] || "Creative Design";

        if (viewerTitle.textContent !== targetTitle) {
          gsap.killTweensOf(viewerTitle);
          gsap.set(viewerTitle, { y: 0, skewY: 0, opacity: 1 });

          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_#X?/*[]";
          const targetLength = targetTitle.length;
          const state = { progress: 0 };

          gsap.to(state, {
            progress: 1,
            duration: 0.3,
            ease: "power2.out",
            onUpdate: () => {
              let output = "";
              const decryptedCount = Math.floor(state.progress * targetLength);
              for (let i = 0; i < targetLength; i++) {
                if (i < decryptedCount) {
                  output += targetTitle[i];
                } else {
                  if (targetTitle[i] === " ") {
                    output += " ";
                  } else {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    output += randomChar;
                  }
                }
              }
              viewerTitle.textContent = output;
            },
            onComplete: () => {
              viewerTitle.textContent = targetTitle;
            }
          });
        }
      };

      tickerSliderFn = () => {
        if (!isZoomed) return;
        const diff = sliderTargetProgress - sliderCurrentProgress;
        if (Math.abs(diff) > 0.001) {
          sliderCurrentProgress += diff * 0.12;
          updateSliderPosition(sliderCurrentProgress);
        } else if (sliderCurrentProgress !== sliderTargetProgress) {
          sliderCurrentProgress = sliderTargetProgress;
          updateSliderPosition(sliderCurrentProgress);
        }
      };

      gsap.ticker.add(tickerSliderFn);

      const handleWheel = (e: WheelEvent) => {
        if (!isZoomed) return;
        e.preventDefault();
        const delta = Math.max(-0.5, Math.min(0.5, e.deltaY * 0.003));
        sliderTargetProgress += delta;
      };

      viewer?.addEventListener("wheel", handleWheel as any, { passive: false });

      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartProgress = 0;

      const handleDragStart = (e: any) => {
        if (!isZoomed) return;
        isDragging = true;
        const isTouch = e.touches && e.touches.length > 0;
        if (isTouch) {
          e.preventDefault();
          dragStartY = e.touches[0].clientY;
        } else {
          dragStartX = e.clientX;
        }
        dragStartProgress = sliderTargetProgress;
        document.body.classList.add("hovering-image");
        if (followerText) followerText.textContent = "spin";
      };

      const handleDragMove = (e: any) => {
        if (!isDragging || !isZoomed) return;
        const isTouch = e.touches && e.touches.length > 0;
        let deltaProgress = 0;
        if (isTouch) {
          e.preventDefault();
          const currentY = e.touches[0].clientY;
          const dy = currentY - dragStartY;
          deltaProgress = -dy / 200;
        } else {
          const currentX = e.clientX;
          const dx = currentX - dragStartX;
          deltaProgress = -dx / 250;
        }
        sliderTargetProgress = dragStartProgress + deltaProgress;
      };

      const handleDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove("hovering-image");
        if (followerText) followerText.textContent = "drag";
        sliderTargetProgress = Math.round(sliderTargetProgress);
      };

      viewerContent?.addEventListener("mousedown", handleDragStart);
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);

      viewerContent?.addEventListener("touchstart", handleDragStart, { passive: false });
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);

      allImages.forEach((img, idx) => {
        let lastTap = 0;
        const openSlider = (e?: any) => {
          if (e) e.preventDefault();
          if (isZoomed) return;
          isZoomed = true;

          const state = Flip.getState(allImages);
          allImages.forEach(image => {
            viewerContent?.appendChild(image);
          });

          if (window.globalLenis) window.globalLenis.stop();
          document.body.style.overflow = "hidden";
          viewer?.classList.add("active");

          sliderTargetProgress = idx;
          sliderCurrentProgress = idx;
          updateSliderPosition(idx);

          Flip.from(state, {
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.015,
            absolute: true,
            onComplete: () => {
              gsap.to([viewerTitle, viewerHelp], {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.5,
                ease: "power3.out"
              });
            }
          });

          document.body.classList.remove("hovering-image");
          document.body.classList.add("hovering-link");
          if (followerText) followerText.textContent = "close";
        };

        img.addEventListener("dblclick", openSlider);
        img.addEventListener("touchend", (e) => {
          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;
          if (tapLength > 0 && tapLength < 400) {
            openSlider(e);
          }
          lastTap = currentTime;
        });
      });

      const closeViewer = () => {
        if (!isZoomed) return;
        gsap.killTweensOf([viewerTitle, viewerHelp]);
        gsap.to([viewerTitle, viewerHelp], {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });

        const state = Flip.getState(allImages);
        allImages.forEach(img => {
          imagesContainer?.appendChild(img);
        });

        gsap.set(allImages, { clearProps: "all" });
        isZoomed = false;
        viewer?.classList.remove("active");

        Flip.from(state, {
          duration: 0.85,
          ease: "power3.inOut",
          absolute: true
        });

        document.body.classList.remove("hovering-link");
        if (followerText) followerText.textContent = "drag";

        if (window.globalLenis) window.globalLenis.start();
        document.body.style.overflow = "";
      };

      viewer?.querySelector(".viewer-bg")?.addEventListener("click", closeViewer);
      viewer?.querySelector(".viewer-close")?.addEventListener("click", closeViewer);
    };

    const initNavPill = () => {
      const linksContainer = document.querySelector(".links");
      if (!linksContainer) return;
      const activePill = linksContainer.querySelector(".nav-active-pill");
      const links = linksContainer.querySelectorAll("a");
      let isScrollingNav = false;

      const updatePill = (targetEl: HTMLElement) => {
        if (!targetEl || !activePill) return;
        const left = targetEl.offsetLeft;
        const width = targetEl.offsetWidth;
        gsap.to(activePill, {
          x: left,
          width: width,
          duration: 0.45,
          ease: "power3.out"
        });
      };

      const activeLink = (linksContainer.querySelector("a.active") || links[0]) as HTMLElement;
      if (activeLink) {
        gsap.set(activePill, {
          x: activeLink.offsetLeft,
          width: activeLink.offsetWidth
        });
      }

      links.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          isScrollingNav = true;
          links.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          updatePill(link as HTMLElement);

          const targetId = link.getAttribute("href");
          if (targetId && targetId !== "#") {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              if (window.globalLenis) {
                window.globalLenis.scrollTo(targetEl, {
                  duration: 1.5,
                  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  onComplete: () => {
                    isScrollingNav = false;
                  }
                });
              } else {
                targetEl.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                  isScrollingNav = false;
                }, 1000);
              }
            } else {
              isScrollingNav = false;
            }
          } else {
            isScrollingNav = false;
          }
        });

        const targetId = link.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            ScrollTrigger.create({
              trigger: targetSection,
              start: "top 50%",
              end: "bottom 50%",
              onToggle: (self) => {
                if (isScrollingNav) return;
                if (self.isActive) {
                  links.forEach(l => l.classList.remove("active"));
                  link.classList.add("active");
                  updatePill(link as HTMLElement);
                }
              }
            });
          }
        }
      });

      window.addEventListener("resize", () => {
        const currentActive = (linksContainer.querySelector("a.active") || links[0]) as HTMLElement;
        updatePill(currentActive);
      });
    };

    const initScrollAnimations = () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";

      const lenis = new Lenis();
      lenisInstance = lenis;
      window.globalLenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      
      tickerLenisFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerLenisFn);
      gsap.ticker.lagSmoothing(0);

      const marqueeContent = document.querySelector(".marquee-content");
      if (marqueeContent) {
        let marqueeProgress = 0;
        tickerMarqueeFn = () => {
          marqueeProgress -= 0.05;
          if (marqueeProgress <= -25) {
            marqueeProgress = 0;
          }
          gsap.set(marqueeContent, { xPercent: marqueeProgress });
        };
        gsap.ticker.add(tickerMarqueeFn);
      }

      document.querySelectorAll(".section-heading").forEach((sectionHeading) => {
        const headingText = sectionHeading.querySelector(".reveal-text") as HTMLElement;
        const headingFade = sectionHeading.querySelector(".reveal-fade") as HTMLElement;
        if (!headingText) return;

        const splitHeading = new CustomSplitText(headingText, { type: "lines,chars", linesClass: "overflow-hidden" });
        gsap.set(splitHeading.chars, { y: "110%", rotationZ: 5 });
        if (headingFade) gsap.set(headingFade, { opacity: 0, y: 20 });

        const tlHeading = gsap.timeline({ paused: true });
        tlHeading.to(splitHeading.chars, {
          y: "0%",
          rotationZ: 0,
          duration: 1,
          stagger: 0.02,
          ease: "power4.out"
        });
        if (headingFade) {
          tlHeading.to(headingFade, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
        }

        ScrollTrigger.create({
          trigger: sectionHeading,
          start: "top 80%",
          animation: tlHeading,
          toggleActions: "play none none reverse"
        });
      });

      gsap.utils.toArray(".work-item").forEach((item: any) => {
        const img = item.querySelector(".work-item-img");
        const nameH1 = item.querySelector(".work-item-name h1");
        if (!nameH1 || !img) return;

        const split = new CustomSplitText(nameH1, { type: "chars" });
        gsap.set(nameH1, { overflow: "hidden" });
        gsap.set(split.chars, { y: "150%" });

        const tlText = gsap.timeline({ paused: true });
        tlText.to(nameH1, {
          "--bg-scale": 1,
          duration: 0.7,
          ease: "power4.inOut"
        });
        tlText.to(split.chars, {
          y: "0%",
          duration: 0.8,
          stagger: 0.04,
          ease: "power4.out",
        }, "-=0.3");

        ScrollTrigger.create({
          trigger: nameH1,
          start: "top 85%",
          animation: tlText,
          toggleActions: "play none none reverse"
        });

        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "center center",
          scrub: true,
          animation: gsap.fromTo(img,
            { clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" }
          ),
        });

        ScrollTrigger.create({
          trigger: item,
          start: "center center",
          end: "bottom top",
          scrub: true,
          animation: gsap.fromTo(img,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
          ),
        });
      });

      const cards = document.querySelectorAll(".sticky-cards .card");
      if (cards.length > 0) {
        const totalCards = cards.length;
        const cardYOffset = 15;
        const cardScaleStep = 0.08;

        cards.forEach((card, i) => {
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50 + i * cardYOffset,
            scale: 1 - i * cardScaleStep,
            zIndex: totalCards - i,
          });
        });

        const tlCards = gsap.timeline({
          scrollTrigger: {
            trigger: ".sticky-cards",
            start: "top top",
            end: `+=${window.innerHeight * 3}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(".services-timeline .timeline-progress", { height: `${progress * 100}%` });
              let activeIndex = 0;
              if (progress < 0.25) activeIndex = 0;
              else if (progress < 0.58) activeIndex = 1;
              else if (progress < 0.90) activeIndex = 2;
              else activeIndex = 3;

              document.querySelectorAll(".services-sidebar .sidebar-pill").forEach((pill, i) => {
                pill.classList.toggle("active", i === activeIndex);
              });
              document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
                dot.classList.toggle("active", i === activeIndex);
              });
            }
          }
        });

        for (let i = 0; i < totalCards - 1; i++) {
          const stepLabel = `step-${i}`;
          tlCards.add(stepLabel);

          tlCards.to(cards[i], {
            yPercent: -220,
            rotationX: 35,
            scale: 0.9,
            ease: "power1.inOut",
            duration: 1
          }, stepLabel);

          for (let j = i + 1; j < totalCards; j++) {
            const behindIndex = j - i;
            const targetY = -50 + (behindIndex - 1) * cardYOffset;
            const targetScale = 1 - (behindIndex - 1) * cardScaleStep;
            tlCards.to(cards[j], {
              yPercent: targetY,
              scale: targetScale,
              ease: "power1.inOut",
              duration: 1
            }, stepLabel);
          }
        }

        const handleIndicatorClick = (index: number) => {
          const trigger = tlCards.scrollTrigger;
          if (trigger) {
            const scrollStart = trigger.start;
            const targetScroll = scrollStart + index * window.innerHeight;
            if (window.globalLenis) {
              window.globalLenis.scrollTo(targetScroll, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }
          }
        };

        document.querySelectorAll(".services-sidebar .sidebar-pill").forEach((pill, i) => {
          pill.setAttribute("style", "cursor: pointer");
          pill.addEventListener("click", () => handleIndicatorClick(i));
        });

        document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
          dot.setAttribute("style", "cursor: pointer");
          dot.addEventListener("click", () => handleIndicatorClick(i));
        });
      }

      const backToTopBtn = document.getElementById("back-to-top-btn");
      if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
          if (window.globalLenis) {
            window.globalLenis.scrollTo(0, {
              duration: 2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }

      const tokyoTimeEl = document.getElementById("tokyo-time");
      const londonTimeEl = document.getElementById("london-time");
      if (tokyoTimeEl && londonTimeEl) {
        const updateTimes = () => {
          const now = new Date();
          tokyoTimeEl.textContent = now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Tokyo",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
          londonTimeEl.textContent = now.toLocaleTimeString("en-US", {
            timeZone: "Europe/London",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
        };
        updateTimes();
        clockInterval = setInterval(updateTimes, 1000);
      }

      const dividerDots = document.querySelector(".section-intersection-divider .divider-dots");
      if (dividerDots) {
        gsap.to(dividerDots, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".section-intersection-divider",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    };

    return () => {
      if (mouseMoveHandler) window.removeEventListener("mousemove", mouseMoveHandler);
      if (clockInterval) clearInterval(clockInterval);
      if (tickerFollowerFn) gsap.ticker.remove(tickerFollowerFn);
      if (tickerSliderFn) gsap.ticker.remove(tickerSliderFn);
      if (tickerLenisFn) gsap.ticker.remove(tickerLenisFn);
      if (tickerMarqueeFn) gsap.ticker.remove(tickerMarqueeFn);
      if (lenisInstance) lenisInstance.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="custom-cursor-follower"><span className="follower-text">drag</span></div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="counter">
          <div className="counter-1 digit"></div>
          <div className="counter-2 digit"></div>
          <div className="counter-3 digit"></div>
        </div>

        <div className="images-container">
          <div className="img"><img src="/img1.webp" alt="" /></div>
          <div className="img"><img src="/img2.webp" alt="" /></div>
          <div className="img"><img src="/img3.webp" alt="" /></div>
          <div className="img"><img src="/img4.webp" alt="" /></div>
          <div className="img"><img src="/img5.webp" alt="" /></div>
          <div className="img"><img src="/img6.webp" alt="" /></div>
          <div className="img"><img src="/img7.webp" alt="" /></div>
          <div className="img"><img src="/img8.webp" alt="" /></div>
          <div className="img"><img src="/img9.webp" alt="" /></div>
          <div className="img"><img src="/img10.webp" alt="" /></div>
          <div className="img"><img src="/img11.webp" alt="" /></div>
          <div className="img"><img src="/img12.webp" alt="" /></div>
          <div className="img"><img src="/img13.webp" alt="" /></div>
          <div className="img"><img src="/img14.webp" alt="" /></div>
          <div className="img"><img src="/img15.webp" alt="" /></div>
        </div>

        <nav>
          <div className="logo-group">
            <div className="logo magnetic">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="50" r="20" fill="currentColor" />
              </svg>
            </div>
            <div className="logo-name magnetic">
              <a href="#">Aura</a>
            </div>
          </div>

          <div className="links">
            <div className="nav-active-pill"></div>
            <a href="#home" className="active">Home</a>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#studio">Studio</a>
          </div>

          <div className="cta magnetic">
            <a href="#">
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
              <span>Contact us</span>
            </a>
          </div>
        </nav>

        <div className="hero-main-content">
          <div className="header">
            <h1>We engineer high-end sensory digital experiences</h1>
          </div>

          <div className="site-info">
            <h2>An elite digital production studio collaborating with progressive brands globally.</h2>
            <div className="site-info-copy">
              <p>Interactive &amp; Visual Design</p>
              <p>EST. 2026 / TOKYO — LONDON</p>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <div className="play-btn">
            <svg viewBox="0 0 30 30" fill="currentColor">
              <path d="M6 6v20l16-10z" />
            </svg>
          </div>
          <h2>Play Showreel (0:58)</h2>
        </div>
      </section>

      {/* Selected Works Section */}
      <div className="scroll-sections" id="work">
        <div className="marquee-strip">
          <div className="marquee-content">
            <span>LUMINA • DIGITAL • STUDIO • TOKYO • LONDON • </span>
            <span>LUMINA • DIGITAL • STUDIO • TOKYO • LONDON • </span>
            <span>LUMINA • DIGITAL • STUDIO • TOKYO • LONDON • </span>
            <span>LUMINA • DIGITAL • STUDIO • TOKYO • LONDON • </span>
          </div>
        </div>

        <div className="section-heading">
          <h2 className="reveal-text">SELECTED <br/> WORKS</h2>
          <p className="reveal-fade">(05) RECENT PROJECTS</p>
        </div>

        <section className="work-item">
          <div className="work-item-img">
            <img src="/img1.webp" alt="" />
          </div>
          <div className="work-item-name">
            <h1>Lumina Agency</h1>
          </div>
        </section>

        <section className="work-item">
          <div className="work-item-img">
            <img src="/img2.webp" alt="" />
          </div>
          <div className="work-item-name">
            <h1>Noir &amp; Sens</h1>
          </div>
        </section>

        <section className="work-item">
          <div className="work-item-img">
            <img src="/img3.webp" alt="" />
          </div>
          <div className="work-item-name">
            <h1>Quantum Dex</h1>
          </div>
        </section>

        <section className="work-item">
          <div className="work-item-img">
            <img src="/img4.webp" alt="" />
          </div>
          <div className="work-item-name">
            <h1>Nova Architects</h1>
          </div>
        </section>

        <section className="work-item">
          <div className="work-item-img">
            <img src="/img5.webp" alt="" />
          </div>
          <div className="work-item-name">
            <h1>Cybernetic Dreams</h1>
          </div>
        </section>
      </div>

      {/* Section Divider */}
      <div className="section-intersection-divider" id="services">
        <div className="divider-dots"></div>
        <div className="section-heading">
          <h2 className="reveal-text">SERVICES &amp;<br/>EXPERTISE</h2>
          <p className="reveal-fade">(06) WHAT WE DO</p>
        </div>
      </div>

      {/* Services Section */}
      <section className="sticky-cards">
        <div className="services-bg-pattern"></div>

        {/* Left Floating Index */}
        <div className="services-sidebar">
          <div className="sidebar-pill active">01</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">02</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">03</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">04</div>
        </div>

        {/* Right Floating Progress Timeline */}
        <div className="services-timeline">
          <div className="timeline-track">
            <div className="timeline-progress"></div>
            <div className="timeline-dots-container">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        {/* Card 1 */}
        <div className="card" id="card-1">
          <div className="card-header">
            <h1>Creative Brand Strategy</h1>
            <div className="card-index">(01)</div>
          </div>
          
          <p className="card-desc">
            We clarify your positioning, define a distinctive brand tone of voice, and build visual systems that work seamlessly across digital products and global campaigns.
          </p>

          <div className="card-details">
            <div className="card-testimonial">
              <blockquote>
                &quot;The rebranding completely redefined how our brand was perceived by investors. The attention to typography and motion was outstanding.&quot;
              </blockquote>
              <div className="testimonial-author">
                <img src="/img5.webp" alt="Elena Rostova" />
                <div className="author-info">
                  <span className="name">Elena Rostova</span>
                  <span className="role">CEO at Vektor</span>
                </div>
              </div>
            </div>

            <div className="card-gallery">
              <div className="gallery-item">
                <img src="/img1.webp" alt="Showcase 1" />
              </div>
              <div className="gallery-item">
                <img src="/img6.webp" alt="Showcase 2" />
              </div>
              <div className="gallery-item">
                <img src="/img7.webp" alt="Showcase 3" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" id="card-2">
          <div className="card-header">
            <h1>Interactive Development</h1>
            <div className="card-index">(02)</div>
          </div>
          
          <p className="card-desc">
            We design and code bespoke digital interfaces with smooth scroll, fluid WebGL effects, high-performance interactions, and rich animations.
          </p>

          <div className="card-details">
            <div className="card-testimonial">
              <blockquote>
                &quot;Their technical prowess in GSAP and WebGL transformed our design system into an immersive digital journey. Unmatched expertise.&quot;
              </blockquote>
              <div className="testimonial-author">
                <img src="/img8.webp" alt="Marcus Thorne" />
                <div className="author-info">
                  <span className="name">Marcus Thorne</span>
                  <span className="role">Head of Tech at Aether</span>
                </div>
              </div>
            </div>

            <div className="card-gallery">
              <div className="gallery-item">
                <img src="/img2.webp" alt="Showcase 1" />
              </div>
              <div className="gallery-item">
                <img src="/img9.webp" alt="Showcase 2" />
              </div>
              <div className="gallery-item">
                <img src="/img10.webp" alt="Showcase 3" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" id="card-3">
          <div className="card-header">
            <h1>Cinematic Motion Design</h1>
            <div className="card-index">(03)</div>
          </div>
          
          <p className="card-desc">
            We craft high-fidelity showreels, cinematic 3D renders, and scroll-triggered micro-interactions that tell a powerful brand narrative.
          </p>

          <div className="card-details">
            <div className="card-testimonial">
              <blockquote>
                &quot;The motion design assets gave our launch campaign a cinematic polish. User engagement soared by 140%.&quot;
              </blockquote>
              <div className="testimonial-author">
                <img src="/img11.webp" alt="Aiko Tanaka" />
                <div className="author-info">
                  <span className="name">Aiko Tanaka</span>
                  <span className="role">Creative Director at Sora</span>
                </div>
              </div>
            </div>

            <div className="card-gallery">
              <div className="gallery-item">
                <img src="/img3.webp" alt="Showcase 1" />
              </div>
              <div className="gallery-item">
                <img src="/img12.webp" alt="Showcase 2" />
              </div>
              <div className="gallery-item">
                <img src="/img13.webp" alt="Showcase 3" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" id="card-4">
          <div className="card-header">
            <h1>Strategic Web Experience</h1>
            <div className="card-index">(04)</div>
          </div>
          
          <p className="card-desc">
            We combine performance optimizations, SEO-first architectures, and conversion-focused UI design to turn traffic into lasting client success.
          </p>

          <div className="card-details">
            <div className="card-testimonial">
              <blockquote>
                &quot;Not only is the site visually stunning, but the conversion rate jumped overnight. A true conversion-driven design agency.&quot;
              </blockquote>
              <div className="testimonial-author">
                <img src="/img14.webp" alt="David Chen" />
                <div className="author-info">
                  <span className="name">David Chen</span>
                  <span className="role">Growth Lead at Helix</span>
                </div>
              </div>
            </div>

            <div className="card-gallery">
              <div className="gallery-item">
                <img src="/img4.webp" alt="Showcase 1" />
              </div>
              <div className="gallery-item">
                <img src="/img15.webp" alt="Showcase 2" />
              </div>
              <div className="gallery-item">
                <img src="/img5.webp" alt="Showcase 3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outro Section */}
      <section className="outro" id="studio">
        <div className="outro-grid"></div>
        <div className="outro-mesh"></div>

        <div className="outro-content">
          <p className="outro-tagline">READY TO COLLABORATE?</p>
          <div className="outro-cta-wrapper">
            <a href="mailto:hello@lumina.studio" className="outro-cta magnetic">
              <span>Let&apos;s Create</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
          
          <div className="outro-scroll-top magnetic" id="back-to-top-btn">
            <span className="arrow-up">↑</span>
            <span className="text">Back to base</span>
          </div>
        </div>

        <div className="outro-footer">
          <div className="footer-col">
            <h4>LOCATIONS</h4>
            <div className="time-item">
              <span>TOKYO</span>
              <span className="time-val" id="tokyo-time">00:00 AM</span>
            </div>
            <div className="time-item">
              <span>LONDON</span>
              <span className="time-val" id="london-time">00:00 AM</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>CONNECT</h4>
            <div className="social-links">
              <a href="#" className="hover-underline">Instagram</a>
              <a href="#" className="hover-underline">Behance</a>
              <a href="#" className="hover-underline">Twitter</a>
              <a href="#" className="hover-underline">LinkedIn</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>STUDIO</h4>
            <p className="est-text">EST. 2026 / SHIBUYA-TOKYO</p>
            <p className="copy-text">© 2026 LUMINA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </section>

      {/* Fullscreen Slider Viewer */}
      <div className="fullscreen-viewer">
        <div className="viewer-bg"></div>
        <div className="viewer-content"></div>
        <div className="viewer-info">
          <div className="viewer-title">Clear Gaze</div>
          <div className="viewer-help">Scroll or drag to explore</div>
        </div>
        <button className="viewer-close magnetic">
          <span>Close</span>
        </button>
      </div>
    </>
  );
}
