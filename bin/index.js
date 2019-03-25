#!/usr/bin/env node

'use strict'

const checker = require('../lib/checkSystem.js')
const colors = require('colors')

// set color theme
colors.setTheme({
  success: 'green',
  info: 'grey',
  warn: 'yellow',
  error: 'red',
  boldWarn: ['bold', 'yellow'],
  boldUnderlineSuccess: ['bold', 'underline', 'green'],
  boldUnderlineError: ['bold', 'underline', 'red']
})

console.log('Checking versions...'.info, '\n')

checker(process.argv[2]).then((result) => {
  // check if the process should exit prematurely
  if (result.status != 0) {
    console.log(colors[result.message.type](result.message.text))
    process.exit(result.status)
  }

  // print out results for each package
  result.packages.forEach((p) => {
    if (p.type === 'success') {
      console.log(('✔ ' + colors.bold(p.name) + ' was validated with ' + p.expectedVersion + '.').success)
    } else if (p.type === 'warn') {
      console.log((colors.bold(p.name) + ' was expected, but no validator found!').warn)
    } else if (p.type === 'error' && p.commandError) {
      console.log(('✘ Error validating ' + colors.bold(p.name) + ': ' + p.commandError).error)
    } else if (p.type === 'error' && !p.commandError) {
      console.log((
        '✘ ' + colors.bold(p.name) +
                ' version is incorrect! Expected ' +
                p.expectedVersion + ' but was ' + p.foundVersion + '.'
      ).error)
    }
  })

  // print out a summary message
  if (result.message.type === 'success') {
    console.log('\n', result.message.text.boldUnderlineSuccess)
  } else {
    console.log('\n', result.message.text.boldUnderlineError)
    process.exit(1)
  }
})
