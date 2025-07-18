import { Request, Response } from 'express';
import NewsletterSubscriber from '../models/NewsletterSubscriber';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir email giriniz.' });
    }
    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' });
    }
    await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: 'Abonelik başarılı!' });
  } catch (err) {
    res.status(500).json({ message: 'Abonelik sırasında hata oluştu.' });
  }
};
