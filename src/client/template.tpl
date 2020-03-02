<html {{HTML_ATTRS}}>

<head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="{{FAVICON}}">
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

    {{SCRIPT_TAGS}}
    {{GA_SCRIPT_TAG}}
</body>

</html>
