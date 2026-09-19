(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    Lampa.Noty.show('🇹🇷 PLUGIN STARTED', { time: 3000 });

    Lampa.Listener.follow('full', function (e) {

        Lampa.Noty.show('FULL EVENT: ' + e.type, { time: 2000 });

        if (e.type !== 'complite') return;

        var movie = e.data && e.data.movie;

        if (!movie) {
            Lampa.Noty.show('❌ COMPLITE, BUT NO MOVIE', { time: 5000 });
            return;
        }

        Lampa.Noty.show(
            '✅ MOVIE: ' + (movie.title || movie.name || 'NO TITLE'),
            { time: 5000 }
        );
    });
})();
