const fs = require('fs');
const path = require('path');

const { stdout, stdin, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello!\nEnter your text to write to the file\n');

function endProcess() {
  stdout.write('Goodbye!\n');
  exit();
}

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    endProcess();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => {
  stdout.write('\n');
  endProcess();
});