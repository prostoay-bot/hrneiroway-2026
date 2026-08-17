# Design QA — HR в деталях

- Source visual truth: `/var/folders/xr/z70xcpxx6wsd4875rng7hlp80000gn/T/TemporaryItems/NSIRD_screencaptureui_ko1G8f/Снимок экрана — 2026-08-17 в 16.22.43.png` and `/var/folders/xr/z70xcpxx6wsd4875rng7hlp80000gn/T/TemporaryItems/NSIRD_screencaptureui_exgcA8/Снимок экрана — 2026-08-17 в 16.23.16.png`
- Implementation: `http://127.0.0.1:4173/articles/`
- Desktop screenshot: `/private/tmp/hrneiroway-design-qa/hr-details-editorial-viewport.png`
- Mobile screenshot: `/private/tmp/hrneiroway-design-qa/hr-details-editorial-mobile.png`
- Combined comparison: `/private/tmp/hrneiroway-design-qa/hr-details-design-comparison.jpg`
- Viewports: desktop 1154 × 720 CSS px, mobile 390 × 844 CSS px
- Pixel density: 1× for both implementation captures
- Source dimensions: 670 × 440 px and 500 × 882 px
- State: initial page view; mobile and desktop responsive layouts

## Full-view comparison evidence

The implementation matches the references at the intended art-direction level: monochrome editorial palette, high-contrast serif display type, asymmetric two-column composition, thin black rules, vertical microtype, and image-led magazine panels. The supplied document objects are grayscale, sharply rendered, and integrated into dedicated image fields instead of floating over the copy.

## Focused region comparison evidence

The hero was checked separately on desktop and mobile because typography, object crop, and responsive reflow are the fidelity-critical areas. The desktop maintains a balanced copy/image split; the mobile version converts it to a stacked editorial cover without overlap or horizontal overflow. Card-grid typography and borders remain legible in the full-page capture, so no additional focused crop was required.

## Required fidelity surfaces

- Fonts and typography: passed. Display hierarchy, serif contrast, tight headline leading, uppercase microtype, and body readability align with the references while retaining the project fonts
- Spacing and layout rhythm: passed. Frames, rules, columns, generous white space, and mobile stacking are consistent and free of clipping
- Colors and visual tokens: passed. Black, warm white, and controlled gray replace the previous decorative palette; existing button radius remains consistent with the site
- Image quality and asset fidelity: passed. Real supplied PNG assets are used; grayscale treatment, contrast, scale, and crop support the editorial direction without transparency artifacts
- Copy and content: passed. Existing text, links, metadata, and article titles are unchanged

## Interaction and console checks

- Primary `Читать статьи` link correctly navigates to `#articles`
- Featured article link remains `/articles/ai-pomoshchniki-dlya-sotrudnikov/`
- Existing Yandex Metrika syntax error (`ym(, ...)`) is present in the source page and was not introduced or modified by this design task; it does not block page navigation or rendering

## Findings

No actionable P0, P1, or P2 visual differences remain. The references contain fashion photography, while the implementation intentionally uses the user-supplied HR document objects to preserve subject relevance.

## Comparison history

- Pass 1: verified desktop composition, typography, grayscale asset treatment, card grid, and mobile stacking. No blocking visual issues found, so no corrective iteration was required

## Follow-up polish

- P3: the existing Metrika syntax error can be handled in a separate maintenance task if requested

## Scoped QA update — welcome book CTA

- Source visual truth: `/Users/marina/Desktop/Снимок экрана — 2026-08-17 в 16.24.48.png`
- Supplied object: `/Users/marina/Downloads/pngwing.com (25).png`, 1000 × 858 px with alpha
- Desktop evidence: `/private/tmp/hrneiroway-design-qa/welcome-cta-stationery-crop.png`, rendered from a 1280 px viewport
- Mobile evidence: `/private/tmp/hrneiroway-design-qa/welcome-cta-stationery-mobile.png`, 390 × 844 CSS px at 1× density
- The circular decoration was removed and replaced with the supplied stationery object
- Desktop: copy, three buttons, and the object remain visually separated with no clipping or overlap
- Mobile: content stacks in a single column; the object sits below the buttons and stays inside the CTA frame
- Existing copy, links, metadata, and button labels are unchanged
- No actionable P0, P1, or P2 findings remain

final result: passed
