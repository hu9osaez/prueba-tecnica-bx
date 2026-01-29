import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';
import mermaid from 'mermaid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const diagramsDir = __dirname;
const outputDir = diagramsDir;

// Crear entorno DOM simulado con todas las propiedades necesarias
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
  beforeParse(window) {
    // Mock DOMPurify en window
    window.DOMPurify = {
      sanitize: (svg) => svg,
      addHook: () => {},
      removeHook: () => {},
      setConfig: () => {},
    };
    window.SVGElement = window.HTMLElement;
  }
});

global.document = dom.window.document;
global.window = dom.window;

// Configurar Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'light',
  themeVariables: {
    background: '#ffffff',
    primaryColor: '#bae6fd',
    primaryTextColor: '#000000',
    primaryBorderColor: '#0ea5e9',
    lineColor: '#64748b',
    secondaryColor: '#fecaca',
    tertiaryColor: '#fde68a',
    fontSize: '16px'
  },
  securityLevel: 'loose',
  logLevel: 'error',
});

async function generateDiagram(mmdFile) {
  const mmdContent = readFileSync(mmdFile, 'utf-8');
  const baseName = mmdFile.replace(/\.mmd$/, '');

  try {
    // Generar SVG
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { svg } = await mermaid.render(id, mmdContent);

    // Guardar SVG
    const svgFile = `${baseName}.svg`;
    writeFileSync(svgFile, svg);

    console.log(`✓ Generated: ${svgFile}`);

    return svgFile;
  } catch (error) {
    console.error(`✗ Error generating ${mmdFile}:`, error.message);
    return null;
  }
}

async function main() {
  const files = readdirSync(diagramsDir).filter(f => f.endsWith('.mmd'));

  console.log(`Found ${files.length} Mermaid files`);

  for (const file of files) {
    const filePath = join(diagramsDir, file);
    await generateDiagram(filePath);
  }

  console.log('\n✓ Done!');
}

main().catch(console.error);
