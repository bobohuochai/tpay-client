# 生产环境部署脚本
echo '生产环境部署脚本开始。。。'
curDate=$(date "+%Y%m%d")
echo '备份代码开始。。。'
if [ -f "dist-backup-${curDate}.zip" ]; then rm dist-backup-${curDate}.zip; echo "旧压缩文件删除"; fi
zip -q -r dist-backup-${curDate}.zip ./dist
echo '备份代码成功'
echo '开始删除dist目录'
rm -rf dist
echo '删除dist目录成功'
echo '开始解压代码...'
unzip dist-${curDate}.zip
echo '解压代码成功'
echo '生产环境部署脚本结束'