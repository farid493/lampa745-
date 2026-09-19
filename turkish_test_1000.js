(function () {
    'use strict';

    if (!window.Lampa) return;

    function injectButton(render, movie) {
        var container = render.find('.full-start__buttons');
        if (!container.length) container = render.find('.full-start-new__buttons');
        if (!container.length) container = render.find('.view--torrent').parent();

        if (!container.length) return;
        if (container.find('.tr-turkish-button').length) return;

        var button = $(
            '<div class="full-start__button selector tr-turkish-button" style="background: #e50914; color: #fff; margin-left: 8px;">' +
                '<span style="margin-right:8px;">🇹🇷</span>' +
                '<span>TURKISH</span>' +
            '</div>'
        );

        button.on('hover:enter', function () {
            var title = movie.title || movie.name || 'N/A';
            Lampa.Noty.show('🇹🇷 ИСКАШЬ: ' + title, { time: 5000 });
        });

        container.append(button);
    }

    function start() {
        Lampa.Noty.show('🔥 VER 1000 — MOVIE TEST', { time: 4000 });

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;

            if (!movie) {
                Lampa.Noty.show('❌ COMPLITE BUT NO MOVIE', { time: 6000 });
                return;
            }

            var title = movie.title || movie.name || 'N/A';
            Lampa.Noty.show('🎬 MOVIE: ' + title, { time: 5000 });

            var render = e.object && e.object.activity && e.object.activity.render
                ? e.object.activity.render()
                : null;

            if (render) {
                injectButton(render, movie);
            }
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
