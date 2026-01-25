import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { EnvObjects } from '@core/config/configuration';
import { FirebaseAdminConfig } from './firebase.interface';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    await this.initializeFirebase();
  }

  private async initializeFirebase(): Promise<void> {
    try {
      const firebaseConfig = this.configService.get<FirebaseAdminConfig>(
        EnvObjects.FIREBASE_OPTIONS,
      );

      if (!firebaseConfig) {
        throw new Error('Firebase configuration not found');
      }

      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.logger.warn('Firebase Admin SDK already initialized');
        this.firebaseApp = admin.apps[0];
        return;
      }

      // Initialize Firebase Admin SDK
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey,
          clientEmail: firebaseConfig.clientEmail,
        }),
        storageBucket: firebaseConfig.storageBucket,
      });

      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
      throw error;
    }
  }

  /**
   * Get the Firebase Admin app instance
   */
  getApp(): admin.app.App {
    if (!this.firebaseApp) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return this.firebaseApp;
  }

  /**
   * Get the Firebase Auth instance
   */
  getAuth(): admin.auth.Auth {
    return this.getApp().auth();
  }

  /**
   * Get the Firebase Firestore instance
   */
  getFirestore(): admin.firestore.Firestore {
    return this.getApp().firestore();
  }

  /**
   * Get the Firebase Storage instance
   */
  getStorage(): admin.storage.Storage {
    return this.getApp().storage();
  }

  /**
   * Get the Firebase Messaging instance
   */
  getMessaging(): admin.messaging.Messaging {
    return this.getApp().messaging();
  }

  /**
   * Upload file to Firebase Storage and generate a public URL with access token
   * @param file - The file to upload (Express.Multer.File)
   * @param orgId - Organization ID for organizing files
   * @returns Object containing file_key and file_url
   */
  async uploadFile(
    file: Express.Multer.File,
    orgId: string,
  ): Promise<{ file_key: string; file_url: string }> {
    try {
      const bucket = this.getStorage().bucket();

      // Generate unique file path
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const fileKey = `organizations/${orgId}/uploads/${timestamp}/${randomId}/${file.originalname}`;

      // Create file reference in bucket
      const fileRef = bucket.file(fileKey);

      // Upload file with metadata
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      this.logger.log(`File uploaded successfully: ${fileKey}`);

      // Generate signed URL with access token (valid for 50 years)
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + 50 * 365 * 24 * 60 * 60 * 1000, // 50 years
      });

      return {
        file_key: fileKey,
        file_url: signedUrl,
      };
    } catch (error) {
      this.logger.error('Failed to upload file to Firebase Storage', error);
      throw error;
    }
  }
}
