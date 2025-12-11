import { useState } from 'react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Filter, Trophy, MessageCircle, Users, Award, Star, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

export default function UnimitrCenterPage() {
  const [activeTab, setActiveTab] = useState('discover');

  const students = [
    { id: 1, name: 'Priya Sharma', course: 'Computer Science', year: '3rd', city: 'Mumbai', interests: ['Coding', 'Music'], points: 450, avatar: 'PS' },
    { id: 2, name: 'Arjun Patel', course: 'Business', year: '2nd', city: 'Delhi', interests: ['Sports', 'Photography'], points: 380, avatar: 'AP' },
    { id: 3, name: 'Sneha Reddy', course: 'Design', year: '4th', city: 'Bangalore', interests: ['Art', 'Travel'], points: 520, avatar: 'SR' },
  ];

  const queries = [
    { id: 1, user: 'Rahul', question: 'Best places to study on campus?', answers: 12, upvotes: 45 },
    { id: 2, user: 'Ananya', question: 'Tips for semester exams?', answers: 8, upvotes: 32 },
    { id: 3, user: 'Vikram', question: 'How to join the coding club?', answers: 5, upvotes: 28 },
  ];

  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', points: 1250, badge: '🏆' },
    { rank: 2, name: 'Arjun Patel', points: 1100, badge: '🥈' },
    { rank: 3, name: 'Sneha Reddy', points: 980, badge: '🥉' },
    { rank: 4, name: 'Rahul Kumar', points: 850, badge: '⭐' },
    { rank: 5, name: 'Ananya Singh', points: 720, badge: '⭐' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Uniमित्र Center</h1>
        <p className="text-purple-600">Your student social zone</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-2xl shadow-md p-1">
          <TabsTrigger 
            value="discover" 
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-1" />
            Discover
          </TabsTrigger>
          <TabsTrigger 
            value="queries"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Queries
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            <Trophy className="w-4 h-4 mr-1" />
            Leaders
          </TabsTrigger>
          <TabsTrigger 
            value="messages"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            <Send className="w-4 h-4 mr-1" />
            Chats
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="mt-0 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search students..." 
                className="pl-10 rounded-2xl bg-white shadow-md border-0"
              />
            </div>
            <Button variant="outline" className="rounded-2xl border-2 border-purple-300 text-purple-600">
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500">
                  <AvatarFallback className="text-white">{student.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{student.name}</h4>
                  <p className="text-gray-600">{student.course} • {student.year} Year</p>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    📍 {student.city}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {student.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="rounded-full bg-purple-100 text-purple-700">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl">
                  Connect
                </Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Queries Tab */}
        <TabsContent value="queries" className="mt-0 space-y-4">
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-2xl shadow-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask a Question
          </Button>

          {queries.map((query, idx) => (
            <motion.div
              key={query.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500">
                  <AvatarFallback className="text-white">{query.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-800">{query.user}</p>
                  <p className="text-gray-600 mt-1">{query.question}</p>
                </div>
              </div>
              <div className="flex gap-4 text-gray-500 pl-13">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {query.answers} answers
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {query.upvotes} upvotes
                </span>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-0 space-y-3">
          {leaderboard.map((user, idx) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all ${
                user.rank <= 3 ? 'border-2 border-yellow-300' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{user.badge}</div>
                <div className="flex-1">
                  <h4 className="text-gray-800">#{user.rank} {user.name}</h4>
                  <p className="text-purple-600 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {user.points} points
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-0">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-purple-500" />
            </div>
            <p className="text-gray-600 mb-2">No messages yet</p>
            <p className="text-gray-500">Connect with students to start chatting!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
