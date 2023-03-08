const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");
const httpTests = require("../integration/utils/httpTests");

const temoignagesDao = require("../../src/dao/temoignages.dao");
const { newTemoignage } = require("../fixtures");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    await startServer();
  });
  describe("create", () => {
    it("should create and returns the temoignage", async () => {
      const temoignage1 = newTemoignage();

      const createdTemoignage = await temoignagesDao.create(temoignage1);

      expect(createdTemoignage.toObject()).to.eql({ ...temoignage1, _id: createdTemoignage._id, __v: 0 });
    });
  });
});
