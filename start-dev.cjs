// Dev server launcher — uses absolute paths so it works from any CWD
const { spawn } = require('child_process');
const path = require('path');

// Always resolve relative to this file's location (project root)
const projectRoot = __dirname;
const tsxPath = path.join(projectRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const entryPoint = path.join(projectRoot, 'server', '_core', 'index.ts');

const env = {
  ...process.env,
  NODE_ENV: 'development',
  // Ensure dotenv looks in project root
  PWD: projectRoot,
};

const child = spawn(process.execPath, [tsxPath, 'watch', entryPoint], {
  stdio: 'inherit',
  env,
  cwd: projectRoot,
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code ?? 0));
