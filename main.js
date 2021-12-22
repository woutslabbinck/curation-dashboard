/***************************************
 * Title: main.js
 * Description: TODO
 * Author: Wout Slabbinck (wout.slabbinck@ugent.be)
 * Created on 22/12/2021
 *****************************************/
var ACL = require('@treecg/ldes-announcements').fetchAllAnnouncements()
global.window.ACL = ACL
