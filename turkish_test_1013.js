(function () {
    'use strict';

    if (!window.Lampa) return;

    function testProxyFetch() {
        var targetUrl = 'https://www.fullhdfilmizlesene.now/';
        // Используем публичный бесплатный CORS-прокси (allorigins)
        var proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl);

        Lampa.Noty.show('🔍 Проверка прокси...');

        fetch(proxyUrl)
            .then(function (response) {
                var status = response.status;
                return response.text().then(function (html) {
                    return { status: status, html: html };
                });
            })
            .then(function (res) {
                var hasContent = res.html.indexOf('fullhdfilmizlesene') !== -1 || res.html.indexOf('<html') !== -1;

                Lampa.Noty.show(
                    '📊 PROXY STATUS: ' + res.status + '\n' +
                    'HTML GOT: ' + (hasContent ? 'YES (успех)' : 'NO (пустой ответ)') + '\n' +
                    'LENGTH: ' + res.html.length + ' chars',
                    { time: 10000 }
                );
            })
            .catch(function (err) {
                Lampa.Noty.show('❌ PROXY ERROR: ' + err.message, { time: 8000 });
            });
    }

    function start() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;

            var render = e.object && e.object.activity && e.object.activity.render
                ? e.object.activity.render()
                : null;

            if (!render) return;
            if (render.find('.tr-turkish-button').length) return;

            var button = $(
                '<div class="full-start__button selector tr-turkish-button" style="background: #e50914; color: #fff; margin-left: 8px;">' +
                    '<span style="margin-right:8px;">🇹🇷</span>' +
                    '<span>TEST PROXY</span>' +
                '</div>'
            );

            button.on('hover:enter', function () {
                testProxyFetch();
            });

            render.find('.full-start__buttons').append(button);
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
