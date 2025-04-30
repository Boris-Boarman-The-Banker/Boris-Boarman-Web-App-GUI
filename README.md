# Boris-Boarman Web App GUI

This is a hybrid Next.js + Python application that combines a Next.js frontend with a Flask API backend. The project is designed to leverage Python AI libraries on the backend while providing a modern React-based frontend.

<p align="center">
  <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
</p>

## Introduction

This project is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and uses Flask as the API backend. The integration allows for powerful Python-based processing while maintaining a modern, responsive frontend.

## How It Works

The Python/Flask server is mapped into the Next.js app under `/api/`. This is implemented using `next.config.js` rewrites to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

- **Development**: The Flask server runs on `127.0.0.1:5328`
- **Production**: The Flask server is hosted as Python serverless functions on Vercel

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font family.

## Learn More

To learn more about this stack, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Flask Documentation](https://flask.palletsprojects.com/) - learn about Flask features and API
- [Python Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) - learn about Python serverless functions on Vercel

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
