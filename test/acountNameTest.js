var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var homepath = path.dirname(__dirname);
var helper = require(homepath+'/common/helper.js')
var file = require(homepath+'/common/file.js')
chai.use(chaiHttp);

var expect,url,api,bodyJson;

var account_name_length_wrong_reminder_info = 'Length of account_name should be between 2 and 10';
var account_name_not_exist_reminder_info = "'account_name' is required";


describe('acount name test',function(){
    before('初始化',function(){
        expect = chai.expect;
        url = helper.getBaseUrl('online');
        api = helper.getApi('base_bank');
    });
    beforeEach('每个case执行前操作',function(){
        bodyJson = JSON.parse(file.readFile(homepath+'/test/bank_body.json'));
    });
    //当account_name符合要求时
    it('account_name length right',function(done){
        bodyJson.account_name = helper.randomString(true,2,10);
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(200);
                done();
            });
    });
    //当account_name长度不符合要求时
    it('account_name length not right',function(done){
        var nameLen = helper.randomElement([1,11]);
        bodyJson.account_name = helper.randomString(false,nameLen);
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(account_name_length_wrong_reminder_info);
                done();
            });
    });
    //当account_name字段不存在时
    it('account_name not exist',function(done){
        delete bodyJson.account_name;
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(account_name_not_exist_reminder_info);
                done();
            });
    });
    //account_name''时
    it("account_name is ''",function(done){
        bodyJson.account_name='';
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(account_name_not_exist_reminder_info);
                done();
            });
    });
});