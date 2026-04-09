# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
## Backend Setup

The backend is built with Node.js, Express, and MongoDB.

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=development
   ```
4. Seed sample data (optional):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### API Routes

#### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### User Profiles
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (protected)
- `POST /api/users/follow/:id` - Follow user (protected)
- `POST /api/users/unfollow/:id` - Unfollow user (protected)
- `DELETE /api/users/:id` - Delete user account (protected)

#### Workout Tracker
- `POST /api/workouts` - Add workout (protected)
- `GET /api/workouts/:userId` - Get user workouts (protected)
- `PUT /api/workouts/:id` - Update workout (protected)
- `DELETE /api/workouts/:id` - Delete workout (protected)

#### Community
- `POST /api/posts` - Create post (protected)
- `GET /api/posts` - Get all posts (pagination)
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/like/:id` - Like/Unlike post (protected)
- `POST /api/posts/comment/:id` - Add comment (protected)

#### Settings
- `PUT /api/settings/password` - Change password (protected)

#### Upload
- `POST /api/upload` - Upload image to Cloudinary (protected)
