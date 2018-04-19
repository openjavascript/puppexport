

## puppexport 环境依赖


   ### centos7 
    
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

        安装文件导出命令
            sudo cnpm install -g puppexport

        变更 node_modules 文件执行权限(非ROOT用户)
            sudo chmod -R 755  /usr/lib/node_modules/puppexport/     

        测试命令是否运行正确

            #执行测试命令
            puppexport '{"url":"http://btbtd.com/topic/test/test.html","filepath":"/tmp/file_20180413_2.pdf"}'
    

## 数据范例

```
usage:
    node ./bin/puppexport.js '{"url":"http://btbtd.com/topic/test/test.html","filepath":"/tmp/file_20180413_2.pdf"}'

desc: 
	目前是同步阻塞版本, node 命令执行完时, 会同步在 JSON.filepath 路径生成对应的文件, 

data format: 
	{
		//页面URL
		"url": "http://demo.next.virus.btbtd.com/logreport/logreport",

		存的文件路径, 需要保证文件名的维一性, 注意扩展名( pdf ), 目前支持( png, pdf )
		"filepath": "/home/suches/udocs/website/pupp.me.btbtd.com/project/v1/cache/file_20180411.pdf",

		//每个cookie 的 key 都是 object 对象
		"cookies": [

			{
				//cookie name
				"name": "laravel_session",

				//cookie value
				"value": "eyJpdiI6Imx6XC8wT2hRR3dZVzE2ckF3cFloc2h3PT0iLCJ2YWx1ZSI6IlZ3TTZQWmxOQUtaRkNiTnZaYmFab1FzVGwyWXpZTGkyQWhNSE1BNG9DcWhYOU5cL2FkK2tXQWttV2JxQXRzdzlxNDhlTG5EYWhKNExsa1pzQ1JGeEpzZz09IiwibWFjIjoiODY5YTY3YTQ4MDExZjlmYzNjY2M4MTdlNGJkNDdkOGE0ZGFmY2FjODY4YWE1MjAyNzJlZDEwYTAxZDE2N2Q1NiJ9",

				//cookie 域名
				"domain": "demo.next.virus.btbtd.com",

				//页面url
				"url": "http://demo.next.virus.btbtd.com/logreport/logreport",

				//cookie保存路径
				"path": "/",

				//cookie过期时间, unit 时间截, 当前天+10
				"expires": 1554897241212,

				//只允许 http 使用
				"httpOnly": true
			}

		]
	}

```

## 可用命令

```
   puppexport {json string}          //异步导出PDF, 页面console.log( 'MAGIC_DONE' ) 时, 执行导出命令
   
   puppexport png {json string}      //异步导出PNG, 页面console.log( 'MAGIC_DONE' ) 时, 执行导出命令
   
   puppexport syndPdf {json string}  //同步导出PDF
   
   puppexport syncPng {json string}  //同步导出PNG
 ```
