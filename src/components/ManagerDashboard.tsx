import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, BarChart3, Share2, UserPlus, 
  Settings, LogOut, Bell, Search, Plus, Briefcase,
  MessageSquarePlus, CheckCircle2, Clock
} from 'lucide-react';
import { AreaChart, Card, Title, Text, BarChart } from '@tremor/react';
import ContentCalendar from './ContentCalendar';
import ClientManagement from './ClientManagement';

const chartdata = [
  { date: "Jan", "Total Posts": 12, "Engagement Rate": 2.3 },
  { date: "Feb", "Total Posts": 15, "Engagement Rate": 3.1 },
  { date: "Mar", "Total Posts": 18, "Engagement Rate": 3.8 },
  { date: "Apr", "Total Posts": 22, "Engagement Rate": 4.2 },
];

const clientAcquisitionData = [
  { month: "Jan", "New Clients": 3 },
  { month: "Feb", "New Clients": 5 },
  { month: "Mar", "New Clients": 4 },
  { month: "Apr", "New Clients": 7 },
];

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClient, setShowAddClient] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Content Calendar' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'social', icon: Share2, label: 'Social Accounts' },
    { id: 'acquisition', icon: UserPlus, label: 'Client Acquisition' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <ContentCalendar />;
      case 'clients':
        return <ClientManagement />;
      default:
        return (
          <div className="p-6 space-y-6">
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
                      <Briefcase className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Total Clients</Text>
                      <Title className="text-white">24</Title>
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
                      <MessageSquarePlus className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Scheduled Posts</Text>
                      <Title className="text-white">156</Title>
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
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <Text className="text-slate-400">Published Posts</Text>
                      <Title className="text-white">892</Title>
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
                      <Text className="text-slate-400">Pending Approvals</Text>
                      <Title className="text-white">8</Title>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <Title className="text-white mb-4">Performance Overview</Title>
                  <AreaChart
                    className="h-72 mt-4"
                    data={chartdata}
                    index="date"
                    categories={["Total Posts", "Engagement Rate"]}
                    colors={["purple", "violet"]}
                  />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <Title className="text-white mb-4">Client Acquisition</Title>
                  <BarChart
                    className="h-72 mt-4"
                    data={clientAcquisitionData}
                    index="month"
                    categories={["New Clients"]}
                    colors={["purple"]}
                  />
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <Title className="text-white mb-4">Recent Activity</Title>
                <div className="space-y-4">
                  {[
                    { text: "New client onboarded: Tech Solutions Inc.", time: "2 hours ago" },
                    { text: "Content approved for Social Media Campaign", time: "4 hours ago" },
                    { text: "Monthly report generated for Client XYZ", time: "6 hours ago" },
                    { text: "New social media accounts connected", time: "8 hours ago" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-slate-300">{activity.text}</span>
                      </div>
                      <span className="text-sm text-slate-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
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
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">Harmony</span>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
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

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg mt-auto absolute bottom-6 left-0 mx-6"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
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
              <Search className="w-4 h-4 text- h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;