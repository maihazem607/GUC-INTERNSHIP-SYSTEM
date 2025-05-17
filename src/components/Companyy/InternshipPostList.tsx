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
    <div className={styles.section}>      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.cardInner}>
              <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[var(--primary)] text-xl">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.department}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.postedDate.toLocaleDateString()} - {post.deadline.toLocaleDateString()}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Duration: {post.duration}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.isPaid ? `Paid: $${post.expectedSalary}` : 'Unpaid'}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Skills: {post.skillsRequired.join(', ')}</span>
                </div>              </div>
              <div>
                <span className="bg-[var(--light-purple)] text-[var(--primary)] px-3 py-1 rounded-full text-xs font-medium mr-2">
                  {post.applicationsCount} applications
                </span>
              </div>
            </div>
            </div>            <div className={`border-t border-[#f0f0f0] py-3 px-4 flex justify-between items-center`}>
              <div></div>
              <div>
                <button 
                  className="bg-[rgb(106,31,205)] text-white px-3 py-1 rounded-lg text-sm font-medium mr-2 hover:bg-[rgb(88,24,169)] transition-colors"
                  onClick={() => onEditPost(post)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  onClick={() => onDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
          {posts.length === 0 && (
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <div className="text-center py-8 text-gray-500">
                No internship posts found. Create a new post to get started.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipPostList;
