import mongoose from 'mongoose';
const grpSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    members: [String]
});

const Group = mongoose.model('Group', grpSchema);
export default Group;