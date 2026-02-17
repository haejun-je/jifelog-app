
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Comment, Reply } from '@/types';

interface CommentSectionProps {
  comments: Comment[];
  feedId: string;
  currentUserId: string;
  onAddComment: (feedId: string, content: string) => void;
  onAddReply: (feedId: string, commentId: string, content: string) => void;
  onToggleCommentLike: (feedId: string, commentId: string) => void;
  onToggleReplyLike: (feedId: string, commentId: string, replyId: string) => void;
  onDeleteComment: (feedId: string, commentId: string) => void;
  onDeleteReply: (feedId: string, commentId: string, replyId: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분`;
  if (hours < 24) return `${hours}시간`;
  if (days < 7) return `${days}일`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

const ReplyItem: React.FC<{
  reply: Reply;
  currentUserId: string;
  feedId: string;
  commentId: string;
  onToggleReplyLike: (feedId: string, commentId: string, replyId: string) => void;
  onDeleteReply: (feedId: string, commentId: string, replyId: string) => void;
}> = ({ reply, currentUserId, feedId, commentId, onToggleReplyLike, onDeleteReply }) => {
  const isAuthor = reply.authorId === currentUserId;

  return (
    <div className="flex gap-2 pl-8 py-2">
      <img
        src={reply.author.avatar}
        alt={reply.author.name}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-900 dark:text-white">{reply.author.name}</span>
              <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-gray-200">{reply.content}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleReplyLike(feedId, commentId, reply.id)}
              className={`p-1 transition-colors ${
                reply.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
              }`}
            >
              <Heart size={12} fill={reply.isLiked ? 'currentColor' : 'none'} />
            </button>
            {reply.likes > 0 && (
              <span className="text-xs text-slate-500">{reply.likes}</span>
            )}
          </div>

          {isAuthor && (
            <button
              onClick={() => {
                if (window.confirm('이 답글을 삭제하시겠습니까?')) {
                  onDeleteReply(feedId, commentId, reply.id);
                }
              }}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  currentUserId: string;
  feedId: string;
  onAddReply: (feedId: string, commentId: string, content: string) => void;
  onToggleCommentLike: (feedId: string, commentId: string) => void;
  onToggleReplyLike: (feedId: string, commentId: string, replyId: string) => void;
  onDeleteComment: (feedId: string, commentId: string) => void;
  onDeleteReply: (feedId: string, commentId: string, replyId: string) => void;
}> = ({
  comment,
  currentUserId,
  feedId,
  onAddReply,
  onToggleCommentLike,
  onToggleReplyLike,
  onDeleteComment,
  onDeleteReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const isAuthor = comment.authorId === currentUserId;

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onAddReply(feedId, comment.id, replyContent);
    setReplyContent('');
    setShowReplyInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <div className="flex gap-3">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-900 dark:text-white">{comment.author.name}</span>
                <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-gray-200">{comment.content}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onToggleCommentLike(feedId, comment.id)}
                className={`p-1 transition-colors ${
                  comment.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                }`}
              >
                <Heart size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
              </button>
              {comment.likes > 0 && (
                <span className="text-xs text-slate-500">{comment.likes}</span>
              )}
            </div>

            {isAuthor && (
              <button
                onClick={() => {
                  if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
                    onDeleteComment(feedId, comment.id);
                  }
                }}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 ml-1">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              답글 달기
            </button>
            {comment.replies.length > 0 && (
              <span className="text-xs text-slate-400">
                답글 {comment.replies.length}개
              </span>
            )}
          </div>

          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 mt-2 pl-8"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-500/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                autoFocus
              />
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="p-1.5 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-full transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </motion.div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-2">
              <AnimatePresence>
                {comment.replies.map(reply => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    currentUserId={currentUserId}
                    feedId={feedId}
                    commentId={comment.id}
                    onToggleReplyLike={onToggleReplyLike}
                    onDeleteReply={onDeleteReply}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  feedId,
  currentUserId,
  onAddComment,
  onAddReply,
  onToggleCommentLike,
  onToggleReplyLike,
  onDeleteComment,
  onDeleteReply,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(feedId, newComment);
    setNewComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
            댓글 {comments.length}개
          </span>
        </div>

        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                feedId={feedId}
                onAddReply={onAddReply}
                onToggleCommentLike={onToggleCommentLike}
                onToggleReplyLike={onToggleReplyLike}
                onDeleteComment={onDeleteComment}
                onDeleteReply={onDeleteReply}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-500/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="p-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full transition-colors disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSection;
