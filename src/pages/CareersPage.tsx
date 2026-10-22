import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Users, Target, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import TopHeader from '@/components/landing/TopHeader';
import CardTestimonials from '@/components/CardTestimonials';
import { useToast } from '@/hooks/use-toast';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
}

const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Technology',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹12-18 LPA',
    description: 'Build scalable fintech solutions using React, Node.js, and cloud technologies.',
    requirements: ['React.js, TypeScript', 'Node.js, Express', 'MongoDB, PostgreSQL', 'AWS/Azure experience']
  },
  {
    id: '2',
    title: 'Business Development Manager',
    department: 'Sales',
    location: 'Delhi',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹8-12 LPA',
    description: 'Drive business growth by acquiring new clients and managing partnerships.',
    requirements: ['B2B sales experience', 'Fintech knowledge', 'Strong communication', 'Target-driven mindset']
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    location: 'Bangalore',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '₹15-22 LPA',
    description: 'Lead product strategy and roadmap for our lending and investment platforms.',
    requirements: ['Product management experience', 'Fintech background', 'Agile methodology', 'Data-driven approach']
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Pune',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹6-10 LPA',
    description: 'Create intuitive and beautiful user experiences for our financial products.',
    requirements: ['Figma, Adobe XD', 'User research', 'Prototyping', 'Design systems']
  },
  {
    id: '5',
    title: 'Financial Analyst',
    department: 'Finance',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '1-3 years',
    salary: '₹5-8 LPA',
    description: 'Analyze financial data and provide insights for strategic decision-making.',
    requirements: ['CA/MBA Finance', 'Excel proficiency', 'Financial modeling', 'Analytical skills']
  },
  {
    id: '6',
    title: 'Customer Success Manager',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
    experience: '1-2 years',
    salary: '₹4-6 LPA',
    description: 'Ensure customer satisfaction and drive product adoption.',
    requirements: ['Customer service experience', 'Problem-solving', 'Communication skills', 'CRM tools']
  }
];

const benefits = [
  { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family' },
  { icon: Award, title: 'Performance Bonus', description: 'Quarterly and annual performance incentives' },
  { icon: Users, title: 'Team Events', description: 'Regular team outings and celebrations' },
  { icon: Target, title: 'Career Growth', description: 'Clear career progression paths' }
];

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    setIsApplyModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <UnderDevelopmentPopup />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build the future of fintech with us. We're looking for talented individuals passionate about innovation.
          </p>
        </motion.div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <benefit.icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Open Positions</h2>
          <p className="text-muted-foreground mb-8">Explore opportunities across different departments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job, index) => {
            const isExpanded = expandedJobId === job.id;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="cursor-pointer" onClick={() => setExpandedJobId(isExpanded ? null : job.id)}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <CardDescription>{job.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <p className="text-sm font-medium mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{req}</Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button className="w-full" onClick={() => handleApply(job)}>
                          Apply Now
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Employee Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Team Says</h2>
            <p className="text-muted-foreground text-lg">Hear from our employees about their experience</p>
          </div>
          <CardTestimonials testimonials={[
            {
              id: '1',
              name: 'Rajesh Kumar',
              role: 'Senior Developer',
              text: 'Amazing work culture and growth opportunities. The team is supportive and innovative.',
              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            },
            {
              id: '2',
              name: 'Priya Sharma',
              role: 'Product Manager',
              text: 'Best decision of my career. The leadership truly cares about employee development.',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
            },
            {
              id: '3',
              name: 'Amit Patel',
              role: 'Business Analyst',
              text: 'Great benefits, flexible work environment, and challenging projects. Highly recommend!',
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            },
            {
              id: '4',
              name: 'Sneha Gupta',
              role: 'UI/UX Designer',
              text: 'Creative freedom and collaborative environment. Perfect place for designers to thrive.',
              avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
            }
          ]} />
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join Lendrix Ventech?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Target className="w-12 h-12 text-primary mb-3" />
                <CardTitle>Innovation First</CardTitle>
                <CardDescription>Work on cutting-edge fintech solutions that impact millions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-3" />
                <CardTitle>Great Culture</CardTitle>
                <CardDescription>Collaborative environment with talented professionals</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-3" />
                <CardTitle>Fast Growth</CardTitle>
                <CardDescription>Rapid career progression and learning opportunities</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Application Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.department} • {selectedJob?.location}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="9876543210" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" placeholder="3" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="resume">Resume Link</Label>
              <Input id="resume" placeholder="https://drive.google.com/..." required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cover">Cover Letter</Label>
              <Textarea id="cover" placeholder="Tell us why you're a great fit..." className="mt-1" />
            </div>
            <Button type="submit" className="w-full">Submit Application</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareersPage;
