import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./style.css";
import Swal from "sweetalert2";
import axios from "axios";


export const getBlog = async (blog_url="") => {
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://127.0.0.1:5000";
  const response = await axios.post(`${API_ENDPOINT}/get_blog`, {
    blog_url: blog_url
  });
  return response.data;
};

// Fetch blog HTML content
export const fetchBlogHtml = async (description_url) => {
  try {
    const response = await axios.get(`https://d26lh6sqkii1nb.cloudfront.net/blogs/description/` + description_url);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog description:', error);
  }
};

export const Blog = () => {
  const { blogUrl } = useParams(); // Extract blogUrl from the URL
  const [blogData, setBlogData] = useState(null);
  const [summary, setSummary] = useState([]);

  const [slidesPerView, setSlidesPerView] = useState("auto");

  const updateSlidesPerView = () => {
    if (window.innerWidth < 700) {
      setSlidesPerView(1);
    } else {
      setSlidesPerView("auto");
    }
  };

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);

  useEffect(() => {
    if (blogUrl) {
      fetchBlog(blogUrl);
    }
  }, [blogUrl]);

  const fetchBlog = async (blogUrl) => {
    try {
      const response = await getBlog(blogUrl);
      const htmlContent = await fetchBlogHtml(response[0].blog_description_url);
      const updatedHtmlContent = addIdsToHeadings(htmlContent); // Add IDs to headings
      setBlogData({ ...response[0], blog_description: updatedHtmlContent });
      generateSummary(updatedHtmlContent); // Generate summary after modifying the HTML
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Blog not found",
        text: "Redirecting to home page",
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "/blogs";
      });
    }
  };
  const addIdsToHeadings = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.forEach((heading) => {
      const text = heading.textContent;
      const id = heading.id || text.replace(/\s+/g, "-").toLowerCase(); // Generate an ID
      heading.id = id; // Assign the ID to the heading
    });

    return doc.body.innerHTML; // Return the updated HTML as a string
  };

  const generateSummary = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    if (headings.length === 0) return;

    const summaryData = [];
    const stack = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1), 10);
      const text = heading.textContent;
      const id = heading.id || text.replace(/\s+/g, "-").toLowerCase(); // Generate an ID

      heading.id = id; // Ensure the heading has an ID for linking
      const item = { text, id, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        summaryData.push(item);
      } else {
        stack[stack.length - 1].node.children.push(item);
      }

      stack.push({ level, node: item });
    });

    setSummary(summaryData);
  };

  return (
    <>
      <div className="blogpage">

        <div className="blog-full-container">
          <div className="blog-dashboard-item">
            <p className="text-wrapper-head-2">
              {blogData ? blogData.blog_name : "Loading"}
            </p>
          </div>
          {blogData ? (
            <>
              <div className="blog-image-container">
                {blogData.blog_image_url && (
                  <img
                    src={`https://d26lh6sqkii1nb.cloudfront.net/blogs/images/${blogData.blog_image_url}`}
                    alt="Blog image"
                    className="blog-image"
                  />
                )}
              </div>
              <div className="dashboard-item">
                <div className="blog-container">
                  <div className="blog-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blogData.blog_description,
                      }}
                    ></div>
                  </div>
                  <div className="blog-navigation">
                    <p>
                      Uploaded on{" "}
                      {new Date(
                        blogData.blog_created_date
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-wrapper-head">In this page</p>
                    <ul>
                      {summary.map((h1) => (
                        <li key={h1.id}>
                          <a href={`#${h1.id}`}>{h1.text}</a>
                          {h1.children.length > 0 && (
                            <ul>
                              {h1.children.map((h2) => (
                                <li key={h2.id}>
                                  <a href={`#${h2.id}`}>{h2.text}</a>
                                  {h2.children.length > 0 && (
                                    <ul>
                                      {h2.children.map((h3) => (
                                        <li key={h3.id}>
                                          <a href={`#${h3.id}`}>{h3.text}</a>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="download-the-app">
                      <img
                        src="/migfulllogo.png"
                        alt="MigMig"
                        className="miglogo"
                      />
                      <p>Download medingen app for better experience</p>
                      <button
                        className="continue-button"
                        onClick={() => {
                          window.location.href = "/";
                        }}
                      >
                        Click here
                        <img
                          className="button-icon"
                          alt="Arrow"
                          src="/vector-3.svg"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading blog...</p>
          )}
        </div>
        <div className="blog-feed">
        </div>
        <div className="margin-72"></div>

        <div className="landing-page">
        </div>

      </div>
    </>
  );
};
