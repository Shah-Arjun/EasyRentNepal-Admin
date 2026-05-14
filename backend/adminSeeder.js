const Admin = require("./models/adminModel");
const bcrypt = require('bcrypt');

const adminSeeder = async () => {
     //check if admin is seeded or not
  const isAdminExist = await Admin.findOne({ email: "admin@gmail.com" });
  //console.log(isAdminExist);

  if (!isAdminExist) {
    // admin seeding
    await Admin.create({
      email: "admin@gmail.com",   // email
      password: bcrypt.hashSync("admin", 10),   //pw
      role: "admin",
    });

    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already seeded")
  }

}

module.exports = adminSeeder    