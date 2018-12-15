const fs = require('fs');

/**
 * @module Thesaurus loads partialThesaurus based on the given word.
 * Exposes some methods.
 */

/** @todo Class */
let thesaurus = { words: {} };

/**
 * Normalizes the word and gets the beggining. If the partial dict hasn't been
 * loaded, loads it into thesaurus.
 * @param {String} word 
 * @returns Normalized word and beggining.
 */
function _checkWord (word) {
  word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  let beggining = word.length > 1
    ? word.slice(0,2)
    : word.slice(0,1);

  _loadPartialDict(beggining);

  return [word, beggining];
}

function _loadPartialDict (beggining) {
  if (!thesaurus.words[beggining]) {
    thesaurus.words[beggining] = require(`./words/${beggining}.js`);
  }
}

/**
 * Checks if a word is included in the thesaurus.
 */
thesaurus.includes = (w) => {
  let [word, beggining] = _checkWord(w);
  const partialDict = thesaurus.words[beggining];

  if (!partialDict) {
    throw "Unexpected error. Partial dictionary hasn't been found.";
  } 

  return _checkPlurals(word, partialDict) ;
}

thesaurus.prefixes = () => {
  count = 0;
  let prefixes = [];
  Object.values(words).forEach(el => el
    .forEach(word => /.*[-]$/.test(word) && prefixes.push(word.replace('-', '')))
  );
  return prefixes;
}

/** Loads all the data in the Thesaurus */
thesaurus.loadAll = () => {
  fs.readdirSync('src/words').forEach(f => _loadPartialDict(f.replace('.js', '')));
}


/**
 * If the word it's a plural, checks its singular form.
 * @param {string} word 
 * @param {object} partialDict 
 * @example 'bueyes' -> first checks buey; 
 * if not included checks bueye
 * and if not included then bueyes
 */
function _checkPlurals (word, partialDict){
  let sing = [word];
  let letters = word.split('');
  letters.pop() === 's' && sing.unshift(letters.join('')); 
  letters.pop() === 'e' && sing.unshift(letters.join(''));

  let isincluded = sing.some(w => {
    return partialDict.includes(w)
  });
  return Boolean(isincluded);
}

module.exports = thesaurus;
