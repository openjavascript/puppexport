
const fs = require( 'fs' );

module.exports = function( filepath ){
    let tmp = filepath.split( '/' ), tmpPath = '';
        tmp.pop();

    tmp.map( ( v, k ) => {
        if( !v ) return;
        tmpPath = [ tmpPath, v ].join( '/' );
        if (!fs.existsSync(tmpPath)){
            fs.mkdirSync(tmpPath);
        }
    });
}

