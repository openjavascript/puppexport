

puppexport 环境依赖


   centos7 
    
        安装 nodejs 8.x
            安装说明: https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora

        安装 cnpm 源
            npm install -g cnpm --registry=https://registry.npm.taobao.org

        安装　google chrome
            https://intoli.com/blog/installing-google-chrome-on-centos/

        安装中文字体(在本目录下有个.fonts目录, 里面有中文字体可用)
            请参考 https://blog.csdn.net/wlwlwlwl015/article/details/51482065

        设置 PHP 超时为 120秒, 需要设置 php, php-fpm, nginx 3个地方
            请参考 https://www.scalescale.com/tips/nginx/504-gateway-time-out-using-nginx/

        在项目根目录安装 puppeteer

            #转到项目根目录
            cd {project_root}

            #安装导出服务
            cnpm i puppeteer

        测试命令是否运行正确

            #转到项目根目录
            cd {project_root}

            #执行测试命令
            node ./bin/puppexport.js '{"url":"http://btbtd.com/topic/test/test.html","filepath":"/tmp/file_20180413_2.pdf"}'
    
