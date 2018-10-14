import paths from './paths';
import path = require('path');
import typescript = require('rollup-plugin-typescript2');
import collectSass = require('rollup-plugin-collect-sass');
import nodeResolve = require('rollup-plugin-node-resolve');
import htmlTemplate = require('rollup-plugin-generate-html-template');

const input = paths.entry.map((entry) => {
    return {
        input: path.join(paths.src, 'ts', `${entry}.ts`),
        plugins: [
            nodeResolve(),
            (typescript as any)({
                tsconfig: paths.tsconfig,
                typescript: require('typescript')
            }),
            collectSass({
                importOnce: true
            }),
            htmlTemplate({
                  template: path.join(paths.src, `${entry}.html`),
                  target: `${entry}.html`,
            }),
        ]
    };
});

const output = paths.entry.map((entry) => {
    return {
        format: 'iife' as 'iife',
        file: path.join(paths.build, `${entry}.js`)
    };
});

export {
    input,
    output
};
