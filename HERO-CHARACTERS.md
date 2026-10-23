# WATHBA homepage characters

Updated 2026-10-23 after Ammar explicitly approved the rebuilt shared character style and requested the matching UI.

## Artwork and identity

Dheeb stays on the viewer's LEFT in the exact approved staggered standing image with two black wristbands. Sakhr stays on the RIGHT with two white wristbands, performing the cross-body shoulder stretch from Ammar's attached pose reference. This physical order is identical in Arabic, English and mobile. Mobile copy and buttons appear before the figures.

The shared style and build are approved. Sakhr's new shoulder-stretch rendering implements the requested pose; it is not recorded as a separately approved drawing or a replacement for the governing Dheeb source.

The authoritative style reference is version 2.0 of [مرجع ثبات شخصيات ذيب وصخر](https://github.com/ammarabunada775forbusiness-art/WATHBA-Manufacturing-Docs/blob/main/يوتيوب/وضعيات%20الشخصيات/مرجع%20ثبات%20شخصيات%20ذيب%20وصخر.md). Original PNGs are stored in that repository's central character library as `ذيب وقوف متدرج بعد التمرين.png` and `صخر يمدد كتفه.png`.

- Dheeb PNG SHA-256: `f22c8554ba5f701879f5e5d367f8c46207620829ae4225d1b7d803a23b1b36a1`
- Sakhr PNG SHA-256: `22081140af3e02bbb7af255d74b921c51e144e13fac05a9bda6b717b5b96eadb`

## Assets and exact image preservation

- `dheeb-standing-1024.webp` and `sakhr-stretch-1024.webp` are lossless encodings of the original 1024×1536 PNGs. Their decoded pixels were compared byte-for-byte with the source. No regeneration, mirroring, retouching, background removal, new glow or color adjustment is applied to Dheeb.
- Responsive 512px and 768px WebPs are resized delivery copies at quality 93. The full-size originals remain available.
- Screen blending merges the original black backgrounds with the page and preserves their existing broad soft glow, including behind the thighs. Both figures remain unframed. The site background stays dark.
- Stage size is 1260×1320. Unscaled source placements are Dheeb (-180,-110) and Sakhr (240,-110). CSS and WebGL share exactly these proportions; only empty source margins extend outside the stage. Both heads, hands and bare feet remain visible.
- The old pair files remain available for history but are no longer referenced by either homepage.

## Image generation

Built-in image generation was used for Sakhr; the approved Dheeb image was reused. Input 1: approved Dheeb source (mandatory shared identity, moderately muscular build, fine irregular scribble, darker shorts and soft white-gray glow). Input 2: Ammar's shoulder-stretch attachment (pose only).

Prompt: Match the approved reference's physique, fine black scribble/crosshatching and light interior exactly. Bald adult male, completely featureless face, two white wristbands outlined lightly in ink, dark athletic shorts and bare feet. Right arm extends horizontally across the chest toward viewer-right; bent left arm draws the right upper arm inward, with left fist near the face. Head turns viewer-left. Complete standing staggered legs, both feet visible. Black background with a broad subtle white-gray bloom from above the knees to the head, fading softly to black. No external scribble halo, hair, colors, text, logos or added elements.

## Motion and fallback

One WebGL canvas uses two textures already loaded by the responsive image elements. Each figure has an independent breathing period (about 3.7 and 4.3 seconds). Fine mesh deformation raises the upper body slightly and expands the chest gently; it is zero below the hips, so the feet and leg stance stay fixed. The stretch is held.

Screen composition in the canvas matches the static CSS images. Rendering is capped at 30fps, and stops offscreen, in hidden tabs and during page suspension. No video or animation framework is downloaded.

The pause/play control is keyboard accessible and localized. Reduced-motion and data-saving preferences keep the normal static images. No JavaScript, unsupported WebGL, shader failure, image failure or graphics context loss retain or restore the images and their localized text alternatives. Initialization waits for both figures.

## Validation

- Run `npm run build` and `npm run check`.
- The existing lifecycle test covers both image readiness, pause/resume, frame cap, viewport/visibility/page suspension, reduced motion, data saving, image failure, graphics failure and both languages.
- Review desktop, narrow desktop and phone layouts in the browser; confirm both wristband colors, physical order, full hand/feet visibility, no image rectangles, and copy before figures on mobile.
