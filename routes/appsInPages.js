const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of apps contained on a page (passed as input) sorted by app order in ascending order
router.get('/getAppsInAPage', async function(req, res){
  try {
    const pageId = req.query.pageId;

    const sqlQuery = 'SELECT appId, appOrder FROM apps_in_pages WHERE pageId = ? ORDER BY appOrder;';
    const rows = await pool.query(sqlQuery, [pageId]);
    res.status(200).send(rows);
  } catch (error) {
    res.send(error.message);
  }
});

// To insert an app on a page (passed as input)
router.get('/insertAppsInAPage', async function(req, res){
  try {
    const newPageId = req.query.newPageId;
    const newAppId = req.query.newAppId;
    const newAppOrder = req.query.newAppOrder;

    const sqlQuery = 'INSERT INTO apps_in_pages (pageId, appId, appOrder) VALUES (?, ?, ?);';
    const result = await pool.query(sqlQuery, [newPageId, newAppId, newAppOrder]);
    res.status(200).send("Success");
  } catch (error) {
    res.send(error.message);
  }
});

// To delete all apps contained on a page (passed as input)
router.get('/deleteAppsInAPage', async function(req, res){
  try {
    const pageId = req.query.pageId;

    const sqlQuery = 'DELETE FROM apps_in_pages WHERE pageId = ?;';
    const result = await pool.query(sqlQuery, [pageId]);
    res.status(200).send("Success");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;