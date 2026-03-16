# Copilot Instructions — NirogCare

## Project Overview
NirogCare is a production-grade healthcare web application for users in India, built with
**React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Firebase**, **Supabase**, and
**Recharts**.

## AI Model Configuration
The project uses two AI models via the Lovable AI Gateway
(`https://ai.gateway.lovable.dev/v1/chat/completions`):

| Feature | Model | Env-var override |
|---|---|---|
| Health-chat (Supabase Edge Function) | `openai/gpt-5.4-codex` | `HEALTH_CHAT_MODEL` |
| Prescription analysis (Supabase Edge Function) | `anthropic/claude-opus-4.6` | `PRESCRIPTION_MODEL` |
| Client-side fallback (direct Gemini call) | `gemini-2.5-flash` | `VITE_GEMINI_API_KEY` |

### Using GPT-5.4-Codex and Claude Opus 4.6 in VS Code

1. **Install** the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
   and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
   extensions.
2. **Sign in** with the GitHub account that holds your **Copilot Pro** (or **Pro+**) subscription.
   - GPT-5.4-Codex and Claude Opus 4.6 are **premium models** that count against your
     [premium-request quota](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-your-copilot-subscription/about-billing-for-github-copilot#about-github-copilot-pro).
   - If your plan is **Copilot Pro** (not Pro+), upgrade at
     <https://github.com/settings/copilot> to unlock premium models.
3. **Select the model** in the Chat panel:
   - Click the model-badge in the Copilot Chat title bar  
     **or** open the Command Palette (`⌘/Ctrl+Shift+P`) → **Chat: Use Model**.
   - Choose **GPT-5.4-Codex** or **Claude Opus 4.6** from the list.
4. The workspace `settings.json` sets `github.copilot.chat.defaultOpenAIModel` to
   `gpt-5.4-codex` so new chat sessions prefer that model automatically.

## Directory Structure
```
src/
  components/   # React components (ai/, chat/, health/, emergency/, …)
  lib/          # Core services (aiService.ts, firebase.ts, …)
  pages/        # Route-level pages (Chat.tsx, Dashboard.tsx, …)
supabase/
  functions/
    health-chat/          # Edge Function — streaming chat (gpt-5.4-codex)
    analyze-prescription/ # Edge Function — image analysis (claude-opus-4.6)
```

## Code Conventions
- **Language**: TypeScript strict mode; no implicit `any`.
- **Styling**: Tailwind CSS utility classes; avoid inline styles.
- **State**: React hooks; Tanstack Query for async data.
- **Imports**: Use path alias `@/` mapped to `src/`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, …).

## Healthcare Safety Rules (non-negotiable)
- **Never** suggest changes that cause the app to diagnose medical conditions.
- Always preserve the "consult a doctor" disclaimer in AI responses.
- Keep emergency numbers (108, 112, 104) visible and accurate.
- Do not remove the offline/mock fallback paths in `aiService.ts`.
