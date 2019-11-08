/**
 * <ateveryuan@gmail.com> created at 2019.11.08 11:13:57
 *
 *
 */
'use strict';


const qs = require('qs');

function isBuffer(str){
    return str && typeof str === "object" && Buffer.isBuffer(str);
}

function bufferConvertor(str) {
    return new Buffer( str, 'base64').toString();
}

function SSDecoder(str) {
    const data = str.split(':');
    const result = {};
    const pswAndSer =  data[1].split('@');
    result.server = pswAndSer[1];
    result.port = data[2];
    result.method = data[0];
    result.password = pswAndSer[0];
    return result;
}

function SSRDecoder(str) {
    // ssr://server:port:protocol:method:obfs:password_base64/?params_base64
    const data = str.split(':');
    const pswAndParam =  data[5].split('/?');
    let result = qs.parse(pswAndParam[1]);
    result.server = data[0];
    result.port = data[1];
    result.protocol = data[2];
    result.method = data[3];
    result.obfs = data[4];
    result.password_base64 = bufferConvertor(pswAndParam[0]);
    result.obfsparam = bufferConvertor(result.obfsparam);
    result.protoparam = bufferConvertor(result.protoparam);
    result.remarks = bufferConvertor(result.remarks);
    result.group = bufferConvertor(result.group);
    return result;
}


const error = 'your input is not correct ss/ssr protocol';

function Decoder(str, type) {
    // prefix
    const ssPrefix = "ss://";
    const ssrPrefix = "ssr://";
    const ss = 'ss';
    const ssr = 'ssr';

    // type
    if(!type && str.startsWith(ssPrefix)) {
        type = ss;
    } else if(!type && str.startsWith(ssrPrefix)) {
        type = ssr;
    }

    if(type === ss) {
        str = str.replace(ssPrefix, '')
    } else if( type && type === ssr) {
        str = str.replace(ssrPrefix, '')
    } else {
        return error;
    }

    str = new Buffer( str, 'base64').toString();

    if(type === ss) {
        return SSDecoder(str);
    } else {
        return SSRDecoder(str);
    }
}

module.exports = Decoder;
