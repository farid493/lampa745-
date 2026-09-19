(function () {
    'use strict';

    function start() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;
            if (!movie) return;

            var render = e.object.activity.render();

            if (render.find('.view--turkish').length) return;

            var button = $(
                '<div class="full-start__button selector view--turkish">' +
                    '<span>🇹🇷 TURKISH</span>' +
                '</div>'
            );

            button.on('hover:enter', function () {
                var info = [
                    'Title: ' + (movie.title || 'N/A'),
                    'Original: ' + (movie.original_title || movie.original_name || 'N/A'),
                    'IMDb ID: ' + (movie.imdb_id || 'N/A'),
                    'KP ID: ' + (movie.kinopoisk_id || 'N/A')
                ].join('\n');

                Lampa.Noty.show('--- MOVIE DATA ---\n' + info, { time: 10000 });
            });

            var torrent = render.find('.view--torrent');
            if (torrent.length) {
                torrent.after(button);
            } else {
                render.find('.full-start__buttons').append(button);
            }
        });
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') start();
        });
    }
})();
