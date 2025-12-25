import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { EnvObjects } from '@core/config/configuration';
import { FirebaseAdminConfig } from './firebase.interface';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

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
}
