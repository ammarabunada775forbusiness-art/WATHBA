# WATHBA home hero: Dheeb and Sakhr

Replaces the equipment photograph, floating specification cards and mouse-follow rotation in both homepages. The existing dark surface, hero copy and calls to action are retained. On mobile, copy and buttons precede the two figures.

## Artwork

Generated with the built-in image generator, using the approved front, back and scribble-style references. The source reference library remains unchanged.

- `assets/images/characters/dheeb-sakhr-1254.webp`: full-resolution transparent artwork, 1254 × 1254.
- `assets/images/characters/dheeb-sakhr-640.webp`: mobile source candidate, 640 × 640.
- Both preserve the generated alpha channel and opaque light body highlights. There is no rectangular backdrop.
- Dheeb is left with two black wristbands. Sakhr is right with two white wristbands. Their heads face each other and their torsos angle toward the viewer.

### Generation prompt

Use case: illustration-story. Asset type: transparent full-body character pair for WATHBA website hero, to be animated gently later in code. Create Dheeb and Sakhr standing side by side after exercise. Their heads face one another; their torsos are turned about 30 degrees inward from frontal, so both chests remain clearly visible toward the viewer. Dheeb stands on the LEFT, looking right toward Sakhr; Sakhr on the RIGHT, looking left toward Dheeb. Both full bodies and bare feet visible, equal scale, natural confident relaxed standing with arms resting at their sides and a subtle bend in elbows, feet planted naturally, a small clear transparent gap between silhouettes (no overlap). No gestures, no exercise equipment. Each man's weight rests naturally, as if recovering and breathing after a workout.

REFERENCE ROLES: image 1 defines Dheeb's identity, athletic proportions, black wristbands, shorts and body; image 2 defines Sakhr's identity, white wristbands outlined in ink, and the governing dense organic scribble ink style; DO NOT copy its raised victory arm. Image 3 is anatomy and shared identity reference only, not the pose or back view.

STYLE LOCK: monochrome hand-drawn black ink scribble and layered cross hatching; delicate looping construction lines, irregular medium strokes following muscle volumes, deep dark ink knots in shadow folds, clear white highlights. Organic fine stray ink lines extend just outside bodies. No uniform wire mesh, no clean cartoon outlines, no smooth digital shading, no 3D or photorealism. Preserve bald heads and blank faceless faces: no eyes, brows, nose, mouth, hair or dark scalp patch; keep jawline and head direction readable through silhouette only. Athletic male calisthenics bodies, balanced shoulders and natural trapezius/neck transitions matching references, not exaggerated bodybuilders. Dheeb has TWO solid BLACK wristbands. Sakhr has TWO WHITE wristbands with fine BLACK outlines. Same short athletic shorts shape as references, shaded with scribble 15–20% darker than adjoining body, not solid black. Visible skin surfaces remain opaque white/light gray so the ink figures read on a dark #131313 website.

BACKGROUND: truly transparent alpha everywhere outside the two figures and their fine ink contours, including between limbs and between bodies; no green chroma, no white rectangle, no backdrop, no floor, no drop shadow, no glow.

COMPOSITION: square canvas, both figures from head to toes, occupy about 92% of canvas height and 84% of canvas width, with modest empty alpha margins and gap, separate non-touching silhouettes. No text, labels, logos, glasses, props, decorative elements, or additional characters. This is the single finished pair illustration, not a website screenshot, not a pose sheet.

## Motion and fallback

`assets/js/home-hero.js` uses one small WebGL mesh and the already loaded responsive image. It adds no animation framework, video, extra image download or per-frame layout work. Chest expansion and shoulder lift have separate breathing periods; deformation is zero below the hips. Rendering is limited to 30 frames per second and stops outside the viewport, in a hidden tab, or when the page is suspended.

A keyboard-accessible pause/play control is labeled in the page language. Reduced-motion and data-saving preferences show the static illustration. Missing JavaScript, unsupported WebGL, shader errors and context loss retain or restore the normal image and its localized text alternative.

## Validation

- `npm run build` regenerates both language shells and production assets.
- `npm run check` checks existing internal links, structured data, performance contracts and accessibility structure.
- `node scripts/check-hero.js` checks motion lifecycle, reduced motion, data saving, unavailable graphics and context loss.
- Visual browser verification checks desktop and phone-sized viewports. A phone-sized browser is not a physical-device test.
