const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL;

let redisConfig;

if (redisUrl) {
  try {
    const url = new URL(redisUrl);
    redisConfig = {
      host: url.hostname,
      port: parseInt(url.port),
      password: url.password,
      username: url.username || 'default',
      tls: url.protocol === 'rediss:' ? {
        rejectUnauthorized: false
      } : undefined,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    };
    // console.log(`🔗 Connecting to Redis at ${url.hostname}:${url.port}`);
  } catch (error) {
    console.error('❌ Invalid REDIS_URL:', error.message);
    redisConfig = null;
  }
} else {
  console.warn('⚠️ REDIS_URL not set - caching disabled');
  redisConfig = null;
}

const redis = redisConfig ? new Redis(redisConfig) : null;

if (redis) {
  // redis.on('connect', () => console.log('✅ Redis connected (Upstash)'));
  // redis.on('ready', () => console.log('🎯 Redis ready to accept commands'));
  redis.on('error', (err) => {
    // console.error('❌ Redis error:', err.message);
  });
  // redis.on('close', () => console.log('💤 Redis connection closed'));
}

let isRedisAvailable = false;

if (redis) {
  redis.ping()
    .then(() => {
      isRedisAvailable = true;
      // console.log('✅ Redis ping successful');
    })
    .catch((err) => {
      isRedisAvailable = false;
      console.warn('⚠️ Redis unavailable - caching disabled:', err.message);
    });
}

const cache = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (!isRedisAvailable || !redis) return next();
    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        // console.log(`🎯 Cache HIT: ${key}`);
        return res.json(JSON.parse(cached));
      }
      // console.log(`❌ Cache MISS: ${key}`);
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redis.setex(key, duration, JSON.stringify(data))
          .catch(err => console.error('Cache set error:', err.message));
        return originalJson(data);
      };
      next();
    } catch (error) {
      console.error('Cache error:', error.message);
      next();
    }
  };
};

const clearCache = async (pattern = '*') => {
  if (!isRedisAvailable || !redis) {
    console.warn('⚠️ Redis unavailable - cannot clear cache');
    return;
  }
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      // console.log(`🗑️ Cleared ${keys.length} cache keys for pattern: ${pattern}`);
    } else {
      // console.log(`ℹ️ No cache keys found for pattern: ${pattern}`);
    }
  } catch (error) {
    // console.error('Clear cache error:', error.message);
  }
};

const clearAllCache = async () => {
  if (!isRedisAvailable || !redis) {
    console.warn('⚠️ Redis unavailable - cannot clear cache');
    return;
  }

  try {
    await redis.flushdb();
    // console.log('🗑️ All cache cleared');
  } catch (error) {
    // console.error('Clear all cache error:', error.message);
  }
};

const getCacheStats = async () => {
  if (!isRedisAvailable || !redis) {
    return { available: false };
  }

  try {
    const info = await redis.info('stats');
    const keys = await redis.keys('cache:*');

    return {
      available: true,
      totalKeys: keys.length,
      info: info
    };
  } catch (error) {
    console.error('Get cache stats error:', error.message);
    return { available: false, error: error.message };
  }
};

process.on('SIGTERM', () => {
  if (redis) {
    // console.log('👋 Closing Redis connection...');
    redis.quit();
  }
});

process.on('SIGINT', () => {
  if (redis) {
    // console.log('👋 Closing Redis connection...');
    redis.quit();
  }
});

module.exports = {
  redis,
  cache,
  clearCache,
  clearAllCache,
  getCacheStats
};
