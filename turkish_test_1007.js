(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Noty.show('🔥 1007 ЗАПУЩЕН', { time: 4000 });

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        Lampa.Noty.show('✅ FULL COMPLITE', { time: 3000 });

        var render = e.object.activity.render();

        var html = render.html();

        console.log('1007 RENDER HTML:', html);

        Lampa.Noty.show(
            '📦 RENDER: ' + html.length + ' символов',
            { time: 4000 }
        );

        var selectors = [
            '.full-start__buttons',
            '.full-start-new__buttons',
            '.view--torrent',
            '.full-start__button'
        ];

        var found = [];

        selectors.forEach(function (selector) {
            var el = render.find(selector);

            if (el.length) {
                found.push(selector + '=' + el.length);
            }
        });

        Lampa.Noty.show(
            '🔎 НАЙДЕНО: ' + (found.length ? found.join(' | ') : 'НИЧЕГО'),
            { time: 7000 }
        );

    });

})();
