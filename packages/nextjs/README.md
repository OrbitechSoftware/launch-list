# @launch-list/nextjs

<p align="center">
<a href="https://github.com/OrbitechSoftware/launch-list">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
</a>
</p>

## Overview

Launch List is the easiest way to add lead generation to your Next.js app.

## Getting Started

### Installation

```bash
npm i @launch-list/nextjs
```

## Usage

Add your Launch List API key and project ID to your .env file

```.env
NEXT_PUBLIC_LAUNCH_LIST_API_KEY=<YOUR-API-KEY>
NEXT_PUBLIC_LAUNCH_LIST_PROJECT_ID=<YOUR-PROJECT-ID>
```

Now, you can import the `<SignUp />` component from Launch List. This is a client component and will work in both server and client components.

Full example:

```tsx
import { SignUp } from "@launch-list/nextjs";

export default function Home() {
  return (
    <div>
      <SignUp />
    </div>
  );
}
```
