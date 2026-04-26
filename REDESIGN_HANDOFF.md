# REDESIGN HANDOFF — Home + Navbar + Footer

> Este documento es para que **Claude Code (CLI)** retome el rediseño del frontend desde donde quedó la sesión de Cowork. Léelo de principio a fin antes de tocar código.

---

## 1. Contexto

El usuario quiere rediseñar el frontend público de Arbora Hogar inspirándose en:
- https://mcalpinehouse.com/  (oscuro, moody, editorial casa-museo)
- https://radaville.studio/  (claro, etéreo, editorial whitespace)

**Dirección elegida:** **híbrido luz/oscuridad** — base clara editorial con dos secciones oscuras dramáticas (Manifiesto y Proceso). Mantener tokens de color existentes + cuatro tokens nuevos para superficies oscuras.

**Alcance:** Solo Home + Navbar + Footer. El resto del sitio (Proyectos, Detalle, Servicios, About, Contacto, Galería, Admin) no se toca.

**Mock visual de referencia:** `/Users/diego/Desktop/Proyectos_ongoing/ongoing_projects/WEB_Arbora_Design/mockup-home-redesign.html` — abrir en navegador para ver la dirección visual completa. Es la fuente de verdad para tipografía, ritmo, copy y composición.

---

## 2. Estado de tareas

### ✅ Completado
- [x] Tokens nuevos en `src/index.css` (`--color-inverse-surface`, `--color-inverse-surface-deep`, `--color-inverse-on-surface`, `--color-inverse-on-surface-muted`).
- [x] `src/components/layout/Navbar.jsx` — overlay pattern conservado, brand lowercase "arbora.", adaptación light/dark vía `IntersectionObserver` sobre `[data-nav-theme="dark"]`, glassmorphic al scroll.
- [x] `src/components/layout/Footer.jsx` — dark editorial (`#14130d`), grid 5/7, links con hover italic, marca el atributo `data-nav-theme="dark"`.

### ⏳ Bloqueado por assets del usuario
- [ ] **Fotos reales** — el usuario va a dejarlas en `arbora-hogar/public/`. Sugerencia: `public/hero/`, `public/projects/<slug>/`, `public/manifesto/`. Hasta que aparezcan, las secciones Hero, ProjectsGallery y Manifesto se mantienen con Unsplash placeholders.

### ⏳ Pendiente (orden recomendado)

Las secciones **NO dependientes de fotos** (puedes hacerlas YA):
1. `Intro.jsx` (nuevo) — sección [01] Estudio entre Hero y Projects.
2. `ServicesGrid.jsx` — rebuild a lista numerada editorial.
3. `ProcessSection.jsx` — refactor a dark 4-column timeline.
4. `TrustSection.jsx` — refactor con counters serif italic; **mover en `Home.jsx` después de Process**.
5. `CTAFinal.jsx` — oversized serif centrado.

Las secciones **dependientes de fotos** (esperar al usuario):
6. `Hero.jsx` — full-bleed cover con título 132px italic accents.
7. `ProjectsGallery.jsx` — grid asimétrico de 12 columnas (no horizontal scroll).
8. `Manifesto.jsx` (nuevo) — reemplaza `BudgetSection` en el Home. Dark `#14130d`, foto + quote serif italic.

### Limpieza final
- [ ] En `src/pages/Home.jsx`: eliminar import de `BudgetSection`, agregar `Intro` y `Manifesto`. NO borrar `BudgetSection.jsx` (queda disponible para uso futuro en otras páginas).
- [ ] Orden final del Home: `Hero → Intro → ProjectsGallery → Manifesto → ServicesGrid → ProcessSection → TrustSection → CTAFinal`.
- [ ] Correr `pnpm build` y resolver cualquier error.
- [ ] Smoke test en `pnpm dev`: scroll por todas las secciones y verificar que el Navbar invierte color sobre Hero, Manifesto, Process y Footer.

---

## 3. Patrones que DEBES reutilizar

Estos patrones ya están establecidos en Navbar/Footer. Replicarlos en cada sección nueva.

### 3.1 Brand mark
```jsx
<span className="font-serif font-light lowercase tracking-[0.04em]">
  arbora<span className="italic text-primary">.</span>
</span>
```
Lowercase, peso light, punto en itálica color primary. NUNCA "Arbora Hogar" en mayúsculas en el header/footer.

