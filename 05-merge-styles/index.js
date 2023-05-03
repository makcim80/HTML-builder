const { createReadStream, createWriteStream } = require('fs');
const { readdir } = require('fs/promises');
const { join, extname } = require('path');
const pathFolderStyles = join(__dirname, 'styles');
const pathFileBundle = join(__dirname, 'project-dist', 'bundle.css');
const options = { withFileTypes: true };
const output = createWriteStream(pathFileBundle);

readdir(pathFolderStyles, options)
  .then(contents => contents
    .forEach(dirent => {
      const pathFileStyle = join(__dirname, 'styles', dirent.name);
      if (dirent.isFile() && extname(pathFileStyle) === '.css') {
        const input = createReadStream(pathFileStyle, 'utf-8');
        input.pipe(output);
      }
    })
  )
  .catch(error => console.log(error.message, 'trouble to contents!'));