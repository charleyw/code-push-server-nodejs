const walk = require('walk');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class AppPacker {
  generateManifest(baseDir) {
    const normalizedPath = path.resolve(baseDir);
    return new Promise((resolve, reject) => {
      const files = [];
      const fileHashes = {};
      const walker = walk.walk(normalizedPath, {filters: ['.gitkeep']});
      walker.on('file', (root, fileStats, next) => {
        fs.readFile(root + '/' + fileStats.name, function (err, buffer) {
          const fileName = (root + '/' + fileStats.name).replace(normalizedPath + '/', '');
          fileHashes[fileName] = crypto.createHash('sha256').update(buffer).digest('hex');
          next();
        });
      });
      walker.on('end', () => {
        const manifest = {
          files: fileHashes,
          version: crypto.createHash('sha256').update(JSON.stringify(Object.keys(fileHashes).map(k => `${k}:${fileHashes[k]}`, []).sort())).digest('hex')
        };
        resolve(manifest)
      })
    })
  }
}

module.exports = AppPacker