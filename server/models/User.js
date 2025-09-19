const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ON GARDE UNIQUEMENT CE CHAMP POUR L'ABONNEMENT
    subscriptionExpiresAt: {
      type: Date,
      required: false, // On le rend non-requis
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive',
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple documents to have no value for this field
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true
    },
    paypalSubscriptionId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;