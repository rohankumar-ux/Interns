const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IGNORE = ['node_modules', '.git', '.github', 'scripts', 'public', '_template'];

function getInternFolders() {
    return fs.readdirSync(ROOT).filter(name => {
        const fullPath = path.join(ROOT, name);
        return fs.statSync(fullPath).isDirectory()
            && !IGNORE.includes(name)
            && !name.startsWith('.');
    });
}

function buildIntern(name) {
    const internPath = path.join(ROOT, name);
    const packageJson = path.join(internPath, 'package.json');

    console.log(`\n📦 Building: ${name}`);

    if (!fs.existsSync(packageJson)) {
        console.log(`  ⚠️  No package.json found, copying files directly...`);
        const destPath = path.join(PUBLIC, name);
        fs.mkdirSync(destPath, { recursive: true });
        copyDir(internPath, destPath);
        return true;
    }

    try {
        if (fs.existsSync(path.join(internPath, 'package-lock.json')) ||
            fs.existsSync(path.join(internPath, 'yarn.lock')) ||
            fs.existsSync(path.join(internPath, 'pnpm-lock.yaml'))) {
            console.log(`  📥 Installing dependencies...`);
            execSync('npm install', { cwd: internPath, stdio: 'inherit' });
        }

        console.log(`  🔨 Running build...`);
        execSync('npm run build', { cwd: internPath, stdio: 'inherit' });

        const distPath = path.join(internPath, 'dist');
        const buildPath = path.join(internPath, 'build');
        const outPath = path.join(internPath, 'out');

        let sourcePath;
        if (fs.existsSync(distPath)) sourcePath = distPath;
        else if (fs.existsSync(buildPath)) sourcePath = buildPath;
        else if (fs.existsSync(outPath)) sourcePath = outPath;

        if (sourcePath) {
            const destPath = path.join(PUBLIC, name);
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(sourcePath, destPath);
            console.log(`  ✅ Success: /${name}/`);
            return true;
        } else {
            console.log(`  ❌ No dist/build/out folder found after build`);
            return false;
        }
    } catch (error) {
        console.log(`  ❌ Build failed: ${error.message}`);
        return false;
    }
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') {
                copyDir(srcPath, destPath);
            }
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function generateIndex(interns) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intern Projects</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            background: #0f0f0f;
            color: white;
            padding: 2rem;
        }
        h1 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 12px;
            padding: 1.5rem;
            text-decoration: none;
            color: white;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #333;
        }
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            border-color: #667eea;
        }
        .card h2 { font-size: 1.3rem; margin-bottom: 0.5rem; }
        .card p { opacity: 0.7; font-size: 0.9rem; }
        .empty { text-align: center; opacity: 0.5; padding: 4rem; }
    </style>
</head>
<body>
    <h1>🚀 Intern Projects</h1>
    <div class="grid">
        ${interns.length > 0
            ? interns.map(name => `
        <a href="/${name}/" class="card">
            <h2>${formatName(name)}</h2>
            <p>View project →</p>
        </a>`).join('')
            : '<p class="empty">No projects deployed yet</p>'
        }
    </div>
</body>
</html>`;
}

function formatName(slug) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Main execution
console.log('🚀 Building Intern Projects\n' + '='.repeat(40));

if (fs.existsSync(PUBLIC)) {
    fs.rmSync(PUBLIC, { recursive: true });
}
fs.mkdirSync(PUBLIC, { recursive: true });

const interns = getInternFolders();
console.log(`Found ${interns.length} intern folder(s): ${interns.join(', ') || 'none'}`);

const successful = [];
for (const intern of interns) {
    if (buildIntern(intern)) {
        successful.push(intern);
    }
}

fs.writeFileSync(path.join(PUBLIC, 'index.html'), generateIndex(successful));

console.log('\n' + '='.repeat(40));
console.log(`✅ Build complete: ${successful.length}/${interns.length} projects`);
console.log(`📁 Output: /public/`);
