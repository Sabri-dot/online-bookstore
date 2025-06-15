const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // nëse ka përdorues, e ruaj, nëse jo, lejo bosh
  },
  action: {
    type: String,
    required: true, // p.sh. "login", "logout", "book_purchase", "comment_added"
  },
  description: {
    type: String,
    required: false, // opsionale, për detaje më të hollësishme
  },
  ipAddress: {
    type: String,
    required: false, // për ruajtjen e IP-së së përdoruesit
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Log", logSchema);
