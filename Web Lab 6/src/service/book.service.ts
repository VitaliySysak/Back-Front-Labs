import { Injectable } from '@nestjs/common';
import { BookDto } from '../models';
import {
  Books,
  BooksDoc,
  Pages,
  PagesDoc,
  UserDoc,
  Users,
  Parts,
  PartsDoc,
  PartAccessTokens,
  PartAccessTokensLeanDoc,
} from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SplitToPartService } from './splitToParts.service';
import { randomUUID } from 'crypto';
import { OtpNotMatch } from 'src/shared';
import { count } from 'console';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Books.name)
    private readonly bookModel: Model<BooksDoc>,
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
    @InjectModel(Pages.name)
    private readonly pageModel: Model<PagesDoc>,
    @InjectModel(Parts.name)
    private readonly partModel: Model<PartsDoc>,
    @InjectModel(PartAccessTokens.name)
    private readonly partAccessTokensModel: Model<PartAccessTokensLeanDoc>,
  ) {}

  async createBook(body: BookDto & { email: string }) {
    const user = await this.userModel.findOne({ email: body.email });
    const doc = new this.bookModel({
      title: body.title,
      userId: user._id,
      totalPageNumber: body.pageLinks.length,
    });
    const book = await doc.save();

    const order = new SplitToPartService();
    let arr = {};
    let counter = 0;
    for (const e of body.pageLinks) {
      counter++;
      order.split(e.pageLink).then(async (coordinates) => {
        arr[`Page ${counter}`] = coordinates;

        const doc = new this.pageModel({
          bookId: book._id,
          url: e.pageLink,
          pageNumber: counter,
          TotalCount: 0,
        });
        const page = await doc.save();

        for (const e of coordinates) {
          const doc = new this.partModel({
            pictureId: page._id,
            box: e,
            options: [],
          });
          await doc.save();
        }
      });
    }
    return book;
  }

  async getBook(user) {
    const userBooks = await this.bookModel.find({ userId: user._id });
    return userBooks;
  }

  async getParts() {
    const { ObjectId } = require('mongodb');
    const randomPart = await this.partModel.aggregate([
      { $sample: { size: 1 } },
    ]);

    // const a = await this.pageModel.findById(new ObjectId("6631f77e0fcc31236104f0d8"));
    // console.log(a);

    console.log(randomPart);
    const part = await this.partModel.findOne({ _id: randomPart[0]._id });

    const doc = new this.partAccessTokensModel({
      partId: part._id,
      otp: randomUUID(),
    });
    await doc.save();

    const page = await this.pageModel.findOne({ _id: part.pictureId });

    const result = {
      partId: doc.partId,
      imageUrl: page.url,
      otp: doc.otp,
      box: randomPart[0].box,
    };

    return result;
  }

  async postParts(partId, body) {
    const isMatch = await this.partAccessTokensModel.findOne({
      otp: body.otp,
      partId: partId,
    });

    if (!isMatch) {
      throw new OtpNotMatch('Your part id do not match with otp!');
    }
    await this.partAccessTokensModel.updateOne(
      { otp: body.otp, partId: partId },
      { $unset: { otp: body.otp } },
    );

    const otherUserAnswer = await this.partModel.findOne({
      _id: partId,
      'options.text': body.text,
    });
    console.log(otherUserAnswer);
    if (otherUserAnswer) {
      const matchedAnswer = await this.partModel.findOneAndUpdate(
        {
          _id: partId,
          'options.text': body.text,
        },
        {
          $inc: { 'options.$.count': 1 },
        },
        { new: true },
      );

      const incTotalCounter = await this.pageModel.findOneAndUpdate(
        {
          _id: matchedAnswer.pictureId,
        },
        {
          $inc: { TotalCount: 1 },
        },
        { new: true },
      );
      console.log(incTotalCounter);
      console.log(matchedAnswer);
    } else {
      const newAnswer = await this.partModel.findOneAndUpdate(
        { _id: partId },
        { $push: { options: { text: body.text, count: 0 } } },
        { new: true },
      );
      console.log(newAnswer.toObject());
    }
    return body.text;
  }
}
