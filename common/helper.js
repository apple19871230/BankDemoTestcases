
exports.getApi = function(tag){
    var path = require('path');
    var homepath = path.dirname(__dirname);
    var file = require(homepath+'/common/file.js');
    var apiJson= JSON.parse(file.readFile(homepath+'/conf/api.json'));
    return apiJson[tag];
}
exports.getBaseUrl = function(tag){
    var path = require('path');
    var homepath = path.dirname(__dirname);
    var file = require(homepath+'/common/file.js');
    var urlJson = JSON.parse(file.readFile(homepath+'/conf/host.json'));
    return 'http://'+urlJson[tag].domain_name+':'+urlJson[tag].port;
}

/*
 ** randomString 产生任意长度随机字母数字组合
 ** isLenRandom 是否任意长度 min 任意长度最小位 max 任意长度最大位
 */

exports.randomString = function(isLenRandom, min, max) {
   var str = '';
   var range = min;
   var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
       'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
       'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
       'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
       'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
       '-','.','~','!','@','#','$','%','^','&','*','(',')','_',':','<','>','?'];

   if (isLenRandom) {
     //定义长度
     range = Math.round(Math.random() * (max - min)) + min;
   }
   for (let i = 0; i < range; i++) {
     var pos = Math.round(Math.random() * (arr.length - 1));
     str += arr[pos];
   }
   return str;
 }
 /*
 **取数组内一个任意元素
 **arr 指定数组
 */
exports.randomElement = function(arr){
    var pos = Math.round(Math.random()*(arr.length - 1));
    return arr[pos];
}
/*
** 替换字符串内指定位置的字符
** pos:开始替换的位置
** howmany:替换字符个数
** item: 替换的目标字符或字符串
*/
exports.replacePos = function(str,pos,howmany,item){
    var arrStr = str.split('');
    arrStr.splice(pos-1,howmany,item);
    return arrStr.join('');
}