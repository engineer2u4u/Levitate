# Microsoft Entra ID — company branding assets

Upload in **Entra admin centre → Company Branding → Customise**. These are not
website assets and are not part of the site build; they live here so the
generated files are versioned alongside the logo they came from.

Regenerate from `public/assets/logo.png` if the master logo ever changes.

## Files

| Spec item | File | Size | Weight | Limit |
|---|---|---|---|---|
| Favicon | `favicon-32x32.png` | 32 × 32 | 0.9 KB | 5 KB |
| Header logo | `header-logo-245x36-on-dark.png` | 245 × 36 | 2.2 KB | 10 KB |
| Header logo *(alt)* | `header-logo-245x36-on-light.png` | 245 × 36 | 3.8 KB | 10 KB |
| Banner logo | `banner-logo-245x36.png` | 245 × 36 | 3.8 KB | 50 KB |
| Square logo — light theme | `square-logo-light-theme-240x240.png` | 240 × 240 | 9.8 KB | 50 KB |
| Square logo — dark theme | `square-logo-dark-theme-240x240.png` | 240 × 240 | 5.5 KB | 50 KB |
| Background image | `background-1920x1080-gradient.jpg` | 1920 × 1080 | 21 KB | 300 KB |
| Background image *(alt)* | `background-1920x1080-photo.jpg` | 1920 × 1080 | 171 KB | 300 KB |

Every file is inside its dimension and file-size limit.

## Colour codes

| Field | Hex | Why |
|---|---|---|
| Header background | `#0A1B33` | Brand navy. Pair with `header-logo-...-on-dark.png`. |
| Page background colour | `#F7FAFC` | Matches the website background; also the fallback if the background image fails to load. |
| Footer background | `#0A1B33` | Same navy as the header, so the page is book-ended. |

Brand accents, if a field ever asks for one: teal `#1B8F88`, gradient
`#2FC4BC → #2F7FD6`.

## Two choices to make

**Header logo — dark or light band.** Two versions are supplied:

- Navy header band (`#0A1B33`) + `header-logo-245x36-on-dark.png` — the logo is
  reversed to white. Stronger, and matches the site's own dark sections.
- White header band (`#FFFFFF`) + `header-logo-245x36-on-light.png` — the logo
  keeps its teal-and-navy colours.

Use the pair that matches the header colour you enter; mixing them makes the
logo invisible.

**Background — gradient or photo.**

- `...-gradient.jpg` — brand navy-to-teal gradient. Never competes with the
  sign-in box, and is only 21 KB.
- `...-photo.jpg` — a real session photo, darkened 62% so white text over it
  stays legible.

## How these were produced

The master logo is flattened onto opaque white, so it cannot simply be dropped
onto a coloured surface. Alpha was recovered per pixel by treating each one as
ink composited over white — `a = 1 − min(r,g,b)/255`, then solving back for the
ink colour. That keeps the brand colours exact where the ink is solid and gives
clean anti-aliased edges. The reversed version recolours the same coverage mask
to white.

The source logo is 250 × 80 (aspect 3.1:1) while the header and banner slots are
245 × 36 (6.8:1), so the logo is fitted inside the slot rather than stretched —
it sits left-aligned in the header (Microsoft renders it upper-left) and centred
in the banner.