### 3.2 Atributo `data-nav-theme="dark"` en secciones oscuras
El Navbar tiene un `IntersectionObserver` que monitorea elementos con este atributo y se invierte automáticamente. Aplicarlo a:
- `<section data-nav-theme="dark">` en Manifesto, ProcessSection.
- `<header data-nav-theme="dark">` en Hero (cuando se haga).
- Ya está en el Footer.

### 3.3 Tipografía editorial
- **Headlines:** `font-serif font-light` (peso 300/400), nunca bold. Itálicas como acento sobre sustantivos clave.
- **Tamaños:** `clamp(36px, 5vw, 72px)` para H3 de sección, `clamp(48px, 8vw, 132px)` para CTA Final, `clamp(56px, 9vw, 132px)` para Hero.
- **Letter-spacing:** `tracking-[-0.01em]` o `-0.02em` en titulares grandes.
- **Labels:** `text-[10px] uppercase tracking-[0.32em]` en color `text-on-surface-variant` (light) o `text-inverse-on-surface-muted` (dark). Numerados como `[ 01 ] Estudio`, `[ 02 ] Proyectos`, etc.
- **Itálicas:** Cormorant carga con la familia. Aplicar en palabras clave dentro de headlines (`<em>respiran</em>`, `<em>seleccionados</em>`).

### 3.4 Color rules
- Fondo light de sección: `bg-surface` (default) o `bg-surface-container-low` para secciones que necesitan separación tonal.
- Fondo dark: `bg-[#14130d]` (deep, para Manifiesto y Footer) o `bg-[#1f1e16]` (Process). Usar el deep solo en secciones de "respiro".
- Texto sobre dark: `text-inverse-on-surface` (alta) o `text-inverse-on-surface-muted` (media).
- **Sin negro puro, sin shadows estándar, sin bordes 1px** salvo dividers horizontales muy sutiles (`border-on-surface/10` o `border-inverse-on-surface/15`).

### 3.5 Container y spacing
Reusar `.container-custom` (max-width 1400px, padding lateral 2rem) que ya existe en `index.css`.
Padding vertical de sección: `py-32 md:py-40` para secciones light grandes, `py-32 md:py-40` también para dark, `py-24` para Trust.

### 3.6 Animaciones
- Siempre `useGSAP` de `@gsap/react`, nunca `useEffect` para animaciones.
- Respetar `prefers-reduced-motion` (chequear con `window.matchMedia('(prefers-reduced-motion: reduce)').matches`).
- Patrón scroll: `ScrollTrigger` con `fade-in + translateY(30px → 0)`.
- Para texto: split por palabras y stagger.

---

## 4. Spec por sección pendiente

### 4.1 `src/components/home/Intro.jsx` (NUEVO)
```
[ 01 ] Estudio  |  Una práctica de interiorismo y arquitectura interior que entiende
                   el hogar como una conversación lenta entre material, luz y memoria.

(divider sutil)

párrafo descriptivo (max 520px, color on-surface-variant)  |  — Estudio Arbora (signature italic)
```
Grid 1fr/2fr arriba; 2fr/1fr abajo separado por `border-t border-on-surface/10`.

### 4.2 `src/components/home/ProjectsGallery.jsx` (REBUILD)
**Quitar el horizontal scroll actual.** Reemplazar con grid asimétrico de 12 columnas:
- p1: `col-span-7` aspect 4/5
- p2: `col-start-9 col-span-4` aspect 3/4 + `align-self-end pb-10`
- p3: `col-start-2 col-span-4` aspect 3/4 + `mt-10`
- p4: `col-start-7 col-span-6` aspect 16/11 + `-mt-15`
- p5: `col-start-3 col-span-8` aspect 16/9 + `mt-15`

Cada card: cover con `overflow-hidden`, `<img>` con `transition-transform duration-1000 ease-out` que escala 1.04 al hover. Meta debajo: serif title con italic accent (ej: "Residencia *Terra*") + project-num en italic small `(Las Condes — 2024)`.

CTA al final: `<a className="font-serif italic text-2xl border-b border-current pb-1">Ver todos los proyectos →</a>`

### 4.3 `src/components/home/Manifesto.jsx` (NUEVO)
- `<section data-nav-theme="dark" className="bg-[#14130d] text-inverse-on-surface py-40">`.
- Grid 5fr/4fr.
- Izquierda: foto vertical 4/5 ratio con filter `brightness(0.85) contrast(1.05)`.
- Derecha: label `[ 03 ] Manifiesto` + blockquote serif `clamp(28px, 3.4vw, 46px)` con palabra clave en italic `text-primary-container` + autor en uppercase tracked + nombre serif italic.

