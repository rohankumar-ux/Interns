# Intern Projects Showcase

A monorepo for intern projects, deployed as a single Vercel application.

## 🏗️ Project Structure

```
Interns/
├── _template/           # Starter template (copy this!)
├── john-doe/            # Each intern gets their own folder
├── jane-smith/
├── scripts/             # Build tooling
├── .github/workflows/   # Deployment automation
└── public/              # Generated output (gitignored)
```

---

## 👩‍💻 For Interns

### Getting Started

1. **Copy the template folder**
   ```bash
   cp -r _template your-name
   ```

2. **Rename using your name** (lowercase, hyphens for spaces)
   ```
   john-doe/
   jane-smith/
   ```

3. **Build your project!**

### Requirements

Your project **MUST** have a build script that outputs to `dist/`:

```json
{
  "scripts": {
    "build": "your-build-command"
  }
}
```

### Framework Examples

| Framework | Build Command |
|-----------|--------------|
| Static HTML | `mkdir -p dist && cp -r *.html *.css *.js dist/` |
| Vite (React/Vue) | `vite build` (outputs to dist by default) |
| Create React App | `react-scripts build && mv build dist` |
| Next.js (static) | `next build && next export -o dist` |

### Important Notes

- Your folder name = your URL path: `yoursite.vercel.app/your-name/`
- Use **relative paths** for assets (`./images/logo.png`, not `/images/logo.png`)
- Test locally: `npm run build` then check your `dist/` folder
- Don't commit `node_modules/` or `dist/`

---

## 👨‍💼 For Admins

### Initial Setup

1. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import this repository
   - **Important:** Go to Project Settings → Git → Disable "Auto-Deploy"

2. **Get Vercel Credentials**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Link project (run in repo root)
   vercel link

   # This creates .vercel/project.json with your IDs
   cat .vercel/project.json
   ```

3. **Add GitHub Secrets**

   Go to: Repository → Settings → Secrets and variables → Actions

   | Secret | Value |
   |--------|-------|
   | `VERCEL_TOKEN` | Create at vercel.com/account/tokens |
   | `VERCEL_ORG_ID` | From `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | From `.vercel/project.json` |

### Deploying

1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Vercel"** workflow
3. Click **"Run workflow"**
4. Choose environment:
   - `preview` - Creates a preview URL
   - `production` - Deploys to main domain

### Local Testing

```bash
# Build all projects locally
node scripts/build.js

# Serve the output
npx serve public
```

---

## 🔧 How It Works

1. Each intern folder is detected automatically
2. Build script runs `npm install` and `npm run build` for each
3. Outputs are aggregated into `/public/intern-name/`
4. Landing page generated at `/public/index.html`
5. GitHub Actions deploys `/public/` to Vercel

---

## 📋 Checklist for New Interns

- [ ] Copy `_template` folder and rename to your name
- [ ] Replace template content with your project
- [ ] Ensure `npm run build` creates a `dist/` folder
- [ ] Use relative paths for all assets
- [ ] Push your changes to `main` branch
- [ ] Ask admin to run deployment
