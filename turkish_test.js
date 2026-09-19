(function () {
    'use strict';

    if (typeof Lampa === 'undefined') return;

    Lampa.Noty.show('🇹🇷 TURKISH PLUGIN ACTIVE', { time: 4000 });

    Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;

        var movie = e.data && e.data.movie;
        if (!movie) return;

        var render = e.object.activity.render();
        if (render.find('.view--turkish').length) return;

        var button = $(
            '<div class="full-start__button selector view--turkish">' +
                '<span style="margin-right:8px;">🇹🇷</span>' +
                '<span>TURKISH</span>' +
            '</div>'
        );

        button.on('hover:enter', function () {
            var title = movie.title || movie.name || 'N/A';
            var orig = movie.original_title || movie.original_name || 'N/A';

            Lampa.Noty.show('SEARCHING: ' + title + ' (' + orig + ')', { time: 6000 });
        });

        var torrent = render.find('.view--torrent');
        if (torrent.length) {
            torrent.after(button);
        } else {
            var buttons = render.find('.full-start__buttons');
            if (buttons.length) {
                buttons.append(button);
            }
        }
    });
})();
