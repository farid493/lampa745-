(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Noty.show('🔥 1010 ЗАПУЩЕН', { time: 3000 });

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        var render = e.object.activity.render();

        var container = render.find('.full-start-new__buttons');

        if (!container.length) {
            Lampa.Noty.show('❌ КОНТЕЙНЕР НЕ НАЙДЕН', { time: 5000 });
            return;
        }

        var button = $(
            '<div class="full-start__button selector turkish-test-1010">' +
                '<span>🇹🇷 ТУРЕЦКИЙ ТЕСТ</span>' +
            '</div>'
        );

        container.prepend(button);

        Lampa.Noty.show(
            '✅ 1010 КНОПКА ДОБАВЛЕНА В НАЧАЛО',
            { time: 4000 }
        );

        button.on('hover:enter', function () {
            Lampa.Noty.show(
                '🔥 КНОПКА 1010 НАЖАТА',
                { time: 4000 }
            );
        });

    });

})();
