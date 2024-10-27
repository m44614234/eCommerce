const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("دیتابیس با موفقیت متصل شد");
  } catch (error) {
    console.error("خطا در اتصال به دیتابیس");
  }
};
module.exports = dbConnect;
