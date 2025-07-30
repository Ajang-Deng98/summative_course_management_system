const request = require('supertest');
const express = require('express');
const authController = require('../controllers/auth.controller');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

// Mock dependencies
jest.mock('../models');
jest.mock('../utils/jwt');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    test('should register user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'facilitator'
      };

      const mockUser = { id: 1, ...userData };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mock_token');

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mock_token');
      expect(response.body).toHaveProperty('user');
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).toHaveBeenCalledWith(userData);
    });

    test('should return error if user already exists', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ id: 1, email: userData.email });

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /login', () => {
    test('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        active: true,
        isValidPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mock_token');

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock_token');
      expect(response.body).toHaveProperty('user');
      expect(mockUser.isValidPassword).toHaveBeenCalledWith(loginData.password);
    });

    test('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('should return error for inactive user', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        active: false
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Account is inactive');
    });
  });
});