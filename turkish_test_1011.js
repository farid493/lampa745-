(function () {
    'use strict';

    if (!window.Lampa) return;

    Lampa.Listener.follow('full', function (e) {

        if (e.type !== 'complite') return;

        var movie = e.data && e.data.movie;
        if (!movie) return;

        var render = e.object.activity.render();

        var container = render.find('.full-start-new__buttons');

        if (!container.length) return;

        // Чтобы кнопка не дублировалась
        if (render.find('.turkish-test-1011').length) return;

        var button = $(
            '<div class="full-start__button selector turkish-test-1011">' +
                '<span>🇹🇷 ТУРЕЦКИЙ</span>' +
            '</div>'
        );

        container.prepend(button);

        button.on('hover:enter', function () {

            var imdb = movie.imdb_id;

            if (!imdb) {
                Lampa.Noty.show(
                    '❌ У ФИЛЬМА НЕТ IMDb ID',
                    { time: 5000 }
                );
                return;
            }

            var url =
                'https://fullhdfilmizlesene.now/arama/' + imdb;

            Lampa.Noty.show(
                '🇹🇷 ИЩЕМ: ' + imdb,
                { time: 3000 }
            );

            console.log('TURKISH 1011 SEARCH:', url);

            Lampa.Reguest.get(url)

                .then(function (html) {

                    Lampa.Noty.show(
                        '✅ САЙТ ОТВЕТИЛ: ' +
                        html.length +
                        ' символов',
                        { time: 5000 }
                    );

                    // Ищем ссылки на страницы фильмов
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(
                        html,
                        'text/html'
                    );

                    var links = [];
                    var all = doc.querySelectorAll('a');

                    for (var i = 0; i < all.length; i++) {

                        var href = all[i].getAttribute('href');

                        if (!href) continue;

                        if (href.indexOf('/film/') !== -1) {

                            var absolute;

                            try {
                                absolute = new URL(
                                    href,
                                    'https://fullhdfilmizlesene.now'
                                ).href;
                            } catch (err) {
                                continue;
                            }

                            if (links.indexOf(absolute) === -1) {
                                links.push(absolute);
                            }
                        }
                    }

                    if (!links.length) {

                        Lampa.Noty.show(
                            '⚠️ САЙТ ОТВЕТИЛ, НО FILM-ССЫЛОК НЕТ',
                            { time: 6000 }
                        );

                        console.log(
                            'TURKISH 1011 NO FILM LINKS',
                            html
                        );

                        return;
                    }

                    Lampa.Noty.show(
                        '🎬 НАЙДЕНО ФИЛЬМОВ: ' + links.length,
                        { time: 5000 }
                    );

                    console.log(
                        'TURKISH 1011 FILM LINKS:',
                        links
                    );

                    // Показываем первую найденную страницу
                    Lampa.Noty.show(
                        '🎬 ' + links[0],
                        { time: 8000 }
                    );

                })

                .catch(function (error) {

                    var status =
                        error && error.status
                            ? error.status
                            : 0;

                    var text =
                        error && error.statusText
                            ? error.statusText
                            : 'Нет подключения';

                    Lampa.Noty.show(
                        '❌ ОШИБКА САЙТА: ' +
                        status +
                        ' / ' +
                        text,
                        { time: 7000 }
                    );

                    console.log(
                        'TURKISH 1011 ERROR:',
                        error
                    );
                });
        });
    });

})();
