import { Router } from 'express';
import Razorpay from 'razorpay';
import config from '../config';

export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.post("/orders", async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: config.razorpay.key_id,
        key_secret: config.razorpay.key_secret,
      });

      const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "receipt_order_74394",
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");

      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  return app;
};
