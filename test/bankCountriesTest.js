var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var homepath = path.dirname(__dirname);
var helper = require(homepath+'/common/helper.js')
var file = require(homepath+'/common/file.js')

chai.use(chaiHttp);

var US_account_number_length_wrong_remender_info = "Length of account_number should be between 7 and 11 when bank_country_code is 'US'";
var US_account_number_no_exist_remender_info = "'account_number' is required";
var US_aba_length_wrong_reminder_info = "Length of 'aba' should be 9";
var US_aba_not_exist_reminder_info = "'aba' is mandatory when bank country is US";

var AU_acount_number_length_wrong_reminder_info = "Length of account_number should be between 6 and 9 when bank_country_code is 'AU'"
var AU_bsb_length_wrong_reminder_info = "Length of 'bsb' should be 6";
var AU_bsb_no_exist_reminder_info = "'bsb' is required when bank country code is 'AU'"

var CN_account_number_length_wrong_reminder_info  = "Length of account_number should be between 8 and 20 when bank_country_code is 'CN'"

var expect,url,api,bodyJson,bankCode,bsb,swiftCode;;

describe('bank countries test',function(){
    beforeEach('每个case执行前操作',function(){
        bodyJson = JSON.parse(file.readFile(homepath+'/test/bank_body.json'));
    });
    describe('US bank',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
            bankCode = 'US';
        });

        //当bank是US时,对应的acount_number,swift_code,aba按照对应要求设置正确,信息正确,返回200
        it('info right',function(done){
            bodyJson.bank_country_code = bankCode;
            bodyJson.account_number = helper.randomString(true,1,17);
            bodyJson.swift_code=creatSwiftCode(bankCode);
            bodyJson.aba = helper.randomString(false,9);
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
            });
        //acount_number字符长度>17时
        it('acount_number字符长度>17时',function(done){
            bodyJson.account_number=helper.randomString(false,18);
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(US_account_number_length_wrong_remender_info);
                done();
            });

        });
        //acount_number字符长度<1时
        it('acount_number字符长度<1时',function(done){
            bodyJson.account_number="";
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(US_account_number_no_exist_remender_info);
                done();
            });

        });
        //acount_number不存在时
        it('acount_number不存在时',function(done){
            delete bodyJson.account_number;
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(US_account_number_no_exist_remender_info);
                done();
            });

        });
        //aba字段长度不符合要求时
        it('aba length not right',function(done){
            var abaLengthArr = [8,10];
            bodyJson.aba = helper.randomString(false,helper.randomElement(abaLengthArr));
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(US_aba_length_wrong_reminder_info);
                done();
            });
        });
        //aba字段不存在时,这里服务器没有验证,是bug
        it('aba not exist',function(done){
            delete bodyJson.aba;
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(US_aba_not_exist_reminder_info);
                done();
            });
        });
    });

    describe('AU bank Test',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
            bankCode = 'AU';
            bsb = helper.randomString(false,6);
            swiftCode = creatSwiftCode(bankCode);
        });

         //当bank是AU时,对应的acount_number,swift_code,bsb按照对应要求设置正确,信息正确,返回200
        it('info right',function(done){
            bodyJson.bank_country_code = bankCode;
            bodyJson.account_number = helper.randomString(true,6,9);
            bodyJson.swift_code = swiftCode;
            delete bodyJson.aba;
            bodyJson.bsb = bsb;
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });

        });
        //acount_number长度不符合要求时,<6或>9, 这里服务器文案错误,是bug
        it('acount_number length not right',function(done){
            var acountNumberLengthArr=[5,10];
            bodyJson.account_number=helper.randomString(false,helper.randomElement(acountNumberLengthArr));
            bodyJson.bank_country_code = bankCode;
            bodyJson.swift_code = swiftCode;
            delete bodyJson.aba;
            bodyJson.bsb = bsb;
            console.log(bodyJson);
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(AU_acount_number_length_wrong_reminder_info);
                done();
            });
        });
        //bsb长度错误时
        it('bsb lenght is wrong',function(done){
            bodyJson.bank_country_code = bankCode;
            bodyJson.account_number = helper.randomString(true,6,9);
            bodyJson.swift_code = swiftCode;
            delete bodyJson.aba;
            bodyJson.bsb = helper.randomString(false,7);
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(AU_bsb_length_wrong_reminder_info);
                done();
            });
        });
        //bsb字段不存在时
        it('bsb is not exist',function(done){
            bodyJson.bank_country_code = bankCode;
            bodyJson.account_number = helper.randomString(true,6,9);
            bodyJson.swift_code = swiftCode;
            delete bodyJson.aba;
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(AU_bsb_no_exist_reminder_info);
                done();
            });
        });

    });
    describe('CN bank Test',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
            bankCode = 'CN';
            bsb = helper.randomString(false,6);
            swiftCode = creatSwiftCode(bankCode);
        });
        //当bank是CN时,对应的acount_number,swift_code按照对应要求设置正确,信息正确,返回200
        //这里acount_number长度校验错误,是bug
        it('info right',function(done){
            bodyJson.bank_country_code = bankCode;
            bodyJson.account_number = helper.randomString(true,8,20);
            bodyJson.swift_code=swiftCode;
            delete bodyJson.aba;
            console.log(bodyJson);
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });

        });
        //account_number长度不正确时,服务器校验错误,是bug
        it('account_number length is wrong',function(done){
            var accountNumberLengthArr = [7,21];
            bodyJson.account_number = helper.randomString(false,helper.randomElement(accountNumberLengthArr));
            bodyJson.bank_country_code=bankCode;
            bodyJson.swift_code = swiftCode;
            chai.request(url)
            .post(api)
            .set('content-type','application/json')
            .send(bodyJson)
            .end(function(err,res){
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal(CN_account_number_length_wrong_reminder_info);
                done();
            });

        });
    });
});
function creatSwiftCode(bankCode){
    var swiftCodeArr = [8,11];
    var radomStr = helper.randomString(false,helper.randomElement(swiftCodeArr));
    return helper.replacePos(radomStr,5,2,bankCode);
}