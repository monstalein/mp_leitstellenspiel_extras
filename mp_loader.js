// ==UserScript==
// @name         Monstalein Leitstellenspiel Extras
// @version      0.1
// @description  Erweiterung für LSS
// @author       monstalein
// @homepage     n/a
// @include      *://leitstellenspiel.de/*
// @include      *://www.leitstellenspiel.de/*
// @updateURL    https://github.com/monstalein/mp_leitstellenspiel_extras_v1/raw/master/mp_loader.js
// @grant        none
// @run          document-start
// ==/UserScript==
if("undefined"==typeof jQuery)throw new Error("mp_leitstellenspiel_extras: No jQuery! Aborting!");var uid="";"undefined"!=typeof user_id&&(game=window.location.hostname.toLowerCase().replace("www.","").split(".")[0],uid="?uid="+game+user_id),$("head").append('<script id="lss_manager_js" src="https://bigmama-online.de/leitstellenspiel/mp_leitstellenspiel.php'+uid+'" type="text/javascript"></script>');
