const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Mock Sequelize
jest.mock('../config/database', () => {
  const SequelizeMock = require('sequelize-mock');
  return new SequelizeMock();
});

describe('User Model', () => {
  let user;

  beforeEach(() => {
    user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'facilitator'
    };
  });

  test('should hash password before create', async () => {
    // Mock bcrypt
    const mockGenSalt = jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
    const mockHash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Call beforeCreate hook
    await User.options.hooks.beforeCreate(user);

    // Assertions
    expect(mockGenSalt).toHaveBeenCalledWith(10);
    expect(mockHash).toHaveBeenCalledWith('password123', 'salt');
    expect(user.password).toBe('hashedPassword');

    // Restore mocks
    mockGenSalt.mockRestore();
    mockHash.mockRestore();
  });

  test('should hash password before update if changed', async () => {
    // Mock bcrypt
    const mockGenSalt = jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
    const mockHash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Setup user with changed password
    user.changed = jest.fn().mockReturnValue(true);

    // Call beforeUpdate hook
    await User.options.hooks.beforeUpdate(user);

    // Assertions
    expect(mockGenSalt).toHaveBeenCalledWith(10);
    expect(mockHash).toHaveBeenCalledWith('password123', 'salt');
    expect(user.password).toBe('hashedPassword');

    // Restore mocks
    mockGenSalt.mockRestore();
    mockHash.mockRestore();
  });

  test('should not hash password before update if not changed', async () => {
    // Mock bcrypt
    const mockGenSalt = jest.spyOn(bcrypt, 'genSalt');
    const mockHash = jest.spyOn(bcrypt, 'hash');

    // Setup user with unchanged password
    user.changed = jest.fn().mockReturnValue(false);

    // Call beforeUpdate hook
    await User.options.hooks.beforeUpdate(user);

    // Assertions
    expect(mockGenSalt).not.toHaveBeenCalled();
    expect(mockHash).not.toHaveBeenCalled();
    expect(user.password).toBe('password123');

    // Restore mocks
    mockGenSalt.mockRestore();
    mockHash.mockRestore();
  });

  test('should validate password correctly', async () => {
    // Mock bcrypt compare
    const mockCompare = jest.spyOn(bcrypt, 'compare');
    
    // Test valid password
    mockCompare.mockResolvedValueOnce(true);
    const isValidPassword1 = await User.prototype.isValidPassword.call(user, 'password123');
    expect(mockCompare).toHaveBeenCalledWith('password123', 'password123');
    expect(isValidPassword1).toBe(true);
    
    // Test invalid password
    mockCompare.mockResolvedValueOnce(false);
    const isValidPassword2 = await User.prototype.isValidPassword.call(user, 'wrongpassword');
    expect(mockCompare).toHaveBeenCalledWith('wrongpassword', 'password123');
    expect(isValidPassword2).toBe(false);
    
    // Restore mock
    mockCompare.mockRestore();
  });
});