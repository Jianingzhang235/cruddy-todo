const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  fs.readdir('./datastore/data/', 'utf8', (err, files) => {
    if (err) {
      callback(err);
    } else {
      console.log('FILES', files);
      var todos = _.map(files, function(file) {
        var id = path.basename(file, '.txt');
        console.log('FILE:', file);
        console.log('ID:', id);
        return {id: id, text: file};
      });
    }
    // console.log('todos', todos);
    callback(null, todos);
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
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
