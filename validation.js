const fs = require('fs');
const csv = require('csv-parser');

const usernames = [];

const loginApiUrl = 'https://api.techenablesme.com/calman/api/login'; 

// Function to process the CSV file
function processCsvFile(filePath) {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      // Assuming the CSV has a column named 'CODE' for usernames
      const username = row['CODE']; // Adjust the column name accordingly
      usernames.push(username);

      // Send a login request for each username
      await sendLoginRequest(username);
    })
    .on('end', () => {
      console.log('CSV file processing completed.');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

// Function to send login request and verify success
async function sendLoginRequest(username) {
  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch

    const requestBody = {
      username: username,
      password: '2021cm', // Replace with your actual password
    };

    const response = await fetch(loginApiUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log(`Login successful for username: ${username}`);
    } else {
      console.error(`Login failed for username: ${username} (Status Code: ${response.status})`);
    }
  } catch (error) {
    console.error(`Error while processing username: ${username}`, error);
  }
}

// Replace 'data.csv' with the path to your CSV file
const csvFilePath = 'data.csv';
processCsvFile(csvFilePath);
