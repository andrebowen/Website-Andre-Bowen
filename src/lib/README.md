# Lib Directory - Utilities & Helpers

**Purpose:** Reusable functions, API helpers, constants, and utility code.

Code that's used across multiple components lives here.

---

## Files Overview

### api.ts
Data fetching and API utilities.
```typescript
export async function getArtworksByCategory(category: string) {
  // Fetch filtered artworks
}

export async function getArtworkDetail(id: string) {
  // Get single artwork with full details
}
```

### utils.ts
General utility functions.
```typescript
export function formatDate(date: string) {
  // Date formatting
}

export function slugify(text: string) {
  // Convert text to URL-safe slug
}

export function truncate(text: string, length: number) {
  // Truncate text with ellipsis
}
```

### constants.ts
App-wide constants.
```typescript
export const SITE_NAME = "André Bowen"
export const SITE_URL = "https://andrebowen.com"
export const CATEGORIES = ["still-life", "landscape", "drawing"]
export const BREAKPOINTS = {
  mobile: 600,
  tablet: 900,
  desktop: 1200
}
```

### types.ts
TypeScript interfaces.
```typescript
export interface Artwork {
  id: string
  title: string
  category: string
  year: number
  // ...
}

export interface Artist {
  name: string
  bio: string
  // ...
}
```

---

## When to Add Utilities

- Used in 2+ components → Utility function
- Needed globally → Constant
- Complex type definitions → types.ts
- Data transformations → utils.ts
- External data calls → api.ts

---

## Don't Add Here

- Component logic (goes in components)
- Page logic (goes in pages)
- Styling (goes in styles)
- Configuration (goes in root config files)

---

## Brand Voice

- Clear, descriptive function names
- Proper error handling
- Good TypeScript types
- Well-commented if complex
