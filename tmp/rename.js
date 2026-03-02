const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [from, to] of replacements) {
        if (content.includes(from)) {
            content = content.split(from).join(to);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir, extensions) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
            files.push(...walkDir(full, extensions));
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
            files.push(full);
        }
    }
    return files;
}

const replacements = [
    ['BBC Cakes', 'Janta Bakery'],
    ['bbccakes', 'jantabakery'],
    ['BBC cakes', 'Janta Bakery'],
];

const frontendDir = path.join(__dirname, '..', 'frontend');
const allFiles = walkDir(frontendDir, ['.jsx', '.js', '.html', '.json', '.xml', '.txt', '.css']);

for (const file of allFiles) {
    replaceInFile(file, replacements);
}

console.log('Done!');
