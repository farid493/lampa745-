(function () {
    'use strict';

    window.turkish_raw_test = 'LOADED';

    setTimeout(function () {
        var box = document.createElement('div');

        box.style.position = 'fixed';
        box.style.left = '20px';
        box.style.top = '20px';
        box.style.zIndex = '999999';
        box.style.padding = '20px';
        box.style.background = '#00aa66';
        box.style.color = '#ffffff';
        box.style.fontSize = '24px';
        box.style.fontWeight = 'bold';

        box.textContent = '🇹🇷 TURKISH JS EXECUTED';

        document.body.appendChild(box);
    }, 1000);
})();
