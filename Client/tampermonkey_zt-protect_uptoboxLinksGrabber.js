// ==UserScript==
// @name         zt-protect - Uptobox links grabber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Grab uptobox links from zt-protect.com and redirect to downloadLinks generator service
// @author       Maxime Vernusset
// @match        https://zt-protect.com/*
// @grant        none
// ==/UserScript==

const user = 'USER';
const password = 'PASSWORD';
const uptoboxLinksGeneratorUrl = 'URL';

async function sha256(message) {
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

async function generateToken() {
    const hashedPassword = await sha256(password);
    const decodedToken = {
        user,
        hashedPassword,
        timestamp: Date.now()
    };
    return btoa(JSON.stringify(decodedToken));
}

(function() {
    'use strict';
    const links = [];
    for (let span of document.getElementsByClassName('showURL')) {
        links.push(encodeURI(span.parentElement.href));
    }
    if (links.length > 0) {
        generateToken().then(token => document.location=encodeURI(`${uptoboxLinksGeneratorUrl}?token=${token}&links=${JSON.stringify(links)}`));
    }
})();
