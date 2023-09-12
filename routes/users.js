const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');
const bcrypt = require('bcrypt');


// To return data of a user from the id (passed in as input)
router.get('/getUserById', async function(req, res){
	try {
    const userId = req.query.userId;

    const sqlQuery = 'SELECT name, surname, username, admin FROM user WHERE id = ?;';
    const rows = await pool.query(sqlQuery, [userId]);
    res.status(200).send(rows[0]);
	} catch (error) {
	   res.send(error.message);
	}
});

/*
* To update data of a user from the id (passed in as input).
* 
* The username must be between 6 and 12 characters long and accepts lowercase letters,
* uppercase letters, digits and special characters (such as "-", "_" and ".").
*/
router.get('/updateUserById', async function(req, res){
  try {
    const userId = req.query.userId;
    const name = req.query.name;
    const surname = req.query.surname;
    const username = req.query.username;

    const nameSurnameRegex = /^[a-zA-Zàèéìòù' ]+$/;
    const usernameRegex = /^[a-zA-Z\d-_.]{6,12}$/;
    if (name !== null && surname !== null && username !== null && name !== '' && surname !== '' && nameSurnameRegex.test(name.trim()) && nameSurnameRegex.test(surname.trim()) && usernameRegex.test(username.trim())) {
      const sqlQuery = 'UPDATE user set name = ?, surname = ?, username = ? WHERE id = ?;';
      const rows = await pool.query(sqlQuery, [name.trim(), surname.trim(), username.trim(), userId]);
      res.status(200).send("Success");
    } else {
      res.status(200).send("Error1");
    }
  } catch (error) {
     res.send(error.message);
  }
});

/* 
* To update the password of a user from the id (passed in as input).
* 
* The password must be between 8 and 20 characters long, must contain at least one
* lowercase letter, one uppercase letter, one numeric digit and one special character.
*/
router.post('/updatePswUserById', async function(req, res){
  try {
    const userId = req.body.userId;
    const oldPsw = req.body.oldPsw;
    const newPsw = req.body.newPsw;
    const repeatNewPsw = req.body.repeatNewPsw;

    const pswRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    if (oldPsw !== null && newPsw !== null && repeatNewPsw !== null && pswRegex.test(oldPsw) && pswRegex.test(newPsw) && newPsw === repeatNewPsw) {
      const sqlQuery1 = 'SELECT password FROM user WHERE id = ?;';
      const rows1 = await pool.query(sqlQuery1, [userId]);
      bcrypt
        .compare(oldPsw, rows1[0].password)
        .then(result => {
          if (result) {
            bcrypt
            .hash(newPsw, 15)
            .then(async newPswHashed => {
              const sqlQuery2 = 'UPDATE user SET password = ? WHERE id = ?;';
              const rows2 = await pool.query(sqlQuery2, [newPswHashed, userId]);
              res.status(200).send("Success");
            })
            .catch(err => res.status(200).send("Error"));
          } else {
            res.status(200).send("Error1");
          }
        })
      .catch(err => res.status(200).send("Error"));
    } else {
      res.status(200).send("Error2");
    }
  } catch (error) {
     res.send("Error");
  }
});

module.exports = router;