var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var homepath = path.dirname(__dirname);
var helper = require(homepath+'/common/helper.js')
var file = require(homepath+'/common/file.js')

chai.use(chaiHttp);

var expect,url,api,bodyJson;


//输入指定信息,且信息正确,验证流程是否走通,返回200
describe('right info Test : payment_method=LOCAL',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
        });
        beforeEach('每个case执行前操作',function(){
            bodyJson = JSON.parse(file.readFile(homepath+'/test/bank_body.json'));
        });
    it('give right info, return 200',function(done){
        bodyJson.payment_method = 'LOCAL';
        bodyJson.account_name = helper.randomString(true,2,10);
        delete bodyJson.swift_code;
        chai.request(url)
             .post(api)
             .set('content-type','application/json')
             .send(bodyJson)
             .end(function(err,res){
                expect(res).to.have.status(200);
                done();
             });
    });
});