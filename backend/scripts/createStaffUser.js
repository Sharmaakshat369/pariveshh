const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/User");

const allowedRoles = [
  "ADMIN",
  "STATE_REVIEWER",
  "CENTRAL_REVIEWER",
  "SCRUTINY_OFFICER",
  "MOM_SECRETARIAT",
];

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return undefined;
  return process.argv[index + 1];
};

const run = async () => {
  const email = getArgValue("--email") || process.env.STAFF_EMAIL;
  const password = getArgValue("--password") || process.env.STAFF_PASSWORD;
  const name = getArgValue("--name") || process.env.STAFF_NAME || "Staff User";
  const roleInput = (getArgValue("--role") || process.env.STAFF_ROLE || "ADMIN").toUpperCase();
  const state = getArgValue("--state") || process.env.STAFF_STATE;
  const organization = getArgValue("--organization") || process.env.STAFF_ORGANIZATION || "PARIVESH";
  const phone = getArgValue("--phone") || process.env.STAFF_PHONE;

  if (!email || !password) {
    throw new Error("Email and password are required. Use --email and --password arguments.");
  }

  if (!allowedRoles.includes(roleInput)) {
    throw new Error(`Invalid role: ${roleInput}. Allowed roles: ${allowedRoles.join(", ")}`);
  }

  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment.");
  }

  await mongoose.connect(env.MONGO_URI);

  let user = await User.findOne({ email }).select("+password");

  if (user) {
    user.name = name;
    user.password = password;
    user.role = roleInput;
    user.state = state || null;
    user.organization = organization;
    user.phone = phone;
    await user.save();

    console.log(`Updated ${roleInput} user: ${email}`);
  } else {
    user = await User.create({
      name,
      email,
      password,
      role: roleInput,
      state: state || null,
      organization,
      phone,
    });

    console.log(`Created ${roleInput} user: ${email}`);
  }

  await mongoose.disconnect();
};

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Failed to create staff user:", error.message);
    try {
      await mongoose.disconnect();
    } catch {
    }
    process.exit(1);
  });
