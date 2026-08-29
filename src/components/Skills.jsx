import { useState } from 'react'
import { skills } from '../data'

const TABS = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend',  label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'devops',   label: 'DevOps & Tools' },
]

export default function Skills() {
  const [activeTab, setActiveTab] = useState('frontend')

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Capabilities</span>
          <h2 className="section-title">My Tech Stack</h2>
          <p className="section-subtitle">A collection of languages, frameworks, databases, and DevOps tools I use to bring ideas to life.</p>
        </div>

        {/* Tab switcher buttons */}
        <div className="skills-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`skill-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="skills-panels">
          {TABS.map(tab => (
            <div
              key={tab.key}
              className={`skills-grid ${activeTab === tab.key ? 'active' : ''}`}
            >
              {(skills[tab.key] || []).map(sk => (
                <div key={sk.name} className="skill-card">
                  <div className="skill-icon-wrap" style={{ '--c': sk.color }}>
                    {sk.emoji}
                  </div>
                  <span className="skill-name">{sk.name}</span>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ '--w': `${sk.level}%` }} />
                  </div>
                  <span className="skill-pct">{sk.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Terminal window */}
        <div className="terminal-showcase">
          <div className="terminal-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="terminal-title">~/specialization $ cat details.txt</span>
          </div>
          <div className="terminal-body">
            <div className="t-line">
              <span className="t-prompt">$</span>
              <span className="t-cmd">whoami</span>
            </div>
            <div className="t-out">malay-singh-bisht — Full-Stack &amp; Backend Developer</div>
            
            <div className="t-line" style={{ marginTop: '8px' }}>
              <span className="t-prompt">$</span>
              <span className="t-cmd">cat skills.txt</span>
            </div>
            <div className="t-green">
              React.js · Node.js · Express · Java · Spring Boot · Docker · AWS · PostgreSQL · Supabase · Postman
            </div>

            <div className="t-line" style={{ marginTop: '8px' }}>
              <span className="t-prompt">$</span>
              <span className="t-cmd">echo $AVAILABLE_FOR_HIRE</span>
            </div>
            <div className="t-highlight" style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
              TRUE (Looking for BTech IT Graduate opportunities!)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
