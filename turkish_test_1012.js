(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        var movie = e.data && e.data.movie;

        if (!movie) {
            Lampa.Noty.show(
                '❌ MOVIE НЕ НАЙДЕН',
                { time: 5000 }
            );
            return;
        }

        var render = e.object.activity.render();
        var container = render.find('.full-start-new__buttons');

        if (!container.length) return;

        if (render.find('.turkish-test-1012').length) return;

        var button = $(
            '<div class="full-start__button selector turkish-test-1012">' +
                '<span>🇹🇷 IMDb TEST</span>' +
            '</div>'
        );

        container.prepend(button);

        button.on('hover:enter', function () {

            var imdb = movie.imdb_id || '';
            var title = movie.title || '';
            var original = movie.original_title || '';

            Lampa.Noty.show(
                '🎬 TITLE: ' + title +
                '\nIMDb: ' + (imdb || 'НЕТ') +
                '\nORIGINAL: ' + (original || 'НЕТ'),
                { time: 8000 }
            );

            console.log('TURKISH 1012 MOVIE:', movie);
        });

    });

})();
