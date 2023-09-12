const express = require('express');
const router = express.Router();
const pool = require('../dbConnection/database');

// To configure the Host App
router.get('/getHostAppConfig', async function(req, res){
  try {
  	let routes = `
  		{
  		  "routes": [$$$ PAGES $$$]
  		}
  	`;

  	let page = `
	  	{
	      "path": "$$$ PATH $$$",
	      "layout": "$$$ LAYOUT $$$",
	      "applications": [$$$ APPS $$$]
	    }
  	`;

  	let app = `
	  	{
        "name": "$$$ APP_NAME $$$",
        "order": $$$ APP_ORDER $$$
      }
  	`;

    const sqlQuery1 = 'SELECT id, path, layoutId FROM page WHERE layoutId IS NOT NULL ORDER BY id;';
    const rows1 = await pool.query(sqlQuery1);
    let array1 =  [];
  	for (let i in rows1) {
      if (rows1[i].layoutId !== null) {
        array1.push(page);
    		array1[i] = array1[i].replace('$$$ PATH $$$', rows1[i].path);
        array1[i] = array1[i].replace('$$$ LAYOUT $$$', 'http://localhost:3000/layouts/getLayoutJson?layoutId=' + rows1[i].layoutId);
        const sqlQuery2 = 'SELECT appId, appOrder FROM apps_in_pages WHERE pageId = ' + rows1[i].id + ' ORDER BY appOrder;';
        const rows2 = await pool.query(sqlQuery2);
        let array2 = [];
        for (let j in rows2) {
          array2.push(app);
          const sqlQuery3 = 'SELECT name FROM app WHERE id = ' + rows2[j].appId;
          const rows3 = await pool.query(sqlQuery3);
          array2[j] = array2[j].replace('$$$ APP_NAME $$$', rows3[0].name);
          array2[j] = array2[j].replace('$$$ APP_ORDER $$$', rows2[j].appOrder);
        }
        array1[i] = array1[i].replace('$$$ APPS $$$', array2.toString());
      }
  	}
    routes = routes.replace('$$$ PAGES $$$', array1.toString());
    res.status(200).send(routes);
  } catch (error) {
    res.send(error.message);
  }
});

// To configure the Sidebar
router.get('/getSidebarConfig', async function(req, res){
  try {
    let sections = `
      {
        "sections": [$$$ SECTIONS $$$],
        "sectionsNum": $$$ SECTION NUM $$$
      }
    `;

    let page = `
      {
        "link": "$$$ LINK $$$",
        "name": "$$$ NAME $$$"
      }
    `;

    const sqlQuery1 = "SELECT COUNT(*) AS numSidebarSec FROM (SELECT COUNT(*) FROM page WHERE path != '' AND layoutId IS NOT NULL AND sidebarSection IS NOT NULL GROUP BY sidebarSection) AS countSidebarSec;";
    const rows1 = await pool.query(sqlQuery1);
    let sec = '';
    let numSidebarSec = parseInt(rows1[0].numSidebarSec);
    for (let i = 0; i < numSidebarSec; i++) {
      sec += '[$$$$$ SECTION ' + (i+1) + ' $$$$$]';
      if (i < numSidebarSec - 1)
        sec += ',';
    }
    sections = sections.replace('$$$ SECTIONS $$$', sec);
    sections = sections.replace('$$$ SECTION NUM $$$', numSidebarSec);
    
    for (let i = 0; i < numSidebarSec; i++) {
      const sqlQuery2 = "SELECT path FROM page WHERE path != '' AND layoutId IS NOT NULL AND sidebarSection = " + (i+1) + " ORDER BY id;";
      const rows2 = await pool.query(sqlQuery2);
      let array = [];
      for (let j in rows2) {
        array.push(page);
        array[j] = array[j].replace('$$$ LINK $$$', '#/' + rows2[j].path);
        let pageName = rows2[j].path.charAt(0).toUpperCase() + rows2[j].path.slice(1)
        pageName = pageName.replace(/(-)(\S)/g, s=>s.toUpperCase());
        array[j] = array[j].replace('$$$ NAME $$$', pageName);
      }
      sections = sections.replace('$$$ SECTION ' + (i+1) + ' $$$', array.toString());
    }

    res.status(200).send(sections);
  } catch (error) {
    res.send(error.message);
  }
});

// To configure the Header
router.get('/getHeaderConfig', async function(req, res){
  try {
    let pageSidebar = `
      "$$$ PATH $$$": {
        "sidebar": $$$ SIDEBAR $$$
      }
    `;

    const sqlQuery = "SELECT path, sidebar FROM page WHERE layoutId IS NOT NULL ORDER BY id;";
    const rows = await pool.query(sqlQuery);
    let array = [];
    for (let i in rows) {
      array.push(pageSidebar);
      array[i] = array[i].replace('$$$ PATH $$$', rows[i].path);
      if (rows[i].sidebar)
        array[i] = array[i].replace('$$$ SIDEBAR $$$', true);
      else
        array[i] = array[i].replace('$$$ SIDEBAR $$$', false);
    }
    res.status(200).send('{' + array.toString() + '}');
  } catch (error) {
    res.send(error.message);
  }
});

// To configure the Host App Import Map for apps
router.get('/getHostAppImportMapConfigApps', async function(req, res){
  try {
    let importMapApps = `
      {
        "imports": {
          $$$ APPS $$$
        }
      }
    `;

    const sqlQuery = 'SELECT name, path FROM app;';
    const rows = await pool.query(sqlQuery);
    let array = [];
    for (let i in rows)
      array.push('"' + rows[i].name + '": "' + rows[i].path + '"');
    array.push('"@host-app/root-config": "//localhost:9000/host-app-root-config.js"');
    importMapApps = importMapApps.replace('$$$ APPS $$$', array.toString());
    res.status(200).send(importMapApps);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;