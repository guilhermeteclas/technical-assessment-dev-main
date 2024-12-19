import { Request, Response } from 'express';
import { RegionModel, UserModel } from '../models';
import { STATUS } from '../utils';

export const getRegions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const [regions, total] = await Promise.all([
      RegionModel.find()
        .skip((+page - 1) * +limit)
        .limit(+limit),
      RegionModel.countDocuments(),
    ]);

    return res.json({
      rows: regions,
      page,
      limit,
      total,
    });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const region = await RegionModel.findById(id).lean();

    if (!region) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    return res.json(region);
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const createRegion = async (req: Request, res: Response) => {
  try {
    const { name, coordinates, userId } = req.body;

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

    return res.status(STATUS.CREATED).json(savedRegion);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const region = await RegionModel.findById(id);
    if (!region) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    region.name = update?.name || region.name;
    region.coordinates = update?.coordinates || region.coordinates;

    const updatedRegion = await region.save();

    return res.status(STATUS.UPDATED).json(updatedRegion);
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteRegion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const region = await RegionModel.findById(id);

    if (!region) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: req.t('status.not-found') });
    }

    await region.deleteOne();

    return res.status(STATUS.OK).json({ message: req.t('status.OK') });
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Listar regiões a uma certa distância de um ponto,
// com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
export const getNearbyRegions = async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      maxDistance = 10000,
      userId,
      exclude,
    } = req.query;

    const excludeUser = exclude === 'true';

    if (!latitude || !longitude) {
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

    return res.json(nearbyRegions);
  } catch (error) {
    console.error(error);

    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
// busca região que tenha o ponto informado
export const getRegionsWithinPoint = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
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

    return res.json(regionsContainingPoint);
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
