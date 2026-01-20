# Intern Project Template

## Getting Started

1. Copy this entire `_template` folder
2. Rename it to your name (lowercase, use hyphens): `john-doe`
3. Build your project!

## Requirements

Your project MUST have a `build` script in `package.json` that outputs to a `dist/` folder.

### For Static HTML/CSS/JS
The default `package.json` handles this automatically.

### For React (Vite)
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```
Vite outputs to `dist/` by default.

### For React (Create React App)
```json
{
  "scripts": {
    "build": "react-scripts build && mv build dist"
  }
}
```

### For Next.js (Static Export)
```json
{
  "scripts": {
    "build": "next build && next export -o dist"
  }
}
```

### For Vue (Vite)
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## Important Notes

- Your folder name becomes your URL path: `/your-name/`
- Always test your build locally: `npm run build`
- Make sure all assets use relative paths
