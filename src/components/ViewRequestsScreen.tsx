import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Search, Filter, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ViewRequestsScreenProps {
  onBack: () => void;
}

export default function ViewRequestsScreen({ onBack }: ViewRequestsScreenProps) {
  const [activeTab, setActiveTab] = useState('events');

  const eventRegistrations = [
    { id: 1, name: 'Priya Sharma', studentId: 'CS2021001', event: 'Tech Fest 2025', status: 'Pending', avatar: 'PS' },
    { id: 2, name: 'Arjun Patel', studentId: 'BM2021045', event: 'Tech Fest 2025', status: 'Pending', avatar: 'AP' },
    { id: 3, name: 'Sneha Reddy', studentId: 'DS2021023', event: 'Cultural Night', status: 'Approved', avatar: 'SR' },
    { id: 4, name: 'Rahul Kumar', studentId: 'CS2021078', event: 'Sports Meet', status: 'Pending', avatar: 'RK' },
  ];

  const volunteerApplications = [
    { id: 1, name: 'Ananya Singh', studentId: 'CS2021055', activity: 'Beach Cleanup Drive', status: 'Pending', avatar: 'AS' },
    { id: 2, name: 'Vikram Gupta', studentId: 'EC2021034', activity: 'Teaching Kids', status: 'Pending', avatar: 'VG' },
    { id: 3, name: 'Pooja Verma', studentId: 'ME2021067', activity: 'Food Distribution', status: 'Approved', avatar: 'PV' },
  ];

  const handleApprove = (id: number, type: string) => {
    toast.success(`${type} request approved!`);
  };

  const handleReject = (id: number, type: string) => {
    toast.error(`${type} request declined`);
  };

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">View All Requests</h1>
        <p className="text-purple-600">Manage registrations & applications</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-10 rounded-2xl bg-white shadow-md border-0"
          />
        </div>
        <Button variant="outline" className="rounded-2xl border-2 border-purple-300 text-purple-600">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white rounded-2xl shadow-md p-1">
          <TabsTrigger
            value="events"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Event Registrations
          </TabsTrigger>
          <TabsTrigger
            value="volunteers"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            Volunteer Applications
          </TabsTrigger>
        </TabsList>

        {/* Event Registrations Tab */}
        <TabsContent value="events" className="mt-0 space-y-3">
          {eventRegistrations.map((registration, idx) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-3">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500">
                  <AvatarFallback className="text-white">{registration.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{registration.name}</h4>
                  <p className="text-gray-600">ID: {registration.studentId}</p>
                  <p className="text-purple-600 mt-1">{registration.event}</p>
                </div>
                <Badge
                  className={`${
                    registration.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : registration.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {registration.status}
                </Badge>
              </div>

              {registration.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(registration.id, 'Event')}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(registration.id, 'Event')}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </TabsContent>

        {/* Volunteer Applications Tab */}
        <TabsContent value="volunteers" className="mt-0 space-y-3">
          {volunteerApplications.map((application, idx) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-3">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500">
                  <AvatarFallback className="text-white">{application.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{application.name}</h4>
                  <p className="text-gray-600">ID: {application.studentId}</p>
                  <p className="text-purple-600 mt-1">{application.activity}</p>
                </div>
                <Badge
                  className={`${
                    application.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : application.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {application.status}
                </Badge>
              </div>

              {application.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(application.id, 'Volunteer')}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(application.id, 'Volunteer')}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}