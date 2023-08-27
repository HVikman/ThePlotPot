import React from 'react'

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to ThePlotPot</h1>
        <p>Your source for amazing stories!</p>
      </header>

      <section className="featured-stories">
        {/* This will be a grid of featured stories */}
      </section>

      <section className="recent-stories">
        {/* This will be a list/grid of recently added stories */}
      </section>

    </div>
  )
}

export default Home