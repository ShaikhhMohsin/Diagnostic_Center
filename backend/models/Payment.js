const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    transactionId: { type: String },
    // QR image is served statically from /payments/phonepe_qr.png, we store path for reference
    qrImagePath: { type: String, default: '/payments/phonepe_qr.png' },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
