(function () {
    'use strict';

    var BASE_URL = 'https://www.sinema.gg';

    function addPluginButton(e) {
        if (!e || e.type !== 'open') return;

        var render = e.object.activity.render();
        if ($('.button--tr-sinema', render).length > 0) return;

        var button = $(
            '<div class="full-start__button selector focusable button--tr-sinema">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
            '<span>SinemaCX (TR)</span>' +
            '</div>'
        );

        var isProcessing = false;

        button.on('hover:enter', function () {
            if (isProcessing) return;

            var card = e.data.card || {};
            var origTitle = card.original_title || card.original_name;
            var localTitle = card.title || card.name;
            var cardYear = (card.release_date || card.first_air_date || '').slice(0, 4);

            if (!origTitle && !localTitle) {
                Lampa.Noty.show('Название фильма не найдено');
                return;
            }

            isProcessing = true;
            Lampa.Noty.show('Тест 1: Запрос к sinema.gg...');

            function resetProcessing() {
                isProcessing = false;
            }

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

            var query1 = origTitle || localTitle;
            
            // ТЕСТ 1: Поиск на sinema.gg
            fetch(BASE_URL + '/?s=' + encodeURIComponent(query1))
                .then(function(res) { 
                    if (!res.ok) throw new Error('sinema.gg ответил со статусом: ' + res.status);
                    return res.text(); 
                })
                .then(function(html) {
                    var targetUrl = parseSearchHtml(html, cardYear);

                    if (!targetUrl && origTitle && localTitle && origTitle !== localTitle) {
                        return fetch(BASE_URL + '/?s=' + encodeURIComponent(localTitle))
                            .then(function(res2) { return res2.text(); })
                            .then(function(html2) {
                                return parseSearchHtml(html2, cardYear);
                            });
                    }
                    return targetUrl;
                })
                .then(function(targetUrl) {
                    if (!targetUrl) throw new Error('Фильм не найден в поиске');

                    Lampa.Noty.show('Тест 2: Загрузка страницы фильма...');
                    return fetch(targetUrl);
                })
                .then(function(res) { return res.text(); })
                .then(function(pageHtml) {
                    var iframeMatch = pageHtml.match(/(src|data-vsrc)="([^"]*filmizle\.in[^"]*)"/i);
                    if (!iframeMatch || !iframeMatch[2]) throw new Error('Плеер filmizle.in не найден в HTML');

                    var rawIframe = iframeMatch[2];
                    if (rawIframe.indexOf('http') !== 0) {
                        rawIframe = 'https:' + rawIframe;
                    }

                    var iframeUrl = rawIframe.split('?img=')[0];
                    var urlParts = iframeUrl.split('?')[0].split('/');
                    var videoId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

                    if (!videoId) throw new Error('Не удалось извлечь ID видео');

                    Lampa.Noty.show('Тест 3: Запрос к filmizle.in...');
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
                .then(function(res) { return res.text(); })
                .then(function(responseText) {
                    var jsonResult;
                    try {
                        jsonResult = JSON.parse(responseText);
                    } catch(err) {
                        throw new Error('Балансер вернул не JSON: ' + responseText.substring(0, 30));
                    }

                    if (jsonResult && jsonResult.securedLink) {
                        Lampa.Noty.show('УСПЕХ! Ссылка получена, запуск...');
                        
                        var videoData = {
                            url: jsonResult.securedLink,
                            title: (card.title || card.name) + ' (TR)',
                            type: 'hls'
                        };

                        Lampa.Player.play(videoData);
                    } else {
                        throw new Error('Поток заблокирован или отсутствует');
                    }
                    resetProcessing();
                })
                .catch(function(err) {
                    // Выводим точный текст ошибки прямо на экран TV
                    Lampa.Noty.show('ОШИБКА: ' + (err.message || err));
                    resetProcessing();
                });
        });

        var container = $('.full-start__buttons', render);
        if (!container.length) container = $('.buttons', render);
        
        if (container.length) {
            container.append(button);
            if (Lampa.Controller && Lampa.Controller.refresh) {
                Lampa.Controller.refresh();
            }
        }
    }

    var attempts = 0;
    function startPlugin() {
        if (window.Lampa && Lampa.Listener) {
            Lampa.Listener.follow('full', addPluginButton);
        } else if (attempts < 50) {
            attempts++;
            setTimeout(startPlugin, 100);
        }
    }

    startPlugin();
})();
