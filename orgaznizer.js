const fs = require('fs');

let {words} = require('./src/ES-dict');

let result = {};
Object.keys(words).forEach(letter => {
  let current = words[letter];
  let obj = {};
  current.forEach(function (w) {
    if (w === ''){return;}

    let begginig = w.length > 1
      ? w.slice(0,2)
      : w.slice(0,1);

    begginig = begginig.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    if (obj[begginig]) {
      obj[begginig].push(w);
    } else {
      obj[begginig] = [w];
    }
  });

  Object.keys(obj).forEach(begginig => {
    let data = 'module.exports = ' + JSON.stringify(obj[begginig]);
    let path = `./src/words/${begginig}.js`;
    fs.writeFileSync(path, data);
  })
})
