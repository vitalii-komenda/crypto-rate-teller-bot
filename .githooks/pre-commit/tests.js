#!/usr/bin/env node
const { exec } = require('child_process');
console.log('Checking unit tests');
exec('npm test', (err, stdout, stderr) => {
    if (err) {
        console.error('Unit Tests failed', err);
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        process.exit(1);
        return;
    }
});

console.log('Checking eslint');
exec('npm run eslint', (err, stdout, stderr) => {
    if (err) {
        console.error('eslint failed', err);
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        process.exit(1);
        return;
    }
});