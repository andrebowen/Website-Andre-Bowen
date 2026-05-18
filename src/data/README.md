# Data Directory - Content & Metadata

**Purpose:** Single source of truth for all website content and metadata.

This is where artwork info, artist bio, exhibitions, and all dynamic content lives. Edit this file to update the website.

---

## site-data.json Structure

```json
{
  "artist": {
    "name": "André Bowen",
    "title": "Oil Painter",
    "bio": "...",
    "location": "Australia",
    "email": "contact@andrebowen.com",
    "socialLinks": {
      "instagram": "...",
      "linkedin": "..."
    },
    "cv": "...",
    "education": [...],
    "awards": [...]
  },
  
  "categories": [
    {
      "id": "still-life",
      "name": "Still Life",
      "description": "...",
      "count": 12
    },
    // ... landscape, drawing, etc
  ],
  
  "artworks": [
    {
      "id": "abyssinian-roses",
      "title": "Abyssinian Roses",
      "category": "still-life",
      "year": 2016,
      "medium": "Oil on linen panel",
      "dimensions": "35 × 28 cm",
      "location": "Private collection",
      "description": "...",
      "images": {
        "thumbnail": "images/artworks/still-life/still-life-001-abyssinian-roses.jpg",
        "full": "images/artworks/still-life/still-life-001-abyssinian-roses-hires.jpg"
      },
      "exhibitions": ["exhibition-id-1", "exhibition-id-2"],
      "featured": true,
      "seoData": {
        "title": "Abyssinian Roses | André Bowen",
        "description": "..."
      }
    },
    // ... more artworks
  ],
  
  "exhibitions": [
    {
      "id": "gallery-name-2024",
      "name": "Gallery Name",
      "location": "City, Country",
      "date": "2024-05-15",
      "url": "https://...",
      "featured": true
    }
  ],
  
  "navigation": {
    "main": [...],
    "footer": [...]
  }
}
```

---

## Artwork Entry Template

```json
{
  "id": "unique-slug",
  "title": "Artwork Title",
  "category": "still-life",
  "year": 2020,
  "medium": "Oil on panel",
  "dimensions": "40 × 30 cm",
  "location": "Private collection | Gallery name | Sold",
  "description": "Optional detailed description for artwork detail page",
  "images": {
    "thumbnail": "images/artworks/still-life/still-life-001-title.jpg",
    "full": "images/artworks/still-life/still-life-001-title-hires.jpg"
  },
  "exhibitions": ["exhibition-id"],
  "featured": false,
  "seoData": {
    "title": "Artwork Title | André Bowen",
    "description": "A brief description for search engines"
  }
}
```

---

## When to Edit

**Add new artwork** → Add entry to `artworks` array  
**Update artist info** → Edit `artist` object  
**Add exhibition** → Add to `exhibitions` array  
**Change navigation** → Edit `navigation` object  
**Update category descriptions** → Edit `categories` array  

---

## Image Naming Convention

Images organized in `/images/artworks/[category]/`:

```
still-life-001-abyssinian-roses.jpg
still-life-002-flowers-in-jar.jpg
landscape-001-lake-view.jpg
landscape-002-mountains.jpg
drawing-001-figure-study.jpg
```

Format: `[category]-[number]-[title].jpg`

---

## Data Validation

When adding artwork, ensure:
- ID is unique and URL-safe (lowercase, hyphens only)
- Category matches one of: still-life, landscape, drawing, other
- Year is 4-digit number (YYYY)
- Dimensions format: "WIDTH × HEIGHT cm"
- Image files exist in correct folder
- File paths are relative to project root

---

## How Data Flows

```
site-data.json
    ↓
Pages import data
    ↓
Components receive as props
    ↓
Rendered on pages
    ↓
Users see website
```

Update JSON → pages re-render automatically (via Next.js ISR)

---

## Brand Voice in Content

- Professional, respectful tone
- Artist-focused, not about the artist
- Let work speak for itself
- Clear, helpful descriptions
- Accurate dates, dimensions, media
- Proper title formatting
