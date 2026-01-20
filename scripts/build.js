const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INTERNS_DIR = path.join(ROOT, 'interns');
const PUBLIC = path.join(ROOT, 'public');

function getProjects() {
    if (!fs.existsSync(INTERNS_DIR)) return [];
    return fs.readdirSync(INTERNS_DIR).filter(name => {
        const fullPath = path.join(INTERNS_DIR, name);
        return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
    });
}

function copyFolder(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.statSync(srcPath).isDirectory()) {
            copyFolder(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function generateIndex(projects) {
    const cards = projects.map((name, i) => {
        const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name}&backgroundColor=0a1628`;
        const id = String(i + 1).padStart(2, '0');
        return `
            <a href="/${name}/" class="card">
                <div class="card-frame">
                    <svg class="frame-svg" viewBox="0 0 320 140" preserveAspectRatio="none">
                        <path class="frame-path" d="M20,1 L300,1 L319,20 L319,120 L300,139 L20,139 L1,120 L1,20 Z" />
                        <path class="corner-accent tl" d="M1,30 L1,1 L30,1" />
                        <path class="corner-accent tr" d="M290,1 L319,1 L319,30" />
                        <path class="corner-accent bl" d="M1,110 L1,139 L30,139" />
                        <path class="corner-accent br" d="M290,139 L319,139 L319,110" />
                    </svg>
                    <div class="card-content">
                        <div class="avatar-hex">
                            <svg class="hex-frame" viewBox="0 0 100 100">
                                <polygon class="hex-border" points="50,2 93,27 93,73 50,98 7,73 7,27" />
                                <polygon class="hex-inner" points="50,8 87,30 87,70 50,92 13,70 13,30" />
                            </svg>
                            <img src="${avatarUrl}" alt="${displayName}" class="avatar" />
                            <div class="avatar-glow"></div>
                        </div>
                        <div class="info">
                            <div class="id-tag">
                                <span class="bracket">[</span>
                                <span class="id">OPR-${id}</span>
                                <span class="bracket">]</span>
                            </div>
                            <h2>${displayName}</h2>
                            <div class="status-line">
                                <svg class="status-icon" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                                </svg>
                                <span>ACTIVE</span>
                                <div class="pulse"></div>
                            </div>
                        </div>
                        <div class="arrow-container">
                            <svg class="arrow" viewBox="0 0 24 24">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="scan-line"></div>
            </a>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INTERN HQ // DASHBOARD</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --cyan: #00e5ff;
            --cyan-dim: rgba(0, 229, 255, 0.3);
            --cyan-glow: rgba(0, 229, 255, 0.15);
            --bg-dark: #0a1628;
            --bg-card: #0d1f35;
        }

        body {
            font-family: 'Share Tech Mono', monospace;
            min-height: 100vh;
            background: var(--bg-dark);
            background-image:
                radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 50%);
            color: var(--cyan);
            overflow-x: hidden;
        }

        /* Grid Background */
        .bg-grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(var(--cyan-glow) 1px, transparent 1px),
                linear-gradient(90deg, var(--cyan-glow) 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.3;
            pointer-events: none;
        }

        /* Header */
        header {
            padding: 2.5rem 2rem;
            text-align: center;
            position: relative;
        }

        .header-frame {
            display: inline-block;
            position: relative;
            padding: 1rem 3rem;
        }

        .header-frame::before,
        .header-frame::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid var(--cyan);
        }

        .header-frame::before {
            top: 0; left: 0;
            border-right: none; border-bottom: none;
        }

        .header-frame::after {
            bottom: 0; right: 0;
            border-left: none; border-top: none;
        }

        .logo {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(1.8rem, 5vw, 2.8rem);
            font-weight: 900;
            letter-spacing: 0.2em;
            text-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,229,255,0.3);
        }

        .subtitle {
            font-size: 0.8rem;
            letter-spacing: 0.5em;
            opacity: 0.6;
            margin-top: 0.5rem;
        }

        .header-line {
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--cyan), transparent);
            margin: 1.5rem auto 0;
        }

        /* Main Grid */
        main {
            max-width: 1100px;
            margin: 0 auto;
            padding: 1rem 2rem 3rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 1.5rem;
        }

        /* Card */
        .card {
            position: relative;
            text-decoration: none;
            color: var(--cyan);
            display: block;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: scale(1.03);
        }

        .card-frame {
            position: relative;
            height: 140px;
        }

        .frame-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        .frame-path {
            fill: var(--bg-card);
            stroke: var(--cyan-dim);
            stroke-width: 1.5;
            transition: all 0.3s;
        }

        .card:hover .frame-path {
            stroke: var(--cyan);
            filter: drop-shadow(0 0 8px var(--cyan));
        }

        .corner-accent {
            fill: none;
            stroke: var(--cyan);
            stroke-width: 2;
            opacity: 0.8;
        }

        .card:hover .corner-accent {
            opacity: 1;
            filter: drop-shadow(0 0 4px var(--cyan));
        }

        /* Card Content */
        .card-content {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            gap: 1rem;
        }

        /* Hexagon Avatar */
        .avatar-hex {
            position: relative;
            width: 80px;
            height: 80px;
            flex-shrink: 0;
        }

        .hex-frame {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        .hex-border {
            fill: none;
            stroke: var(--cyan-dim);
            stroke-width: 2;
            transition: all 0.3s;
        }

        .card:hover .hex-border {
            stroke: var(--cyan);
            filter: drop-shadow(0 0 6px var(--cyan));
        }

        .hex-inner {
            fill: var(--bg-dark);
            stroke: none;
        }

        .avatar {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 55px;
            height: 55px;
            clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
        }

        .avatar-glow {
            position: absolute;
            inset: 10px;
            background: radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .card:hover .avatar-glow {
            opacity: 1;
        }

        /* Info */
        .info {
            flex: 1;
            min-width: 0;
        }

        .id-tag {
            font-size: 0.7rem;
            opacity: 0.6;
            margin-bottom: 0.25rem;
        }

        .bracket {
            color: var(--cyan);
        }

        .info h2 {
            font-family: 'Orbitron', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 0 0 10px var(--cyan-glow);
        }

        .status-line {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.7rem;
            opacity: 0.7;
        }

        .status-icon {
            width: 14px;
            height: 14px;
            fill: none;
            stroke: var(--cyan);
            stroke-width: 2;
        }

        .status-icon circle {
            fill: #00ff88;
            stroke: none;
        }

        .pulse {
            width: 6px;
            height: 6px;
            background: #00ff88;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,255,136,0.7); }
            50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(0,255,136,0); }
        }

        /* Arrow */
        .arrow-container {
            width: 40px;
            height: 40px;
            border: 1px solid var(--cyan-dim);
            display: flex;
            align-items: center;
            justify-content: center;
            clip-path: polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%);
            transition: all 0.3s;
            flex-shrink: 0;
        }

        .card:hover .arrow-container {
            border-color: var(--cyan);
            background: var(--cyan);
            box-shadow: 0 0 20px var(--cyan);
        }

        .arrow {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: var(--cyan);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: stroke 0.3s;
        }

        .card:hover .arrow {
            stroke: var(--bg-dark);
        }

        /* Scan Line */
        .scan-line {
            position: absolute;
            left: 20px;
            right: 20px;
            height: 1px;
            background: var(--cyan);
            opacity: 0;
            top: 0;
            box-shadow: 0 0 10px var(--cyan);
        }

        .card:hover .scan-line {
            opacity: 1;
            animation: scan 1.2s ease-in-out infinite;
        }

        @keyframes scan {
            0% { top: 0; }
            100% { top: 140px; }
        }

        /* Empty State */
        .empty {
            text-align: center;
            padding: 4rem;
            opacity: 0.4;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 0.2em;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 2rem;
            font-size: 0.75rem;
            opacity: 0.4;
            letter-spacing: 0.3em;
        }

        .footer-line {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }

        .footer-line::before,
        .footer-line::after {
            content: '';
            width: 50px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--cyan-dim));
        }

        .footer-line::after {
            background: linear-gradient(90deg, var(--cyan-dim), transparent);
        }
    </style>
