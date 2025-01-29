import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Mail, Building2, Phone, X, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Card, Title } from '@tremor/react';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  credentials: {
    username: string;
    password: string;
  };
  socialAccounts: {
    platform: string;
    username: string;
  }[];
}

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    socialAccounts: []
  });

  const generateCredentials = (clientName: string) => {
    const username = (clientName.toLowerCase().replace(/\s+/g, '') + 
      Math.floor(Math.random() * 1000)).slice(0, 15);
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return { username, password };
  };

  const handleAddClient = () => {
    const credentials = generateCredentials(newClient.name || '');
    const client: Client = {
      id: crypto.randomUUID(),
      name: newClient.name || '',
      email: newClient.email || '',
      company: newClient.company || '',
      phone: newClient.phone || '',
      credentials,
      socialAccounts: newClient.socialAccounts || []
    };
    setClients([...clients, client]);
    setShowAddClient(false);
    setNewClient({ socialAccounts: [] });
  };

  const platforms = [
    { id: 'instagram', icon: Instagram, label: 'Instagram' },
    { id: 'facebook', icon: Facebook, label: 'Facebook' },
    { id: 'twitter', icon: Twitter, label: 'Twitter' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Client Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddClient(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <Title className="text-white">{client.name}</Title>
                  <p className="text-slate-400">{client.company}</p>
                </div>
                <div className="flex -space-x-2">
                  {client.socialAccounts.map((account, index) => {
                    const Icon = platforms.find(p => p.id === account.platform)?.icon || Instagram;
                    return (
                      <div
                        key={index}
                        className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-800"
                      >
                        <Icon className="w-4 h-4 text-slate-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-300">Client Credentials</p>
                  <p className="text-sm text-slate-400">Username: {client.credentials.username}</p>
                  <p className="text-sm text-slate-400">Password: {client.credentials.password}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddClient && (
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
                <h2 className="text-2xl font-bold text-white">Add New Client</h2>
                <button
                  onClick={() => setShowAddClient(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClient.name || ''}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newClient.company || ''}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email || ''}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone || ''}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Social Media Accounts
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {platforms.map(({ id, icon: Icon, label }) => (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const accounts = newClient.socialAccounts || [];
                          const exists = accounts.some(a => a.platform === id);
                          if (!exists) {
                            setNewClient({
                              ...newClient,
                              socialAccounts: [...accounts, { platform: id, username: '' }]
                            });
                          }
                        }}
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          newClient.socialAccounts?.some(a => a.platform === id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddClient(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddClient}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white rounded-lg py-3 transition-colors"
                  >
                    Add Client
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

export default ClientManagement;