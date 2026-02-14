# Photo Gallery Images

## Quick Setup:

### Step 1: Add Your Photos

Place 6 photos in this folder (`src/assets/gallery/`) with these exact names:

- photo1.jpg (or .png)
- photo2.jpg (or .png)
- photo3.jpg (or .png)
- photo4.jpg (or .png)
- photo5.jpg (or .png)
- photo6.jpg (or .png)

### Step 2: Update LandingPage.jsx

1. **Import your photos** (add these lines at the top, around line 9):

```javascript
import photo1 from "./assets/gallery/photo1.jpg";
import photo2 from "./assets/gallery/photo2.jpg";
import photo3 from "./assets/gallery/photo3.jpg";
import photo4 from "./assets/gallery/photo4.jpg";
import photo5 from "./assets/gallery/photo5.jpg";
import photo6 from "./assets/gallery/photo6.jpg";
```

2. **Update galleryData** (around line 19):

```javascript
const galleryData = [
  { id: 1, image: photo1, caption: "Your caption", position: "top" },
  { id: 2, image: photo2, caption: "Your caption", position: "bottom" },
  { id: 3, image: photo3, caption: "Your caption", position: "top" },
  { id: 4, image: photo4, caption: "Your caption", position: "bottom" },
  { id: 5, image: photo5, caption: "Your caption", position: "top" },
  { id: 6, image: photo6, caption: "Your caption", position: "bottom" },
];
```

3. **Write your letter** (around line 29):

```javascript
const letterText = `Your message here...`;
```

## Photo Specifications:

- **Format**: JPG or PNG recommended
- **Size**: 800-1200px width for best quality
- **Aspect ratio**: Portrait or square works best
- **File size**: Keep under 2MB per photo

## Current Status:

Right now, the gallery shows placeholders. Once you add images and update the code, they'll appear automatically!
