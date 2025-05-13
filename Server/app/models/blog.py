from app import db
from datetime import datetime

class Blog(db.Model):
    __tablename__ = 'Blogs'

    id = db.Column(db.Integer, primary_key=True)
    blog_name = db.Column(db.Text, nullable=False)
    blog_image_url = db.Column(db.Text, nullable=False)
    blog_category_id = db.Column(db.Integer, nullable=False)
    blog_description_url = db.Column(db.Text, nullable=False)
    blog_visit_count = db.Column(db.Integer, nullable=False)
    blog_rc_priority = db.Column(db.Integer, nullable=False)
    blog_created_date = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    blog_updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    meta_keywords = db.Column(db.Text, nullable=False)
    meta_description = db.Column(db.Text, nullable=False)
    blog_url = db.Column(db.Text, nullable=False)
    meta_title = db.Column(db.Text, nullable=False)
    meta_author = db.Column(db.Text, nullable=False)
    meta_author_title = db.Column(db.Text, nullable=False)
    meta_author_profile_url = db.Column(db.Text, nullable=False)
