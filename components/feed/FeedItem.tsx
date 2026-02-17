
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MessageCircle, MoreHorizontal, MapPin, Edit2, Trash2, X, Check } from 'lucide-react';
import type { Feed } from '@/types';
import CommentSection from '@/components/feed/CommentSection';

interface FeedItemProps {
  feed: Feed;
  currentUserId: string;
  onUpdate: (feedId: string, content: string, images: string[], location?: string) => void;
  onDelete: (feedId: string) => void;
  onToggleLike: (feedId: string) => void;
  onToggleBookmark: (feedId: string) => void;
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

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR');
};

const FeedItem: React.FC<FeedItemProps> = ({
  feed,
  currentUserId,
  onUpdate,
  onDelete,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  onAddReply,
  onToggleCommentLike,
  onToggleReplyLike,
  onDeleteComment,
  onDeleteReply,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(feed.content);
  const [editImages, setEditImages] = useState(feed.images);
  const [editLocation, setEditLocation] = useState(feed.location || '');
  const [showComments, setShowComments] = useState(false);
  const isAuthor = feed.authorId === currentUserId;

  const handleSaveEdit = () => {
    onUpdate(feed.id, editContent, editImages, editLocation || undefined);
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setEditContent(feed.content);
    setEditImages(feed.images);
    setEditLocation(feed.location || '');
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('이 피드를 삭제하시겠습니까?')) {
      onDelete(feed.id);
    }
    setShowMenu(false);
  };

  const removeEditImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={feed.author.avatar}
            alt={feed.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">{feed.author.name}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{formatDate(feed.createdAt)}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-white/5 py-1 min-w-[120px] z-50"
                >
                  <button
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </motion.div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 컨텐츠 */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white text-sm resize-none outline-none focus:ring-2 focus:ring-teal-500/50"
            />

            {editImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {editImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Edit ${idx}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeEditImage(idx)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="장소 (선택사항)"
              className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Check size={14} />
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
              {feed.content.split(/(#[\w가-힣]+)/g).map((part, idx) =>
                part.startsWith('#') ? (
                  <span key={idx} className="text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </p>

            {feed.location && (
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-gray-400">
                <MapPin size={12} />
                <span>{feed.location}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* 이미지 */}
      {!isEditing && feed.images.length > 0 && (
        <div className={`grid gap-1 ${feed.images.length === 1 ? 'grid-cols-1' : feed.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {feed.images.map((img, idx) => (
            <div key={idx} className={feed.images.length === 1 ? 'aspect-video' : 'aspect-square'}>
              <img
                src={img}
                alt={`Feed image ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 액션 바 */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleLike(feed.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              feed.isLiked
                ? 'text-red-500'
                : 'text-slate-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={feed.isLiked ? 'currentColor' : 'none'} />
            <span>{feed.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <MessageCircle size={20} />
            <span>{feed.comments.length}</span>
          </button>
        </div>

        <button
          onClick={() => onToggleBookmark(feed.id)}
          className={`transition-colors ${
            feed.isBookmarked
              ? 'text-teal-500'
              : 'text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
          }`}
        >
          <Bookmark size={20} fill={feed.isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <CommentSection
          comments={feed.comments}
          feedId={feed.id}
          currentUserId={currentUserId}
          onAddComment={onAddComment}
          onAddReply={onAddReply}
          onToggleCommentLike={onToggleCommentLike}
          onToggleReplyLike={onToggleReplyLike}
          onDeleteComment={onDeleteComment}
          onDeleteReply={onDeleteReply}
        />
      )}
    </motion.div>
  );
};

export default FeedItem;
