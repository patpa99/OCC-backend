const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of languages sorted by id in ascending order
router.get('/getLanguagesList', async function(req, res){
	try {
    const sqlQuery = 'SELECT language FROM language ORDER BY id;';
    const rows = await pool.query(sqlQuery);
    res.status(200).send(rows);
	} catch (error) {
	   res.send(error.message);
	}
});

// To return the language of a user (passed in as input)
router.get('/getUserLanguageFromId', async function(req, res){
  try {
    const userId = req.query.userId;

    const sqlQuery1 = 'SELECT language FROM user WHERE id = ?;';
    const rows1 = await pool.query(sqlQuery1, [userId]);
    const sqlQuery2 = 'SELECT language FROM language WHERE id = ?;';
    const rows2 = await pool.query(sqlQuery2, [rows1[0].language]);
    res.status(200).send(rows2[0].language);
  } catch (error) {
     res.send(error.message);
  }
});

// To set the language of a user (passed in as input)
router.get('/setUserLanguage', async function(req, res){
  try {
    const language = req.query.language;
    const userId = req.query.userId;

    const sqlQuery1 = 'SELECT id FROM language WHERE language = ?;';
    const rows1 = await pool.query(sqlQuery1, [language]);
    const sqlQuery2 = 'UPDATE user SET language = ? WHERE id = ?;';
    const rows2 = await pool.query(sqlQuery2, [rows1[0].id, userId]);
    res.status(200).send("Success");
  } catch (error) {
     res.send(error.message);
  }
});

module.exports = router;