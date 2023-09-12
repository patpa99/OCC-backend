const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of sidebar sections sorted by id in ascending order
router.get('/getSidebarSectionsList', async function(req, res){
  try {
    const sqlQuery = 'SELECT * FROM sidebar_section ORDER BY id;';
    const rows = await pool.query(sqlQuery);
    res.status(200).send(rows);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;