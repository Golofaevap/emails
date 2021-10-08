var imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const _ = require("lodash");

var config = {
    imap: {
        user: "leiterche1980@rambler.ru",
        password: "MMMu8raf",
        host: "imap.rambler.ru",
        port: 993,
        tls: true,
        authTimeout: 3000,
    },
};

async function main() {
    const connection = await imaps.connect(config);
    const openBox = await connection.openBox("INBOX");

    var delay = 24 * 3600 * 1000;
    var yesterday = new Date();
    yesterday.setTime(Date.now() - delay);
    yesterday = yesterday.toISOString();
    // var searchCriteria = ["UNSEEN"];
    // var searchCriteria = ["UNSEEN", ["SINCE", yesterday]];

    var searchCriteria = [["SINCE", yesterday]];
    var fetchOptions = {
        bodies: ["HEADER", "TEXT", ""],
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    messages.forEach(function (item) {
        var all = _.find(item.parts, { which: "" });
        var id = item.attributes.uid;
        var idHeader = "Imap-Id: " + id + "\r\n";
        item.attributes.uid;
        simpleParser(idHeader + all.body, (err, mail) => {
            // access to the whole mail object
            console.log(mail.subject);
            // console.log(mail.html);
            // console.log(mail.text);
            console.log(mail.messageId);
            // const myID = /ddd-ddd-dddd/g;
            // const id = myID.match(mail.text);
            // console.log(id);
            const string = mail.text.match(/\d\d\d-\d\d\d-\d\d\d\d/);
            if (string) console.log(string[0]);
        });
    });
    console.log("finish");
}

main();

// imaps.connect(config).then(function (connection) {
//     return connection.openBox("INBOX").then(function () {
//         // var searchCriteria = ["1:5"];
//         var delay = 24 * 3600 * 1000;
//         var yesterday = new Date();
//         yesterday.setTime(Date.now() - delay);
//         yesterday = yesterday.toISOString();
//         // var searchCriteria = ["UNSEEN"];
//         // var searchCriteria = ["UNSEEN", ["SINCE", yesterday]];

//         var searchCriteria = [["SINCE", yesterday]];
//         var fetchOptions = {
//             bodies: ["HEADER", "TEXT", ""],
//         };
//         return connection.search(searchCriteria, fetchOptions).then(function (messages) {
//             messages.forEach(function (item) {
//                 var all = _.find(item.parts, { which: "" });
//                 var id = item.attributes.uid;
//                 var idHeader = "Imap-Id: " + id + "\r\n";
//                 simpleParser(idHeader + all.body, (err, mail) => {
//                     // access to the whole mail object
//                     console.log(mail.subject);
//                     // console.log(mail.html);
//                     console.log(mail.text);
//                     console.log(mail.messageId);
//                     // const myID = /ddd-ddd-dddd/g;
//                     // const id = myID.match(mail.text);
//                     // console.log(id);
//                     const string = mail.text.match(/\d\d\d-\d\d\d-\d\d\d\d/);
//                     if (string) console.log(string[0]);
//                 });
//             });
//             connection.closeBox();
//         });
//     });
// });
