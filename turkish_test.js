(function () {
    'use strict';

    function startPlugin() {
        if (window.turkish_test_started) return;
        window.turkish_test_started = true;

        Lampa.Noty.show('🇹🇷 TURKISH PLUGIN LOADED', {
            time: 10000
        });

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            Lampa.Noty.show('FULL EVENT WORKS', {
                time: 5000
            });
        });
    }

    function bootstrap() {
        if (typeof Lampa === 'undefined') {
            setTimeout(bootstrap, 300);
            return;
        }

        if (window.appready) {
            startPlugin();
            return;
        }

        if (Lampa.Listener && Lampa.Listener.follow) {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') {
                    startPlugin();
                }
            });
        }

        setTimeout(function () {
            if (window.appready) {
                startPlugin();
            }
        }, 1500);
    }

    bootstrap();

})();
