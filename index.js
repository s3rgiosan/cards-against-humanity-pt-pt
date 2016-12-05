/*global masterCards:true*/
/*eslint-env node*/
"use strict";

var fs = require('fs');
var forEach = require('lodash.foreach');
var map = require('lodash.map');
var mkdirp = require('mkdirp');
var sanitize = require('sanitize-filename');
var uniqBy = require('lodash.uniqby');

require('./data/cards.js');

var expansions = map(uniqBy(masterCards, 'expansion'), 'expansion');
forEach(expansions, function(expansion) {
  let dir = sanitize(expansion.toLowerCase());
  mkdirp('./cards/' + dir);
});