Quote sugerida: *"Una casa no se diseña, se afina. Como un instrumento — hasta que la luz, el silencio y la madera suenan en la misma nota."*

Atribución: "Filosofía del estudio · Arbora · 2018"

### 4.4 `src/components/home/ServicesGrid.jsx` (REBUILD a lista numerada)
**Quitar el grid de cards actual.** Reemplazar con `<div className="services-list">` que tenga:
- Header: 1fr/2fr con label `[ 04 ] Servicios` + H3 "Lo que *hacemos*, con cuidado."
- Lista con `border-top border-bottom on-surface/12`, cada fila grid `80px 2fr 3fr auto`:
  - service-num italic `01 / 06`
  - service-name serif con italic accent
  - service-desc 14px max 420px
  - flecha →
- Hover por fila: `bg-surface-container-low` + `pl-4 pr-4`.

Datos de los 6 servicios ya están en `src/data/services.js`, reutilizar.

### 4.5 `src/components/home/ProcessSection.jsx` (REFACTOR)
- `<section data-nav-theme="dark" className="bg-inverse-surface text-inverse-on-surface py-40">`.
- Header 1fr/2fr con label inverse + H3 "Cuatro etapas, *una conversación*."
- Grid 4 columnas, cada step:
  - `border-t border-inverse-on-surface/20 pt-7`
  - `<span className="font-serif italic text-sm text-inverse-on-surface-muted">01</span>`
  - h4 serif 28px
  - p 14px color `text-inverse-on-surface/70`

Pasos: Encuentro / Concepto / Diseño técnico / Obra (copy en el mock HTML).

### 4.6 `src/components/home/TrustSection.jsx` (REFACTOR + REORDER)
- Background: `bg-surface-container-low py-30`.
- Grid 4 columnas. Cada item:
  - label uppercase tracked
  - número serif `clamp(48px, 6vw, 84px) font-light leading-none` con la cifra en italic primary (ej: `+<em>120</em>`, `<em>4.9</em>/5`)
  - p 13px max 200px

Counters: animar con GSAP `gsap.to(target, { innerText: N, snap: 1, scrollTrigger: ... })`.

**IMPORTANTE:** Mover esta sección en `Home.jsx` para que aparezca **después** de ProcessSection, no antes (en el mock va: Process → Trust → CTAFinal).

### 4.7 `src/components/home/CTAFinal.jsx` (REFACTOR)
- `bg-surface py-50 text-center`.
- Label superior `[ 06 ] Comienza tu proyecto`.
- H2 serif `clamp(48px, 8vw, 132px) font-light leading-[0.95]`: "Cuéntanos sobre tu *casa*."
- Dos botones pill side-by-side:
  - Primary: `bg-on-surface text-surface px-9 py-4.5 rounded-full text-xs uppercase tracking-[0.32em]`, hover → `bg-primary`.
  - Secondary: `border border-on-surface/30 text-on-surface`, mismo padding, hover → fill on-surface.

---

## 5. Stack y reglas de código

- **React 18 + JavaScript** (NO TypeScript).
- **Tailwind v4** vía `@tailwindcss/vite`. Tokens en `@theme` block dentro de `index.css` (no hay `tailwind.config.js`).
- **GSAP 3** vía `@gsap/react` → `useGSAP`.
- **React Router v6**.
- Comentarios en **inglés**.
- Arrow functions, componentes funcionales.
- Un componente por archivo.
- Imágenes con `loading="lazy"` y dimensiones definidas.
- `pnpm build` debe pasar sin errores antes de dar por terminado.

Ver `CLAUDE.md` en la raíz para el resto de las reglas.

---

## 6. Cómo verificar que está todo bien

```bash
cd arbora-hogar
pnpm build      # Debe pasar sin errores ni warnings
pnpm dev
```

Smoke test manual:
1. Abrir `/` (Home) y hacer scroll completo.
2. El Navbar debe estar transparente al inicio, glassmorphic al scrollear, e invertir colores sobre Hero, Manifesto, Process, Footer.
3. Hover en links de Footer → italic + cambia a primary-container.
4. Click en hamburguesa → overlay fullscreen oscuro con tipografía serif oversized.
5. Click en una entrada del overlay → cierra overlay y navega.
6. Servicios: hover en cada fila debe extender el padding lateral.
7. Counters de Trust: deben animarse al entrar al viewport.

Si algo de esto falla, el rediseño no está completo.
