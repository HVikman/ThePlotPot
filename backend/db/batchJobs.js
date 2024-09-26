const cron = require('node-cron')
const db = require('./mysql')

const scheduleChapterCountsUpdate = ()  => {
  console.log('Batch jobs scheduled')
  // Schedule query to run every minute to batch update view and like counts
  cron.schedule('* * * * *', () => {
    db.query('CALL UpdateCounts()', (error, results) => {
      if (error) {
        console.error('Error running the batch job:', error)
      } else {
        console.log('Successfully updated chapter counts', results)
      }
    })
  })
}

module.exports = scheduleChapterCountsUpdate