</head>
<body>
    <div class="bg-grid"></div>

    <header>
        <div class="header-frame">
            <h1 class="logo">INTERN HQ</h1>
            <p class="subtitle">OPERATIVE DASHBOARD</p>
        </div>
        <div class="header-line"></div>
    </header>

    <main>
        <div class="grid">
            ${projects.length ? cards : '<p class="empty">[ NO OPERATIVES DETECTED ]</p>'}
        </div>
    </main>

    <footer>
        <div class="footer-line">
            <span>◇</span>
        </div>
        SYS.ONLINE // ${projects.length} UNIT${projects.length !== 1 ? 'S' : ''} ACTIVE
    </footer>
</body>
</html>`;
}

// Main
console.log('Building...\n');

if (fs.existsSync(PUBLIC)) fs.rmSync(PUBLIC, { recursive: true });
fs.mkdirSync(PUBLIC);

const projects = getProjects();
console.log('Found:', projects.length ? projects.join(', ') : 'none');

for (const name of projects) {
    console.log(`  → ${name}/`);
    copyFolder(path.join(INTERNS_DIR, name), path.join(PUBLIC, name));
}

fs.writeFileSync(path.join(PUBLIC, 'index.html'), generateIndex(projects));
console.log(`\nDone! ${projects.length} project(s)`);
