const path = require('path');
const { readdir, stat } = require('fs/promises');
const options = { withFileTypes: true };
readdir(path.join(__dirname, 'secret-folder'), options)
  .then(contents => contents
    .forEach(dirent => {
      if (dirent.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', dirent.name);
        const extension = path.extname(filePath);
        const fileName = path.basename(filePath, extension);
        stat(filePath)
          .then(stats => {
            console.log(`${fileName} - ${extension.replace('.', '')} - ${stats.size}b`);
          })
          .catch(error => console.log(error.message, 'trouble to stats!'));
      }
    })
  )
  .catch(error => console.log(error.message, 'trouble to contents!'));
