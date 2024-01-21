import jwt from "jsonwebtoken";
const JWT_SECRET = "youaregoodboy";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(403).send({
      error: "Please use a valid token",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log(data);
    req.user = { _id: data.userId };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
export default fetchUser;
