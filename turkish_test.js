(function () {
    'use strict';

    if (!window.Lampa) return;

    function start() {
        Lampa.Noty.show('🔥 TURKISH 999 LOADED', { time: 5000 });

        Lampa.Listener.follow('full', function (e) {
            Lampa.Noty.show('full: ' + e.type, { time: 4000 });
        });

        Lampa.Listener.follow('activity', function (e) {
            if (e.component !== 'full') return;
            Lampa.Noty.show('activity/full: ' + e.type, { time: 4000 });
        });
    }

    if (window.appready) {
        start();
    } else {
        if (Lampa.Listener && Lampa.Listener.follow) {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') start();
            });
        } else {
            start();
        }
    }
})();
