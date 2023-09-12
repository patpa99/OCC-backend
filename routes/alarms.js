const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');


// To return the list of the first 5 alarms sorted in ascending order by id
router.get('/get5AlarmsList', async function(req, res){
	try {
    let alarmsJson = `
    {
      "alarmList": [
        $$$ ALARM_LIST $$$
      ],
      "alarmHeader": [
        "Priority",
        "Location",
        "Subsystem",
        "Affected Device",
        "Description",
        "Initial Time"
      ]
    }`;
    const sqlQuery1 = 'SELECT priority, location, subsystem, affectedDevice, description, initialTime FROM alarm ORDER BY id LIMIT 5;';
    const rows1 = await pool.query(sqlQuery1);
    const sqlQuery2 = 'SELECT COUNT(*) AS num_rows FROM (SELECT priority, location, subsystem, affectedDevice, description, initialTime FROM alarm ORDER BY id LIMIT 5) table_results;';
    const rows2 = await pool.query(sqlQuery2);
    let str = '';
    for(let i = 0; i < parseInt(rows2[0].num_rows); i++) {
      str += '[$$$$$ ALARM_LIST' + (i+1) + ' $$$$$]';
      if(i !== parseInt(rows2[0].num_rows)-1)
        str += ',';
    }
    alarmsJson = alarmsJson.replace('$$$ ALARM_LIST $$$', str);
    let array, datetime, datetimeToInsert;
    for(let j in rows1) {
      array = []
      datetime = new Date(rows1[j].initialTime);
      datetimeToInsert = ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2) + ' ' + ('0' + datetime.getDate()).slice(-2) + '-' + ('0' + datetime.getMonth()).slice(-2) + '-' + datetime.getFullYear();
      array.push('"' + rows1[j].priority + '"', '"' + rows1[j].location + '"', '"' + rows1[j].subsystem + '"', '"' + rows1[j].affectedDevice + '"', '"' + rows1[j].description + '"', '"' + datetimeToInsert + '"');
      alarmsJson = alarmsJson.replace('$$$ ALARM_LIST' + (parseInt(j)+1) + ' $$$', array.toString());
    }
    res.status(200).send(alarmsJson);
	} catch (error) {
	   res.send(error.message);
	}
});

// To return the list of all alarms sorted in ascending order by id
router.get('/getAllAlarmsList', async function(req, res){
  try {
    let alarmsJson = `
    {
      "alarmList": [
        $$$ ALARM_LIST $$$
      ],
      "alarmHeader": [
        "Priority",
        "Location",
        "Subsystem",
        "Affected Device",
        "Description",
        "Initial Time"
      ]
    }`;
    const sqlQuery1 = 'SELECT priority, location, subsystem, affectedDevice, description, initialTime FROM alarm ORDER BY id;';
    const rows1 = await pool.query(sqlQuery1);
    const sqlQuery2 = 'SELECT COUNT(*) AS num_rows FROM (SELECT priority, location, subsystem, affectedDevice, description, initialTime FROM alarm ORDER BY id) table_results;';
    const rows2 = await pool.query(sqlQuery2);
    let str = '';
    for(let i = 0; i < parseInt(rows2[0].num_rows); i++) {
      str += '[$$$$$ ALARM_LIST' + (i+1) + ' $$$$$]';
      if(i !== parseInt(rows2[0].num_rows)-1)
        str += ',';
    }
    alarmsJson = alarmsJson.replace('$$$ ALARM_LIST $$$', str);
    let array, datetime, datetimeToInsert;
    for(let j in rows1) {
      array = []
      datetime = new Date(rows1[j].initialTime);
      datetimeToInsert = ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2) + ' ' + ('0' + datetime.getDate()).slice(-2) + '-' + ('0' + datetime.getMonth()).slice(-2) + '-' + datetime.getFullYear();
      array.push('"' + rows1[j].priority + '"', '"' + rows1[j].location + '"', '"' + rows1[j].subsystem + '"', '"' + rows1[j].affectedDevice + '"', '"' + rows1[j].description + '"', '"' + datetimeToInsert + '"');
      alarmsJson = alarmsJson.replace('$$$ ALARM_LIST' + (parseInt(j)+1) + ' $$$', array.toString());
    }
    res.status(200).send(alarmsJson);
  } catch (error) {
     res.send(error.message);
  }
});

module.exports = router;