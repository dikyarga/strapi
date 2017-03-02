'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const chalk = require('chalk');

// Utils
const textInput = require('../utils/input/text');

function rightPad(string, n = 12) {
  n -= string.length;
  return string + ' '.repeat(n > -1 ? n : 0);
}

module.exports = async () => {
  const state = {
    error: undefined,

    code: {
      label: rightPad('Code'),
      mask: 'code',
      placeholder: '######',
      validateKeypress: (data, value) => (
        /\d/.test(data) && value.length < 7
      ),
      validateValue: data => data.trim().length === 6
    }
  };

  async function render() {
    for (const key in state) {
      if (!Object.hasOwnProperty.call(state, key)) {
        continue;
      }

      const piece = state[key];
      if (typeof piece === 'string') {
        console.log(piece);
      } else if (typeof piece === 'object') {
        let result;

        try {
          result = await textInput({
            label: '- ' + piece.label,
            initialValue: piece.initialValue || piece.value,
            placeholder: piece.placeholder,
            mask: piece.mask,
            validateKeypress: piece.validateKeypress,
            validateValue: piece.validateValue,
            autoComplete: piece.autoComplete
          });

          piece.value = result;

          process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${result}\n`);
        } catch (err) {
          if (err.message === 'USER_ABORT') {
            process.exit(1);
          } else {
            console.error(err);
          }
        }
      }
    }

    return state.code.value;
  }


  return render().catch(console.error);
};