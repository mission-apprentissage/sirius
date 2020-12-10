module.exports = {
  getNbModifiedDocuments: ({ result }) => (result.nModified !== undefined ? result.nModified : result.n),
};
