require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Discogs = require('disconnect').Client;

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/upload-releases', async (req, res) => {
  const { username, token, releases } = req.body;
  
  if (!username || !token || !releases || !releases.length) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const dis = new Discogs({ userToken: token });
    const col = dis.user().collection();
    
    // Get folders to find Uncategorized folder
    const folders = await new Promise((resolve, reject) => {
      col.getFolders(username, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    let uncategorizedFolder = folders.folders.find(f => f.name === 'Uncategorized');
    
    // If Uncategorized folder doesn't exist, create it
    if (!uncategorizedFolder) {
      try {
        uncategorizedFolder = await new Promise((resolve, reject) => {
          col.createFolder(username, 'Uncategorized', (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        console.log('Created Uncategorized folder:', uncategorizedFolder);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create Uncategorized folder: ' + error.message });
      }
    }

    // Get existing releases
    const existingReleases = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await col.getReleases(username, uncategorizedFolder.id, {
        page: page,
        per_page: 100
      });
      
      data.releases.forEach(release => {
        existingReleases.push(release.id.toString());
      });

      hasMore = page < data.pagination.pages;
      page++;
    }

    // Add new releases
    const results = [];
    for (const releaseId of releases) {
      if (existingReleases.includes(releaseId)) {
        results.push({
          releaseId,
          status: 'Already exists in collection'
        });
        continue;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        const data = await col.addRelease(username, uncategorizedFolder.id, releaseId);
        results.push({
          releaseId,
          status: 'Added successfully',
          title: data.basic_information.title
        });
      } catch (error) {
        results.push({
          releaseId,
          status: 'Failed to add',
          error: error.message
        });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 