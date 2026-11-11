# WATHBA homepage characters

Updated 2026-10-23 after Ammar explicitly approved the rebuilt shared character style and requested the matching UI. Updated 2026-11-11 after Ammar asked for Dheeb and Sakhr to be separated and animated as characters rather than shown as one picture or video, then asked the same day to remove the glow behind them and to make the motion livelier, as if both had just finished training.

## Artwork and identity

Dheeb stays on the viewer's LEFT in the exact approved staggered standing image with two black wristbands. Sakhr stays on the RIGHT with two white wristbands, performing the cross-body shoulder stretch from Ammar's attached pose reference. This physical order is identical in Arabic, English and mobile. Mobile copy and buttons appear before the figures.

The shared style and build are approved. Sakhr's new shoulder-stretch rendering implements the requested pose; it is not recorded as a separately approved drawing or a replacement for the governing Dheeb source.

The authoritative style reference is version 2.1 of [مرجع ثبات شخصيات ذيب وصخر](https://github.com/ammartheeb/wathba-manufacturing-docs/blob/main/يوتيوب/وضعيات%20الشخصيات/مرجع%20ثبات%20شخصيات%20ذيب%20وصخر.md). Original PNGs are stored in that repository's central character library as `ذيب وقوف متدرج بعد التمرين.png` and `صخر يمدد كتفه.png`.

- Dheeb PNG SHA-256: `f22c8554ba5f701879f5e5d367f8c46207620829ae4225d1b7d803a23b1b36a1`
- Sakhr PNG SHA-256: `22081140af3e02bbb7af255d74b921c51e144e13fac05a9bda6b717b5b96eadb`

## Assets and exact image preservation

- `dheeb-standing-1024.webp` and `sakhr-stretch-1024.webp` are lossless encodings of the original 1024×1536 PNGs. Their decoded pixels were compared byte-for-byte with the source. They stay in the repository unchanged.
- No glow is shown behind the characters. The hero uses `dheeb-standing-noglow-*.webp` and `sakhr-stretch-noglow-*.webp`, derived from those originals by `scripts/tools/remove-character-glow.py`: the smooth background glow, including the glow seen through gaps between the limbs, is subtracted to black, while every pixel of the ink drawing keeps its exact original value (checked on every run). No regeneration, mirroring, retouching or color adjustment is applied. Re-run the script only if an original changes.
- Responsive 512px and 768px WebPs are resized delivery copies at quality 93; the 1024px files are lossless.
- Screen blending merges the black backgrounds with the page. Both figures remain unframed. The site background stays dark.
- Dheeb and Sakhr are two separate elements, each with its own canvas and fallback image. Stage size is 1502×1450 source pixels: Dheeb's full 1024×1536 image sits at (-150,-30) and Sakhr's at (478,-30), leaving a clear gap of about 160 source pixels between the bodies. Only black margins overlap, so no image rectangle appears.
- The stage has the page color (#131313) and a soft edge mask as a safeguard against any visible image edge. Both heads, hands and bare feet remain visible.
- The old pair files remain available for history but are no longer referenced by either homepage.

## Image generation

Built-in image generation was used for Sakhr; the approved Dheeb image was reused. The generation record below is kept as history; the glow it describes is removed on the site. Input 1: approved Dheeb source (mandatory shared identity, moderately muscular build, fine irregular scribble, darker shorts and soft white-gray glow). Input 2: Ammar's shoulder-stretch attachment (pose only).

Prompt: Match the approved reference's physique, fine black scribble/crosshatching and light interior exactly. Bald adult male, completely featureless face, two white wristbands outlined lightly in ink, dark athletic shorts and bare feet. Right arm extends horizontally across the chest toward viewer-right; bent left arm draws the right upper arm inward, with left fist near the face. Head turns viewer-left. Complete standing staggered legs, both feet visible. Black background with a broad subtle white-gray bloom from above the knees to the head, fading softly to black. No external scribble halo, hair, colors, text, logos or added elements.

## Motion and fallback

Each character is skinned to a small 2D skeleton (feet, pelvis, chest, head, upper and lower arms) on its own WebGL canvas. The approved pixels are never redrawn; a 32×48 mesh moves them with joint weights measured on the 1024×1536 originals.

Both characters look calm and alive with one continuous idle motion, after the owner found the rotating moves too busy (2026-11-11):

- A light breathing heave (about 1.7 seconds per breath for Dheeb, 1.55 for Sakhr) lifts the shoulders a few pixels; the body does not change size.
- A slow weight sway of the whole figure, and a head that drifts gently on its own rhythm.
- With a mouse, both heads turn a little toward the visitor's pointer; without one, Sakhr keeps looking toward Dheeb.
- Taps do nothing. Heads and arms ride rigidly on the chest, and the feet are bound to a fixed bone, so the stance never moves.
- The earlier move set (shrug, nod, stretch pull and others) is still defined in the script but not scheduled.

Rendering is capped at 30fps and stops offscreen, in hidden tabs and during page suspension. No video or animation framework is downloaded.

The pause/play control is localized and stays invisible unless it is reached with the keyboard (it then appears at the lower left of the figures), so the hero shows no button while keyboard and screen-reader users can still stop the motion. Reduced-motion and data-saving preferences keep the normal static images in the same separated layout. No JavaScript, unsupported WebGL, shader failure, image failure or graphics context loss retain or restore the images and their localized text alternatives. Initialization waits for both figures.

## Validation

- Run `npm run build` and `npm run check`.
- The lifecycle test covers two separate character canvases, both image readiness, pause/resume, frame cap, viewport/visibility/page suspension, reduced motion, data saving, image failure, graphics failure and both languages.
- Review desktop, narrow desktop and phone layouts in the browser; confirm both wristband colors, physical order, the gap between the figures, no glow or light rim around the figures, full hand/feet visibility, no image rectangles, feet that never move, and copy before figures on mobile.
