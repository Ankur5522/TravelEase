import express from "express";
import {
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,
    updateGroup,
    addUsertoGroup,
    removeUserFromGroup,
    confirmGroup,
    fetchMembers,
    verifyCode
} from "../controllers/groupControllers.js";

const router = express.Router();

router.get("/getGroups", getGroups);
router.get("/getGroup/:id", getGroup);
router.post("/createGroup", createGroup);
router.post("/updateGroup/:id", updateGroup);
router.delete("/deleteGroup/:id", deleteGroup);
router.post("/addUserToGroup/:id", addUsertoGroup);
router.post("/removeUserFromGroup/:id", removeUserFromGroup);
router.post("/confirmGroup/:id", confirmGroup);
router.post("/fetchMembers/:id", fetchMembers);
router.post("/verifyCode", verifyCode)

export default router;
