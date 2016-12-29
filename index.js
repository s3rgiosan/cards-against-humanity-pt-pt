/*global masterCards:true*/
/*eslint-env node*/
"use strict";

var forEach = require('lodash.foreach');
var fs = require('fs');
var groupBy = require('lodash.groupby');
var mkdirp = require('mkdirp');
var sanitize = require('sanitize-filename');

require('./data/cards.js');

/**
 * Process the provided set of questions and answers.
 *
 * @since 1.0.0
 */
var expansions = groupBy(masterCards, 'expansion');
forEach(expansions, function(expansion) {

  let expansionName = '';
  let questions = [];
  let answers = [];

  forEach(expansion, function(card) {

    if (expansionName === '') {
      expansionName = sanitize(card.expansion.toLowerCase());
    }

    let cardType = sanitize(card.cardType.toLowerCase());
    if (cardType !== 'q' && cardType !== 'a') {
      console.error('Invalid card type for expansion %s.', expansionName);
      return;
    }

    if (cardType === 'q') {
      questions.push(card.text);
      return;
    }

    answers.push(card.text);
  });

  let expansionFolder = ['./cards', expansionName].join('/');
  mkdirp(expansionFolder, function(err) {

    if (err) {
      console.error('Could not create the expansion %s folder.', expansionName);
      return;
    }

    if (questions.length > 0) {
      writeFile(questions, expansionFolder, 'questions');
    }

    if (answers.length > 0) {
      writeFile(answers, expansionFolder, 'answers');
    }
  });
});

/**
 * Write a file containing questions or answers for a specific expansion.
 *
 * @since  1.0.0
 * @param  {Array}  data      An array containing questions or answers.
 * @param  {String} path      The expansion folder.
 * @param  {String} type      The type of cards ('questions' or 'answers')
 * @param  {String} expansion The expansion name.
 * @return {File}             A file containing questions or answers.
 */
function writeFile(data, path, type, expansion) {
  fs.writeFile(
    [path, type + '.md'].join('/'),
    data.map(function(value) {
      return value;
    }).join('\n'),
    function(err) {
      if (err) {
        console.error('Could not create the %s file for the expansion %s.', type, expansion);
        return;
      }
    }
  );
}
