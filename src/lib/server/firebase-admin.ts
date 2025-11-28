import * as admin from "firebase-admin";

let app: admin.app.App | null = null;

function initFirebaseAdmin() {
  if (app) return app;
  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[Firebase Admin] 서비스 계정 환경변수가 설정되지 않았습니다.");
    throw new Error("Firebase Admin 환경변수가 없습니다.");
  }

  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return app;
}

export function getAdminApp() {
  return initFirebaseAdmin();
}

export function getAdminAuth() {
  return initFirebaseAdmin().auth();
}
