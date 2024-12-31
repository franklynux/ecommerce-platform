import prometheus from 'prom-client';
import os from 'os';

// Create a Registry
const register = new prometheus.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'pet-accessories-api'
});

// Enable the collection of default metrics
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const errorTotal = new prometheus.Counter({
  name: 'error_total',
  help: 'Total number of errors',
  labelNames: ['type']
});

// Custom metrics for business logic
const orderTotal = new prometheus.Counter({
  name: 'order_total',
  help: 'Total number of orders',
  labelNames: ['status']
});

const productStockLevel = new prometheus.Gauge({
  name: 'product_stock_level',
  help: 'Current stock level for products',
  labelNames: ['product_id']
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotal);
register.registerMetric(errorTotal);
register.registerMetric(orderTotal);
register.registerMetric(productStockLevel);

// Monitoring middleware
export const monitoringMiddleware = (req, res, next) => {
  const start = process.hrtime();
  const path = req.route ? req.route.path : req.path;

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    httpRequestDurationMicroseconds
      .labels(req.method, path, res.statusCode)
      .observe(durationInSeconds);

    httpRequestTotal
      .labels(req.method, path, res.statusCode)
      .inc();

    if (res.statusCode >= 400) {
      errorTotal.labels(res.statusCode >= 500 ? 'server' : 'client').inc();
    }
  });

  next();
};

// Health check endpoint handler
export const healthCheck = async (req, res) => {
  try {
    const healthData = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      os: {
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        loadavg: os.loadavg()
      }
    };

    res.json({
      status: 'healthy',
      data: healthData
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
};

// Metrics endpoint handler
export const getMetrics = async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const monitoring = {
  orderTotal,
  productStockLevel,
  errorTotal
};