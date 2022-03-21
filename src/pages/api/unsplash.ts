const unsplashUrl = "https://api.unsplash.com/search/photos";
const clientId = process.env.UNSPLASH_CLIENT_ID;

const unsplash = async (req, res) => {
  const { page, query } = req.query;
  if (!clientId) {
    throw new Error("No client id provided");
  }
  const endpoint = `${unsplashUrl}?client_id=${clientId}&query=${query}&page=${page}&per_page=21`;

  try {
    const response = await fetch(endpoint).then((data) => data.json());
    res.json({
      rows: response.results,
      count: response.total,
      pages: response.total_pages,
    });
  } catch (e) {
    res.json({
      rows: [],
      count: 0,
      pages: 0,
    });
  }
};

export default unsplash;
