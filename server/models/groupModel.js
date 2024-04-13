import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    seatVacant: {
        type: Number,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    confirmed: {
        type: Boolean,
        default: false
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    },
    code: {
        type: String,
        required: true
    }
},{timestamps: true});

const Group = mongoose.model('Group', groupSchema);

export default Group;
