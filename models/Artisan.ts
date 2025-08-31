import mongoose, { Schema, model, models } from "mongoose";

const ArtisanSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  heritage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.Artisan || model("Artisan", ArtisanSchema);
