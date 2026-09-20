(function () {
    'use strict';

    var TMDB_API_KEY = '500330721680edb6d5f7f12ba7cd9023';
    var BASE_URL = 'https://www.sinema.gg';

    function SinemaCXPlugin() {
        this.name = 'SinemaCX (TR)';
        this.version = '1.0.0';
    }

    SinemaCXPlugin.prototype.init = function () {
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'open') {
                var render = e.object.activity.render();

                var button = $(
                    '<div class="full-start__button selector button--tr-sinema">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
                    '<span>SinemaCX (TR)</span>' +
                    '</div>'
                );

                button.on('hover:enter', function () {
                    var card = e.data.card;
                    var imdbId = card.imdb_id;

                    if (!imdbId) {
                        Lampa.Noty.show('IMDb ID не найден');
                        return;
                    }

                    Lampa.Noty.show('Ищем турецкую озвучку...');

                    // 1. Получаем инфо с TMDB
                    fetch('https://api.themoviedb.org/3/find/' + imdbId + '?api_key=' + TMDB_API_KEY + '&external_source=imdb_id')
                        .then(function(res) { return res.json(); })
                        .then(function(tmdbData) {
                            var movie = tmdbData.movie_results && tmdbData.movie_results[0];
                            if (!movie) throw new Error('Фильм не найден на TMDB');

                            var title = movie.title || movie.original_title;

                            // 2. Ищем на sinema.gg
                            return fetch(BASE_URL + '/?s=' + encodeURIComponent(title), {
                                headers: {
                                    'User-Agent': navigator.userAgent,
                                    'Referer': BASE_URL + '/'
                                }
                            }).then(function(res) { return res.text(); });
                        })
                        .then(function(html) {
                            var pageUrlMatch = html.match(/href="(https:\/\/(www\.)?sinema\.gg\/[^"]+)"/i);
                            if (!pageUrlMatch || !pageUrlMatch[1]) throw new Error('Фильм не найден на SinemaCX');

                            // 3. Загружаем страницу фильма и ищем iframe плеера
                            return fetch(pageUrlMatch[1], {
                                headers: { 'Referer': BASE_URL + '/' }
                            });
                        })
                        .then(function(res) { return res.text(); })
                        .then(function(pageHtml) {
                            var iframeMatch = pageHtml.match(/src="([^"]*filmizle\.in[^"]*)"/i) || pageHtml.match(/data-vsrc="([^"]*filmizle\.in[^"/>]*)"/i);
                            if (!iframeMatch || !iframeMatch[1]) throw new Error('Плеер filmizle.in не найден');

                            var iframeUrl = iframeMatch[1].split('?img=')[0];
                            var videoId = iframeUrl.split('/').pop().split('?')[0];

                            // 4. POST запрос к балансеру za m3u8
                            var apiUrl = 'https://player.filmizle.in/player/index.php?data=' + videoId + '&do=getVideo';
                            var bodyParams = new URLSearchParams();
                            bodyParams.append('hash', videoId);
                            bodyParams.append('r', BASE_URL + '/');

                            return fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Referer': iframeUrl,
                                    'User-Agent': navigator.userAgent
                                },
                                body: bodyParams.toString()
                            });
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(jsonResult) {
                            if (jsonResult && jsonResult.securedLink) {
                                // 5. Запускаем нативный плеер Lampa
                                Lampa.Player.play({
                                    url: jsonResult.securedLink,
                                    title: (card.title || card.name) + ' (Türkçe)',
                                    headers: {
                                        'Referer': 'https://player.filmizle.in/'
                                    }
                                });
                            } else {
                                throw new Error('Не удалось получить m3u8 ссылку');
                            }
                        })
                        .catch(function(err) {
                            Lampa.Noty.show(err.message || 'Ошибка загрузки потока');
                        });
                });

                $('.full-start__buttons', render).append(button);
            }
        });
    };

    if (window.appready) {
        new SinemaCXPlugin().init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') new SinemaCXPlugin().init();
        });
    }
})();
