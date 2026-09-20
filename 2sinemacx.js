(function () {
    'use strict';

    if (!window.Lampa) return;

    var BASE_URL = 'https://www.sinema.gg';

    function parseSearchHtml(html, searchYear) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var mainContainer = doc.querySelector('#content, .content, .site-main, #main, .posts-container') || doc;
        var links = mainContainer.querySelectorAll('a.baslik, a.resim, article a, .post-title a, h2 a, h3 a');

        var fallbackLink = '';

        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href') || '';
            var titleText = (links[i].textContent || '').toLowerCase();
            if (!href) continue;

            if (href.indexOf('http') !== 0) {
                href = BASE_URL + (href.indexOf('/') === 0 ? '' : '/') + href;
            }

            if (href.indexOf('/category/') === -1 &&
                href.indexOf('/tag/') === -1 &&
                href.indexOf('/page/') === -1 &&
                href.indexOf('/search/') === -1 &&
                href !== BASE_URL + '/') {

                if (!fallbackLink) fallbackLink = href;

                if (searchYear && (titleText.indexOf(searchYear) !== -1 || href.indexOf(searchYear) !== -1)) {
                    return href;
                }
            }
        }
        return fallbackLink;
    }

    function injectButton(render, movie) {
        var container = render.find('.full-start__buttons');
        if (!container.length) container = render.find('.full-start-new__buttons');
        if (!container.length) container = render.find('.view--torrent').parent();

        if (!container.length) return;
        if (container.find('.button--tr-sinema').length) return;

        var button = $(
            '<div class="full-start__button selector focusable button--tr-sinema" style="background: #e50914; color: #fff; margin-left: 8px;">' +
            '<span style="margin-right:8px;">🇹🇷</span>' +
            '<span>SinemaCX</span>' +
            '</div>'
        );

        var isProcessing = false;

        button.on('hover:enter', function () {
            if (isProcessing) return;

            var origTitle = movie.original_title || movie.original_name;
            var localTitle = movie.title || movie.name;
            var cardYear = (movie.release_date || movie.first_air_date || '').slice(0, 4);

            if (!origTitle && !localTitle) {
                Lampa.Noty.show('Название фильма не найдено');
                return;
            }

            isProcessing = true;
            Lampa.Noty.show('Поиск SinemaCX...');

            function resetProcessing() {
                isProcessing = false;
            }

            var query1 = origTitle || localTitle;

            // 1. Поиск на sinema.gg
            fetch(BASE_URL + '/?s=' + encodeURIComponent(query1))
                .then(function (res) {
                    if (!res.ok) throw new Error('sinema.gg статус: ' + res.status);
                    return res.text();
                })
                .then(function (html) {
                    var targetUrl = parseSearchHtml(html, cardYear);

                    if (!targetUrl && origTitle && localTitle && origTitle !== localTitle) {
                        return fetch(BASE_URL + '/?s=' + encodeURIComponent(localTitle))
                            .then(function (res2) { return res2.text(); })
                            .then(function (html2) {
                                return parseSearchHtml(html2, cardYear);
                            });
                    }
                    return targetUrl;
                })
                .then(function (targetUrl) {
                    if (!targetUrl) throw new Error('Фильм не найден в поиске');

                    Lampa.Noty.show('Загрузка плеера...');
                    return fetch(targetUrl);
                })
                .then(function (res) { return res.text(); })
                .then(function (pageHtml) {
                    var iframeMatch = pageHtml.match(/(src|data-vsrc)="([^"]*filmizle\.in[^"]*)"/i);
                    if (!iframeMatch || !iframeMatch[2]) throw new Error('Плеер filmizle.in не найден');

                    var rawIframe = iframeMatch[2];
                    if (rawIframe.indexOf('http') !== 0) {
                        rawIframe = 'https:' + rawIframe;
                    }

                    var iframeUrl = rawIframe.split('?img=')[0];
                    var urlParts = iframeUrl.split('?')[0].split('/');
                    var videoId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

                    if (!videoId) throw new Error('Не удалось извлечь ID видео');

                    var apiUrl = 'https://player.filmizle.in/player/index.php?data=' + videoId + '&do=getVideo';
                    var postData = 'hash=' + encodeURIComponent(videoId) + '&r=' + encodeURIComponent(BASE_URL + '/');

                    return fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: postData
                    });
                })
                .then(function (res) { return res.text(); })
                .then(function (responseText) {
                    var jsonResult;
                    try {
                        jsonResult = JSON.parse(responseText);
                    } catch (err) {
                        throw new Error('Балансер вернул не JSON');
                    }

                    if (jsonResult && jsonResult.securedLink) {
                        Lampa.Noty.show('Запуск видео...');

                        var videoData = {
                            url: jsonResult.securedLink,
                            title: (movie.title || movie.name) + ' (TR)',
                            type: 'hls'
                        };

                        Lampa.Player.play(videoData);
                    } else {
                        throw new Error('Поток не найден');
                    }
                    resetProcessing();
                })
                .catch(function (err) {
                    Lampa.Noty.show('ОШИБКА: ' + (err.message || err));
                    resetProcessing();
                });
        });

        container.append(button);
        if (window.Lampa && Lampa.Controller && Lampa.Controller.refresh) {
            Lampa.Controller.refresh();
        }
    }

    function start() {
        Lampa.Noty.show('🇹🇷 SinemaCX Плагин Загружен', { time: 3000 });

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;
            if (!movie) return;

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
