var thumper = require('./thumper')
,   bets    = require('./bets')
,   services= require('./services.js')
;
/*
var analyze_consumer = {
    exchange: 'bettingExchange',
    queue: 'analyze_queue',
    routingKey: 'analyze',
    callback: function(msg, headers, deliveryInfo) {
        console.log("__dirname", __dirname);
        filename = "small_" + msg.filename;
        tmpPath = __dirname + "/../tmp/" + filename;
        image_storage.readGsFile(msg.filename, function(error, gsData) {
            console.log('resize_consumer readGsFile');
            im.resize({
                srcData: gsData.binary,
                dstPath: tmpPath,
                width:   225
            }, function(err, stdout, stderr){
                console.log('storing file');
                console.log(Object.keys(gsData.gsObject));
                image_storage.storeFile(tmpPath, filename, gsData.gsObject.contentType, function(error, data) {
                    console.log("deleting temporary file: ", tmpPath);
                    fs.unlink(tmpPath);
                    thumper.publishMessage('cloudstagram-new-image', msg, '');
                });
            });
        });
    }
};
*/
function analyze_consumer() {
    
    services.getRabbitMqConnection(function(conn) {
        
        //var ex = conn.exchange('bettingExchange', {'type': 'direct', durable: false}, function(ex) {
            console.log("hallo");
            //ex.publish('', "testnachricht", {deliveryMode: 1});
        //});
    });
    
};
/*
var new_image_consumer = {
    exchange: 'cloudstagram-new-image',
    queue: 'new_image_queue',
    routingKey: '',
    callback: function(msg, headers, deliveryInfo) {
        user_images.addLatestImage(msg.userid, msg);
    }
};

var image_to_followers_consumer = {
    exchange: 'cloudstagram-new-image',
    queue: 'image_to_followers_queue',
    routingKey: '',
    callback: function(msg, headers, deliveryInfo) {
        user_images.addImageToFollowers(msg.userid, msg, function(error, data) {
        });
    }
};
*/
    