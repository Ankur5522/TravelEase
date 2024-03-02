import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
