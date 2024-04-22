import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find().sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const createGroup = async (req, res) => {
    const group = req.body;
    try {
        if (
            group.owner === "" ||
            group.from === "" ||
            group.to === "" ||
            group.seatVacant === 0 ||
            group.from === group.to
        ) {
            return res.status(400).json({ error: "Invalid group data" });
        }
        const user = await User.findById(group.owner);
        let code;
        do {
            code = generateCode();
            const existingGroup = await Group.findOne({ code: code });
            if (!existingGroup) {
                break;
            }
        } while (true);

        const newGroup = new Group({
            ownerName: user.name,
            ownerId: user._id,
            from: group.from,
            to: group.to,
            seatVacant: group.seatVacant,
            time: group.time,
            members: [user._id],
            code: code,
        });
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export const updateGroup = async (req, res) => {
    const { id } = req.params;
};

export const deleteGroup = async (req, res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.status(200).json({ message: "Group deleted successfully" });
};

export const addUsertoGroup = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const group = await Group.findById(id);
        const user = await User.findById(userId);
        if (group.members.includes(user._id)) {
            return res.status(400).json({ error: "User already in group" });
        }
        group.members.push(user._id);
        group.seatVacant = group.seatVacant - 1;
        await group.save();

        res.status(200).json({ message: "User added to group successfully" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const removeUserFromGroup = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const group = await Group.findById(id);
        const user = await User.findById(userId);
        if (!group.members.includes(user._id)) {
            return res.status(400).json({ error: "User not in group" });
        }
        group.members = group.members.filter(
            (member) => member.toString() !== userId.toString()
        );
        group.seatVacant = group.seatVacant + 1;
        await group.save();

        res.status(200).json({
            message: "User removed from group successfully",
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const confirmGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        group.confirmed = true;
        await group.save();
        res.status(200).json({ message: "Group confirmed successfully" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const fetchMembers = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        const members = await User.find({ _id: { $in: group.members } });
        res.status(200).json(members);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const fetchChatId = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        const chatRoom_id = group.chatRoomId;
        res.status(200).json({ chatRoom_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verifyCode = async (req, res) => {
    const { code, userId } = req.body;
    try {
        const group = await Group.findOne({ code: code });
        if (!group) {
            return res.status(400).json({ error: "Invalid code" });
        }
        if (group.members.includes(userId)) {
            return res.status(400).json({ error: "User already in group" });
        }
        group.members.push(userId);
        group.save();
        res.status(200).json({
            group,
            message: "User added to group successfully",
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const splitAmount = async (req, res) => {
    const { userId, groupId, amount } = req.body;
    try {
        const user = await User.findById(userId);
        const group = await Group.findById(groupId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const receivers = group.members
            .filter((memberId) => memberId.toString() !== userId)
            .map((memberId) => ({ receiverId: memberId, amount: amount }));

        const transaction = new Transaction({
            senderId: userId,
            receivers: receivers,
            amount: amount,
        });

        group.members.forEach(async (memberId) => {
            const receiver = await User.findById(memberId);
            receiver.transactions.push(transaction._id);
            await receiver.save();
        });
        group.transactionId = transaction._id;

        await Promise.all([transaction.save(), group.save()]);
        res.status(201).json({
            message: "Transaction created successfully",
            details: { amount, groupId, transactionId: transaction._id },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
