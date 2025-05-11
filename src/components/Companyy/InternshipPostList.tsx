import React from 'react';
import styles from './InternshipPostList.module.css';
import { InternshipPost } from './types';

interface InternshipPostListProps {
  posts: InternshipPost[];
  onEditPost: (post: InternshipPost) => void;
  onDeletePost: (postId: string) => void;
}

const InternshipPostList: React.FC<InternshipPostListProps> = ({ posts, onEditPost, onDeletePost }) => {
  return (
    <div className={styles.section}>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border border-[var(--light-gray)] rounded p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[var(--primary)]">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>{post.department}</span>
                  <span>{post.postedDate.toLocaleDateString()} - {post.deadline.toLocaleDateString()}</span>
                  <span>Duration: {post.duration}</span>
                  <span>{post.isPaid ? `Paid: $${post.expectedSalary}` : 'Unpaid'}</span>
                  <span>Skills: {post.skillsRequired.join(', ')}</span>
                </div>
              </div>
              <div>
                <span className="bg-[var(--light-purple)] text-[var(--primary)] px-2 py-1 rounded-full text-xs font-medium mr-2">
                  {post.applicationsCount} applications
                </span>
                <button 
                  className="text-[var(--primary)] hover:text-[var(--secondary)] text-xs mr-2"
                  onClick={() => onEditPost(post)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 text-xs"
                  onClick={() => onDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No internship posts found. Create a new post to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipPostList;
