
const puppeteer = require("puppeteer");

const events = require('events');
const Evt = new events.EventEmitter();
const shell = require("shelljs");
const colors = require( 'colors' );

const Config = require( '../common/config.js' );
const Const = require('../common/const.js');
const printf = require( "../utils/printf.js" );
const getArgs = require( "../utils/get_args.js" );

function exit( browser ){
    browser.close();
    process.exit(1);
}

module.exports = function( data ){
    console.log( 'fire Const.cmd.pdf', new Date().getTime() );
    return (async () => {

        const browser = await puppeteer.launch( 
            {args: ['--no-sandbox', '--disable-setuid-sandbox']} 
        ).then( async browser => {

            const page = await browser.newPage();
            let isDone;

            if( data.cookies ){
                if( data.cookies.length ){
                    for( let i = 0, j = data.cookies.length; i < j; i++ ){
                        await page.setCookie( data.cookies[i] )
                        .then( ()=>{
                        }, ( err )=>{
                            onPageError( err, page );
                        });
                    }
                }else{
                    await page.setCookie( data.cookies )
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
                if( msg.text() != data.DONE_LOG ) return;
                isDone = 1;
                setTimeout( ()=>{
                    doneAction();
                }, 2000 );
            });


            function doneAction() {
                switch( data.type ){
                    case 'png': {
                        page.screenshot( { path: data.filepath } ).then( ()=>{
                            exit( browser );
                        });
                        break;
                    }
                    default: {
                        page.pdf( { 
                            path: data.filepath, format: 'A4' 
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
            await page.goto( data.url );
        });
        ;
    })();
};

