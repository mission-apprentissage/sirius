location /smtp {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;

    proxy_pass          http://smtp:8025;

    # Websocket configuration
    # See:
    #  - https://www.nginx.com/blog/websocket-nginx/
    #  - https://github.com/mailhog/MailHog/issues/117
    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection $connection_upgrade;
}
