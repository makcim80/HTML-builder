const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const { join } = require('path');
const pathFolderCopied = join(__dirname, 'files');
const pathDirCreation = join(__dirname, 'files-copy');
const options = { withFileTypes: true };

function copyDir() {
  rm(pathDirCreation, { force: true, recursive: true })
    .then(() => {
      mkdir(pathDirCreation, { recursive: true })
        .then(() => {
          readdir(pathFolderCopied, options)
            .then(contents => contents
              .forEach(dirent => {
                if (dirent.isFile()) {
                  const pathFileCopied = join(pathFolderCopied, dirent.name);
                  const pathFileCreation = join(pathDirCreation, dirent.name);
                  copyFile(pathFileCopied, pathFileCreation)
                    .then()
                    .catch(error => console.log(error.message, 'trouble to file!'));
                }
              })
            )
            .catch(error => console.log(error.message, 'trouble to contents!'));
        })
        .catch(error => console.log(error.message, 'trouble to dir!'));
    })
    .catch(error => console.log(error.message, 'trouble to clearing!'));
}

copyDir();
