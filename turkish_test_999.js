(function () {
    'use strict';

    if (!window.Lampa) return;

    function start() {
        Lampa.Noty.show('🔥 TURKISH 999 LOADED', { time: 4000 });

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;

            if (!movie) {
                Lampa.Noty.show('❌ COMPLITE BUT NO MOVIE', { time: 6000 });
                return;
            }

            var title = movie.title || movie.name || 'N/A';
            var original = movie.original_title || movie.original_name || 'N/A';
            var imdb = movie.imdb_id || 'N/A';
            var kp = movie.kinopoisk_id || 'N/A';

            Lampa.Noty.show(
                '🎬 MOVIE FOUND\n' +
                title + '\n' +
                'Original: ' + original + '\n' +
                'IMDb: ' + imdb + '\n' +
                'KP: ' + kp,
                { time: 10000 }
            );
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
