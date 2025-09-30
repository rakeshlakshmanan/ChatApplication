import express from 'express';
import Message from '../Models/messageModel.js';
import Group from '../Models/groupModel.js';

const router = express.Router();

//1. Get private messages
router.get('/private', async (req, res) => {
    const { user1, user2 } = req.query;
    const messages = await Message.find({
        isGroup: false,
        $or: [{ sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
        ]
    }).sort({ timestamp: 1 });
    res.json(messages);
});


//2. Get group messages
router.get('/group/:groupName', async (req, res) => {
    const groupName = req.params.groupName;
    const username = req.query.user;
    if (!username) {
        return res.status(400).json({ error: 'Username is required ' });
    }
    const group = await Group.findOne({ groupName });

    if (!group || !group.members.includes(username)) {
        return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const messages = await Message.find({
        receiver: groupName,
        isGroup: true,
    }).sort({ timestamp: 1 });
    res.json(messages);
});

//3. Get Unified list of convos(private + group)
router.get('/conversations/all/:username', async (req, res) => {
    const username = req.params.username;

    //----private chat list----

    const privateMsgs = await Message.find({
        isGroup: false,
        $or: [
            { sender: username },
            { receiver: username }
        ]
    });

    const privateUsers = new Set();
    privateMsgs.forEach(msg => {
        if (msg.sender !== username) privateUsers.add(msg.sender);
        if (msg.receiver !== username) privateUsers.add(msg.receiver);
    });

    const privateList = [...privateUsers].map(name => ({
        name,
        isGroup: false
    }));

    //----Group Chat List----

    const groups = await Group.find({ members: username });
    const groupList = groups.map(g => ({
        name: g.groupName,
        isGroup: true
    }));

    res.json([...privateList, ...groupList]);
});
export default router;