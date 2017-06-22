module.exports = function(app) {
       app.get('*', function(req, res) {
          var path = require('path');
          res.sendFile(path.join(__dirname, '../public', 'index.html')); // load our public/index.html file
       });
};
