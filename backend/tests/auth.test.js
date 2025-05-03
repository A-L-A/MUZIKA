import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Simple tests that don't require database connection
describe("Authentication", () => {
  // Verify testing setup works
  test("Testing infrastructure works", () => {
    expect(1 + 1).toBe(2);
  });

  // Test JWT token generation and verification
  test("JWT tokens can be generated and verified", () => {
    const user = {
      _id: "123456789012",
      userType: "regularUser",
    };

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || "test-secret-key",
      { expiresIn: "1d" }
    );

    expect(token).toBeDefined();

    // Verify the token can be decoded
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "test-secret-key"
    );
    expect(decoded.userId).toBe(user._id);
    expect(decoded.userType).toBe(user.userType);
  });
});
