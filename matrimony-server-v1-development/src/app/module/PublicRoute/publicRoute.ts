// routes/location.routes.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import catchAsync from "../../../utils/catchAsync";


const router = express.Router();

// MongoDB collection names
const DIVISION_COLLECTION = "divisions";
const DISTRICT_COLLECTION = "districts";
const UPAZILA_COLLECTION = "upazilas";

// Generic function to fetch all documents from a collection
// Generic function to fetch all documents from a collection
const getAllDocuments = async (collectionName: string) => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB is not connected");
  }
  return await mongoose.connection.db.collection(collectionName).find({}).toArray();
};

// Generic function to fetch a single document by _id from a collection
const getDocumentById = async (collectionName: string, id: string) => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB is not connected");
  }
  return await mongoose.connection.db
    .collection(collectionName)
    .findOne({ _id: new mongoose.Types.ObjectId(id) });
};

/* ========== DIVISIONS ========== */
// GET all divisions
const getAllDivisions = async (req: Request, res: Response) => {
  const divisions = await getAllDocuments(DIVISION_COLLECTION);
  res.status(200).json({ success: true, data: divisions });
};

// GET division by id
const getDivisionById = async (req: Request, res: Response) => {
  const division = await getDocumentById(DIVISION_COLLECTION, req.params.id);
  if (!division) return res.status(404).json({ success: false, message: "Division not found" });
  res.status(200).json({ success: true, data: division });
};

/* ========== DISTRICTS ========== */
// GET all districts
const getAllDistricts = async (req: Request, res: Response) => {
  const districts = await getAllDocuments(DISTRICT_COLLECTION);
  res.status(200).json({ success: true, data: districts });
};

// GET district by id
const getDistrictById = async (req: Request, res: Response) => {
  const district = await getDocumentById(DISTRICT_COLLECTION, req.params.id);
  if (!district) return res.status(404).json({ success: false, message: "District not found" });
  res.status(200).json({ success: true, data: district });
};

/* ========== UPAZILAS ========== */
// GET all upazilas
const getAllUpazilas = async (req: Request, res: Response) => {
  const upazilas = await getAllDocuments(UPAZILA_COLLECTION);
  res.status(200).json({ success: true, data: upazilas });
};

// GET upazila by id
const getUpazilaById = async (req: Request, res: Response) => {
  const upazila = await getDocumentById(UPAZILA_COLLECTION, req.params.id);
  if (!upazila) return res.status(404).json({ success: false, message: "Upazila not found" });
  res.status(200).json({ success: true, data: upazila });
};

/* ========== ROUTES ========== */
router.get("/divisions", catchAsync(getAllDivisions));
router.get("/divisions/:id", catchAsync(getDivisionById));

router.get("/districts", catchAsync(getAllDistricts));
router.get("/districts/:id", catchAsync(getDistrictById));

router.get("/upazilas", catchAsync(getAllUpazilas));
router.get("/upazilas/:id", catchAsync(getUpazilaById));

export default router;
