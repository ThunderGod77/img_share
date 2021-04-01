var SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendMail = ()=>{
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
      {
        'subject':'Hello from the Node SDK!',
        'sender' : {'email':'kshitijgang76@gmail.com', 'name':'Sendinblue'},
        'replyTo' : {'email':'kshitijgang76@gmail.com', 'name':'Sendinblue'},
        'to' : [{'name': 'John Doe', 'email':'gangkshitij@gmail.com'}],
        'htmlContent' : '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
        'params' : {'bodyMessage':'Made just for you!'}
      }
    ).then(function(data) {
      console.log(data);
    }, function(error) {
      console.error(error);
    });
}



