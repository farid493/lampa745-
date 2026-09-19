(function () {
    'use strict';

    if (!window.Lampa) return;

    var BASE_URL = 'https://www.fullhdfilmizlesene.now/';


    /* =====================================================
       ЗАПРОС ЧЕРЕЗ LAMPA.REGUEST
       ===================================================== */

    function inspectSearchForm() {

        Lampa.Noty.show(
            '🔍 1003: LAMPA REQUEST\n' +
            'Запрашиваю FullHDFilmizlesene...',
            { time: 5000 }
        );

        var network = new Lampa.Reguest();

        network.timeout(20000);

        network.silent(
            BASE_URL,

            /* SUCCESS */
            function (response) {

                var html = '';

                if (typeof response === 'string') {
                    html = response;
                } else if (response && response.responseText) {
                    html = response.responseText;
                } else {
                    try {
                        html = JSON.stringify(response);
                    } catch (e) {
                        html = String(response);
                    }
                }

                if (!html) {
                    Lampa.Noty.show(
                        '⚠️ 1003: ПУСТОЙ ОТВЕТ',
                        { time: 8000 }
                    );
                    return;
                }

                inspectHTML(html);
            },

            /* ERROR */
            function (a, b) {

                var errorText = '';

                try {
                    if (typeof a === 'string') {
                        errorText = a;
                    } else if (a && a.message) {
                        errorText = a.message;
                    } else if (b && b.message) {
                        errorText = b.message;
                    } else {
                        errorText = String(a || b || 'UNKNOWN ERROR');
                    }
                } catch (e) {
                    errorText = 'UNKNOWN ERROR';
                }

                Lampa.Noty.show(
                    '❌ 1003 REQUEST ERROR\n' +
                    errorText,
                    { time: 10000 }
                );
            },

            false,

            {
                dataType: 'text'
            }
        );
    }


    /* =====================================================
       АНАЛИЗ HTML
       ===================================================== */

    function inspectHTML(html) {

        var parser = new DOMParser();

        var doc = parser.parseFromString(
            html,
            'text/html'
        );


        /* =========================
           FORMS
           ========================= */

        var forms = doc.querySelectorAll('form');

        var formInfo = [];


        forms.forEach(function (form, index) {

            var rawAction =
                form.getAttribute('action') || '';

            var action = BASE_URL;

            try {

                action = rawAction
                    ? new URL(
                        rawAction,
                        BASE_URL
                    ).href
                    : BASE_URL;

            } catch (e) {

                action =
                    rawAction || BASE_URL;
            }


            var method = (
                form.getAttribute('method') ||
                'GET'
            ).toUpperCase();


            var inputs = [];


            form.querySelectorAll('input').forEach(
                function (input) {

                    var name =
                        input.getAttribute('name');

                    var type =
                        input.getAttribute('type') ||
                        'text';

                    var placeholder =
                        input.getAttribute(
                            'placeholder'
                        ) || '';


                    if (name) {

                        inputs.push(
                            name +
                            ' [' +
                            type +
                            ']' +
                            (
                                placeholder
                                    ? ' "' +
                                      placeholder +
                                      '"'
                                    : ''
                            )
                        );
                    }

                }
            );


            formInfo.push(
                'FORM #' +
                (index + 1) +
                '\n' +

                'METHOD: ' +
                method +
                '\n' +

                'ACTION: ' +
                action +
                '\n' +

                'INPUTS: ' +
                (
                    inputs.join(', ') ||
                    'NONE'
                )
            );

        });


        /* =========================
           SEARCH INPUTS
           ========================= */

        var searchInputs = [];


        doc.querySelectorAll(
            'input'
        ).forEach(function (input) {

            var type =
                input.getAttribute('type') ||
                'text';

            var name =
                input.getAttribute('name') || '';

            var placeholder =
                input.getAttribute(
                    'placeholder'
                ) || '';

            var value =
                input.getAttribute('value') || '';


            if (
                type === 'search' ||
                name.toLowerCase().indexOf('search') !== -1 ||
                name.toLowerCase().indexOf('s') === 0 ||
                placeholder.toLowerCase().indexOf('film') !== -1 ||
                placeholder.toLowerCase().indexOf('imdb') !== -1
            ) {

                searchInputs.push(
                    'name=' + name +
                    ' type=' + type +
                    ' placeholder="' +
                    placeholder +
                    '"' +
                    (value
                        ? ' value="' +
                          value +
                          '"'
                        : '')
                );

            }

        });


        /* =========================
           SCRIPTS
           ========================= */

        var scripts = [];


        doc.querySelectorAll(
            'script[src]'
        ).forEach(function (script) {

            var src =
                script.getAttribute('src');

            if (
                src &&
                scripts.indexOf(src) === -1 &&
                scripts.length < 10
            ) {

                try {

                    src = new URL(
                        src,
                        BASE_URL
                    ).href;

                } catch (e) {}

                scripts.push(src);
            }

        });


        /* =========================
           FILM LINKS
           ========================= */

        var filmLinks = [];


        doc.querySelectorAll(
            'a[href]'
        ).forEach(function (link) {

            var href =
                link.getAttribute('href');

            if (
                href &&
                href.indexOf('/film/') !== -1 &&
                filmLinks.indexOf(href) === -1 &&
                filmLinks.length < 5
            ) {

                filmLinks.push(href);
            }

        });


        /* =========================
           PLAYER
           ========================= */

        var iframeCount =
            doc.querySelectorAll(
                'iframe'
            ).length;

        var videoCount =
            doc.querySelectorAll(
                'video'
            ).length;

        var sourceCount =
            doc.querySelectorAll(
                'source'
            ).length;


        var hasM3U8 =
            html.toLowerCase()
                .indexOf('.m3u8') !== -1;


        /* =========================
           LANGUAGE
           ========================= */

        var lowerHTML =
            html.toLowerCase();


        var hasDublaj =
            lowerHTML.indexOf(
                'türkçe dublaj'
            ) !== -1 ||
            lowerHTML.indexOf(
                'dublaj'
            ) !== -1;


        var hasAltyazi =
            lowerHTML.indexOf(
                'türkçe altyazılı'
            ) !== -1 ||
            lowerHTML.indexOf(
                'altyaz'
            ) !== -1;


        /* =========================
           ИТОГ
           ========================= */

        var result =

            '✅ 1003 REQUEST OK\n\n' +

            'HTML SIZE: ' +
            html.length +
            ' bytes\n\n' +

            'FORMS: ' +
            forms.length +
            '\n\n' +

            (
                formInfo.join('\n\n') ||
                'FORMS: NONE'
            ) +

            '\n\n' +

            'SEARCH INPUTS:\n' +

            (
                searchInputs.join('\n') ||
                'NONE'
            ) +

            '\n\n' +

            'FILM LINKS:\n' +

            (
                filmLinks.join('\n') ||
                'NONE'
            ) +

            '\n\n' +

            'PLAYER:\n' +

            'IFRAME: ' +
            iframeCount +

            ' | VIDEO: ' +
            videoCount +

            ' | SOURCE: ' +
            sourceCount +

            ' | M3U8: ' +
            (
                hasM3U8
                    ? 'YES'
                    : 'NO'
            ) +

            '\n\n' +

            'DUBLAJ: ' +
            (
                hasDublaj
                    ? 'YES'
                    : 'NO'
            ) +

            ' | ALTYAZI: ' +

            (
                hasAltyazi
                    ? 'YES'
                    : 'NO'
            ) +

            '\n\n' +

            'SCRIPTS:\n' +

            (
                scripts.join('\n') ||
                'NONE'
            );


        Lampa.Noty.show(
            result,
            { time: 30000 }
        );
    }


    /* =====================================================
       КНОПКА
       ===================================================== */

    function injectButton(render, movie) {

        var container =
            render.find(
                '.full-start__buttons'
            );


        if (!container.length) {

            container =
                render.find(
                    '.full-start-new__buttons'
                );
        }


        if (!container.length) {

            container =
                render.find(
                    '.view--torrent'
                ).parent();
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

            'style="' +
            'background:#e50914;' +
            'color:#fff;' +
            'margin-left:8px;' +
            '">' +

            '<span style="margin-right:8px;">🇹🇷</span>' +

            '<span>TURKISH</span>' +

            '</div>'

        );


        button.on(
            'hover:enter',
            function () {

                inspectSearchForm();

            }
        );


        container.append(button);
    }


    /* =====================================================
       LAMPA FULL EVENT
       ===================================================== */

    function start() {

        Lampa.Noty.show(
            '🔥 VER 1003 — LAMPA REQUEST TEST',
            { time: 4000 }
        );


        Lampa.Listener.follow(
            'full',
            function (e) {

                if (
                    e.type !== 'complite'
                ) {
                    return;
                }


                var movie =
                    e.data &&
                    e.data.movie;


                if (!movie) {

                    Lampa.Noty.show(
                        '❌ MOVIE DATA NOT FOUND',
                        { time: 5000 }
                    );

                    return;
                }


                var render =
                    e.object &&
                    e.object.activity &&
                    e.object.activity.render
                        ? e.object.activity.render()
                        : null;


                if (!render) {

                    Lampa.Noty.show(
                        '❌ RENDER NOT FOUND',
                        { time: 5000 }
                    );

                    return;
                }


                injectButton(
                    render,
                    movie
                );

            }
        );
    }


    /* =====================================================
       START
       ===================================================== */

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

                    if (
                        e.type === 'ready'
                    ) {
                        start();
                    }

                }
            );

        } else {

            start();

        }
    }

})();
