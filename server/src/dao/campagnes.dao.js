const ObjectId = require("mongoose").mongo.ObjectId;
const Campagne = require("../models/campagne.model");

const getAllWithTemoignageCount = async () => {
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    {
      $lookup: {
        from: "temoignages",
        let: { campagneId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toObjectId: "$campagneId" }, "$$campagneId"],
              },
            },
          },
        ],
        as: "temoignagesList",
      },
    },
    {
      $addFields: {
        temoignagesCount: { $size: "$temoignagesList" },
      },
    },
    {
      $unset: ["temoignagesList"],
    },
  ]);
};

const getOneWithTemoignagneCount = async (id) => {
  const idToObjectId = ObjectId(id);
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
        _id: idToObjectId,
      },
    },
    {
      $lookup: {
        from: "temoignages",
        let: { campagneId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [{ $toObjectId: "$campagneId" }, "$$campagneId"],
              },
            },
          },
        ],
        as: "temoignagesList",
      },
    },
    {
      $addFields: {
        temoignagesCount: { $size: "$temoignagesList" },
      },
    },
    {
      $unset: ["temoignagesList"],
    },
  ]);
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedCampagne) => {
  return Campagne.updateOne({ _id: id, deletedAt: null }, updatedCampagne);
};

module.exports = {
  getAllWithTemoignageCount,
  getOneWithTemoignagneCount,
  create,
  deleteOne,
  update,
};
