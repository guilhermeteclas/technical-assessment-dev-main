import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
  Index,
} from '@typegoose/typegoose';
import lib from '../lib';

import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<User>('save', async function (next) {
  const user = this as Omit<mongoose.Document, keyof User> & User;

  // usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
  if (user.isDirectModified('address') || user.isModified('coordinates')) {
    if (
      (user.address != '' && user.coordinates.length) ||
      (user.address == '' && !user.coordinates.length)
    ) {
      return next(
        new Error('You must provide either "address" or "coordinates".'),
      );
    }
  }

  // uso de serviço de geolocalização para resolver endereço ↔ coordenadas
  if (user.isModified('coordinates') && user.coordinates.length > 0) {
    user.address = await lib.getAddressFromCoordinates(user.coordinates);
  } else if (user.isModified('address') && user.address != '') {
    const { lat, lng } = await lib.getCoordinatesFromAddress(user.address);
    user.coordinates = [lat, lng];
  }

  next();
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false, type: () => [Number] })
  coordinates?: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}

@pre<Region>('save', async function (next) {
  const region = this as Omit<mongoose.Document, keyof Region> & Region;

  if (!region._id) {
    region._id = new ObjectId().toString();
  }

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });

    if (user) {
      user.regions.push(region._id);
      await user.save({ session: region.$session() });
    }
  }

  next(region.validateSync());
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
@Index({ coordinates: '2dsphere' })
export class Region extends Base {
  @Prop({ required: true })
  name!: string;

  // coordenadas para GeoJSON
  @Prop({
    required: true,
    type: mongoose.Schema.Types.Mixed,
  })
  coordinates!: {
    type: string;
    coordinates: number[][][];
  };

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}

export const UserModel = getModelForClass(User);
export const RegionModel = getModelForClass(Region);
