import update = require('log-update');
import chalk from 'chalk';
import watch = require('watch');
import path = require('path');
import fs = require('fs-extra');

interface ObserveOptions {
    watching?:boolean;
    interval:number;
    paths:{path:string, cb:()=>void}[];
}
export function observe({watching:alreadyWatching, interval, paths}:ObserveOptions) {
    const start = new Date();
    console.log(chalk.yellow('Start watching...'));
    
    if (alreadyWatching) {
        // HACK
        // for some reason on re-painting update deletes
        // the line before it, so we throw an empty one in here
        console.log();
    }
    
    // Initialize timer text
    update(chalk.grey('Just now'));
    
    // Set interval to update the timer text, so we can
    // see more easily if a rebuild has just happened
    const timer = setInterval(() => {
        update(chalk.grey(getTimerText(start)));
    }, interval);

    if (!alreadyWatching) {
        paths.forEach(({path:root, cb}) => {
            if (!fs.pathExistsSync(root)) {
                return;
            }
            watch.createMonitor(root, {
                // because manifest.json is in plugin src folder (for skpm) and we are modifying
                // it during the build process to avoid duplication with package.json,
                // we don't want to watch it
                filter: file => path.basename(file) !== 'manifest.json'
            }, (monitor) => {
                monitor.on('created', cb);
                monitor.on('changed', cb);
                monitor.on('removed', cb);
            });
        });
    }

    return timer;
}

export function logError(error:Error) {
    console.log(chalk.bgRed('Compilation failed'));
    console.log(chalk.grey(error.stack));
    console.log();
}

export function getTimerText(start:Date) {
    const diff = (Date.now() - start.getTime()) / 1000;
    let txt:string;
    if (diff < 60) {
        txt = 'Moments ago';
    } else if (diff < 60 * 60) {
        txt = Math.round(diff / 60) + 'mins ago';
    } else if (diff < 60 * 60 * 10) {
        txt = Math.round(diff / (60 * 60 * 10)) + 'hrs ago';
    } else {
        txt = 'A long time ago';
    }
    return txt;
}
