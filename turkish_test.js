(function () {
    'use strict';

    if (typeof Lampa === 'undefined') {
        return;
    }

    Lampa.Noty.show('🇹🇷 TURKISH PLUGIN LOADED', {
        time: 10000
    });

    Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;

        Lampa.Noty.show('FULL EVENT WORKS', {
            time: 5000
        });
    });
})();
