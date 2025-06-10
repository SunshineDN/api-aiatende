import KommoServices from '../services/kommo/KommoServices.js';

export const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const lead_id = err.lead_id || req.body?.lead_id || null;

  if (lead_id) {
    try {
      const kommo = new KommoServices({
        auth: process.env.KOMMO_AUTH,
        url: process.env.KOMMO_URL,
      });
      const formattedLog = `[${statusCode}] ${err.message}\nRota: ${req.originalUrl}\nData: ${new Date().toLocaleString()}`;
      await kommo.sendErrorLog({ lead_id, error: formattedLog });
    } catch (error) {
      console.error('Error initializing KommoServices:', error);
    }
  }

  res.status(statusCode).json({
    error: {
      name: err.name || 'InternalError',
      status: statusCode,
      message: err.message || 'Internal Server Error',
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      ...(lead_id && { lead_id }),
    }
  });
}