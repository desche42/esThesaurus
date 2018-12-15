const fs = require('fs');

/**
 * Contains all words of the thesaurus.
 */
let Thesaurus = require('./thesaurus');
Thesaurus.loadAll();
let words = Thesaurus.words;

Object.keys(words).forEach(letter => {
  let current = words[letter];
  let obj = {};
  current.forEach(function (w) {
    if (w === ''){return;}

    let beggining = w.length > 1
      ? w.slice(0,2)
      : w.slice(0,1);

    beggining = beggining.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    if (obj[beggining]) {
      obj[beggining].push(w);
    } else {
      obj[beggining] = [w];
    }
  });

  Object.keys(obj).forEach(beggining => {
    let data = 'module.exports = ' + JSON.stringify(obj[beggining]);
    let path = `./src/words/${beggining}.js`;
    fs.writeFileSync(path, data);
  })
})
