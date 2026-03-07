const { spawn } = require('child_process');
const readline = require('readline');

// Proxy de routage pour Chrome-DevTools MCP
// Objectif : Remplacer les noms d'outils contenant des '.' par '_' pour satisfaire Antigravity
// et les rétablir lors de l'appel effectif pour le serveur MCP original.

const child = spawn('bunx', [
  '-y',
  'chrome-devtools-mcp@latest',
  '--no-usage-statistics',
  '--browser-url=http://127.0.0.1:9222'
], { 
  stdio: ['pipe', 'pipe', 'inherit'], 
  env: process.env 
});

// Interception sortante : MCP Server -> Antigravity/Claude Code
const rl = readline.createInterface({ input: child.stdout });
rl.on('line', (line) => {
  try {
    let msg = JSON.parse(line);
    // On sanitise les noms d'outils renvoyés lors de l'énumération list_tools
    if (msg.result?.tools) {
      msg.result.tools = msg.result.tools.map((t) => ({ 
        ...t, 
        name: t.name.replace(/\./g, '_') 
      }));
    }
    process.stdout.write(JSON.stringify(msg) + '\n');
  } catch (e) {
    // Si ce n'est pas du JSON ou une erreur de parsing, on laisse passer le flux tel quel
    process.stdout.write(line + '\n');
  }
});

// Interception entrante : Antigravity/Claude Code -> MCP Proxy -> MCP Server
const reader = readline.createInterface({ input: process.stdin });
reader.on('line', (line) => {
  try {
    let msg = JSON.parse(line);
    // On rétablit les '.' pour l'exécution effective par le serveur original
    if (msg.method === 'tools/call' && msg.params?.name?.includes('_')) {
      msg.params.name = msg.params.name.replace(/_/g, '.');
    }
    child.stdin.write(JSON.stringify(msg) + '\n');
  } catch (e) {
    child.stdin.write(line + '\n');
  }
});

child.on('exit', (code) => {
  process.exit(code);
});
