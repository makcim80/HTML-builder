const { createReadStream, createWriteStream } = require('fs');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const { join, extname } = require('path');

const pathFolderStyles = join(__dirname, 'styles');
const pathFolderComponents = join(__dirname, 'components');
const pathFolderAssets = join(__dirname, 'assets');
const pathFileTemplate = join(__dirname, 'template.html');
const pathFolderNew = join(__dirname, 'project-dist');
const pathFileStyle = join(__dirname, 'project-dist', 'style.css');
const pathFileIndex = join(__dirname, 'project-dist', 'index.html');
const pathFolderAssetsCopy = join(__dirname, 'project-dist', 'assets');
const options = { withFileTypes: true };

function replaceComponent(template) {
  let data = template;
  const name = data.match(/(?<={{)\w+(?=}})/)[0];
  const pathComponent = join(pathFolderComponents, `${name}.html`);
  const streamComponent = createReadStream(pathComponent, 'utf-8');
  let component = '';

  streamComponent.on('data', chunk => component += chunk);
  streamComponent.on('end', () => {
    data = data.replace(`{{${name}}}`, component);
    if (data.match(/(?<={{)\w+(?=}})/)) {
      replaceComponent(data);
    } else {
      const outputIndex = createWriteStream(pathFileIndex);

      outputIndex.write(data);
    }
  });
  streamComponent.on('error', error => console.log('Error', error.message, `reading ${name}.html`));
}

function createFileIndex() {
  const stream = createReadStream(pathFileTemplate, 'utf-8');
  let template = '';

  stream.on('data', chunk => template += chunk);
  stream.on('end', () => {
    replaceComponent(template);
  });
  stream.on('error', error => console.log('Error', error.message, 'reading template.html'));
}

function createFileStyle() {
  const outputStyle = createWriteStream(pathFileStyle);

  readdir(pathFolderStyles, options)
    .then(contents => contents
      .forEach((dirent, index, array) => {
        const pathToFileStyle = join(pathFolderStyles, dirent.name);

        if (dirent.isFile() && extname(pathToFileStyle) === '.css') {
          const input = createReadStream(pathToFileStyle, 'utf-8');
          let style = '';

          input.on('data', chunk => style += chunk);
          input.on('end', () => {
            outputStyle.write(style);
            if (index >= 0 && index < array.length) {
              outputStyle.write('\n');
            }
          });
          input.on('error', error => console.log('Error', error.message));
        }
      })
    )
    .catch(error => console.log(error.message, 'trouble to styles'));
}

function copyDir(pathOriginal, pathCopy) {
  mkdir(pathCopy, { recursive: true })
    .then(() => {
      readdir(pathOriginal, options)
        .then(contents => contents
          .forEach(dirent => {
            const pathElementOriginal = join(pathOriginal, dirent.name);
            const pathElementCopy = join(pathCopy, dirent.name);

            if (dirent.isFile()) {
              copyFile(pathElementOriginal, pathElementCopy)
                .then()
                .catch(error => console.log(error.message, 'trouble to file!'));
            } else {
              copyDir(pathElementOriginal, pathElementCopy);
            }
          })
        )
        .catch(error => console.log(error.message, 'trouble to copying'));
    })
    .catch(error => console.log(error.message, 'trouble to folder!'));
}

rm(pathFolderNew, { force: true, recursive: true })
  .then(() => {
    mkdir(pathFolderNew, { recursive: true })
      .then(() => {
        createFileIndex();
        createFileStyle();
        copyDir(pathFolderAssets, pathFolderAssetsCopy);
      })
      .catch(error => console.log(error.message, 'trouble to dir!'));
  })
  .catch(error => console.log(error.message, 'trouble to clearing!'));

