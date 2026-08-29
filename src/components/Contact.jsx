import { useState } from 'react'
import { Mail, MapPin, Send, Check } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { personal } from '../data'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    }, 1200)
  }

  const contactItems = [
    { icon: <Mail size={18} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: <MapPin size={18} />, label: 'Location', value: personal.location, href: null },
    { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', value: 'https://www.linkedin.com/in/malay-singh-bisht-1b53a91b5/', href: personal.social.linkedin },
    { icon: <GithubIcon size={18} />, label: 'GitHub', value: 'https://github.com/Malay2509', href: personal.social.github },
  ]

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Connect</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">I'm actively looking for full-stack and backend opportunities. Let's discuss roles!</p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact cards info */}
          <div className="contact-info">
            {contactItems.map(item => (
              <div key={item.label} className="contact-card">
                <div className="contact-icon">{item.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="contact-label">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-value">
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-value">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-success" style={{ display: status === 'sent' ? 'block' : 'none' }}>
              🎉 Thank you! Your message has been sent successfully.
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="formName">Your Name</label>
                <input
                  type="text"
                  id="formName"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="formEmail">Your Email</label>
                <input
                  type="email"
                  id="formEmail"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="formSubject">Subject</label>
              <input
                type="text"
                id="formSubject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Job Opportunity / Collaboration"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="formMessage">Message</label>
              <textarea
                id="formMessage"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell me about the role..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status !== 'idle'}
              className="btn btn-primary btn-full"
            >
              {status === 'idle' && <><Send size={15} /> Send Message</>}
              {status === 'sending' && 'Sending…'}
              {status === 'sent' && <><Check size={15} /> Message Sent!</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
