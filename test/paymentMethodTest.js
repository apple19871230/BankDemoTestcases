var chai = require('chai');
var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var homepath = path.dirname(__dirname);
var helper = require(homepath+'/common/helper.js')
var file = require(homepath+'/common/file.js')

chai.use(chaiHttp);

var payment_method_wrong_reminder_info = "'payment_method' field required, the value should be either 'LOCAL' or 'SWIFT'";

var expect,url,api,bodyJson;


describe('collect bank info Test',function(){
    describe('payment_method testcases',function(){
        before('初始化',function(){
            expect = chai.expect;
            url = helper.getBaseUrl('online');
            api = helper.getApi('base_bank');
        });
        beforeEach('每个case执行前操作',function(){
            bodyJson = JSON.parse(file.readFile(homepath+'/test/bank_body.json'));
        });
        //payment_method = SWIFT/LOCAL,设置正确,返回200
        it('payment_method = SWIFT/LOCAL ,otherinfo is right',function(done){
            var paymentMethodArr = ['SWIFT','LOCAL'];
            bodyJson.payment_method = helper.randomElement(paymentMethodArr);
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    done();
                    });
        });
        //payment_method设置为小写的swift/loccal,或者其他字符,提示报错信息
        it('payment_method = swift/local/other otherinfo is right',function(done){
            var randomStr = helper.randomString(true,0,10);
            var paymentMethodArr = ['swift','local',randomStr];
            bodyJson.payment_method = helper.randomElement(paymentMethodArr);
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal(payment_method_wrong_reminder_info);
                    done();
                    });
        });
        //当没有这个payment_method字段时
        it('payment_method no exist',function(done){
            delete bodyJson.payment_method;
            chai.request(url)
                .post(api)
                .set('content-type','application/json')
                .send(bodyJson)
                .end(function(err,res){
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal(payment_method_wrong_reminder_info);
                    done();
                    });
        });

    });
});


