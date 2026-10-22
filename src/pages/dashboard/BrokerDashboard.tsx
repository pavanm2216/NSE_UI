import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowRight,
  MapPin,
  IndianRupee,
  Plus,
  Phone,
  Mail,
  Shield,
  Award,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Listings', value: '12', change: '+3 this month', trend: 'up', icon: Building2 },
  { label: 'Total Views', value: '2,450', change: '+18% this week', trend: 'up', icon: Eye },
  { label: 'Leads Generated', value: '45', change: '+8 today', trend: 'up', icon: Users },
  { label: 'Conversion Rate', value: '12.5%', change: '+2.3%', trend: 'up', icon: TrendingUp },
];

const listings = [
  { 
    id: 1, 
    title: '3 BHK Apartment in Bandra', 
    type: 'Residential',
    price: '₹2.5 Cr',
    location: 'Bandra West, Mumbai',
    views: 450,
    leads: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
  },
  { 
    id: 2, 
    title: 'Commercial Space in BKC', 
    type: 'Commercial',
    price: '₹5.8 Cr',
    location: 'BKC, Mumbai',
    views: 320,
    leads: 8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
  },
  { 
    id: 3, 
    title: 'Villa in Lonavala', 
    type: 'Residential',
    price: '₹3.2 Cr',
    location: 'Lonavala, Maharashtra',
    views: 280,
    leads: 6,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'
  },
];

const recentLeads = [
  { name: 'Rahul Sharma', property: '3 BHK Apartment in Bandra', phone: '+91 98765 43210', time: '2 hours ago', hot: true },
  { name: 'Priya Patel', property: 'Commercial Space in BKC', phone: '+91 87654 32109', time: '5 hours ago', hot: true },
  { name: 'Amit Kumar', property: 'Villa in Lonavala', phone: '+91 76543 21098', time: '1 day ago', hot: false },
  { name: 'Sneha Gupta', property: '3 BHK Apartment in Bandra', phone: '+91 65432 10987', time: '2 days ago', hot: false },
];

const products = [
  {
    id: 1,
    name: 'Premium Property Listing',
    description: 'Get maximum visibility for your premium properties with featured listings, professional photography, and priority placement.',
    features: ['Featured placement', 'Professional photos', 'Virtual tours', '24/7 support'],
    price: '₹5,000/month',
    popular: true
  },
  {
    id: 2,
    name: 'Lead Generation Pro',
    description: 'Advanced lead generation tools with AI-powered matching, automated follow-ups, and detailed analytics.',
    features: ['AI lead matching', 'Auto follow-ups', 'Analytics dashboard', 'CRM integration'],
    price: '₹3,000/month',
    popular: false
  },
  {
    id: 3,
    name: 'Property Assurance',
    description: 'Comprehensive property verification, legal documentation support, and buyer protection services.',
    features: ['Legal verification', 'Document support', 'Buyer protection', 'Insurance coverage'],
    price: '₹2,000/property',
    popular: false
  }
];

const distributedProperties = [
  {
    id: 1,
    title: 'Skyline Residences',
    location: 'Powai, Mumbai',
    type: 'Apartment Complex',
    units: 120,
    sold: 85,
    commission: '₹12.5L',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Green Valley Villas',
    location: 'Whitefield, Bangalore',
    type: 'Villa Project',
    units: 45,
    sold: 32,
    commission: '₹8.2L',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Tech Park Plaza',
    location: 'Cyber City, Gurgaon',
    type: 'Commercial',
    units: 80,
    sold: 65,
    commission: '₹15.8L',
    status: 'Completed'
  }
];

const BrokerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Broker Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings and leads</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" asChild>
          <Link to="/dashboard/add-property">
            <Plus className="mr-2 w-4 h-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1 number-display">{stat.value}</p>
                    <p className="text-xs mt-1 text-success">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Products & Services */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Products & Services</CardTitle>
              <p className="text-sm text-muted-foreground">Enhance your real estate business with our premium tools</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{product.name}</h4>
                          {product.popular && (
                            <Badge className="bg-gold/10 text-gold">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{product.price}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" className="w-full" variant={product.popular ? 'default' : 'outline'}>
                      {product.popular ? 'Get Started' : 'Learn More'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distributed Properties */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Distributed Properties</CardTitle>
              <p className="text-sm text-muted-foreground">Your partnership projects</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributedProperties.map((property) => (
                  <div key={property.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{property.type}</p>
                      </div>
                      <Badge className={property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-muted-foreground">Units:</span>
                        <span className="ml-1 font-medium">{property.units}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sold:</span>
                        <span className="ml-1 font-medium">{property.sold}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="ml-1 font-bold text-green-600">{property.commission}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((property.sold / property.units) * 100)}% sold
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apartment Assurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Apartment Assurance Program
          </CardTitle>
          <p className="text-sm text-muted-foreground">Comprehensive protection for your property transactions</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Legal Protection</h3>
              <p className="text-sm text-muted-foreground">Complete legal verification and documentation support for all transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">Professional property inspection and quality certification services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Investment Security</h3>
              <p className="text-sm text-muted-foreground">Insurance coverage and investment protection for buyers and sellers</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button className="gradient-primary">
              Learn More About Assurance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Listings and Recent Leads */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Listings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/listings">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{listing.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {listing.location}
                          </p>
                        </div>
                        <Badge className={listing.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                          {listing.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-lg font-bold text-primary">{listing.price}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {listing.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {listing.leads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/leads">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{lead.name}</p>
                          {lead.hot && (
                            <Badge className="bg-destructive/10 text-destructive text-xs">Hot</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{lead.property}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.time}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
