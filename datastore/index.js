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
  // var todos = [];
  fs.readdir('./datastore/data/', 'utf8', (err, files) => {
    if (err) {
      callback(err);
    } else {
      // console.log('FILES', files);
      var todos = _.map(files, function(file) {
        var id = path.basename(file, '.txt');
        // console.log('FILE:', file);
        // console.log('ID:', id);
        return {id: id, text: id};
      });
    }
    // console.log('TODOS', todos);
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
