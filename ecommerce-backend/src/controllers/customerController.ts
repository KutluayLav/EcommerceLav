import { Request, Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter: any = { role: 'customer' };
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const customers = await User.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
    const total = await User.countDocuments(filter);
    res.json({ customers, total });
  } catch (err) {
    res.status(500).json({ message: 'Müşteriler listelenemedi.' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Müşteri bulunamadı.' });
    }
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    res.json({ customer, orders });
  } catch (err) {
    res.status(500).json({ message: 'Müşteri getirilemedi.' });
  }
};
