const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of apps sorted by id in ascending order
router.get('/getAppsList', async function(req, res){
  try {
    const sqlQuery = 'SELECT id, name FROM app ORDER BY id;';
    const rows = await pool.query(sqlQuery);
    res.status(200).send(rows);
  } catch (error) {
    res.send(error.message);
  }
});

// To insert a new app into the database
router.get('/insertNewApp', async function(req, res){
  const appName = req.query.appName;
  const appPath = req.query.appPath;

  try {
    if (appName !== null && appPath !== null && appName.trim() !== '' && appPath.trim() !== '') {
      const sqlQuery = 'INSERT INTO app (name, path) VALUES (?, ?);';
      const rows = await pool.query(sqlQuery, [appName.trim(), appPath.trim()]);
      res.status(200).send("Success");
    } else {
      res.status(200).send("Error1");
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;