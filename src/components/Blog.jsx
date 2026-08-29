import { blog } from '../data'

export default function Blog() {
  const getCatClass = (cat) => {
    const c = cat.toLowerCase()
    if (c.includes('back')) return 'backend-cat'
    if (c.includes('dev') || c.includes('tool')) return 'devops-cat'
    return 'db-cat'
  }

  return (
    <section id="blog" className="section blog-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Articles</span>
          <h2 className="section-title">Latest Blog Posts</h2>
          <p className="section-subtitle">Writing about system architecture, REST API design, backend performance, and dev practices.</p>
        </div>

        {/* Grid layout */}
        <div className="blog-grid">
          {blog.map((post, i) => (
            <article key={i} className="blog-card">
              <div className={`blog-category ${getCatClass(post.category)}`}>
                {post.category}
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              
              <div className="blog-footer">
                <span className="blog-date">📅 {post.date}</span>
                <a href={post.link} className="blog-read">
                  Read article →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
