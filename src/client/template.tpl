<html {{HTML_ATTRS}}>

<head>
    <meta charSet="UTF-8" />
    <link rel="icon" href="data:,">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
        * {
            margin: 0px;
            padding: 0px;
        }
    </style>
    {{META_TAGS}}
    {{STYLE_TAGS}}
    {{STYLED_STYLES}}
    <script type="text/javascript">
        function makeMeRun() {
            const execute = document.querySelectorAll('.execute');
            execute.forEach((item)=>{
                eval(item.innerText);
                item.parentElement.removeChild(item);
            })
        }
    </script>
</head>

<body>
    <div id="app">{{HTML_CONTENT}}</div>
    <script type="text/javascript">
        window.__APOLLO_STATE__ = {{INITIAL_STATE}};
        window.__INITIAL_DATA__ = {{INITIAL_DATA}};
        window.NODE_ENV = "{{NODE_ENV}}";
        window.ROOT_URL = "{{ROOT_URL}}";
        window.apiUrl = "{{API_URL}}";
        window.uploadUrl = "{{UPLOAD_URL}}";
        window.appPort = {{APP_PORT}};
        window.baseName = "{{BASE_NAME}}";


        window.ga = window.ga ||  function() {
                        (ga.q = ga.q || []).push(arguments);
                    };
        ga.l = +new Date();
        ga("create", "{{TRACKING_ID}}", "auto");
        ga("send", "pageview");



    </script>

    {{SCRIPT_TAGS}}
    {{GA_SCRIPT_TAG}}
</body>

</html>
