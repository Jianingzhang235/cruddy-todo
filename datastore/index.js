const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
// const readFilePromise = Promise.promisify(fs.readFile);


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let file = path.join(exports.dataDir, `${id}.txt`);

    fs.writeFile(file, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: id, text: text});
      }
    });
  });
};

// Solution code is not working either! Nothing does!
// Students mentioned an error with node version so we are giving up this nonsense!
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then((data) => {
        return {id: id, text: data.toString()};
      });
    });
    Promise.all(data).then((results) => callback(null, results));
  });
};

exports.readOne = (id, callback) => {
  let file = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(file, (err, item) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: item.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  let file = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(file, (err, item) => {
    if (!item) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let file = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(file, function(err, item) {

    if (err) {
      callback(err);
    } else {
      callback(null, item);
    }
  });
};



// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
