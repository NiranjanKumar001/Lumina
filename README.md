# <p align="center">✨ LUMINA | SENSORY DIGITAL STUDIO ✨</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Syne&weight=700&size=28&duration=3000&pause=1000&color=1F1F1F&center=true&vCenter=true&width=500&lines=WE+ENGINEER+SENSORY;DIGITAL+EXPERIENCES;LUMINA+STUDIO" alt="Typing SVG" />
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" /></a>
  <a href="#"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" /></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=for-the-badge" alt="Lenis" /></a>
</p>

```text
      :::       :::    :::  :::   :::  ::::::::::: ::::    :::     :::     
     :+:       :+:    :+:  :+:+: :+:+:     :+:     :+:+:   :+:   :+: :+:   
    +:+       +:+    +:+ +:+ +:+:+ +:+    +:+     :+:+:+  +:+  +:+   +:+  
   +#+       +#+    ++# +#+  +:+  +#+    +#+     +#+ +:+ +#+ +#++:++#++: 
  +#+       +#+    +#+ +#+       +#+    +#+     +#+  +#+#+# +#+     +#+ 
 #+#       #+#    #+# #+#       #+#    #+#     #+#   #+#+# #+#     #+# 
##########  ########  ###       ############## ###    #### ###     ### 
                                                                     
               -- ＥＳＴ.  ２０２６  /  ＴＯＫＹＯ --
```

---

> [!NOTE]
> **Lumina** is a premium, high-performance landing page engineered for creative studios. It blends immersive typography, buttery-smooth kinetics, and high-fidelity 3D interaction into a unified frontend experience.

---

## ⚡ Key Animations & Features

### 🌀 3D Circular Slider Gallery
*   **Immersive Perspective**: A custom 3D wheel rendering gallery built using standard CSS 3D transforms, triggered seamlessly on demand.
*   **Double-Tap / Double-Click Activation**: Intentional activation model utilizing `dblclick` (desktop) and tap-latency tracking (mobile) to enter/exit the interactive viewer state.
*   **Continuous Physics-based Lerp**: Features a custom GSAP tick-lerp loop that interpolates swipe movements at 60fps/120fps, translating even micro-swipes into fluid, elastic slide transitions.

### 📱 Touchscreen Adaptability
*   **Smart Device Detection**: Automatically disables power-heavy mouse-bound operations (such as custom squashing cursors, 3D parallax hero tilts, and magnetic grid buttons) on mobile to preserve battery life and prevent interaction conflicts.
*   **Responsive Scaling**: Layout images seamlessly scale from premium large viewports (`260px` x `360px` on desktop) down to neat, optimized boundaries (`180px` x `250px` on mobile) using pure media queries.

### 🚀 Performance & Polishing
*   **Zero FOUC (Flash of Unstyled Content)**: Pre-initialized CSS states ensure all images start hidden at `scale(0)` and text containers load at `opacity: 0` before GSAP splits and orchestrates them.
*   **WebP Modern Compression**: Updated standard image links to `.webp` assets to ensure instant loading speeds on high-latency mobile networks.

---

## 🛠️ Local Development & Commands

Run a local server inside the workspace to preview changes:

### 1. Standalone Live Server
```bash
npx http-server -p 3000
```

### 2. Share with Mobile Devices (Host Network)
To test responsive swipe physics on your physical mobile phone, run the server bound to all local network interfaces:
```bash
npx http-server -a 0.0.0.0 -p 3000
```
Then open your mobile browser and enter your computer's local IP address:
```text
http://192.168.X.X:3000
```

---

## 📂 Project Structure
```text
Lumina/
├── index.html        # Responsive framework & DOM structure
├── styles.css        # Premium typography tokens & responsive layout overrides
├── script.js        # Core GSAP timelines, physics loop & touch mapping
├── video.mp4         # Immersive hero backdrop reel
└── img1.webp...      # Optimized webp creative project assets
```

---

<p align="center">
  <sub>Engineered with precision for premium sensory outputs. Lumina Creative.</sub>
</p>
