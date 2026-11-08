import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class S3Service {
  private s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })
  

  /**
   * Upload a file to S3 bucket
   * @param fileBuffer - The buffer of the file to upload
   * @param s3Key - The S3 key (file path within the bucket)
   * @param mimeType - The MIME type of the file
   */
  async uploadFile(fileBuffer: Buffer, s3Key: string, mimeType: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
    }

    try {
      const data = await this.s3.upload(params).promise()
      return data.Key // Return the S3 key of the uploaded file
    } catch (error: any) {
      console.error('Upload error:', error) // Log the error for debugging
      throw new HttpException('Error uploading file to S3', HttpStatus.INTERNAL_SERVER_ERROR) // Specify the HTTP status code
    }
  }

  /**
   * Upload a file to S3 bucket
   * @param fileBuffer - The buffer of the file to upload
   * @param folder - folder name
   * @param customFilename - optional custom filename
   */
  async uploadImage(file: Express.Multer.File, folder: string, customFilename?: string): Promise<string> {
    const fileKey = customFilename ? 
      `${folder}/${customFilename}` : 
      `${folder}/${uuidv4()}-${file.originalname}`
      
    await this.s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise()
    return fileKey
  }

  /**
   * Generate the S3 key for a comment file
   * @param userId - User ID
   * @param parameterId - Parameter ID
   * @param commentId - Comment ID
   * @param fileExtension - File extension (e.g., .mp3, .wav)
   */
  generateS3Key(
    userId: string,
    parameterId: string,
    commentId: string,
    riskProfileId: string,
    fileExtension: string
  ): string {
    return `${riskProfileId}/comments/${userId}-comments-${commentId}${fileExtension}`
  }

  /**
   * Moves an object from one location to another within the same S3 bucket
   * @param sourceUrl - The full S3 URL or key of the source object
   * @param destFolder - The destination folder path
   * @returns The S3 key of the moved object
   */
  async moveObject(sourceUrl: string, destFolder: string): Promise<string> {
    try {
      const bucketName = process.env.AWS_BUCKET_NAME;
      let sourceKey = sourceUrl;
      
      // Check if the source is a full URL and extract the key if needed
      if (sourceUrl.includes('amazonaws.com')) {
        const bucketUrl = `https://${bucketName}.s3.amazonaws.com/`;
        sourceKey = sourceUrl.startsWith(bucketUrl) ? 
          sourceUrl.replace(bucketUrl, '') : sourceUrl;
      }
      
      // Get the original file name from the source key
      const fileName = sourceKey.split('/').pop();
      if (!fileName) {
        throw new HttpException('Could not determine file name', HttpStatus.BAD_REQUEST);
      }
      
      // Define the destination key
      const destKey = `${destFolder}/${fileName}`;
      
      // Copy the object to the new location
      await this.s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`,
        Key: destKey
      }).promise();
      
      // Delete the original object
      await this.s3.deleteObject({
        Bucket: bucketName,
        Key: sourceKey
      }).promise();
      
      return destKey;
    } catch (error) {
      console.error('Error moving S3 object:', error);
      throw new HttpException(
        'Error moving file in S3', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSignedUrl(s3Key: string): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME || 'radiology-dev-resource'
    // Set to maximum allowed value (7 days) for AWS S3 pre-signed URLs
    const expiryTime = 604800 // Maximum allowed time in seconds (7 days)

    const bucketUrl = `https://${bucketName}.s3.amazonaws.com/`
    const key = s3Key.startsWith(bucketUrl) ? s3Key.replace(bucketUrl, '') : s3Key

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiryTime,
    }

    try {
      const url = await this.s3.getSignedUrlPromise('getObject', params)
      return url
    } catch (error: any) {
      throw new HttpException('Error generating signed URL', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteFile(s3Key: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    }

    try {
      await this.s3.deleteObject(params).promise()
    } catch (error: any) {
      throw new HttpException('Error deleting S3 object', error.message)
    }
  }
}
