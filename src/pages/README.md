# Pages Directory - Next.js Routes

**Purpose:** Define all URL routes and page structure for the website.

Every `.tsx` file here automatically becomes a route. This is where page logic, layouts, and data fetching happen.

---

## Page Structure

### Core Pages
- **`_app.tsx`** - Global app wrapper. Runs on every page.
  - Sets up global context
  - Loads global styles
  - Wraps all pages with Layout component

- **`_document.tsx`** - HTML document setup
  - Meta tags (charset, viewport)
  - Font loading
  - Document structure

- **`index.tsx`** - Homepage (`/`)
  - Hero section with featured artwork
  - Recent works gallery
  - Artist statement

- **`about.tsx`** - About page (`/about`)
  - Artist biography
  - Education & exhibitions
  - Contact CTA

- **`contact.tsx`** - Contact page (`/contact`)
  - Contact form
  - Email/social links
  - Response expectations

### Dynamic Routes

- **`[category].tsx`** - Gallery category pages
  - Routes: `/still-life`, `/landscape`, `/drawing`, `/master-studies`
  - Displays all artworks in category
  - Uses data from `src/data/site-data.json`

- **`artwork/[id].tsx`** - Individual artwork detail pages
  - Route: `/artwork/[artwork-id]`
  - Full artwork information
  - Related artworks sidebar
  - Image viewer

---

## Data Flow

Each page imports data from `src/data/site-data.json`:

```typescript
import data from '@/data/site-data.json'

export default function CategoryPage({ category }) {
  const artworks = data.artworks.filter(a => a.category === category)
  return <GalleryGrid artworks={artworks} />
}
```

---

## When to Edit

- **Adding a new page** → Create new `.tsx` file
- **Changing page layout** → Edit the component inside
- **Updating page copy/content** → Edit `src/data/site-data.json` instead
- **Changing navigation** → Edit `src/components/Navigation/`

---

## Brand Voice

- Professional, minimal, clear
- Let artwork be the focus
- Use simple language
- No jargon or decoration
- Support, don't distract
