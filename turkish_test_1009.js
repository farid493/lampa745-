(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Noty.show('🔥 1009 ЗАПУЩЕН', { time: 3000 });

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        var render = e.object.activity.render();

        var container = render.find('.full-start-new__buttons');

        if (!container.length) {
            Lampa.Noty.show('❌ B НЕ НАЙДЕН', { time: 5000 });
            return;
        }

        Lampa.Noty.show('✅ B НАЙДЕН', { time: 3000 });

        if (render.find('.turkish-test-1009').length) return;

        var button = $(
            '<div class="full-start__button selector turkish-test-1009">' +
                '<span>🇹🇷 ТЕСТ 1009</span>' +
            '</div>'
        );

        container.append(button);

        Lampa.Noty.show('🇹🇷 КНОПКА 1009 ДОБАВЛЕНА', { time: 4000 });

        button.on('hover:enter', function () {
            Lampa.Noty.show('🔥 1009 НАЖАТА!', { time: 4000 });
        });

    });

})();
