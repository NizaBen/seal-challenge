module.exports = async function (req, res, next) {
  try {
    const { document } = req.body;
    if (!document) {
      throw createHttpError.BadRequest("Provide a valid document");
    }
    const documentExists = await ShortUrl.findOne({ document });
    if (documentExists) {
      return res.send({
        shortUrl: `http://localhost:4104/${documentExists.shortId}`
      });
    }
    const shortUrl = new ShortUrl({ url, shortId: shortId.generate() });
    const result = await shortUrl.save();
    return res.send({
      shortUrl: `http://localhost:4104/${result.shortId}`
    });
  } catch (error) {
    next(error);
  }
};
