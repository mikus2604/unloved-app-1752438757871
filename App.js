Creating a full-stack blog application using React for the frontend, Node.js for the backend, and Supabase for database storage involves several steps. Below is a high-level overview of how you can structure this project, along with some code snippets for each part.

### Step 1: Set Up Supabase

1. **Create a Supabase Project:**
   - Go to [Supabase](https://supabase.io/) and create a new project.
   - Note the `supabaseUrl` and `supabaseKey` provided, as these will be used in your backend connection.

2. **Database Schema:**
   - Create tables for the blog, for example:
     ```sql
     -- users table
     CREATE TABLE users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       username TEXT UNIQUE NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL -- store hashed passwords
     );

     -- posts table
     CREATE TABLE posts (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       title TEXT NOT NULL,
       content TEXT NOT NULL,
       author_id UUID REFERENCES users (id),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
     );
     ```

### Step 2: Backend with Node.js

Create a Node.js server using Express.js to handle API requests.

1. **Project Setup:**
   ```bash
   mkdir blog-backend
   cd blog-backend
   npm init -y
   npm install express supabase-js bcryptjs body-parser cors dotenv
   ```

2. **Server Setup:**
   - Create a file `index.js` for the Express server:
     ```javascript
     const express = require('express');
     const bodyParser = require('body-parser');
     const cors = require('cors');
     const bcrypt = require('bcryptjs');
     const { createClient } = require('@supabase/supabase-js');
     require('dotenv').config();

     const app = express();
     app.use(cors());
     app.use(bodyParser.json());

     const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

     // Sample endpoint for creating a new user
     app.post('/api/register', async (req, res) => {
       const { username, email, password } = req.body;
       const hashedPassword = await bcrypt.hash(password, 10);

       const { data, error } = await supabase
         .from('users')
         .insert([{ username, email, password: hashedPassword }]);

       if (error) return res.status(400).json({ error: error.message });
       res.status(201).json(data);
     });

     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
     ```

3. **Environment Variables:**
   - Create a `.env` file and add your Supabase credentials:
     ```
     SUPABASE_URL=your-supabase-url
     SUPABASE_KEY=your-supabase-key
     ```

### Step 3: Frontend with React

1. **Project Setup:**
   ```bash
   npx create-react-app blog-frontend
   cd blog-frontend
   npm install @supabase/supabase-js axios
   ```

2. **React App Structure:**
   - Configure a simple login and registration form:
     ```javascript
     import React, { useState } from 'react';
     import axios from 'axios';

     function App() {
       const [username, setUsername] = useState('');
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');

       const handleRegister = async () => {
         try {
           const response = await axios.post('http://localhost:5000/api/register', {
             username,
             email,
             password,
           });
           console.log('User registered:', response.data);
         } catch (error) {
           console.error('Error registering user:', error);
         }
       };

       return (
         <div>
           <h1>Register</h1>
           <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
           <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
           <button onClick={handleRegister}>Register</button>
         </div>
       );
     }

     export default App;
     ```

3. **Connect to Backend:**
   - Ensure CORS is allowed in your backend and match the API routes with your React app to connect them properly.

### Step 4: Run Your Application

- Start your backend server:
  ```bash
  node index.js
  ```

- Start your React development server:
  ```bash
  npm start
  ```

Now you have the basic setup for a blog application with user's registration functionality using React for the frontend, Express and Node.js for the backend, and Supabase for the database management. You can expand this by adding posts functionality, authentication, and more complex features as needed.