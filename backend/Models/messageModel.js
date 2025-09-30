import mongoose from 'mongoose';

const msgSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
    isGroup: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', msgSchema);
export default Message;