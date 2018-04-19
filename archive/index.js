
/*

usage:
	node {approot}/scripts/puppexport/puppexport.js 'JSON String'

desc: 
	目前是同步阻塞版本, node 命令执行完时, 会同步在 JSON.filepath 路径生成对应的文件, 

data format: 
	{
		//页面URL
		"url": "http://demo.next.virus.btbtd.com/logreport/logreport",

		存的文件路径, 需要保证文件名的维一性, 注意扩展名( pdf ), 目前支持( png, pdf )
		"filepath": "/home/suches/udocs/website/pupp.me.btbtd.com/project/v1/cache/file_20180411.pdf",

        //请求超时时间, 单位秒, 默认120秒 
        "MAX_TIME": 120,

        //用于识别页面加载完毕的 console.log, 默认 MAGIC_DONE 
        //页面可以导出时, 在页面执行 console.log( 'MAGIC_DONE' )
        "DONE_LOG": "MAGIC_DONE",

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
*/

const puppeteer = require("puppeteer");

let printf = require( "./utils/printf.js" )
    , getArgs = require( "./utils/get_args.js" )
    ;

var cmd_args = getArgs( process )
    , json = ''
    ;

//console.log( 'cmd_args', cmd_args, cmd_args.length );

if( !cmd_args.length ){
    process.exit( 0 );
}

if( cmd_args.length ){
    json = JSON.parse( cmd_args[ 0 ] );
}
if( !json ){
    process.exit( 0 );
}

/*
console.dir( json );
console.log( json.url );
console.log( json.type );
console.log( json.filepath );
*/

if( !json.type ){
	json.type = ( json.filepath || 'pdf' ).replace( /^.*\./, '' );
}

json.DONE_LOG = json.DONE_LOG || 'MAGIC_DONE';
json.MAX_TIME = json.MAX_TIME || 120;

//console.log( __dirname, cmd_args );
//console.dir( json );

function exit( browser ){
    browser.close();
    process.exit(1);
}

(async () => {

	const browser = await puppeteer.launch( 
        {args: ['--no-sandbox', '--disable-setuid-sandbox']} 
    ).then( async browser => {

        const page = await browser.newPage();
        let isDone;

        if( json.cookies ){
            if( json.cookies.length ){
                for( let i = 0, j = json.cookies.length; i < j; i++ ){
                    await page.setCookie( json.cookies[i] )
                    .then( ()=>{
                    }, ( err )=>{
                        onPageError( err, page );
                    });
                }
            }else{
                await page.setCookie( json.cookies )
                .then( ()=>{
                }, ( err )=>{
                    onPageError( err, page );
                });
            }
        }

        page.on( 'error', ( err ) => {
            onError( err, page );
        });

        page.on( 'pageerror', ( err ) => {
            onError( err, page );
            return;
        });

        function onError( err, page ){
            console.log( 'onError', err, "\n\n" );
            exit( browser );
        }

        function onPageError( err, page ){
            console.log( 'onPageError', err, "\n\n" );
            exit( browser );
        }

        page.on('console', msg => {
            console.log(msg.text())
            if( msg.text() != json.DONE_LOG ) return;
            isDone = 1;
            setTimeout( ()=>{
                doneAction();
            }, 2000 );
        });


        function doneAction() {
            switch( json.type ){
                case 'png': {
                    page.screenshot( { path: json.filepath } ).then( ()=>{
                        exit( browser );
                    });
                    break;
                }
                default: {
                    page.pdf( { 
                        path: json.filepath, format: 'A4' 
                        , printBackground: true
                        , margin: {
                            top: "0"
                            , right: "0"
                            , bottom: "0"
                            , left: "0"
                        }
                    }).then( ()=>{
                        console.log( 'MAGIC_DONE fire from puppexport.js', new Date().getTime() );
                        exit( browser );
                    });
                }
            }
        }

        //await page.goto( json.url, {"waitUntil" : "networkidle2"} );

        await page.goto( json.url );

        /*
        setTimeout( ()=>{
            if( isDone ) return;
           browser.close();
        }, (json.MAX_TIME||120) * 1000 );
        */
    });
    ;


})();
