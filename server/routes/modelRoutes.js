import express from "express";
const router = express.Router();
import modelsController from "../controllers/modelsController.js";

router
  .route("/")
  .get(modelsController.getAllModels)
  .post(modelsController.createNewModel)
  .patch(modelsController.updateModel)
  .delete(modelsController.deleteModel);

export default router;
