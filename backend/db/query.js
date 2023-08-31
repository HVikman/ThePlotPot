const db = require('./mysql')

const queryDB = (query, params, singleResult = false) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) reject(error)
      else resolve(singleResult ? results[0] : results)
    })
  })
}
module.exports = queryDB