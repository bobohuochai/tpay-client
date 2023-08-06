# 构建脚本
echo "生产环境构建脚本开始"
npm run build
echo "生产环境构建脚本完成"
curDate=$(date "+%Y%m%d")
if [ -f "dist-${curDate}.zip" ]; then rm dist-${curDate}.zip; echo "旧压缩文件删除"; fi
zip -q -r dist-${curDate}.zip ./dist
echo "资源压缩包dist-${curDate}.zip已生成准备上传..."
scp -p "iexRA8Q3uo2FsT1P1" -r ./dist-${curDate}.zip  root@47.97.167.99:/data/html
echo "资源压缩包dist-${curDate}.zip上传成功"