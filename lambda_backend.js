var express = require('express');
var request = require('request');
var app = express();

app.get('/', function(req, appRes) {
    var sessionId = req.query.sessionId;
    var userId = req.query.userId;
    var query = req.query.query;

    var contexts = {};
    var retMsg = [];
    var endRun = false;
    
    var actions = {
        "hasProvided": ($parameters, callback) => {
            if (hasContextAttribute($parameters[0])) {
                sendEvent($parameters[1], callback);
            } else {
                sendEvent($parameters[2], callback);
            }
        },
        "attributeIs": ($parameters, callback) => {
            if (contextAttributeIs($parameters[0], $parameters[1])) {
                sendEvent($parameters[2], callback);
            } else {
                sendEvent($parameters[3], callback);
            }
        }
    }

    var getActionFromMessage = (msg) => {
        if (msg.includes('.action')) {
            let index = msg.indexOf(".action");
            index += 8;
            return msg.substr(index).split(" ")[0];
        }
        return "";
    };

    var getEventFromMessage = (msg) => {
        if (msg.includes('.event')) {
            let index = msg.indexOf(".event");
            index += 7;
            return msg.substr(index);
        }
        return "";
    }

    var getActionEventsFromMessage = (msg) => {
        if (msg.includes('.action')) {
            let index = msg.indexOf(".action");
            index += 8;
            return msg.substr(index).split(" ").splice(1);
        }
        return [""];
    }

    var setContexts = (ret) => {
        contexts = ret.result.contexts;
    }

    var hasContextAttribute = (attribute) => {
        for (let i = 0; i < contexts.length; i++) {
            if (contexts[i].parameters[attribute] !== "") return true;
        }
        return false;
    }

    var contextAttributeIs = (attribute, value) => {
        for (let i = 0; i < contexts.length; i++) {
            if (contexts[i].parameters[attribute] === value) return true;
        }
        return false;
    }

    var addMessage = (msg) => {
        msg = removeActionFromMessage(msg);
        msg = removeEventFromMessage(msg);

        if (msg !== "") retMsg.push(msg);
    }

    var removeActionFromMessage = (msg) => {
        if (msg.includes('.action')) msg = msg.substr(0, msg.indexOf(".action"));
        return msg.trim();
    }

    var removeEventFromMessage = (msg) => {
        if (msg.includes('.event')) msg = msg.substr(0, msg.indexOf(".event"));
        return msg.trim();
    }

    var sendQuery = (callback) => {
        let url = 'https://api.dialogflow.com/v1/query?v=20150910&lang=no';
        url += "&query=" + encodeURI(query) + "&sessionId=" + sessionId;

        let options = {
            url: url,
            headers: {
                Authorization: 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
            }
        }

        request.get(options, callback);
    }

    var sendEvent = ($event, callback) => {
        let url = 'https://api.dialogflow.com/v1/query?v=20150910&lang=no';
        url += "&e=" + $event + "&sessionId=" + sessionId;

        let options = {
            url: url,
            headers: {
                Authorization: 'Bearer 35ab7ad584cb4e2ba60341cd01f35d86'
            }
        }

        request.get(options, callback);
    }

    var logQuery = (intent) => {
        let url = 'https://chatbase.com/api/message';
        let obj = {
            api_key: 'd8a73789-5275-4be2-9727-18180c2295b2',
            type: 'user',
            platform: 'demo20180529',
            intent: intent,
            user_id: userId,
            message: query,
            version: "0.2",
            time_stamp: Date.now()
        };
        
        if (intent === "Default Fallback Intent") {
            obj.not_handled = true;
            delete obj.intent;
        }
        
        let options = {
            url: url,
            body: JSON.stringify(obj)
        }

        request.post(options);
    }

    var logResponse = (messages, intent) => {
        let url = 'https://chatbase.com/api/messages';
        
        let msgs = [];
        
        for (var i in messages) {
            let obj = {
                api_key: 'd8a73789-5275-4be2-9727-18180c2295b2',
                type: 'agent',
                user_id: userId,
                time_stamp: Date.now(),
                platform: 'demo20180529',
                message: messages[i],
                intent: intent,
                version: "0.2",
            }
            
            if (intent === "Default Fallback Intent") {
                delete obj.intent;
            }
            
            msgs.push(obj);
        }
        
        let options = {
            url: url,
            body: JSON.stringify({
                messages: msgs
            })
        }
        
        request.post(options);
    }
    
    var queryLogged = false;

    var func = (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        let ret = JSON.parse(body);        
        let intent = ret.result.metadata.intentName;
        
        if (!queryLogged) {
            logQuery(intent);
            queryLogged = true;
        }
        
        setContexts(ret);
        let messages = ret.result.fulfillment.messages;
        
        let actionOrEventTriggered = false;

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i].speech;
            let action = getActionFromMessage(message);
            let $event = getEventFromMessage(message);

            if (actions[action]) {
                actionOrEventTriggered = true;
                let $events = getActionEventsFromMessage(message);
                actions[action]($events, func);
            }
            if ($event !== "") {
                actionOrEventTriggered = true;
                sendEvent($event, func);
            }
            if (i == messages.length - 1 && !actionOrEventTriggered) endRun = true;
            addMessage(message);
        }

        if (endRun && retMsg.length > 0) {
            var response = {
                "statusCode": 200,
                "body": JSON.stringify(retMsg),
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "isBase64Encoded": false
            };
            
            logResponse(retMsg, intent);

            appRes.setHeader('Content-Type', 'application/json');
            appRes.send(JSON.stringify(retMsg));
        }
    }

    sendQuery(func);
}).listen(4280);