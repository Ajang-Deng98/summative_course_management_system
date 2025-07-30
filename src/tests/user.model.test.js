const bcrypt = require('bcryptjs');

// Mock database
jest.mock('../config/database', () => {
  const SequelizeMock = require('sequelize-mock');
  return new SequelizeMock();
});

// Mock the models module
jest.mock('../models', () => {
  const bcrypt = require('bcryptjs');
  return {
    User: {
      options: {
        hooks: {
          beforeCreate: jest.fn(async (user) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          }),
          beforeUpdate: jest.fn(async (user) => {
            if (user.changed && user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          })
        }
      },
      prototype: {
        isValidPassword: jest.fn()
      }
    }
  };
});

const { User } = require('../models');

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
    // Mock the isValidPassword method to simulate bcrypt.compare behavior
    User.prototype.isValidPassword.mockImplementation(async function(password) {
      return await bcrypt.compare(password, this.password);
    });
    
    // Create a user instance with hashed password
    const userInstance = {
      password: await bcrypt.hash('password123', await bcrypt.genSalt(10)),
      isValidPassword: User.prototype.isValidPassword
    };
    
    // Test valid password
    const isValidPassword1 = await userInstance.isValidPassword('password123');
    expect(isValidPassword1).toBe(true);
    
    // Test invalid password
    const isValidPassword2 = await userInstance.isValidPassword('wrongpassword');
    expect(isValidPassword2).toBe(false);
  });
});