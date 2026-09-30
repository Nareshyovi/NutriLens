# NutriLens AI Calorie Tracker

NutriLens is a mobile calorie tracking application built with Expo (React Native), Supabase, and AI integrations.

## Setup Steps

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Supabase Local Setup:**
   Make sure Docker is running, then initialize and start Supabase:
   ```bash
   supabase init
   supabase start
   ```

3. **Run Migrations:**
   Push the schema, seed data, and RLS tests to the database:
   ```bash
   supabase db reset
   ```

4. **Environment Variables:**
   Create a `.env` file in the root of the project (do not commit this file):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   *Note: Never place service roles or AI provider API keys in this file.*

5. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy ai-analyze-meal
   supabase functions deploy export-my-data
   supabase functions deploy delete-my-account
   ```
   Provide secrets to Edge Functions via Supabase CLI:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_key
   ```

6. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

## EAS Build for Android/iOS

To build the app for production using Expo Application Services (EAS):

1. **Install EAS CLI and login:**
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. **Configure the project:**
   ```bash
   eas build:configure
   ```
3. **Build for Android:**
   ```bash
   eas build --platform android --profile production
   ```
4. **Build for iOS:**
   ```bash
   eas build --platform ios --profile production
   ```

## Store Release Checklist

- [ ] **Code Signing:** Ensure Android Keystore and iOS Distribution Certificates are valid and securely backed up.
- [ ] **Privacy Policy:** Publish a GDPR and DPDP Act-compliant privacy policy detailing AI usage and data retention.
- [ ] **Data Deletion:** Verify the "Delete Account" flow successfully removes all user records and storage files to comply with Apple/Google store requirements.
- [ ] **Health Data Disclaimers:** Display the "AI estimates only, not medical advice" disclaimer prominently during onboarding.
- [ ] **Environment Secrets:** Ensure no `.env` files or secrets are bundled in the final IPA/APK.
- [ ] **Dependency Audit:** Run `npm audit` and update vulnerable packages before building.
