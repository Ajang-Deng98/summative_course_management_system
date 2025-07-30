const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../utils/jwt');

// Mock environment variables
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';

// Mock jwt module
jest.mock('jsonwebtoken');

describe('JWT Utilities', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'facilitator'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generateToken should create a JWT token with user data', () => {
    // Mock jwt.sign
    jwt.sign.mockReturnValue('mock_token');

    // Call generateToken
    const token = generateToken(mockUser);

    // Assertions
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    expect(token).toBe('mock_token');
  });

  test('verifyToken should verify a valid token', () => {
    // Mock jwt.verify for success
    jwt.verify.mockReturnValue({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role
    });

    // Call verifyToken
    const decoded = verifyToken('valid_token');

    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(decoded).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role
    });
  });

  test('verifyToken should return null for invalid token', () => {
    // Mock jwt.verify to throw error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Call verifyToken
    const decoded = verifyToken('invalid_token');

    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', process.env.JWT_SECRET);
    expect(decoded).toBeNull();
  });
});