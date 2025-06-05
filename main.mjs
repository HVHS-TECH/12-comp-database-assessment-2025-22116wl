/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by Wilfred Leicester, Term 2 2025
/**************************************************************/

import { fb_initialise, fb_authenticate, fb_authChanged, fb_logout, fb_read, fb_write, fb_update, fb_readSorted, fb_delete } from './fb.mjs';
window.fb_initialise = fb_initialise;
window.fb_authenticate = fb_authenticate;
window.fb_authChanged = fb_authChanged;
window.fb_logout = fb_logout;
window.fb_read = fb_read;
window.fb_write = fb_write;
window.fb_update = fb_update;
window.fb_readSorted = fb_readSorted;
window.fb_delete = fb_delete;
window.Submit = Submit;

fb_initialise();

var game;

