import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Plus, Calendar as CalendarIcon, Clock, Instagram, Facebook, Twitter, Linkedin, X } from 'lucide-react';
import { Card, Title } from '@tremor/react';

interface Post {
  id: string;
  date: Date;
  content: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  clientId: string;
  mediaUrl?: string;
}

const ContentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddPost, setShowAddPost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Partial<Post>>({
    date: new Date(),
    platform: 'instagram',
    status: 'draft'
  });

  const currentMonth = startOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({
    start: currentMonth,
    end: endOfMonth(currentMonth)
  });

  const platformIcons = {
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin
  };

  const platformColors = {
    instagram: 'from-pink-500 to-purple-500',
    facebook: 'from-blue-500 to-blue-600',
    twitter: 'from-sky-400 to-sky-500',
    linkedin: 'from-blue-600 to-blue-700'
  };

  const handleAddPost = () => {
    const post: Post = {
      id: crypto.randomUUID(),
      date: newPost.date!,
      content: newPost.content || '',
      platform: newPost.platform as Post['platform'],
      status: 'draft',
      clientId: '1', // This would come from selected client
    };
    setPosts([...posts, post]);
    setShowAddPost(false);
    setNewPost({
      date: new Date(),
      platform: 'instagram',
      status: 'draft'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddPost(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Post
        </motion.button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <div className="grid grid-cols-7 gap-px bg-slate-700/20">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-slate-400 font-medium">
              {day}
            </div>
          ))}
          
          {daysInMonth.map((date) => {
            const dayPosts = posts.filter(post => 
              format(post.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );
            
            return (
              <motion.div
                key={date.toString()}
                whileHover={{ scale: 0.98 }}
                className={`min-h-[120px] p-2 bg-slate-800/50 border border-slate-700/50 ${
                  format(date, 'MM') !== format(selectedDate, 'MM')
                    ? 'opacity-50'
                    : ''
                }`}
              >
                <div className="text-sm text-slate-400 mb-2">
                  {format(date, 'd')}
                </div>
                <div className="space-y-2">
                  {dayPosts.map((post) => {
                    const Icon = platformIcons[post.platform];
                    return (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-2 rounded-lg bg-gradient-to-r ${platformColors[post.platform]} text-white text-sm`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="truncate">{post.content.substring(0, 20)}...</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <AnimatePresence>
        {showAddPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Schedule New Post</h2>
                <button
                  onClick={() => setShowAddPost(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Platform
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(platformIcons).map(([platform, Icon]) => (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewPost({ ...newPost, platform })}
                        className={`p-3 rounded-lg flex flex-col items-center gap-2 ${
                          newPost.platform === platform
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs capitalize">{platform}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newPost.content || ''}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                    placeholder="Write your post content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={format(newPost.date || new Date(), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setNewPost({ ...newPost, date: new Date(e.target.value) })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddPost(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddPost}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white rounded-lg py-3 transition-colors"
                  >
                    Schedule Post
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentCalendar;