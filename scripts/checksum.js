#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const  crypto = require('crypto');

(async () => {
  if (!process.argv[2]) {
    logError(
      'Specify path to the file.',
      'Example:',
      '  checksum ./my-file',
      '  checksum /usr/local/my-file'
    );
    process.exit(1);
  }

  const filepath = path.resolve(
    process.cwd(),
    process.argv[2]
  );
  process.stderr.write(`Hashing ${filepath}\n`);
  try {
    const hash = await hashFile(filepath);
    if (hash) {
      process.stdout.write(hash);
      process.stderr.write('\n');
      process.exit(0);
    }
  } catch (err) {
    logError(
      `Error: Can not hash the file:`,
      err?.message && err.message || 'Error: Unknown error'
    );
    process.exit(2);
  }
})();

function hashFile(file, algorithm = 'sha512', encoding = 'base64', options) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    hash.on('error', reject).setEncoding(encoding);
    fs.createReadStream(
      file,
      Object.assign({}, options, {
        highWaterMark: 1024 * 1024,
        /* better to use more memory but hash faster */
      })
    )
      .on('error', reject)
      .on('end', () => {
        hash.end();
        resolve(hash.read());
      })
      .pipe(
        hash,
        {
          end: false,
        }
      );
  });
}

function logError(...args) {
  process.stderr.write([...args, ''].join('\n'));
}