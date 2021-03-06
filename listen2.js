const { ImapFlow } = require("imapflow");
const client = new ImapFlow({
    host: "imap.rambler.ru",
    port: 993,
    secure: true,
    auth: {
        user: "leiterche1980@rambler.ru",
        pass: "MMMu8raf",
    },
});

const main = async () => {
    // Wait until client connects and authorizes
    await client.connect();

    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock("INBOX");
    try {
        // fetch latest message source
        let message = await client.fetchOne("*", { source: true });
        console.log(message.source.toString());

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        for await (let message of client.fetch("1:*", { envelope: true })) {
            console.log(`${message.uid}: ${message.envelope.subject}`);
            console.log(message)
            throw "x";
        }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }

    // log out and close connection
    await client.logout();
};

main().catch((err) => console.error(err));
