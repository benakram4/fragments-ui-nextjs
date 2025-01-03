
# Fragments UI (Next.js)

This repository contains the front end for the Fragments project, built with Next.js. The back end for this project can be found [here](https://github.com/benakram4/fragments).

## Table of Contents
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Continuous Integration and Delivery](#continuous-integration-and-delivery)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js**: A React framework for building modern web applications.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **AWS Amplify**: A set of tools and services for building secure, scalable cloud-powered applications.
- **AWS Cognito**: Used for authentication in the project.
- **Hadolint**: A Dockerfile linter that helps you build Docker images with best practices.

## Project Structure

The project's structure follows the standard Next.js setup:

```
/app
  /page.js
/public
/styles
  /globals.css
.eslintrc.json
next.config.js
package.json
```

## Continuous Integration and Delivery

This project uses GitHub Actions for CI/CD:

- **CI Workflow**: Defined in `.github/workflows/ci.yml`. This workflow lints the code, lints the Dockerfile, and builds and pushes Docker images to Docker Hub.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
