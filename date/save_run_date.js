const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lastRunDate.txt');

function saveLastRunDate(date) {
  fs.writeFileSync(filePath, date.toISOString());
  console.log('Last run date saved successfully.');
}

function getLastRunDate() {
  try {
    const lastRunDate = fs.readFileSync(filePath, 'utf8');
    return new Date(lastRunDate);
  } catch (err) {
    console.error('Error retrieving last run date:', err);
    return null;
  }
}

module.exports = {saveLastRunDate, getLastRunDate};