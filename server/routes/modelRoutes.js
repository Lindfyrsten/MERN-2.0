import express from "express";
const router = express.Router();
import modelsController from "../controllers/modelsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router
  .route("/")
  .get(modelsController.getAllModels)
  .post(modelsController.createNewModel)
  .patch(modelsController.updateModel)
  .delete(modelsController.deleteModel);

export default router;
