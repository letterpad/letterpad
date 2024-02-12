const unsplashUrl = "https://api.unsplash.com/search/photos";
const clientId = process.env.UNSPLASH_CLIENT_ID;

const unsplash = async (req, res) => {
  const { page, query, downloadLocation } = req.query;
  if (!clientId) {
    throw new Error("No client id provided");
  }
  if (downloadLocation) {
    // if the photo is inserted, trigger downloadlocation url
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    });
    return res.status(200).json({});
  }
  // contninue with searching for photos
  const endpoint = `${unsplashUrl}?client_id=${clientId}&query=${query}&page=${page}&per_page=21&orientation=landscape`;

  try {
    const response = await fetch(endpoint).then((data) => data.json());
    res.json({
      rows: response.results,
      count: response.total,
      pages: response.total_pages,
    });
  } catch (e: any) {
    res.json({
      rows: [],
      count: 0,
      pages: 0,
      error:
        "Cannot connect to unsplash API at the moment. Please try again later.",
    });
  }
};

export default unsplash;
