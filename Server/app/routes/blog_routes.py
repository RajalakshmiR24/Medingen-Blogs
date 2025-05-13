from flask import Blueprint, request, jsonify
from app.models.blog import Blog

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/get_blog', methods=['POST'])
def get_blog():
    data = request.get_json()
    blog_url = data.get('blog_url')

    if blog_url:
        blog = Blog.query.filter_by(blog_url=blog_url).first()
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404

        return jsonify([{
            'id': blog.id,
            'blog_name': blog.blog_name,
            'blog_image_url': blog.blog_image_url,
            'blog_category_id': blog.blog_category_id,
            'blog_description_url': blog.blog_description_url,
            'blog_visit_count': blog.blog_visit_count,
            'blog_rc_priority': blog.blog_rc_priority,
            'blog_created_date': blog.blog_created_date.isoformat(),
            'blog_updated_date': blog.blog_updated_date.isoformat(),
            'meta_title': blog.meta_title,
            'meta_keywords': blog.meta_keywords,
            'meta_description': blog.meta_description,
            'meta_author': blog.meta_author,
            'meta_author_title': blog.meta_author_title,
            'meta_author_profile_url': blog.meta_author_profile_url,
            'blog_url': blog.blog_url
        }])
    else:
        # Return all blogs if no URL is provided
        blogs = Blog.query.all()
        blog_list = []
        for blog in blogs:
            blog_list.append({
                'id': blog.id,
                'blog_name': blog.blog_name,
                'blog_image_url': blog.blog_image_url,
                'blog_category_id': blog.blog_category_id,
                'blog_description_url': blog.blog_description_url,
                'blog_visit_count': blog.blog_visit_count,
                'blog_rc_priority': blog.blog_rc_priority,
                'blog_created_date': blog.blog_created_date.isoformat(),
                'blog_updated_date': blog.blog_updated_date.isoformat(),
                'meta_title': blog.meta_title,
                'meta_keywords': blog.meta_keywords,
                'meta_description': blog.meta_description,
                'meta_author': blog.meta_author,
                'meta_author_title': blog.meta_author_title,
                'meta_author_profile_url': blog.meta_author_profile_url,
                'blog_url': blog.blog_url
            })
        return jsonify(blog_list)


@blog_bp.route('/authors', methods=['GET'])
def get_authors_with_blogs():
    blogs = Blog.query.with_entities(
        Blog.meta_author,
        Blog.meta_author_title,
        Blog.meta_author_profile_url,
        Blog.blog_url
    ).all()

    result = [
        {
            "author": author,
            "title": title,
            "profile_image": profile_url,
            "blog_url": blog_url
        }
        for author, title, profile_url, blog_url in blogs
    ]

    return jsonify(result), 200