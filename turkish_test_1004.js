(function () {
    'use strict';

    if (!window.Lampa) return;

    var BASE_URL = 'https://www.fullhdfilmizlesene.now/';

    function objectToText(obj) {
        if (obj === null) return 'NULL';
        if (obj === undefined) return 'UNDEFINED';

        if (typeof obj === 'string') {
            return obj;
        }

        var result = [];

        try {
            result.push('TYPE: ' + typeof obj);

            if (obj.message !== undefined) {
                result.push('message: ' + obj.message);
            }

            if (obj.status !== undefined) {
                result.push('status: ' + obj.status);
            }

            if (obj.statusText !== undefined) {
                result.push('statusText: ' + obj.statusText);
            }

            if (obj.readyState !== undefined) {
                result.push('readyState: ' + obj.readyState);
            }

            if (obj.responseText !== undefined) {
                result.push(
                    'responseText: ' +
                    String(obj.responseText).substring(0, 500)
                );
            }

            if (obj.response !== undefined) {
                result.push(
                    'response: ' +
                    String(obj.response).substring(0, 500)
                );
            }

            if (obj.error !== undefined) {
                result.push('error: ' + obj.error);
            }

            if (obj.code !== undefined) {
                result.push('code: ' + obj.code);
            }

            if (obj.url !== undefined) {
                result.push('url: ' + obj.url);
            }

            try {
                var keys = Object.keys(obj);

                if (keys.length) {
                    result.push(
                        'KEYS: ' + keys.join(', ')
                    );
                }
            } catch (e) {}

            try {
                var json = JSON.stringify(obj);

                if (json && json !== '{}') {
                    result.push(
                        'JSON: ' +
                        json.substring(0, 1000)
                    );
                }
            } catch (e) {}

        } catch (e) {
            result.push(
                'INSPECT ERROR: ' + e.message
            );
        }

        return result.join('\n');
    }


    function testRequest() {

        Lampa.Noty.show(
            '🔍 1004: TEST LAMPA.REGUEST\n' +
            BASE_URL,
            { time: 5000 }
        );

        var network = new Lampa.Reguest();

        network.timeout(20000);

        network.silent(
            BASE_URL,

            function (response) {

                var text = '';

                try {

                    if (typeof response === 'string') {
                        text = response;

                    } else if (
                        response &&
                        response.responseText
                    ) {
                        text = response.responseText;

                    } else {
                        text = JSON.stringify(response);
                    }

                } catch (e) {
                    text = String(response);
                }

                Lampa.Noty.show(
                    '✅ REQUEST SUCCESS\n\n' +
                    'TYPE: ' +
                    typeof response +
                    '\n' +
                    'SIZE: ' +
                    text.length +
                    '\n\n' +
                    text.substring(0, 800),
                    { time: 15000 }
                );
            },

            function (a, b) {

                var errorA = objectToText(a);
                var errorB = objectToText(b);

                Lampa.Noty.show(
                    '❌ REQUEST FAILED\n\n' +
                    '--- ERROR A ---\n' +
                    errorA +
                    '\n\n' +
                    '--- ERROR B ---\n' +
                    errorB,
                    { time: 30000 }
                );
            },

            false,

            {
                dataType: 'text'
            }
        );
    }


    function injectButton(render) {

        var container =
            render.find('.full-start__buttons');

        if (!container.length) {
            container =
                render.find('.full-start-new__buttons');
        }

        if (!container.length) {
            container =
                render.find('.view--torrent').parent();
        }

        if (!container.length) {

            Lampa.Noty.show(
                '❌ BUTTON CONTAINER NOT FOUND',
                { time: 5000 }
            );

            return;
        }

        if (
            container.find(
                '.tr-turkish-button'
            ).length
        ) {
            return;
        }

        var button = $(
            '<div class="full-start__button selector tr-turkish-button" ' +
            'style="background:#e50914;color:#fff;margin-left:8px;">' +
            '<span style="margin-right:8px;">🇹🇷</span>' +
            '<span>TURKISH</span>' +
            '</div>'
        );

        button.on(
            'hover:enter',
            function () {
                testRequest();
            }
        );

        container.append(button);
    }


    function start() {

        Lampa.Noty.show(
            '🔥 VER 1004 — REQUEST ERROR DEBUG',
            { time: 4000 }
        );

        Lampa.Listener.follow(
            'full',
            function (e) {

                if (e.type !== 'complite') {
                    return;
                }

                var movie =
                    e.data &&
                    e.data.movie;

                if (!movie) {
                    return;
                }

                var render =
                    e.object &&
                    e.object.activity &&
                    e.object.activity.render
                        ? e.object.activity.render()
                        : null;

                if (!render) {
                    return;
                }

                injectButton(render);
            }
        );
    }


    if (window.appready) {

        start();

    } else if (
        Lampa.Listener &&
        Lampa.Listener.follow
    ) {

        Lampa.Listener.follow(
            'app',
            function (e) {

                if (e.type === 'ready') {
                    start();
                }

            }
        );

    } else {

        start();

    }

})();
