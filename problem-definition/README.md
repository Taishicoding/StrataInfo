# Shōmei — South Australian strata problem overview

This is a standalone website for static information pages plus one Vercel Function for Shōmei Assistant. It does not depend on the main Shōmei product site. There is no frontend build or package install step.

## Deploy to Vercel

The assistant needs a serverless function. Deploy through Git integration or the Vercel CLI so Vercel builds `api/assistant.js` as a function; a static-only upload may publish the page without that endpoint.

### Vercel CLI (no Git required)

From the repository folder, run `npx vercel --cwd problem-definition` and follow the prompts to create/link the project. In that Vercel project’s **Settings → Environment Variables**, add `OPENAI_API_KEY` for Production (and Preview/Development if you use those environments). Optionally add `OPENAI_MODEL` to select a model available to your account; the function defaults to `gpt-6-astra`. Then publish with `npx vercel --prod --cwd problem-definition`.

### Git integration

1. Push the repository to GitHub, GitLab or Bitbucket.
2. In Vercel, import that repository and set **Root Directory** to `problem-definition`.
3. Choose **Other** as the framework preset. Leave Build Command and Install Command empty. Set Output Directory to `.`.
4. Add `OPENAI_API_KEY` in **Settings → Environment Variables** (and optionally `OPENAI_MODEL`), then deploy.

In both cases, `index.html` is the site entry point and `api/assistant.js` serves `/api/assistant`.

If this folder is copied into its own repository, use `.` as the Root Directory instead. The site uses Google Fonts and external links to legislation and sources; those links require an internet connection. After adding or changing an environment variable, redeploy for the function to receive it. Never add the API key to HTML or browser JavaScript, or commit it to Git.

## Content notes

Legal information is general and linked to its references in the page. The assistant is grounded in the page’s cited notes and does not use the attached `sa_strata_governance.md` as legal authority because that file labels its claims and links unverified. Management-fee figures are estimates from a 2026 commercial market guide, not government data or quotes for a particular scheme. Fees vary by lot count, scope, disbursements and building complexity. Review the source link and confirm prices with individual strata managers before relying on any estimate.

The assistant sends visitors’ questions to the OpenAI Responses API through the Vercel Function. It limits the recent conversation and answer length, and does not request stored Responses. Public visitors can generate API usage and costs; configure account usage controls and monitor usage before sharing the site widely.
