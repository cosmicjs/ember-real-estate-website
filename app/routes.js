module.exports = function(app) {
    app.get('/api', function(req,res){
      return res.json({
        bucket: process.env.COSMIC_BUCKET,
        writeKey: process.env.COSMIC_WRITE_KEY,
        readKey: process.env.COSMIC_READ_KEY
      });
    });
    app.get('*', function(req, res) {
      var path = require('path');
      res.sendFile(path.join(__dirname, '../public', 'index.html')); // load our public/index.html file
    });

};
