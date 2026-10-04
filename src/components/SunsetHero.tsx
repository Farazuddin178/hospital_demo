"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Homepage hero with an animated sunset behind the content: a sky gradient, a
 * sun that rises a little on load, slow clouds, and three ridges of hills that
 * shift with the pointer for depth. Original work, inspired by the "Sunset 3D"
 * look; drawn with a single WebGL fragment shader (no Three.js) and animated
 * with GSAP.
 *
 * Performance and accessibility:
 * - The CSS gradient on the section (.bg-sunset) paints on the first frame and
 *   is what visitors see before the canvas starts, or if WebGL is unavailable.
 * - WebGL starts only once the browser is idle after the first paint, and
 *   GSAP loads after that in its own chunk, so neither delays the headline.
 * - Drawing stops while the hero is off screen.
 * - With "reduce motion" turned on, one still frame is drawn and nothing moves.
 * - Light and dark mode each get their own palette (dawn and dusk).
 */

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uRise;
uniform float uDark;
uniform vec2 uPointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
  float px = 1.5 / uRes.y;
  float horizon = 0.20;

  // Sky: dawn in light mode, dusk in dark mode.
  vec3 low = mix(vec3(0.97, 0.76, 0.62), vec3(0.62, 0.30, 0.24), uDark);
  vec3 mid = mix(vec3(0.99, 0.90, 0.83), vec3(0.24, 0.16, 0.26), uDark);
  vec3 top = mix(vec3(0.90, 0.94, 0.97), vec3(0.05, 0.08, 0.13), uDark);
  float t = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 col = mix(low, mid, smoothstep(0.0, 0.35, t));
  col = mix(col, top, smoothstep(0.30, 0.95, t));

  // Sun, right of centre so it never sits behind the headline.
  // On narrow (phone) screens it rises less, staying low by the hills instead
  // of behind the search suggestions.
  vec2 sun = vec2(min(0.34 * aspect, 0.62), horizon + 0.02 + 0.09 * uRise * min(aspect, 1.0));
  sun.x += uPointer.x * 0.01;
  float d = length(p - sun);
  vec3 sunCol = mix(vec3(1.0, 0.80, 0.56), vec3(1.0, 0.66, 0.42), uDark);
  vec3 glowCol = mix(vec3(1.0, 0.72, 0.50), vec3(0.95, 0.45, 0.30), uDark);
  col += glowCol * (exp(-d * 5.0) * 0.35 + exp(-d * 16.0) * 0.30);
  col = mix(col, sunCol, smoothstep(0.062, 0.058, d));

  // Clouds: thin bands drifting slowly, lit from the sun's side.
  float c = fbm(vec2(p.x * 1.4 + uTime * 0.010 + uPointer.x * 0.02, p.y * 6.0));
  float band = smoothstep(horizon + 0.10, horizon + 0.30, uv.y) * (1.0 - smoothstep(0.62, 0.86, uv.y));
  float cloud = smoothstep(0.56, 0.80, c) * band;
  vec3 cloudCol = mix(vec3(1.0, 0.96, 0.93), vec3(0.42, 0.26, 0.33), uDark) + glowCol * exp(-d * 3.0) * 0.15;
  col = mix(col, cloudCol, cloud * 0.55);

  // Three ridges of hills, far to near. Nearer ridges move more with the
  // pointer, which reads as depth.
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float shift = uPointer.x * (0.015 + 0.03 * fi) + uTime * 0.002 * (fi + 1.0);
    float h = horizon + 0.04 - fi * 0.055
            + (0.07 + 0.025 * fi) * (fbm(vec2((p.x + shift) * (1.1 + 0.45 * fi) + fi * 7.3, fi * 3.1)) - 0.5);
    vec3 farL = vec3(0.86, 0.84, 0.88), nearL = vec3(0.74, 0.79, 0.86);
    vec3 farD = vec3(0.24, 0.15, 0.22), nearD = vec3(0.08, 0.09, 0.14);
    vec3 hill = mix(mix(farL, nearL, fi / 2.0), mix(farD, nearD, fi / 2.0), uDark);
    // Haze: the far ridge takes on the sky colour near the sun.
    hill = mix(hill, low, (1.0 - fi / 2.0) * 0.25);
    col = mix(col, hill, smoothstep(h + px, h - px, uv.y));
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export default function SunsetHero({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let stop = () => {};
    const start = () => {
      stop = startScene(section, canvas);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => {
        window.cancelIdleCallback(id);
        stop();
      };
    }
    const id = setTimeout(start, 300);
    return () => {
      clearTimeout(id);
      stop();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-sunset relative isolate overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
      />
      {children}
    </section>
  );
}

/** Sets up WebGL and the animation. Returns a function that tears it all down. */
function startScene(section: HTMLElement, canvas: HTMLCanvasElement): () => void {
  {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return () => {}; // The CSS gradient stays as the background.

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return () => {};
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
    gl.useProgram(program);

    // One triangle that covers the whole canvas.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      rise: gl.getUniformLocation(program, "uRise"),
      dark: gl.getUniformLocation(program, "uDark"),
      pointer: gl.getUniformLocation(program, "uPointer"),
    };

    // Animated values live here, outside React state, so nothing re-renders.
    const isDark = () => document.documentElement.classList.contains("dark");
    const state = { rise: 0, dark: isDark() ? 1 : 0, px: 0, py: 0, time: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) state.rise = 1;

    function resize() {
      // Soft, low-detail imagery: 1.5x pixel density is plenty.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { width, height } = section!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw() {
      gl!.uniform2f(u.res, canvas!.width, canvas!.height);
      gl!.uniform1f(u.time, state.time);
      gl!.uniform1f(u.rise, state.rise);
      gl!.uniform1f(u.dark, state.dark);
      gl!.uniform2f(u.pointer, state.px, state.py);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    resize();
    draw();
    canvas.dataset.ready = "true"; // Fades the canvas in over the CSS gradient.

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(section);

    // Theme switches redraw with the other palette.
    const themeObserver = new MutationObserver(() => {
      state.dark = isDark() ? 1 : 0;
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let cleanupMotion = () => {};
    let cancelled = false;

    if (!reduceMotion) {
      import("gsap").then(({ gsap }) => {
        if (cancelled) return;

        const ctx = gsap.context(() => {
          // The sun rises once, then the scene keeps drifting gently.
          gsap.to(state, { rise: 1, duration: 3.2, ease: "power2.out" });

          // Content settles in after the sky. The headline only moves (no fade),
          // so it still counts as painted on the first frame.
          gsap.from(section.querySelectorAll("[data-hero-rise]"), {
            y: 18,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.08,
          });
          gsap.from(section.querySelectorAll("[data-hero-fade]"), {
            opacity: 0,
            y: 12,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.25,
          });
        }, section);

        // Pointer parallax, eased by GSAP rather than tracked in React state.
        const toX = gsap.quickTo(state, "px", { duration: 1.4, ease: "power3.out" });
        const toY = gsap.quickTo(state, "py", { duration: 1.4, ease: "power3.out" });
        function onPointerMove(e: PointerEvent) {
          const rect = section!.getBoundingClientRect();
          toX(((e.clientX - rect.left) / rect.width - 0.5) * 2);
          toY(((e.clientY - rect.top) / rect.height - 0.5) * 2);
        }
        section.addEventListener("pointermove", onPointerMove);

        // GSAP's ticker drives the redraw. It only runs while the hero is visible.
        let last = 0;
        function tick(time: number) {
          // ~30 frames a second is smooth for motion this slow, and halves GPU work.
          if (time - last < 1 / 31) return;
          last = time;
          state.time = time;
          draw();
        }
        let running = false;
        const visibility = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !running) gsap.ticker.add(tick);
          if (!entry.isIntersecting && running) gsap.ticker.remove(tick);
          running = entry.isIntersecting;
        });
        visibility.observe(section);

        cleanupMotion = () => {
          visibility.disconnect();
          gsap.ticker.remove(tick);
          section.removeEventListener("pointermove", onPointerMove);
          ctx.revert();
        };
      });
    }

    return () => {
      cancelled = true;
      cleanupMotion();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }
}
