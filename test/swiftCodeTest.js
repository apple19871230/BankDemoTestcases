var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var homepath = path.dirname(__dirname);
var helper = require(homepath+'/common/helper.js')
var file = require(homepath+'/common/file.js')

chai.use(chaiHttp);

var expect,url,api,bodyJson;

var no_swift_code_reminder_info ="'swift_code' is required when payment method is 'SWIFT'";
var swift_code_wrong_reminder_info_base ="The swift code is not valid for the given bank country code: US";
var swift_code_len_wrong_reminder_info = "Length of 'swift_code' should be either 8 or 11";


describe('swift_code test',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
        });
        beforeEach('每个case执行前操作',function(){
            bodyJson = JSON.parse(file.readFile(homepath+'/test/bank_body.json'));
        });
    //当swift_code 的长度符合标准时
    it('swift_code length is 8/11',function(done){
        var swiftCodeArr = [8,11];
        var radomStr = helper.randomString(false,helper.randomElement(swiftCodeArr));
        bodyJson.swift_code = helper.replacePos(radomStr,5,2,bodyJson.bank_country_code);
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(200);
                done();
            });

    });
    //当swift_code 的长度不符合标准时
    it('swift_code length is not 8/11',function(done){
        var radomStr = helper.randomString(false,helper.randomElement(9));
        bodyJson.swift_code = helper.replacePos(radomStr,5,2,bodyJson.bank_country_code);
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(swift_code_len_wrong_reminder_info)
                done();
            });
    });
    //当swift_code内不含指定字符时:US/AU/CN
    it('当swift_code内不含指定字符时:US/AU/CN',function(done){
        var swiftCodeArr = [8,11];
        var radomStr = helper.randomString(false,helper.randomElement(swiftCodeArr));
        bodyJson.swift_code = radomStr;
        chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(swift_code_wrong_reminder_info_base)
                done();
            });
    });

    //当payment_method为SWIFT时,swift_code不存在,会有报错信息提示
    it('swift_code not exist',function(done){
            delete bodyJson.swift_code;
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal(no_swift_code_reminder_info);
                    done();
                });
    });

});