# Components Directory - React Components

**Purpose:** Reusable UI components following Apple HIG design system.

Each component is self-contained, tested, and follows the design specifications in `/docs/DESIGN/`.

---

## Component Organization

### Navigation/
Header and navigation components
- **Header.tsx** - Main header wrapper
- **Hamburger.tsx** - Mobile hamburger menu (2-bar Apple style)
- **NavLinks.tsx** - Navigation link list
- **Brand Voice:** Clean, minimal, professional. Navigation supports but doesn't dominate.

### Gallery/
Gallery display and filtering
- **GalleryGrid.tsx** - Responsive grid layout (1/2/3/4 columns)
- **FilterBar.tsx** - Category/sort controls (if needed)
- **Brand Voice:** Let artwork shine. Generous whitespace. No distractions.

### Cards/
Reusable card components
- **ArtworkCard.tsx** - Single artwork thumbnail with info
- **CategoryCard.tsx** - Category selector card
- **InfoCard.tsx** - Info/content card (about, statements, etc)
- **Brand Voice:** Minimal styling. Focus on content. Consistent spacing.

### Forms/
Input and form components
- **ContactForm.tsx** - Contact form with validation
- **FormField.tsx** - Reusable form input wrapper
- **Brand Voice:** Clear, helpful, accessible. Good error messages.

### Layout/
Page structure components
- **MainLayout.tsx** - Primary page layout wrapper
- **Footer.tsx** - Site footer with links
- **Brand Voice:** Supportive. Clear hierarchy. Professional.

### Common/
Shared utilities and primitives
- **Button.tsx** - Primary/secondary button styles
- **Image.tsx** - Optimized image component
- **Link.tsx** - Custom link handling
- **Brand Voice:** Consistent, predictable, accessible.

---

## Component Design Principles

### 1. Simplicity First
- One responsibility per component
- Minimal props
- Clear naming

### 2. Apple HIG Compliance
- Use HIG colors from `src/styles/variables.css`
- Minimum 44×44px touch targets
- Proper spacing (4px grid)
- System fonts

### 3. Accessibility (WCAG AAA)
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Proper color contrast

### 4. Performance
- Lazy load images
- Code splitting where needed
- No unnecessary re-renders

---

## Component Template

```typescript
import styles from './Component.module.css'

interface ComponentProps {
  title: string
  // other props
}

export default function Component({ title }: ComponentProps) {
  return (
    <div className={styles.container}>
      {/* content */}
    </div>
  )
}
```

---

## When to Create a Component

- Reused in multiple places → Component
- Single-use complex UI → Component
- Helps readability → Component
- Just HTML → Inline instead

---

## Styling Components

Use CSS modules or inline styles:

```typescript
import styles from './Component.module.css'

<div className={styles.card}>
  {/* Uses CSS from Component.module.css */}
</div>
```

**Style files reference:** `/src/styles/variables.css` for colors, spacing, typography

---

## Brand Voice

- Clean, minimal, professional
- Support the artwork, don't distract
- Clear, helpful, accessible
- Consistent interactions
- Generous whitespace
- No decoration
