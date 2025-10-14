#!/bin/sh
# 環境変数 PORT をテンプレートに埋め込む
envsubst '\$PORT' < /etc/nginx/template/default.conf.template > /etc/nginx/conf.d/default.conf

# nginx をフォアグラウンドで起動
exec nginx -g "daemon off;"

