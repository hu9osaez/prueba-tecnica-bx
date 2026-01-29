import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const diagramsDir = __dirname;

function encodeBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64url');
}

async function generatePng(mmdFile) {
  const mmdContent = readFileSync(mmdFile, 'utf-8');
  const baseName = mmdFile.replace(/\.mmd$/, '');

  try {
    // Usar mermaid.ink para generar PNG
    const encoded = encodeBase64(mmdContent);
    const url = `https://mermaid.ink/img/${encoded}?type=png&bgColor=ffffff`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    // Guardar PNG
    const pngFile = `${baseName}.png`;
    writeFileSync(pngFile, response.data);

    console.log(`✓ Generated: ${pngFile}`);

    return pngFile;
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
    await generatePng(filePath);
  }

  console.log('\n✓ Done!');
}

main().catch(console.error);
