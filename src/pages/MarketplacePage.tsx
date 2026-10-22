import React, { useState } from 'react';
import { Search, Plus, MapPin, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import AddBusinessModal from '@/components/marketplace/AddBusinessModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Business {
  id: string;
  name: string;
  owner: string;
  category: string;
  location: string;
  rating: number;
  description: string;
  logo?: string;
  subscriptionType: string;
}

const MarketplacePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock approved businesses
  const [businesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Tech Solutions Inc',
      owner: 'John Doe',
      category: 'Technology',
      location: 'Mumbai',
      rating: 4.5,
      description: 'Leading IT solutions provider specializing in cloud computing and AI',
      subscriptionType: 'Premium'
    },
    {
      id: '2',
      name: 'Green Foods',
      owner: 'Jane Smith',
      category: 'Food & Beverage',
      location: 'Delhi',
      rating: 4.8,
      description: 'Organic food delivery service with farm-fresh produce',
      subscriptionType: 'Basic'
    },
    {
      id: '3',
      name: 'HealthCare Plus',
      owner: 'Dr. Rajesh Kumar',
      category: 'Healthcare',
      location: 'Bangalore',
      rating: 4.9,
      description: 'Multi-specialty healthcare clinic with 24/7 emergency services',
      subscriptionType: 'Pro'
    },
    {
      id: '4',
      name: 'EduTech Academy',
      owner: 'Priya Sharma',
      category: 'Education',
      location: 'Pune',
      rating: 4.6,
      description: 'Online learning platform for competitive exams and skill development',
      subscriptionType: 'Premium'
    },
    {
      id: '5',
      name: 'Fashion Hub',
      owner: 'Amit Patel',
      category: 'Retail',
      location: 'Mumbai',
      rating: 4.3,
      description: 'Trendy clothing and accessories for men and women',
      subscriptionType: 'Basic'
    },
    {
      id: '6',
      name: 'Digital Marketing Pro',
      owner: 'Sneha Reddy',
      category: 'Technology',
      location: 'Bangalore',
      rating: 4.7,
      description: 'Full-service digital marketing agency for startups and enterprises',
      subscriptionType: 'Premium'
    },
    {
      id: '7',
      name: 'Cafe Delight',
      owner: 'Rahul Verma',
      category: 'Food & Beverage',
      location: 'Delhi',
      rating: 4.4,
      description: 'Cozy cafe serving artisan coffee and gourmet sandwiches',
      subscriptionType: 'Basic'
    },
    {
      id: '8',
      name: 'FitLife Gym',
      owner: 'Vikram Singh',
      category: 'Healthcare',
      location: 'Mumbai',
      rating: 4.5,
      description: 'State-of-the-art fitness center with personal training programs',
      subscriptionType: 'Premium'
    },
    {
      id: '9',
      name: 'Smart Home Solutions',
      owner: 'Neha Gupta',
      category: 'Technology',
      location: 'Pune',
      rating: 4.6,
      description: 'Home automation and IoT solutions for modern living',
      subscriptionType: 'Pro'
    },
    {
      id: '10',
      name: 'Kids Learning Center',
      owner: 'Anjali Mehta',
      category: 'Education',
      location: 'Delhi',
      rating: 4.8,
      description: 'Early childhood education with play-based learning approach',
      subscriptionType: 'Basic'
    },
    {
      id: '11',
      name: 'Organic Grocery Store',
      owner: 'Suresh Iyer',
      category: 'Retail',
      location: 'Bangalore',
      rating: 4.7,
      description: 'Chemical-free groceries and organic products',
      subscriptionType: 'Premium'
    },
    {
      id: '12',
      name: 'Legal Advisors LLP',
      owner: 'Adv. Meera Joshi',
      category: 'Services',
      location: 'Mumbai',
      rating: 4.9,
      description: 'Corporate and personal legal consultation services',
      subscriptionType: 'Pro'
    }
  ]);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || business.location === locationFilter;
    const matchesRating = ratingFilter === 'all' || business.rating >= parseFloat(ratingFilter);
    const matchesSubscription = subscriptionFilter === 'all' || business.subscriptionType === subscriptionFilter;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRating && matchesSubscription;
  });

  const handleContactBusiness = (businessId: string) => {
    // Check if user has subscription
    toast({
      title: "Subscription Required",
      description: "Please purchase a subscription to contact businesses.",
      variant: "destructive"
    });
    // Redirect to subscription plans page
    setTimeout(() => navigate('/subscription-plans'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Business Ecosystem</h1>
            <p className="text-muted-foreground">Discover and connect with verified businesses</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Business
            </Button>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {business.logo ? (
                          <img src={business.logo} alt={business.name} className="w-10 h-10 rounded" />
                        ) : (
                          <span className="text-xl font-bold text-primary">{business.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{business.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{business.subscriptionType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{business.description}</CardDescription>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{business.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Category: </span>
                      <span className="font-medium">{business.category}</span>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full" 
                      onClick={() => handleContactBusiness(business.id)}
                    >
                      Contact Business
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No businesses found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
      <AddBusinessModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default MarketplacePage;
