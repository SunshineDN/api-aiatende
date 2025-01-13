import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

//Criar caminho caso nao exista
if (!fs.existsSync(path.join(__dirname, 'public', 'files'))) {
  fs.mkdirSync(path.join(__dirname, 'public', 'files'), { recursive: true });
}

// Criar um arquivo de texto
fs.writeFileSync(path.join(__dirname, 'public', 'files', 'teste.txt'), 'Hello World!');

console.log(path.join(__dirname, 'public', 'files'));