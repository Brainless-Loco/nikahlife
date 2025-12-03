// src/modules/biodata/trash.model.ts
import { Schema, model } from "mongoose";
import { IBiodata } from "../biodata/biodata.interface";
import { ITrash } from "./trash.interface";


const trashSchema = new Schema<ITrash>(
  {

data: { type: Schema.Types.Mixed, required: true },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const Trash = model<ITrash>("Trash", trashSchema);
export default Trash;
