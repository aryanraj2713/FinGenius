import { Request, Response, Router } from 'express';
import Razorpay from 'razorpay';
import config from '../config';
import database from '../loaders/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import generateToken, { authenticateToken } from '../utils';

export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.post("/orders", authenticateToken(), async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;
      const receiver = req.body.receiver;
      const instance = new Razorpay({
        key_id: config.razorpay.key_id,
        key_secret: config.razorpay.key_secret,
      });

      const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: uuidv4(),
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");

      const collection = (await database()).collection('orders');
      await collection.insertOne({
        orderId: order.id,
        userId: user.userId,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        receiver: receiver,
      });

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/signup", async (req, res) => {
    try {
      const collection = (await database()).collection('users');
      const user = await collection.findOne({ email: req.body.email });
      if (user) {
        throw new Error('User already exist with same email');
      }
      const saltRounds = 10;
      const hash = await bcrypt.hash(req.body.password, saltRounds);

      await collection.insertOne({
        userId: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      res.status(201).send({
        success: true,
        message: 'User created successfully',
      });
    } catch (error) {
      if (error.message === 'User already exist with same email') {
        res.status(409).send({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const data = await (await database()).collection('users').findOne({ email: req.body.email });

      if (!data) {
        throw { statusCode: 404, message: 'User Does Not Exsist' };
      }

      const result = await bcrypt.compare(req.body.password, data.password);
      if (!result) {
        throw { statusCode: 401, message: 'Incorrect Password / Not Allowed' };
      }
      const user = await (await database()).collection('users').findOne({ email: req.body.email }, {
        projection: { password: 0, _id: 0 }
      });
      res.status(200).json({
        success: true,
        message: 'login Successful',
        user,
        jwt: generateToken(data.email),
      });
    } catch (error) {
      res.status(error.statusCode || 500).send({
        success: false,
        message: error.message,
      });
    }
  });

  app.get("/orders", authenticateToken(), async (req, res) => {
    try {
      const user = res.locals.user;
      const collection = (await database()).collection('orders');
      const orders = await collection.find({ userId: user.userId }).toArray();
      res.json(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/orders/:orderId", authenticateToken(), async (req, res) => {
    try {
      const user = res.locals.user;
      const collection = (await database()).collection('orders');
      const order = await collection.findOne({ orderId: req.params.orderId, userId: user.userId });
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/user", authenticateToken(), async (req, res) => {
    try {
      const user = res.locals.user;
      res.json(user);
    } catch (error) {
      res.status
    }
  });

  return app;
};
