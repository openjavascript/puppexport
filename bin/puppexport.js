#! /usr/bin/env node


const events = require('events');
const colors = require( 'colors' );

const Config = require( '../common/config.js' );
const Const = require('../common/const.js');
const printf = require( "../utils/printf.js" );
const getArgs = require( "../utils/get_args.js" );

const pdf = require( "../handler/pdf.js" );
const syncPdf = require( "../handler/syncPdf.js" );

let cmd_args = getArgs( process )
    , cmd = Const.cmd.pdf
    , data = null
    ;

if( cmd_args.length ){
    if( cmd_args.length > 1 ){
        cmd = cmd_args[0];
        data = cmd_args[1];
    }else{
        data = cmd_args[ 0 ];
    }
    data = JSON.parse( data );
}


if( !( cmd && data ) ){
    console.log( 'nothing to do' );
    process.exit( 0 );
}

if( !data.type ){
	data.type = ( data.filepath || 'pdf' ).replace( /^.*\./, '' ) || cmd;
}

data.DONE_LOG = data.DONE_LOG || Const.DONE_LOG;
data.MAX_TIME = data.MAX_TIME || Const.MAX_TIME;

/*
console.dir( Config );
*/
console.log( 'cmd:', cmd, new Date().getTime() );
console.dir( data );

switch( cmd ){

    case Const.cmd.png: 
    case Const.cmd.pdf: {
        pdf( data );
        break;
    }

    case Const.cmd.syncPng: 
    case Const.cmd.syncPdf: {
        syncPdf( data );
        break;
    }
}
