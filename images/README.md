# Images Directory - Artwork & Media Assets

**Purpose:** High-resolution artwork organized by category, plus supporting imagery.

This is where all images are stored and organized.

---

## Folder Structure

```
images/
├── artworks/              # Organized artwork files
│   ├── still-life/        # Still life paintings
│   ├── landscape/         # Landscape paintings
│   ├── drawing/           # Drawings and studies
│   └── other/             # Other works
├── portrait/              # Artist portrait
└── hero/                  # Homepage hero images
```

---

## Image Organization

### Artwork Images
Stored in category folders: `/artworks/[category]/`

**Naming Convention:**
```
[category]-[number]-[title].jpg
still-life-001-abyssinian-roses.jpg
landscape-002-lake-study.jpg
drawing-015-figure-sketch.jpg
```

**Image Variants:**
- **Thumbnail:** `still-life-001-abyssinian-roses.jpg` (optimized, ~800px)
- **Full:** `still-life-001-abyssinian-roses-hires.jpg` (high-res, ~2000px)

### Portrait
Artist headshot/portrait:
- `portrait.jpg` - High quality, professional

### Hero
Homepage hero images:
- `hero-still-life.jpg` - Featured still life
- `hero-landscape.jpg` - Featured landscape

---

## Image Specifications

### Resolution
- **Thumbnail:** 800-1000px width, optimized
- **Full/Detail:** 2000-3000px width, high quality
- **Portrait:** 400-600px width
- **Hero:** 1200-1600px width

### Format
- **Primary:** JPG (best for photographs)
- **Alternative:** WebP (modern browsers)
- Avoid: PNG (larger files)

### Optimization
- Compress before uploading
- Use modern formats (WebP when possible)
- Include both low and high-res versions
- Optimize for web (not print)

---

## Metadata in site-data.json

Every image referenced in code must have corresponding entry in `site-data.json`:

```json
{
  "images": {
    "thumbnail": "images/artworks/still-life/still-life-001-title.jpg",
    "full": "images/artworks/still-life/still-life-001-title-hires.jpg"
  }
}
```

---

## When to Add Images

**New artwork** → Add to appropriate category folder, update `site-data.json`  
**New portrait** → Replace or add variant to `/portrait/`  
**New hero image** → Add to `/hero/`, update homepage  

---

## Image Best Practices

1. **Always provide alt text** in code (automatically from metadata)
2. **Test across devices** (mobile, tablet, desktop)
3. **Check file sizes** (aim for <500KB per image)
4. **Use consistent aspect ratios** within categories
5. **Include high-res versions** for detail pages
6. **Optimize before upload** (use tools like TinyPNG)

---

## Tools for Image Optimization

- **TinyPNG/TinyJPG** - Lossless compression
- **ImageOptim** - Batch optimization
- **Squoosh** - WebP conversion
- **Sharp** (Node.js) - Automated optimization

---

## Brand Voice

Let the artwork speak. Images should be:
- High quality and professional
- Properly lit and color-accurate
- Consistently formatted
- Well organized for easy access
