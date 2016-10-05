#!/usr/bin/env node
'use strict';
const program = require('commander');
const cli = require('../cli');

function errorHandler(error) {
  process.stderr.write(error);
  process.exit(error.code || 1);
}

cli.configure(program, process.argv);
if (!program.args.length) {
    program.help();
    return;
}

cli.execute(program.args, program.type)
   .then(result => {
     process.stdout.write(result);
     process.exitCode = 0;
   })
   .catch(error => errorHandler);

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
