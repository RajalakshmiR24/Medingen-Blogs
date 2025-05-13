import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthorSection = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
          const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://127.0.0.1:5000";

        const response = await axios.get(`${API_ENDPOINT}/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleBlogClick = (blogUrl) => {
    navigate(`/blogs/${encodeURIComponent(blogUrl)}`);
  };

  if (loading) {
    return <>Loading authors...</>;
  }

  // Group authors by name and aggregate their blog URLs
  const groupedAuthors = authors.reduce((acc, author) => {
    if (!acc[author.author]) {
      acc[author.author] = {
        title: author.title,
        profile_image: author.profile_image,
        blog_urls: [],
      };
    }
    acc[author.author].blog_urls.push(author.blog_url);
    return acc;
  }, {});

  return (
    <div className="author-section">
      <h2 className="section-heading">Meet Our Authors</h2>
      {Object.keys(groupedAuthors).length === 0 ? (
        <p>No authors found.</p>
      ) : (
        <ul className="author-list">
          {Object.entries(groupedAuthors).map(([authorName, authorData], index) => (
            <li key={index} className="author-item">
              <div className="author-header">
                <a
                  href={authorData.profile_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png" // LinkedIn icon
                    alt="LinkedIn Profile"
                  />
                </a>
                <div className="author-info">
                  <p className="author-name">{authorName}</p>
                  <p className="author-title">{authorData.title}</p>
                </div>
              </div>

              {/* Display all blog URLs for each author */}
              {authorData.blog_urls.length > 0 && (
                <ul className="blog-url-list">
                  {authorData.blog_urls.map((url, i) => (
                    <li key={i} className="blog-url-item">
                      <div
                        className="blog-url-link"
                        onClick={() => handleBlogClick(url)}
                      >
                        {url}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorSection;
