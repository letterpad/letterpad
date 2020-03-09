<body>
    <div id="app">{{HTML_CONTENT}}</div>
    <script type="text/javascript">
        window.__APOLLO_STATE__ = {{INITIAL_STATE}};
        window.__INITIAL_DATA__ = {{INITIAL_DATA}};
        window.NODE_ENV = "{{NODE_ENV}}";
        window.ROOT_URL = "{{ROOT_URL}}";
        window.API_URL = "{{API_URL}}";
        window.UPLOAD_URL = "{{UPLOAD_URL}}";
        window.APP_PORT = {{APP_PORT}};
        window.BASE_NAME = "{{BASE_NAME}}";
        window.THEME = "{{THEME}}";

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '{{TRACKING_ID}}');
    </script>

    <script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@13.0.1/dist/lazyload.min.js"></script>
    {{SCRIPT_TAGS}}
    {{GA_SCRIPT_TAG}}
</body>

</html>
