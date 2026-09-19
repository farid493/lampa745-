(function () {
    'use strict';

    if (!window.Lampa) return;

    function inspectSearchForm() {
        var baseUrl = 'https://www.fullhdfilmizlesene.now/';

        Lampa.Noty.show(
            '🔍 ИНСПЕКЦИЯ: ' + baseUrl,
            { time: 4000 }
        );

        fetch(baseUrl)
            .then(function (response) {
                var status = response.status;

                return response.text().then(function (html) {
                    return {
                        status: status,
                        html: html
                    };
                });
            })
            .then(function (res) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(res.html, 'text/html');

                /* =========================
                   1. ФОРМЫ
                   ========================= */

                var forms = doc.querySelectorAll('form');
                var formInfo = [];

                forms.forEach(function (form, index) {

                    var rawAction = form.getAttribute('action') || '';
                    var action = baseUrl;

                    try {
                        action = rawAction
                            ? new URL(rawAction, baseUrl).href
                            : baseUrl;
                    } catch (e) {
                        action = rawAction || baseUrl;
                    }

                    var method = (
                        form.getAttribute('method') || 'GET'
                    ).toUpperCase();

                    var inputs = [];

                    form.querySelectorAll('input').forEach(function (inp) {

                        var name = inp.getAttribute('name');
                        var type = inp.getAttribute('type') || 'text';
                        var ph = inp.getAttribute('placeholder') || '';

                        if (name) {
                            inputs.push(
                                name +
                                ' (' +
                                type +
                                (ph ? ', ph: "' + ph + '"' : '') +
                                ')'
                            );
                        }
                    });

                    formInfo.push(
                        'FORM #' + (index + 1) +
                        ' [' + method + ']\n' +
                        'ACTION: ' + action + '\n' +
                        'INPUTS: ' +
                        (inputs.join(', ') || 'NONE')
                    );
                });

                /* =========================
                   2. ВНЕШНИЕ SCRIPT
                   ========================= */

                var scripts = [];

                doc.querySelectorAll('script[src]').forEach(function (script) {

                    var src = script.getAttribute('src');

                    if (
                        src &&
                        scripts.indexOf(src) === -1 &&
                        scripts.length < 10
                    ) {
                        try {
                            src = new URL(src, baseUrl).href;
                        } catch (e) {}

                        scripts.push(src);
                    }
                });

                /* =========================
                   3. РЕЗУЛЬТАТ
                   ========================= */

                var result =
                    '📊 STATUS: ' + res.status + '\n' +
                    'FORMS: ' + forms.length + '\n\n' +

                    (
                        formInfo.join('\n\n') ||
                        'ФОРМЫ НЕ НАЙДЕНЫ'
                    ) +

                    '\n\n' +
                    'SCRIPTS:\n' +

                    (
                        scripts.join('\n') ||
                        'NONE'
                    );

                Lampa.Noty.show(
                    result,
                    { time: 20000 }
                );
            })
            .catch(function (err) {

                Lampa.Noty.show(
                    '❌ FETCH ERROR: ' + err.message,
                    { time: 8000 }
                );
            });
    }


    function start() {

        Lampa.Noty.show(
            '🔥 VER 1001 — FULL INSPECTOR READY',
            { time: 4000 }
        );

        Lampa.Listener.follow('full', function (e) {

            if (e.type !== 'complite') return;

            var movie = e.data && e.data.movie;

            if (!movie) return;

            var render =
                e.object &&
                e.object.activity &&
                e.object.activity.render
                    ? e.object.activity.render()
                    : null;

            if (!render) return;

            if (
                render.find('.tr-turkish-button').length
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

            button.on('hover:enter', function () {
                inspectSearchForm();
            });

            render
                .find('.full-start__buttons')
                .append(button);
        });
    }


    if (window.appready) {

        start();

    } else {

        if (
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
    }

})();
