import express from "express";

import { CreateFeedback, deleteSubUser, deleteSubUserProfile,  GetFeedback, loadUser, Login, logout, 
    RegisterSuBUser, RegisterUser, removeDocs, removeMedia, removeVideo, updateSubUserProfile, uploadDocs, uploadMedia, uploadVideo } from "../Controllers/User.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";



const router = express.Router();


router.post("/register-user",RegisterUser);

router.post("/register-sub-user",isAuthenticated,RegisterSuBUser);
router.post("/login",Login);
router.post("/load",isAuthenticated,loadUser);
router.put("/update",isAuthenticated,updateSubUserProfile);
router.delete("/delete",isAuthenticated,deleteSubUserProfile);
router.post("/logout",isAuthenticated,logout);
router.post("/upload-media",isAuthenticated,uploadMedia);
router.post("/delete-media",isAuthenticated,removeMedia);
router.post("/upload-video",isAuthenticated,uploadVideo);
router.post("/delete-video",isAuthenticated,removeVideo);
router.post("/upload-doc",isAuthenticated,uploadDocs);
router.post("/delete-doc",isAuthenticated,removeDocs);
router.post("/delete-sub-user",isAuthenticated,deleteSubUser);
router.post("/feedback",CreateFeedback);
router.get("/feedback",GetFeedback);

export default router;