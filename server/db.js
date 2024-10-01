const admin = require("firebase-admin");
const config = require("./config");

const serviceAccount = {
  type: config.serviceAccountKey.type,
  project_id: config.serviceAccountKey.project_id,
  private_key_id: config.serviceAccountKey.private_key_id,
  private_key: config.serviceAccountKey.private_key.replace(/\\n/g, "\n"),
  client_email: config.serviceAccountKey.client_email,
  client_id: config.serviceAccountKey.client_id,
  auth_uri: config.serviceAccountKey.auth_uri,
  token_uri: config.serviceAccountKey.token_uri,
  auth_provider_x509_cert_url:
    config.serviceAccountKey.auth_provider_x509_cert_url,
  client_x509_cert_url: config.serviceAccountKey.client_x509_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://altinayfleet-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;
