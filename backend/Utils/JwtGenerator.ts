import jwt = require("jsonwebtoken");

function jwtGenerator(id: string | number) {
  const payload = { id };

  return jwt.sign(payload, process.env.jwtSecret as string, {
    expiresIn: "1hr",
  });
}

export default jwtGenerator;
