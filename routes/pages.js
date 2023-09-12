const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of pages sorted by id in ascending order
router.get('/getPagesList', async function(req, res){
	try {
    const sqlQuery = 'SELECT * FROM page ORDER BY id;';
    const rows = await pool.query(sqlQuery);
    res.status(200).send(rows);
	} catch (error) {
	   res.send(error.message);
	}
});

// To return the layout of a page (passed as input)
router.get('/getPageLayout', async function(req, res){
  try {
    const pageId = req.query.pageId;

    const sqlQuery = 'SELECT layoutId FROM page WHERE id = ?;';
    const row = await pool.query(sqlQuery, [pageId]);
    res.status(200).send(row[0]);
  } catch (error) {
     res.send(error.message);
  }
});

// To update the layout of a page (passed as input)
router.get('/updatePageLayout', async function(req, res){
  try {
    const pageId = req.query.pageId;
    const newLayoutId = req.query.newLayoutId;

    const sqlQuery = 'UPDATE page SET layoutId = ? WHERE id = ?;';
    const result = await pool.query(sqlQuery, [newLayoutId, pageId]);
    res.status(200).send("Success");
  } catch (error) {
     res.send(error.message);
  }
});

// To delete a page (passed as input)
router.get('/deleteAPage', async function(req, res){
  try {
    const pageId = req.query.pageId;

    const sqlQuery = 'DELETE FROM page WHERE id = ?;';
    const result = await pool.query(sqlQuery, [pageId]);
    res.status(200).send("Success");
  } catch (error) {
    res.send(error.message);
  }
});

// To insert a new page in the database
router.get('/insertNewPage', async function(req, res){
  try {
    const pagePath = req.query.pagePath;
    const sidebarSection = req.query.sidebarSection;
    const sidebar = req.query.sidebar;

    if (sidebarSection === '0') {
      const sqlQuery = 'INSERT INTO page (path, sidebar) VALUES (?, ?);';
      const result = await pool.query(sqlQuery, [pagePath, sidebar]);
    } else {
      const sqlQuery = 'INSERT INTO page (path, sidebarSection, sidebar) VALUES (?, ?, ?);';
      const result = await pool.query(sqlQuery, [pagePath, sidebarSection, sidebar]);
    }
    res.status(200).send("Success");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;