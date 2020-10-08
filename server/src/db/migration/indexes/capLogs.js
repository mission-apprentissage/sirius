module.exports = async (db) => {
  await db.createCollection("logs");
  await db.command({ convertToCapped: "logs", size: 1000000000 });
};
