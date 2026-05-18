# Styles Directory - Styling & Design System

**Purpose:** CSS variables, global styles, theme definitions, and design system implementation.

All styling follows Apple HIG. Colors, spacing, typography are defined here.

---

## Files Overview

### variables.css
Master CSS variables. Single source of truth for design.

```css
:root {
  /* Colors - Light Mode */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FFFFFF;
  --text-primary: #000000;
  --text-secondary: #3C3C43;
  --separator: #D1D1D6;
  --accent: #007AFF;
  
  /* Semantic Colors */
  --success: #34C759;
  --warning: #FF9500;
  --error: #FF3B30;
  
  /* Spacing (4px grid) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
}

/* Dark mode (auto) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --text-primary: #FFFFFF;
    /* ... etc */
  }
}
```

### globals.css
Global styles applied to entire site.
- Reset & normalize
- Base element styles
- Global utilities
- Import variables.css first

### typography.css
Font scales, weights, line heights.
- Display: 34px / 41px
- Headline: 17px / 22px
- Body: 17px / 22px
- Caption: 13px / 18px

### components.css
Component-specific base styles (optional).

### responsive.css
Media queries and responsive utilities.

---

## Design System

### Colors (WCAG AAA Compliant)
**Light Mode:**
- Background: Pure white (#FFFFFF)
- Text primary: Black (#000000) - 21:1 contrast
- Text secondary: Gray (#3C3C43) - 8:1 contrast
- Separator: Light gray (#D1D1D6)
- Accent: System blue (#007AFF) - interactive elements only

**Dark Mode (Auto):**
- Background: Pure black (#000000)
- Text primary: White (#FFFFFF)
- Text secondary: Light gray (#8E8E93)
- Separator: Dark gray (#424245)
- Accent: Light blue (#0A84FF)

### Spacing Grid
All spacing uses 4px base unit:
- 4px: Minimal spacing
- 8px: Tight spacing
- 12px: Standard padding
- 16px: Standard gap
- 24px: Large sections
- 32px: Major sections

### Typography
```
Font Stack: -apple-system, BlinkMacSystemFont, 'Segoe UI'
Letter Spacing: -0.4px (optical adjustment)
Line Height: 1.5 (body), 1.3 (headings)
```

### Border Radius
- Buttons: 8px
- Cards: 12px
- Images: 12px
- Small elements: 4px

---

## When to Edit Styles

**Update colors globally** → Edit `variables.css`  
**Change typography scale** → Edit `typography.css`  
**Add component styles** → Create component-scoped CSS module  
**Fix layout issues** → Edit component's CSS module (surgical)  
**Add responsive breakpoints** → Edit `responsive.css`  

---

## Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 600px) { /* Tablet */ }
@media (min-width: 900px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large */ }
```

---

## Do Not Edit

- Font sizes (defined in spec)
- Color values (use variables)
- Spacing units (use 4px grid)
- Touch targets (minimum 44×44px)

These are locked to maintain consistency and accessibility.

---

## Brand Voice Through Design

- **Pure white background** = gallery wall aesthetic
- **Generous spacing** = respect for content
- **No decoration** = focus on artwork
- **System fonts** = clean, modern, trusted
- **Subtle interactions** = Apple-like responsiveness
- **Dark mode auto** = user preference respected
