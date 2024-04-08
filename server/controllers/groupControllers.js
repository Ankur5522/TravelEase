import Group from "../models/groupModel.js"

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const getGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const createGroup = async (req, res) => {
    const group = req.body;
    try {
        if(group.owner === "" || group.from === "" || group.to === "" || group.seatVacant === 0 || group.from === group.to) {
            return res.status(400).json({ error: "Invalid group data" });
        }
        const newGroup = new Group(group);
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export const updateGroup = async (req, res) => {
    const { id } = req.params;
}

export const deleteGroup = async (req, res) => {
    const { id } = req.params;

    if (!Group.isValid(id)) {
        return res.status(404).send(`No group with id: ${id}`);
    }

    await Group.findByIdAndRemove(id);

    res.json({ error: "Group deleted successfully" });
}