import { Injectable } from '@nestjs/common';
import { LinkDto } from '../models';
import { Links, LinksDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { LinkNotFound, ExpiredLink, NoExpiration } from '../shared';
import { setExpirationDate } from '../helper';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Links.name)
    private readonly linkModel: Model<LinksDoc>,
  ) {}

  async createLink(body: LinkDto & { email: string }) {
    const shortLink = randomUUID().replace(/-/g, '').slice(0, -17);
    const days = 5;
    const expiredAt = setExpirationDate(days);
    const doc = new this.linkModel({
      ...body,
      originalLink: body.originalLink,
      shortLink: shortLink,
      expiredAt: expiredAt,
    });
    const links = await doc.save();

    return links;
  }

  async getExpired(query, user) {
    const data = JSON.parse(query.expiredAt);

    if (!data.gt && !data.lt) {
      throw new NoExpiration('There is any expiration date mentions, please try again!')
    }

    if (data.gt && data.lt) {
      const ltAndGtExpirationDate = await this.linkModel.aggregate([
        {
          $match: {
            email: user.email,
            expiredAt: { $gt: new Date(data.gt), $lt: new Date(data.lt) }
          },
        },
      ]);
      return ltAndGtExpirationDate
    }

    if (data.gt) {
      const gtExpirationDate = await this.linkModel.aggregate([
        {
          $match: {
            email: user.email,
            expiredAt: { $gt: new Date(data.gt) },
          },
        },
      ]);
      return gtExpirationDate
    }
    
    if (data.lt) {
      const ltExpirationDate = await this.linkModel.aggregate([
        {
          $match: {
            email: user.email,
            expiredAt: { $lt: new Date(data.lt) },
          },
        },
      ]);
      return ltExpirationDate
    }
  }

  async getLink(cut, user) {
    const originalLink = await this.linkModel.findOne({ shortLink: cut });
    const now = setExpirationDate(0);
    if (originalLink.expiredAt < now) {
      throw new ExpiredLink('Link was expired')
    }
    
    if (!originalLink) {
      throw new LinkNotFound('Short link was not found');
    }
    return originalLink.originalLink;
  }
}
