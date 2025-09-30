import express from 'express';


import Group from '../Models/groupModel.js';
const router = express.Router();

//4. Create a group with members

router.post('/create', async (req, res) => {
    const { groupName, members } = req.body;

    if (!groupName || !Array.isArray(members) || members.length === 0) {
        return res.status(409).json({ error: 'Group name and members are required' });
    }

    const existing = await Group.findOne({ groupName });
    if (existing) {
        return res.status(409).json({ error: 'Group already exists' });
    }

    const group = new Group({ groupName, members });
    await group.save();

    res.status(201).json({ message: 'Group created successfully', group });
});

export default router;