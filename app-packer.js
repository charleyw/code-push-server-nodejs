const walk = require('walk');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const diff = require('deep-diff').diff;
const archiver = require('archiver');

class AppPacker {
  generateManifest(baseDir) {
    const normalizedPath = path.resolve(baseDir);
    return new Promise((resolve, reject) => {
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

  createUpdatePackage(newManifest, oldManifest, sourceFileDir, outputStream) {
    const diffResults = diff(oldManifest.files, newManifest.files);
    const filesToAdd = [];
    const filesToDelete = [];
    diffResults.forEach(d => {
      switch(d.kind) {
        case 'E':
        case 'N':
          filesToAdd.push(d.path.join());
          break;
        case 'D':
          filesToDelete.push(d.path.join());
          break;
      }
    });

    const archive = archiver('zip', {store: true});
    archive.pipe(outputStream);

    archive.on('error', function(err) {
      throw err;
    });

    filesToAdd.forEach(fileName => archive.append(fs.createReadStream(sourceFileDir + '/' + fileName), {name: fileName}));
    archive.append(new Buffer(JSON.stringify({deletedFiles: filesToDelete})), {name: 'hotcodepush.json'});
    archive.finalize();
  }
}

module.exports = AppPacker;