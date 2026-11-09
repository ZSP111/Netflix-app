import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Info.css'

const FAQ = [
  ['What is Box of Movies?', 'Box of Movies is a streaming-style app for discovering movies and TV shows. Browse trending titles, watch trailers, explore episodes and keep a personal list for every profile.'],
  ['How much does it cost?', 'Box of Movies is free to use. Create an account with your email and start browsing right away.'],
  ['Where can I watch?', 'Anywhere you have a modern web browser — on your phone, tablet, laptop or TV browser. The layout adapts to any screen size.'],
  ['What can I watch on Box of Movies?', 'Thousands of movies and TV shows, powered by The Movie Database (TMDB). Each title plays its official trailer.'],
  ['Can I have multiple profiles?', 'Yes. Each account can have up to 5 profiles, each with its own My List and Continue Watching row. Kids profiles only show family-friendly titles.'],
  ['How do I cancel or delete my data?', 'Your list and profiles are stored on your device. Delete a profile from Manage Profiles to remove its data, or sign out at any time.'],
]

const Info = () => {
  const { hash } = useLocation()
  const [open, setOpen] = useState(0)

  useEffect(() => {
    document.title = 'Help Center - Box of Movies'
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="page info-page">
      <h1 className="page-title">Help Center</h1>

      <section id="faq">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq">
          {FAQ.map(([q, a], i) => (
            <li key={q} className={open === i ? 'open' : ''}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {q}
                <span aria-hidden="true">{open === i ? '×' : '+'}</span>
              </button>
              {open === i && <p>{a}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section id="help">
        <h2>Getting started</h2>
        <ol>
          <li>Sign up with your email and a password of at least 6 characters.</li>
          <li>Pick a profile on the “Who’s watching?” screen (or add a new one).</li>
          <li>Hover or tap any title to play the trailer, add it to My List, or open More Info.</li>
          <li>Use the search icon in the top bar to find any movie, show or actor.</li>
        </ol>
      </section>

      <section id="devices">
        <h2>Ways to watch</h2>
        <p>Box of Movies runs in any up-to-date browser: Chrome, Edge, Firefox and Safari on desktop and mobile. For the best experience use a connection of at least 5 Mbps for HD trailers.</p>
      </section>

      <section id="terms">
        <h2>Terms of Use</h2>
        <p>Box of Movies is provided “as is” for personal, non-commercial entertainment. Trailers are streamed from YouTube and are subject to YouTube’s terms. Movie and TV metadata and images are provided by TMDB.</p>
      </section>

      <section id="privacy">
        <h2>Privacy</h2>
        <p>We use Firebase Authentication to manage your account (email and display name). Profiles, My List and watch history are stored locally in your browser and never shared. You can remove them at any time by deleting a profile.</p>
      </section>

      <section id="about">
        <h2>About</h2>
        <p>Box of Movies is an independent project built with React, Vite, Firebase and the TMDB API.</p>
      </section>

      <section id="contact">
        <h2>Contact us</h2>
        <p>Questions or feedback? Open an issue on the project’s GitHub repository and we’ll get back to you.</p>
      </section>
    </div>
  )
}

export default Info
