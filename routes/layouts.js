const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of layout images
router.get('/getLayoutImagesList', async function(req, res){
  try {
    const sqlQuery = 'SELECT id, image FROM layout;';
    const rows = await pool.query(sqlQuery);
    res.status(200).send(rows);
  } catch (error) {
    res.send(error.message);
  }
});

// To return the layout json of a layout (passed as input)
router.get('/getLayoutJson', async function(req, res){
  try {
    const layoutId = req.query.layoutId;

    const sqlQuery = 'SELECT layoutJson FROM layout WHERE id = ?;';
    const rows = await pool.query(sqlQuery, [layoutId]);
    res.status(200).send(rows[0].layoutJson);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;