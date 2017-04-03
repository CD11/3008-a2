var express = require('express');
var crypto  = require('crypto');
var router  = express.Router();
var sqlite3 = require('sqlite3').verbose();
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/logins.log', category: 'login'}
  ]
});

/* POST login */
router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var website = req.body.website;
  req.db.all("SELECT * FROM users WHERE username=? AND website=?;", [username, website], function(err, rows) {
    var log = log4js.getLogger('login');
    var hash = crypto.createHash('sha256').update(website+password+rows[0].salt).digest('hex');
    if (hash == rows[0].hash) {
      res.json({'status': 'ok'});
      log.info("successful login", username);
    } else {
      res.json({'status': 'wrong password'});
      log.info("unsuccessful login", username);
      
    }
  });
});

module.exports = router;