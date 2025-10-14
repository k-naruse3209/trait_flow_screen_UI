# --- ビルドステージ ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- 実行ステージ ---
FROM nginx:1.27-alpine

# 宣言上ポート 8080（あくまでメタ情報）
EXPOSE 8080

# テンプレートファイルを配置
COPY nginx.conf.template /etc/nginx/template/default.conf.template

# ビルド成果物を nginx の html 配置場所にコピー
COPY --from=build /app/dist /usr/share/nginx/html

# 起動スクリプトをコピー
COPY start.sh /start.sh
RUN chmod +x /start.sh

# ENTRYPOINT を start.sh にする
ENTRYPOINT ["/start.sh"]
# CMD は nginx 起動をサポートするために残してもよい

CMD ["nginx", "-g", "daemon off;"]

