(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Noty.show('🔥 1008 ЗАПУЩЕН', { time: 4000 });

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        Lampa.Noty.show('✅ 1008 FULL OK', { time: 3000 });

        var render = e.object.activity.render();

        var a = render.find('.full-start__buttons').length;
        var b = render.find('.full-start-new__buttons').length;
        var c = render.find('.view--torrent').length;
        var d = render.find('.full-start__button').length;

        Lampa.Noty.show(
            'КОНТЕЙНЕРЫ: A=' + a +
            ' B=' + b +
            ' C=' + c +
            ' D=' + d,
            { time: 7000 }
        );

    });

})();
