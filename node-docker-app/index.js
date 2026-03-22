const express = require('express');
const app = express();

const PORT = 3000;

// Serve static files (frontend)
app.use(express.static('public'));

// API endpoint: convert UTC → Central Time
app.get('/api/convert', (req, res) => {
  const utcInput = req.query.utc || new Date().toISOString();
  
  try {
    const utcDate = new Date(utcInput);
    
    if (isNaN(utcDate)) {
      return res.json({ error: 'Invalid UTC time format' });
    }
    
    const centralTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'long'
    }).format(utcDate);

    res.json({
      utc: utcDate.toISOString(),
      central: centralTime,
      success: true
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`⏰ Server running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
