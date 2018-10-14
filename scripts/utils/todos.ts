import fs = require('fs-extra');
import chalk from 'chalk';


async function readDir(dirPath):Promise<number> {
    let todoCnt = 0;
    const searchRegEx = /TODO(.*)/g;
    const list = await fs.readdir(dirPath);
    for (const fileName of list) {
        const fullPath = dirPath + '/' + fileName;
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
            readDir(fullPath);
        } else if (stats.isFile()) {
            const data = await fs.readFile(fullPath, 'utf-8');
            const matchFile = data.match(searchRegEx);
            if (!matchFile) {
                continue;
            }
            console.log('\n' + chalk.underline(fullPath + ': '));
            data.split('\n').forEach((lineContent, line) => {
                const matchLine = lineContent.match(searchRegEx);
                if (matchLine && matchLine.length > 0) {
                    matchLine.forEach((match) => {
                        todoCnt++;
                        console.log(chalk.gray(' *:' + (String(line + 1).padEnd(6, ' ') + match)));
                    });
                }
            });
        }
    }
    return todoCnt;
}

readDir('./src')
.then((todoCnt) => {
    if (todoCnt > 0) {
        console.log(chalk.red.bold('\n✖ ' + todoCnt + ' todos found in code\n'));
    } else {
        console.log(chalk.green.bold('\nGreat, seems you are todo-free\n'));
    }
});
