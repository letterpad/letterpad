<html {{HTML_ATTRS}}>

<head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{META_TAGS}}
    {{STYLE_TAGS}}
</head>

<body>
    <div id="app">{{HTML_CONTENT}}</div>
    <script>
        window.__APOLLO_STATE__ = {{INITIAL_STATE}};
        window.NODE_ENV = "{{NODE_ENV}}";
        window.rootUrl = "{{ROOT_URL}}";
        window.apiUrl = "{{API_URL}}";
        window.uploadUrl = "{{UPLOAD_URL}}";
        window.appPort = {{APP_PORT}};
        window.apiPort = {{API_PORT}};
        window.baseName = "{{BASE_NAME}}";

        window.ga = window.ga ||  function() {
                        (ga.q = ga.q || []).push(arguments);
                    };
        ga.l = +new Date();
        ga("create", {{TRACKING_ID}}, "auto");
        ga("send", "pageview");
    </script>
        
    {{SCRIPT_TAGS}}
    {{GA_SCRIPT_TAG}}
</body>

</html>