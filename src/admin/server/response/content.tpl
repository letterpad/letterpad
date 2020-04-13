<!DOCTYPE html>
<html>

<head>
    <meta charSet="UTF-8" />
    <title>Letterpad</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
     <link rel="icon" href="{{FAVICON}}">
    <link href="{{BASE_NAME}}/admin/css/vertical.css" rel="stylesheet"/>
    <link href="{{BASE_NAME}}/admin/css/custom.css" rel="stylesheet"/>
    {{STYLE_TAGS}}
</head>

<body>
    <div id="app"></div>
    <script>
        window.__APOLLO_STATE__ = {{INITIAL_STATE}};
        window.NODE_ENV = "{{NODE_ENV}}";
        window.ROOT_URL = "{{ROOT_URL}}";
        window.API_URL = "{{API_URL}}";
        window.UPLOAD_URL = "{{UPLOAD_URL}}";
        window.APP_PORT = {{APP_PORT}};
        window.BASE_NAME = "{{BASE_NAME}}";
    </script>

    {{SCRIPT_TAGS}}
    <link href="{{BASE_NAME}}/admin/css/prism-theme.css" rel="stylesheet"/>
    <link href="{{BASE_NAME}}/admin/css/font-awesome.min.css" rel="stylesheet"/>

    <script>
        document.body.classList.add(localStorage.theme);
    </script>
</body>

</html>
