import dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  'PORT',
  'JWT_PRIVATE_KEY',
  'JWT_PUBLIC_KEY',
  'NODE_ENV',
  'FRONTEND_ORIGIN',
  'DB_PATH',
] as const;

const missingVars: string[] = [];
for (const key of requiredVars) {
  if (!process.env[key]) {
    missingVars.push(key);
  }
}

if (missingVars.length > 0) {
  throw new Error(
    `Configuration startup error: Missing required environment variable(s): ${missingVars.join(', ')}`
  );
}

const decodeKey = (key: string): string => {
  const trimmed = key.trim();
  if (trimmed.startsWith('-----BEGIN')) {
    return trimmed;
  }
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    if (decoded.trim().startsWith('-----BEGIN')) {
      return decoded.trim();
    }
  } catch {
    // ignore
  }
  return trimmed;
};

export const env = {
  PORT: parseInt(process.env.PORT!, 10),
  JWT_PRIVATE_KEY: decodeKey(process.env.JWT_PRIVATE_KEY!),
  JWT_PUBLIC_KEY: decodeKey(process.env.JWT_PUBLIC_KEY!),
  NODE_ENV: process.env.NODE_ENV!,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN!,
  DB_PATH: process.env.DB_PATH!,
};
