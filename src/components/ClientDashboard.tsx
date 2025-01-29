import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, MessageSquare, ThumbsUp, ThumbsDown, 
  Calendar, Bell, Search, Filter, Clock, CheckCircle2,
  XCircle, BarChart, PieChart, TrendingUp, Users
} from 'lucide-react';
import { Card, Title, Text, AreaChart, DonutChart, BarList } from '@tremor/react';

interface Post {
  id: string;
  content: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'pending' | 'approved' | 'rejected';
  scheduledFor: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const chartdata = [
  { date: "Jan", "Engagement Rate": 2.3, "Follower Growth": 5.2 },
  { date: "Feb", "Engagement Rate": 3.1, "Follower Growth": 5.8 },
  { date: "Mar", "Engagement Rate": 3.8, "Follower Growth": 6.5 },
  { date: "Apr", "Engagement Rate": 4.2, "Follower Growth": 7.2 },
];

const platformData = [
  { name: "Instagram", value: 45 },
  { name: "Facebook", value: 30 },
  { name: "Twitter", value: 15 },
  { name: "LinkedIn", value: 10 },
];

const engagementData = [
  { name: "Likes", value: 456 },
  { name: "Comments", value: 351 },
  { name: "Shares", value: 271 },
  { name: "Saves", value: 190 },
];

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts] = useState<Post[]>([
    {
      id: '1',
      content: "Exciting new product launch coming soon! Stay tuned for more updates. #innovation #technology",
      platform: 'instagram',
      status: 'pending',
      scheduledFor: '2024-03-20T10:00:00',
      engagement: {
        likes: 245,
        comments: 32,
        shares: 18
      }
    },
    {
      id: '2',
      content: "Check out our latest case study on how we helped a client achieve 300% growth!",
      platform: 'linkedin',
      status: 'pending',
      scheduledFor: '2024-03-21T14:00:00',
      engagement: {
        likes: 189,
        comments: 24,
        shares: 15
      }
    }
  ]);

  const handlePostAction = (postId: string, action: 'approve' | 'reject') => {
    // Handle post approval/rejection
    console.log(`Post ${postId} ${action}ed`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        post.status === 'pending' ? 'bg-yellow-500' :
                        post.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-slate-300 capitalize">{post.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        Scheduled for {new Date(post.scheduledFor).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-white mb-6">{post.content}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePostAction(post.id, 'approve')}
                        className="flex items-center gap-2 bg-green-600/20 text-green-500 px-4 py-2 rounded-lg hover:bg-green-600/30 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePostAction(post.id, 'reject')}
                        className="flex items-center gap-2 bg-red-600/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </motion.button>
                    </div>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600/20 rounded-lg">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Total Followers</Text>
                      <Title className="text-white">24.5K</Title>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Engagement Rate</Text>
                      <Title className="text-white">4.2%</Title>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-600/20 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Total Posts</Text>
                      <Title className="text-white">156</Title>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-600/20 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Pending Posts</Text>
                      <Title className="text-white">8</Title>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <Title className="text-white mb-4">Growth & Engagement</Title>
                  <AreaChart
                    className="h-72 mt-4"
                    data={chartdata}
                    index="date"
                    categories={["Engagement Rate", "Follower Growth"]}
                    colors={["purple", "indigo"]}
                  />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <Title className="text-white mb-4">Platform Distribution</Title>
                  <DonutChart
                    className="h-72 mt-4"
                    data={platformData}
                    category="value"
                    index="name"
                    colors={["purple", "indigo", "blue", "cyan"]}
                  />
                </Card>
              </motion.div>
            </div>

            {/* Engagement Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <Title className="text-white mb-4">Engagement Breakdown</Title>
                <BarList
                  data={engagementData}
                  className="mt-4"
                  color="purple"
                />
              </Card>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-slate-800 text-white p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">Analytics</span>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
            { id: 'pending', icon: Clock, label: 'Pending Approvals' },
            { id: 'calendar', icon: Calendar, label: 'Content Calendar' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-xs flex items-center justify-center">2</span>
            </button>
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="h-[calc(100vh-4rem)] overflow-auto p-6">
          {renderContent()}
        </div>
      </div>

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
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
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Content
                  </label>
                  <p className="text-white">{selectedPost.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Platform
                    </label>
                    <p className="text-white capitalize">{selectedPost.platform}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Scheduled For
                    </label>
                    <p className="text-white">
                      {new Date(selectedPost.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedPost.engagement && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Likes
                      </label>
                      <p className="text-white">{selectedPost.engagement.likes}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Comments
                      </label>
                      <p className="text-white">{selectedPost.engagement.comments}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Shares
                      </label>
                      <p className="text-white">{selectedPost.engagement.shares}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handlePostAction(selectedPost.id, 'approve');
                      setSelectedPost(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 transition-colors"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handlePostAction(selectedPost.id, 'reject');
                      setSelectedPost(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 transition-colors"
                  >
                    Reject
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

export default ClientDashboard;