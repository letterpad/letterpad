<html>

<head>
    <meta charSet="UTF-8" />
    <title>Letterpad</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="{{BASE_NAME}}/admin/css/vertical.css" rel="stylesheet"/>
    {{STYLE_TAGS}}
</head>

<body>
    <div id="app"></div>
    <script>
        window.__APOLLO_STATE__ = {{INITIAL_STATE}};
        window.NODE_ENV = "{{NODE_ENV}}";
        window.ROOT_URL = "{{ROOT_URL}}";
        window.apiUrl = "{{API_URL}}";
        window.uploadUrl = "{{UPLOAD_URL}}";
        window.appPort = {{APP_PORT}};
        window.baseName = "{{BASE_NAME}}";
    </script>

    {{SCRIPT_TAGS}}
    <link href="{{BASE_NAME}}/admin/css/prism-theme.css" rel="stylesheet"/>
    <link href="{{BASE_NAME}}/admin/css/font-awesome.min.css" rel="stylesheet"/>
</body>

</html>
