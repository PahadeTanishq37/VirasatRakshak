import { HeritageService } from '../services/heritage.service.js';

export const getAllHeritageSites = (req, res) => {
  const sites = HeritageService.getAll(req.query);
  res.json({
    success: true,
    data: sites,
    count: sites.length
  });
};

export const getHeritageSiteById = (req, res) => {
  const { id } = req.params;
  const site = HeritageService.getById(id);

  if (!site) {
    return res.status(404).json({
      success: false,
      error: `Heritage site not found for ID: ${id}`
    });
  }

  res.json({
    success: true,
    data: site
  });
};
