const paths = require('./paths');
const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const collectSass = require('rollup-plugin-collect-sass');
const nodeResolve = require('rollup-plugin-node-resolve');
const htmlTemplate = require('rollup-plugin-generate-html-template');

exports.input = paths.entry.map((entry) => {
    return {
        input: path.join(paths.src, 'ts', `${entry}.ts`),
        plugins: [
            nodeResolve(),
            typescript({
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

exports.output = paths.entry.map((entry) => {
    return {
        format: 'iife',
        file: path.join(paths.build, `${entry}.js`)
    };
});