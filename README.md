# Adulting Copilot

Adulting Copilot is a guided assistant app for young adults navigating recurring "life admin" tasks (e.g., filing taxes, setting up 401ks, disputing fees). It provides step-by-step guidance and features an AI assistant to draft emails and scripts.

Built as an MVP for the RevenueCat Ship-a-thon hackathon.

## Tech Stack
- React Native / Expo (targeting iOS, Android, and Web)
- React Navigation
- Anthropic API (Claude 3.5 Sonnet) for AI Drafts
- RevenueCat (react-native-purchases) for Paywalls & Subscriptions
- AsyncStorage for local persistence (mocked server logic for demo)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npx expo start
   ```
   *For hackathon judging purposes, the app is pre-seeded with a demo state demonstrating completed tasks and active Premium status.*

## Environment Variables

For local development, create a `.env` file in the root directory:
```
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
EXPO_PUBLIC_USE_MOCK_API=true # Set to false to use the real Anthropic API
```
*Note: For the demo MVP, the Anthropic API call is mocked by default to protect API keys. Setting `USE_MOCK_API=false` will attempt to call the real API.*

## RevenueCat & Family Plan Flow

### Entitlement
- **`premium_access`**: The single entitlement that unlocks all premium features (unlimited tasks, AI drafts, deadline tracking, saved history).

### Offerings & Products
- `adulting_premium_monthly_self` ($6.99/mo)
- `adulting_premium_annual_self` ($59.99/yr)
- `adulting_premium_monthly_sponsor` ($6.99/mo) (Parent-sponsor product)

Both self-pay and sponsor-pay grant the same `premium_access` entitlement. The main paywall surfaces the self-pay options.

### Sponsor Linking Mechanism
To implement the "Ask a parent to sponsor" feature without relying on platform family sharing:
1. **Code Generation:** When a child requests sponsorship, the app generates a short, unique `sponsorCode` linked to their RevenueCat `app_user_id`. (In a production environment, this mapping is stored in a lightweight database like Supabase/Firebase. For this Expo MVP, it is simulated via `AsyncStorage` and mocked key-value structures).
2. **Parent Login:** The generated code is shared with the parent. The parent opens a separate Sponsor screen (simulating a web link or secondary app view). The app retrieves the `app_user_id` associated with the code and calls `Purchases.logIn(childAppUserId)`.
3. **Purchase:** The parent completes the sandbox purchase of `adulting_premium_monthly_sponsor`. Because the SDK is identified as the child, the entitlement is granted directly to the child's account.
4. **Attributes:** The app calls `Purchases.setAttributes()` to store `sponsor_name` and `is_sponsored=true`, allowing the child's UI to display a custom "Premium — sponsored by [Name]" badge instead of a generic Premium label.

*For demo purposes on the web build, purchases and entitlements are simulated using local storage so judges can verify the UI and flow instantly.*
