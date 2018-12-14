let thesaurus = { dict: {}};

function _checkWord (word) {
  word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

  let begginig = word.length > 1
    ? word.slice(0,2)
    : word.slice(0,1);

  if (!thesaurus.dict[begginig]) {
    thesaurus.dict[begginig] = require(`./words/${begginig}.js`);
  }
  return [word, begginig];
}


thesaurus.includes = (w) => {
  let [word, begginig] = _checkWord(w);
  const partialDict = thesaurus.dict[begginig];

  return partialDict && checkPlurals(word, partialDict) ;
}

thesaurus.prefixes = () => {
  count = 0;
  let prefixes = [];
  Object.values(words).forEach(el => el
    .forEach(word => /.*[-]$/.test(word) && prefixes.push(word.replace('-', '')))
  );
  return prefixes;
}

function checkPlurals (word, partialDict){
  let sing = [word];
  let letters = word.split('');
  letters.pop() === 's' && sing.push(letters.join('')); 
  letters.pop() === 'e' && sing.push(letters.join(''));

  let isincluded = sing.some(w => {
    return partialDict.includes(w)
  });
  return Boolean(isincluded);
}

module.exports = thesaurus;
