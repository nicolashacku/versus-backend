const mongoose = require("mongoose");

const AppEntrySchema = new mongoose.Schema({
  app: {
    type: String,
    enum: ["didi_moto", "indrive", "uber", "didi_food", "rappi", "otro"],
    required: true,
  },
  amount: { type: Number, required: true, min: 0 },
  km: { type: Number, default: null },
});

const EntrySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      enum: ["nicolas", "sebastian"],
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    apps: [AppEntrySchema],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

// Un solo registro por usuario+fecha
EntrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Entry", EntrySchema);
