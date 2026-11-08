import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  AttributeType,
  AdminUpdateUserAttributesCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminResetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get<string>('COGNITO_CLIENT_ID');
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    
    this.logger.log('CognitoService initialized');
  }

  async createUser(
    username: string,
    password: string,
    email: string,
    name: string,
  ): Promise<string> {
    this.logger.log(`Creating Cognito user: ${username} with email: ${email}`);
    
    // First, create the user in Cognito
    const userAttributes: AttributeType[] = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'name', Value: name },
    ];

    try {
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        UserAttributes: userAttributes,
        MessageAction: 'SUPPRESS', // Suppress sending the email
      });

      this.logger.debug(`Sending AdminCreateUserCommand for username: ${username}`);
      const createUserResponse = await this.cognitoClient.send(createUserCommand);
      const cognitoUserId = createUserResponse.User.Username;
      this.logger.log(`User ${username} created in Cognito with ID: ${cognitoUserId}`);

      // Then, set their password permanently
      this.logger.debug(`Setting permanent password for username: ${username}`);
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      });
      await this.cognitoClient.send(setPasswordCommand);
      this.logger.log(`Password set for user ${username}`);

      // Skip confirmation if the user is already confirmed
      // The user should be automatically confirmed when created with AdminCreateUserCommand
      
      return cognitoUserId;
    } catch (error) {
      this.logger.error(`Failed to create Cognito user: ${error.message}`, error.stack);
      throw new Error(`Failed to create Cognito user: ${error.message}`);
    }
  }

  async updateUserAttributes(
    username: string,
    attributes: Record<string, string>,
  ): Promise<void> {
    this.logger.log(`Updating attributes for Cognito user: ${username}`);
    this.logger.debug(`Attributes to update: ${JSON.stringify(attributes)}`);
    
    const userAttributes: AttributeType[] = Object.entries(attributes).map(
      ([key, value]) => ({ Name: key, Value: value }),
    );

    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: userAttributes,
    });

    try {
      await this.cognitoClient.send(updateCommand);
      this.logger.log(`Successfully updated attributes for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to update Cognito user: ${error.message}`, error.stack);
      throw new Error(`Failed to update Cognito user: ${error.message}`);
    }
  }

  async deleteUser(username: string): Promise<void> {
    this.logger.log(`Deleting Cognito user: ${username}`);
    
    try {
      const deleteUserCommand = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      
      await this.cognitoClient.send(deleteUserCommand);
      this.logger.log(`User ${username} deleted from Cognito successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${username} from Cognito: ${error.message}`);
      throw error;
    }
  }

  async authenticateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Authenticating user: ${username}`);
  
    // Enable mock auth if explicitly set, in development mode, or when AWS credentials are missing
    const useMockAuth = this.configService.get<string>('USE_MOCK_AUTH') === 'true'
      || process.env.NODE_ENV !== 'production'
      || !this.userPoolId
      || !this.clientId;
      
    if (useMockAuth) {
      // For development/testing, provide mock authentication
      this.logger.warn(`Using MOCK authentication for user: ${username}`);
      
      // Basic credential check for development mode
      if (password === 'testpassword' || password === 'password123') {
        this.logger.log(`User ${username} mock authenticated successfully`);
        
        // Return mock tokens
        return {
          idToken: 'mock-id-token-' + Date.now(),
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600,
        };
      } else {
        this.logger.error(`Mock authentication failed for user ${username}: Invalid password`);
        throw new UnauthorizedException('Invalid username or password');
      }
    }
  
    // Real Cognito authentication for production
    try {
      const authCommand = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });
      
      const authResponse = await this.cognitoClient.send(authCommand);
      this.logger.log(`User ${username} authenticated successfully`);
      
      return {
        idToken: authResponse.AuthenticationResult.IdToken,
        accessToken: authResponse.AuthenticationResult.AccessToken,
        refreshToken: authResponse.AuthenticationResult.RefreshToken,
        expiresIn: authResponse.AuthenticationResult.ExpiresIn,
      };
    } catch (error) {
      this.logger.error(`Authentication failed for user ${username}: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid username or password');
    }
  }
  
  async directPasswordReset(username: string, newPassword: string): Promise<void> {
    this.logger.log(`Directly resetting password for user: ${username}`);
    
    // Enable mock auth if explicitly set, in development mode, or when AWS credentials are missing
    const useMockAuth = this.configService.get<string>('USE_MOCK_AUTH') === 'true'
      || process.env.NODE_ENV !== 'production'
      || !this.userPoolId;
      
    if (useMockAuth) {
      // For development/testing, we'll just log and pretend it worked
      this.logger.warn(`MOCK direct password reset for user: ${username}`);
      this.logger.log(`Mock password successfully reset for user ${username}`);
      return;
    }
    
    try {
      // This is an admin operation that bypasses the normal flow
      const resetPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        Password: newPassword,
        Permanent: true
      });
      
      await this.cognitoClient.send(resetPasswordCommand);
      this.logger.log(`Password directly reset for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to directly reset password for user ${username}: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to reset password: ${error.message}`);
    }
  }
}
