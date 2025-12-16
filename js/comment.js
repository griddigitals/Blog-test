// Mock comments data
const mockComments = [
  {
    id: "1",
    author: "Taylor Scrybe",
    date: "September 19 2021",
    content: "Great insights on starting an online business! The step-by-step approach makes it much easier to understand. I've been researching various resources and found some really helpful guides online.",
    avatar: "T",
    replies: []
  },
  {
    id: "2",
    author: "Tarundeep Singh",
    date: "January 15 2022",
    content: "Excellent article on how to start an online business. Very comprehensive and well-structured!",
    avatar: "T",
    replies: []
  },
  {
    id: "3",
    author: "Nafiu Dauda",
    date: "January 31 2024",
    content: "I'm very interested in starting my own online business. This guide is exactly what I needed!",
    avatar: "N",
    replies: [
      {
        id: "3-1",
        author: "Admin",
        date: "February 07 2024",
        content: "Hi there! Great to hear that. Starting an online business can be an exciting journey filled with opportunities. We hope our article proves helpful to you as you embark on your online business journey 🚀",
        avatar: "A",
        replies: []
      }
    ]
  },
  {
    id: "4",
    author: "Rema Alishap Limu",
    date: "February 07 2024",
    content: "Hi! I am confident in my abilities to be successful in this opportunity because it is my dream and passion to run an online business ever since I was young.",
    avatar: "R",
    replies: [
      {
        id: "4-1",
        author: "Admin",
        date: "February 20 2024",
        content: "That's wonderful! Wishing you the best as you embark on this exciting journey 💜",
        avatar: "A",
        replies: []
      }
    ]
  },
  {
    id: "5",
    author: "John Martinez",
    date: "March 22 2024",
    content: "Great to acknowledge that online business is such a big opportunity for livelihood. It has been my dream to be a part of this kind of business and I'm ready to begin soon.",
    avatar: "J",
    replies: [
      {
        id: "5-1",
        author: "Admin",
        date: "March 26 2024",
        content: "Absolutely! Wishing you the best of luck 🎉",
        avatar: "A",
        replies: []
      }
    ]
  }
];

// Render a single comment
function renderComment(comment, isReply = false) {
  const commentDiv = document.createElement('div');
  commentDiv.className = `comment ${isReply ? 'reply' : ''}`;
  commentDiv.dataset.commentId = comment.id;
  
  commentDiv.innerHTML = `
    <div class="comment-wrapper">
      <div class="comment-avatar">${comment.avatar}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-text">${comment.content}</p>
        <button class="comment-reply-btn" onclick="toggleReplyForm('${comment.id}')">Reply</button>
        <div id="reply-form-${comment.id}" class="reply-form hidden">
          <textarea rows="3" placeholder="Write your reply..."></textarea>
          <div class="reply-form-actions">
            <button class="btn-small primary" onclick="postReply('${comment.id}')">Post Reply</button>
            <button class="btn-small ghost" onclick="cancelReply('${comment.id}')">Cancel</button>
          </div>
        </div>
        <div class="comment-replies" id="replies-${comment.id}">
          ${comment.replies.map(reply => renderComment(reply, true)).join('')}
        </div>
      </div>
    </div>
  `;
  
  return commentDiv.outerHTML;
}

// Render all comments
function renderComments() {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = mockComments.map(comment => renderComment(comment)).join('');
}

// Toggle reply form
function toggleReplyForm(commentId) {
  const replyForm = document.getElementById(`reply-form-${commentId}`);
  replyForm.classList.toggle('hidden');
}

// Cancel reply
function cancelReply(commentId) {
  const replyForm = document.getElementById(`reply-form-${commentId}`);
  replyForm.classList.add('hidden');
  replyForm.querySelector('textarea').value = '';
}

// Post reply
function postReply(commentId) {
  const replyForm = document.getElementById(`reply-form-${commentId}`);
  const textarea = replyForm.querySelector('textarea');
  const replyText = textarea.value.trim();
  
  if (!replyText) {
    showToast('Error', 'Please enter a reply');
    return;
  }
  
  // Find the comment and add reply
  const comment = findComment(mockComments, commentId);
  if (comment) {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Guest User",
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: replyText,
      avatar: "G",
      replies: []
    };
    
    comment.replies.push(newReply);
    renderComments();
    showToast('Success!', 'Your reply has been posted successfully!');
  }
}

// Find comment by ID (recursive)
function findComment(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies.length > 0) {
      const found = findComment(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// Scroll to comment form
function scrollToCommentForm() {
  document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
}

// Show toast notification
function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}

// Handle comment form submission
document.addEventListener('DOMContentLoaded', function() {
  // Render comments on page load
  renderComments();
  
  // Handle comment form
  const commentForm = document.getElementById('commentForm');
  const formError = document.getElementById('form-error');
  
  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const privacy = document.getElementById('privacy').checked;
    
    // Validation
    if (!name || !email || !comment || !privacy) {
      formError.classList.remove('hidden');
      return;
    }
    
    formError.classList.add('hidden');
    
    // Create new comment
    const newComment = {
      id: Date.now().toString(),
      author: name,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: comment,
      avatar: name.charAt(0).toUpperCase(),
      replies: []
    };
    
    // Add to comments array
    mockComments.push(newComment);
    
    // Re-render comments
    renderComments();
    
    // Show success message
    showToast('Success!', 'Your comment has been successfully submitted. It will be approved within the next 24 hours.');
    
    // Reset form
    commentForm.reset();
    
    // Scroll to comments
    document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth' });
  });
});

let commentsPerPage = 2; // How many top-level comments to show per click
let currentIndex = 0;

function renderCommentsBatch() {
  const commentsList = document.getElementById('comments-list');
  
  // Slice comments to display
  const commentsToShow = mockComments.slice(0, currentIndex + commentsPerPage);
  
  // Render HTML
  commentsList.innerHTML = commentsToShow.map(comment => renderComment(comment)).join('');
  
  currentIndex += commentsPerPage;

  // Hide Load More if all comments are shown
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (currentIndex >= mockComments.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

// Add event listener for Load More button
document.getElementById('load-more-btn').addEventListener('click', renderCommentsBatch);

// Initial render on page load
document.addEventListener('DOMContentLoaded', function() {
  currentIndex = 0;
  renderCommentsBatch();
  
  // Existing comment form logic remains unchanged
  const commentForm = document.getElementById('commentForm');
  const formError = document.getElementById('form-error');
  
  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const privacy = document.getElementById('privacy').checked;
    
    if (!name || !email || !comment || !privacy) {
      formError.classList.remove('hidden');
      return;
    }
    
    formError.classList.add('hidden');
    
    const newComment = {
      id: Date.now().toString(),
      author: name,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: comment,
      avatar: name.charAt(0).toUpperCase(),
      replies: []
    };
    
    mockComments.push(newComment);

    // Re-render comments batch including new comment
    renderCommentsBatch();

    showToast('Success!', 'Your comment has been successfully submitted. It will be approved within the next 24 hours.');
    commentForm.reset();
    
    document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth' });

    // After rendering comments
const newComments = document.querySelectorAll('.comment');
newComments.forEach(comment => {
  comment.classList.add('slide-in');
});

  });
});
