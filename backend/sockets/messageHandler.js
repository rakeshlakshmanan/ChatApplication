
import Message from '../Models/messageModel.js';
import Group from '../Models/groupModel.js';

//Socket.io handling messages here

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected: ', socket.id);

        socket.on('sendMessage', async ({ sender, receiver, text, timeStamp, isGroup }) => {
            if (!sender || !receiver || !text) return;

            //if grp, validate membership
            if (isGroup) {
                const group = await Group.findOne({ groupName: receiver });
                if (!group || !group.members.includes(sender)) {
                    return socket.emit('error', { message: 'You are not a meber of this group' });
                }
            }

            const msg = new Message({ sender, receiver, text, timeStamp, isGroup });
            await msg.save();
            io.emit('receiveMessage', msg);
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected: ', socket.id);
        });
    });
}