# AI agent prompts: Upload Dropzone

Paste one of these into your coding agent (Cursor, Claude Code, Windsurf, v0, Lovable). Open this folder in the agent first so it can read the files.

Next.js App Router ready ('use client' included), React 18/19, Tailwind v3/v4. In a Next.js app, put the files under `components/` and import them from any page.

---

## Prompt 1: add it to my project with real uploads

```
Add the "Upload Dropzone" from this folder to my project and connect it to my real upload endpoint.

Source of truth: react/src/components/UploadDropzone.tsx and react/src/components/upload-dropzone.css (React + TypeScript + Framer Motion). If my project is not React, port html/upload-dropzone.html instead and replace the simulated tick() with real progress.

Steps:
1. Look at my stack and find how files are uploaded today (an API route, presigned S3/R2 URLs, Supabase Storage, UploadThing...). Ask me if there's nothing yet.
2. Copy UploadDropzone.tsx and upload-dropzone.css into my components folder. Install framer-motion@11.18.2 if it's missing.
3. Write an `upload(file, onProgress, signal)` function for my backend. Use XMLHttpRequest (or the SDK's progress callback) so onProgress gets real numbers. Reject with a short readable message on failure. Abort on signal.
4. Put <UploadDropzone upload={upload} /> on the page I name. Set maxSize and accept from my server's real limits.
5. Use onAllDone to enable whatever comes next (save, publish, continue).
6. Run my type-check and build.

Done when: the build passes, the console is clean, dropping or picking files uploads them for real with live rings, a failed upload shows my error and Retry works, the browse button opens the picker from the keyboard, and files over the limit say "Too large". Tell me which files you changed.
```

---

## Prompt 2: restyle it to my brand

```
Restyle the Upload Dropzone (react/src/components/upload-dropzone.css) to my design system.

1. Read my tokens and fonts.
2. Map the variables at the top of the file to mine: --volt (drag-over border, rings, total bar), --err, --panel, --line, --line2, --text, --muted, --faint. Change colours only through these variables.
3. Change the file type colours in TYPES inside UploadDropzone.tsx to fit my palette, and the title/hint/chips props to my copy.
4. Keep the motion (fly-in arc, shockwave, ring check) unless I ask. Keep focus rings, 44 px buttons and the Reduce Motion block.

Show me screenshots of the empty zone, the drag-over state, rows mid-upload with one failed, and all done, at 1280 px and 390 px.
```

---

## Prompt 3: port it to another framework

```
Rebuild the Upload Dropzone in the framework my project uses (Vue 3 with <script setup>, Svelte 5, or a vanilla Web Component). Ask me if you can't tell. No UI libraries.

What it is:
- A drop zone (a clickable div) with a real "browse your computer" <button> inside as the keyboard path; both open a hidden <input type="file" multiple>. Its border is an SVG rect with stroke-dasharray 10 9 whose dashoffset marches (1.6 s loop). At rest the zone breathes (background and a faint violet glow, 3.6 s).
- Drag-over (window dragenter/dragover/dragleave/drop, only accept inside the zone): zone scales to 1.025 on a spring, border turns lime and marches faster (0.45 s), a radial glow follows the cursor (--mx/--my), the icon tile jumps up, scales 1.12, tilts -6deg and turns lime, and the title reads "Release to upload N files".
- Drop: a lime ring expands 9x from the drop point in 0.7 s. Each file becomes a row in the list and flies in from the drop point: translate from the drop point, scale .3, rotate ±(8 + 3i) deg, through a point 30 px above, to its slot, 0.76 s, 95 ms stagger (Web Animations API with fill backwards).
- Each row: a type badge coloured by extension, name, "1.6 MB of 4.2 MB", and a 44 px SVG progress ring (pathLength 100) with the percent inside. At 100% a lime disc scales in with overshoot, a dark check draws (pathLength 1), and 14 sparks burst from the ring. On failure the row turns red, shakes (±6 px, 0.45 s), the ring becomes a Retry button. Remove buttons abort and slide the row out.
- A total bar on top weighted by bytes, with a moving shimmer, "Uploading · 2 of 4 done", "1 failed", then "4 files ready" with a glow.
- Uploads go through an injectable upload(file, onProgress, signal) function; simulate when none is given.
- progressbar roles with values, a polite live region, 44 px targets, visible focus, a Reduce Motion fallback (fade only, no marching, no shockwave).

Reference: html/upload-dropzone.html and react/src/components/UploadDropzone.tsx.
Give me one component file plus a demo page, and tell me how to run it.
```
