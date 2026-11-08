import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  public readonly cognitoClientSecret: string;
  public readonly cognitoClientId: string;
  public readonly jwtSecret: string;
  public readonly jwtRefreshSecret: string;
  public readonly tokenExpiry: string;
  public readonly refreshTokenExpiry: string;
  public readonly radiologistTaxDeduction: number;

  // Declare the required environment variables here
  private static readonly requiredVariables = [
    'COGNITO_CLIENT_ID',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'TOKEN_EXPIRY',
    'REFRESH_TOKEN_EXPIRY',
  ];

  constructor() {
    this.validateEnvironment();
    this.cognitoClientId = process.env.COGNITO_CLIENT_ID as string;
    this.cognitoClientSecret = '' as string;
    this.jwtSecret =
      (process.env.JWT_SECRET as string) ||
      'hKu2VeS6+iY9S3efccUkvHtv8V4FvSzs57FjyztL1Ck=';
    this.jwtRefreshSecret =
      (process.env.JWT_REFRESH_SECRET as string) ||
      'hmQg9FH4bUyUM4LLcgOgDHBZmpwZ6eZQzmG/+km3+AeykMSxVY2wntFvOg4pfNlamYXjjP7QWCkyHgDYuJM5KQ==';
    this.tokenExpiry = process.env.TOKEN_EXPIRY || '7d';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '1h';
    // Default tax deduction is 18% if not specified in environment
    this.radiologistTaxDeduction = process.env.RADIOLOGIST_TAX_DEDUCTION ? parseFloat(process.env.RADIOLOGIST_TAX_DEDUCTION) : 18;
  }

  private validateEnvironment() {
    ConfigService.requiredVariables.forEach((variable) => {
      if (!process.env[variable]) {
        throw new Error(`Environment variable ${variable} is missing!`);
      }
    });
  }
}
