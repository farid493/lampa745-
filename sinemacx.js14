(function () {
    'use strict';

    var BASE_URL = 'https://www.sinema.gg';

    function initSinemaCX() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'open') {
                var render = e.object.activity.render();
                
                // Предотвращение дублирования кнопки в DOM
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

                    var card = e.data.card;
                    var origTitle = card.original_title || card.original_name;
                    var localTitle = card.title || card.name;
                    var cardYear = (card.release_date || card.first_air_date || '').slice(0, 4);

                    if (!origTitle && !localTitle) {
                        Lampa.Noty.show('Название фильма не найдено');
                        return;
                    }

                    isProcessing = true;
                    Lampa.Noty.show('Поиск SinemaCX...');

                    function resetProcessing() {
                        isProcessing = false;
                    }

                    // Очистка названия от спецсимволов для точного поиска
                    function cleanSearchQuery(str) {
                        return (str || '').toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();
                    }

                    // Точечный разбор результатов поиска
                    function parseSearchHtml(html, searchYear, queryText) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, 'text/html');
                        
                        // Ищем сначала в основном блоке контента, чтобы проигнорировать сайдбары
                        var mainContainer = doc.querySelector('#content, .content, .site-main, #main, .posts-container') || doc;
                        var links = mainContainer.querySelectorAll('a.baslik, a.resim, article a, .post-title a, h2 a, h3 a');
                        
                        var fallbackLink = '';
                        var cleanQuery = cleanSearchQuery(queryText);

                        for (var i = 0; i < links.length; i++) {
                            var href = links[i].getAttribute('href') || '';
                            var titleText = (links[i].textContent || '').toLowerCase();
                            if (!href) continue;

                            if (href.indexOf('http') !== 0) {
                                href = BASE_URL + (href.indexOf('/') === 0 ? '' : '/') + href;
                            }

                            // Исключаем системные страницы
                            if (href.indexOf('/category/') === -1 && 
                                href.indexOf('/tag/') === -1 && 
                                href.indexOf('/page/') === -1 && 
                                href.indexOf('/search/') === -1 &&
                                href !== BASE_URL + '/') {

                                if (!fallbackLink) fallbackLink = href;

                                // Приоритет 1: Совпадение по году и названию
                                if (searchYear && (titleText.indexOf(searchYear) !== -1 || href.indexOf(searchYear) !== -1)) {
                                    return href;
                                }
                            }
                        }
                        return fallbackLink;
                    }

                    var query1 = origTitle || localTitle;
                    
                    fetch(BASE_URL + '/?s=' + encodeURIComponent(query1))
                        .then(function(res) { return res.text(); })
                        .then(function(html) {
                            var targetUrl = parseSearchHtml(html, cardYear, query1);

                            if (!targetUrl && origTitle && localTitle && origTitle !== localTitle) {
                                return fetch(BASE_URL + '/?s=' + encodeURIComponent(localTitle))
                                    .then(function(res2) { return res2.text(); })
                                    .then(function(html2) {
                                        return parseSearchHtml(html2, cardYear, localTitle);
                                    });
                            }
                            return targetUrl;
                        })
                        .then(function(targetUrl) {
                            if (!targetUrl) throw new Error('Фильм не найден на SinemaCX');

                            return fetch(targetUrl);
                        })
                        .then(function(res) { return res.text(); })
                        .then(function(pageHtml) {
                            // Парсинг iframe балансера filmizle.in
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

                            // POST запрос к видео-эндпоинту
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
                                throw new Error('Ошибка ответа балансера');
                            }

                            if (jsonResult && jsonResult.securedLink) {
                                var videoData = {
                                    url: jsonResult.securedLink,
                                    title: (card.title || card.name) + ' (TR)',
                                    headers: {
                                        'Referer': 'https://player.filmizle.in/'
                                    }
                                };

                                Lampa.Player.play(videoData);
                                Lampa.Player.playlist([videoData]);
                            } else {
                                throw new Error('Поток не найден или заблокирован');
                            }
                            resetProcessing();
                        })
                        .catch(function(err) {
                            Lampa.Noty.show(err.message || 'Ошибка загрузки');
                            resetProcessing();
                        });
                });

                // Монтирование кнопки в интерфейс Lampa
                var container = $('.full-start__buttons', render);
                if (!container.length) container = $('.buttons', render);
                
                if (container.length) {
                    container.append(button);
                    if (Lampa.Controller && Lampa.Controller.refresh) {
                        Lampa.Controller.refresh();
                    }
                }
            }
        });
    }

    if (window.appready) {
        initSinemaCX();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initSinemaCX();
        });
    }
})();
