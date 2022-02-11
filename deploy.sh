#!/usr/bin/env sh


# 构建
yarn build

# 进入构建文件夹
cd dist

git init
git add -A
git commit -m 'deploy'

git branch -M main
git remote remove origin
git remote add origin git@github.com:wujinghaoyyds/evernote-vue.git
git push -f -u origin main:dist
cd -
echo https://wujinghaoyyds.github.io/evernote-vue/#/