/**
 * Extends app.json rather than replacing it.
 *
 * app.json stays the single readable source of truth for the app's identity.
 * The one thing it cannot express is where google-services.json lives on a
 * build machine: the file is gitignored, so it never reaches EAS with the
 * project archive. It is stored instead as a secret file environment variable,
 * which the builder materialises at a path handed over in GOOGLE_SERVICES_JSON.
 *
 * Locally that variable is unset and the checked-out file is used, so
 * `expo prebuild` and `expo run:android` keep working with no extra setup.
 */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? config.android.googleServicesFile,
  },
});
