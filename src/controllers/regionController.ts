import { Request, Response } from 'express';
import { RegionModel, UserModel } from '../models';
import { STATUS } from '../utils';

interface Region {
  name: string;
  coordinates: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  userId: string;
}

export const getRegions = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Fetch all regions'
   */

  try {
    const { page = 1, limit = 10 } = req.query;

    const [regions, total] = await Promise.all([
      RegionModel.find()
        .skip((+page - 1) * +limit)
        .limit(+limit),
      RegionModel.countDocuments(),
    ]);

    return res.status(200).json({
      rows: regions,
      page,
      limit,
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Find region by id'
   */

  try {
    const { id } = req.params;
    const region = await RegionModel.findById(id).lean();

    if (!region) {
      // #swagger.responses[400] = { description: 'Region not founded in database' }
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    return res.status(200).json(region);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRegion = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Create a new region'
   */
  /*  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add this points to coordinates: [-48.65636129787703, -27.62967416516865],
                      [-48.65636129787703, -27.637038989898578],
                      [-48.643176809921385, -27.637038989898578],
                      [-48.643176809921385, -27.62967416516865],
                      [-48.65636129787703, -27.62967416516865]',
      required: true,
      schema: {
          name: 'Ponte do Imaruim',
          userId: '675f6e4c24ca512dc0f6ae4e',
          coordinates: {
              type: 'Polygon',
              coordinates: [
              ]
          }
      }
  } 
*/

  try {
    const { name, coordinates, userId }: Region = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    const newRegion = new RegionModel({
      name,
      coordinates,
      user: userId,
    });

    const savedRegion = await newRegion.save();

    return res
      .status(201)
      .json({ id: savedRegion.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRegion = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Delete a region'
   */
  /*  #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add this points to coordinates: [-48.65636129787703, -27.62967416516865],
                      [-48.65636129787703, -27.637038989898578],
                      [-48.643176809921385, -27.637038989898578],
                      [-48.643176809921385, -27.62967416516865],
                      [-48.65636129787703, -27.62967416516865]',
      required: true,
      schema: {
          name: 'Ponte do Imaruim',
          userId: '675f6e4c24ca512dc0f6ae4e',
          coordinates: {
              type: 'Polygon',
              coordinates: [
              ]
          }
      }
  } 
*/
  try {
    const { id } = req.params;
    const update = req.body;

    const region = await RegionModel.findById(id);
    if (!region) {
      // #swagger.responses[400] = { description: 'Region not founded in database' }
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    region.name = update?.name || region.name;
    region.coordinates = update?.coordinates || region.coordinates;

    const updatedRegion = await region.save();

    return res
      .status(201)
      .json({ id: updatedRegion.id, 'message:': req.t('status.ok') });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRegion = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Remove a region'
   */
  try {
    const { id } = req.params;
    const region = await RegionModel.findById(id);

    if (!region) {
      // #swagger.responses[400] = { description: 'Region not founded in database' }
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    await region.deleteOne();

    // #swagger.responses[200] = { description: 'Region deleted' }
    return res.status(STATUS.OK).json({ message: req.t('status.ok') });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getNearbyRegions = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'List regions at a certain distance from a point,with the option to filter regions not belonging to the user who made the request.'
   */
  try {
    const {
      latitude,
      longitude,
      maxDistance = 10000,
      userId,
      exclude = false,
    } = req.query;

    const excludeUser = exclude === 'true';

    if (!latitude || !longitude) {
      // #swagger.responses[400] = { description: 'Latitude and longitude are required.' }
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: 'Latitude and longitude are required.' });
    }

    // filtra as regiões com base no usuário ou exclui da pesquisa (exclude=true)
    let filter = {};
    if (excludeUser) {
      filter = { user: { $ne: userId } };
    } else if (userId) {
      filter = { user: userId };
    }

    const nearbyRegions = await RegionModel.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [+longitude, +latitude],
          },
          $maxDistance: +maxDistance,
        },
      },
      ...filter,
    });
    // #swagger.responses[200] = { description: 'Region founded' }
    return res.status(STATUS.OK).json(nearbyRegions);
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getRegionsWithinPoint = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Regions']
   * #swagger.description = 'Search for the region that has the specified point'
   */
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      // #swagger.responses[400] = { description: 'Latitude and longitude are required.' }
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: 'Latitude and longitude are required.' });
    }

    const point = [+longitude, +latitude];

    const regionsContainingPoint = await RegionModel.find({
      coordinates: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: point,
          },
        },
      },
    });

    // #swagger.responses[200] = { description: 'Region founded' }
    return res.status(STATUS.OK).json(regionsContainingPoint);
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
