const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  // let token;
  // if (req?.headers?.authorization?.startsWith("Bearer")) {
  //   token = req.headers.authorization.split(" ")[1];
  //   console.log("token =>", token);
  //   try {
  //     if (token) {
  //       console.log("token =>", token);

  //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //       // console.log(decoded);
  //       const user = await User.findById(decoded?.id);
  //       req.user = user;
  //       next();
  //     }
  //   } catch (error) {
  //     throw new Error("Not Authorized token expired,Please Login again");
  //   }
  // } else {
  //   throw new Error("THere is no token attached to header");
  // }

  try {
		const token = req.cookies.jwt;
		console.log("token =>", token);

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("Your are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };

