(function () {
    'use strict';

    if (!window.Lampa) return;

    function start() {

        Lampa.Noty.show('🔥 1005 ЗАПУЩЕН', { time: 3000 });

        Lampa.Listener.follow('full', function (e) {

            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;
            if (!movie) return;

            var render = e.object.activity.render();

            var container = render.find('.full-start__buttons');

            if (!container.length)
                container = render.find('.full-start-new__buttons');

            if (!container.length) {
                var torrent = render.find('.view--torrent');

                if (torrent.length)
                    container = torrent.parent();
            }

            if (!container.length) {
                Lampa.Noty.show(
                    '❌ КОНТЕЙНЕР НЕ НАЙДЕН',
                    { time: 5000 }
                );
                return;
            }

            if (render.find('.turkish-test-1005').length) return;

            var button = $(
                '<div class="full-start__button selector turkish-test-1005">' +
                    '<span>🇹🇷 ТЕСТ 1005</span>' +
                '</div>'
            );

            container.append(button);

            button.on('hover:enter', function () {

                var imdb = movie.imdb_id;

                if (!imdb) {
                    Lampa.Noty.show(
                        '❌ IMDb ID НЕ НАЙДЕН',
                        { time: 5000 }
                    );
                    return;
                }

                var url =
                    'https://fullhdfilmizlesene.now/arama/' + imdb;

                Lampa.Noty.show(
                    '🔎 ИЩЕМ: ' + imdb,
                    { time: 3000 }
                );

                Lampa.Reguest.get(url)

                    .then(function (html) {

                        Lampa.Noty.show(
                            '✅ ОТВЕТ ПОЛУЧЕН: ' +
                            html.length +
                            ' символов',
                            { time: 5000 }
                        );

                        console.log(
                            'TURKISH 1005 HTML:',
                            html
                        );

                    })

                    .catch(function (error) {

                        Lampa.Noty.show(
                            '❌ ОШИБКА REQUEST: ' +
                            (error.status || '0') +
                            ' / ' +
                            (error.statusText || 'error'),
                            { time: 6000 }
                        );

                        console.log(
                            'TURKISH 1005 ERROR:',
                            error
                        );

                    });

            });

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
