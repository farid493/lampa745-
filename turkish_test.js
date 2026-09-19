(function () {
    'use strict';

    function component(object) {
        // Заглушка компонента для интеграции в систему Lampa
        this.create = function () {
            return this.render();
        };

        this.render = function () {
            var html = $('<div><div class="empty__title" style="padding: 20px; font-size: 1.5em;">🇹🇷 TURKISH SEARCH MODULE</div></div>');
            return html;
        };

        this.start = function () {
            Lampa.Controller.add('content', {
                toggle: function () {},
                left: function () { Lampa.Controller.toggle('menu'); },
                back: function () { Lampa.Activity.backward(); }
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.destroy = function () {};
    }

    function startPlugin() {
        // 1. Регистрация манифеста плагина
        var manifest = {
            type: 'video',
            version: '1.0.0',
            name: 'Turkish Online',
            description: 'Просмотр турецкого контента',
            component: 'turkish_test'
        };

        try {
            Lampa.Manifest.plugins = manifest;
        } catch (e) {
            console.log('Turkish plugin manifest error:', e);
        }

        // 2. Регистрация компонента в системе
        Lampa.Component.add('turkish_test', component);

        // 3. Подписка на открытие карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                var movie = e.data && e.data.movie;
                if (!movie) return;

                var render = e.object.activity.render();
                if (render.find('.view--turkish').length) return;

                var button = $(
                    '<div class="full-start__button selector view--turkish">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; vertical-align: middle;">' +
                            '<circle cx="12" cy="12" r="10" fill="#E30A17"/>' +
                            '<path d="M11 9A3 3 0 1 0 11 15A3.6 3.6 0 0 1 11 9Z" fill="white"/>' +
                            '<polygon points="13.5,12 15,10.8 14.2,12.6 15.8,12.6 14.3,13.4" fill="white"/>' +
                        '</svg>' +
                        '<span>TURKISH</span>' +
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
            }
        });
    }

    // Запускаем сразу
    if (typeof Lampa !== 'undefined') {
        startPlugin();
    }
})();
