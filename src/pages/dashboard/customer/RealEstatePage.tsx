import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Bed, Bath, Square, TrendingUp, Eye, Heart,
  Filter, Search, Star, Crown, ShoppingBag, BarChart3, Users, ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const properties = [
  {
    id: 1, title: 'Luxury Apartment in Bandra', location: 'Bandra West, Mumbai',
    price: 25000000, type: 'Apartment', bedrooms: 3, bathrooms: 2, area: 1200,
    roi: 8.5, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    status: 'Available', featured: true,
  },
  {
    id: 2, title: 'Commercial Office Space', location: 'Cyber City, Gurgaon',
    price: 45000000, type: 'Commercial', bedrooms: 0, bathrooms: 4, area: 2500,
    roi: 12.3, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    status: 'Available', featured: false,
  },
  {
    id: 3, title: 'Heritage Villa with Garden', location: 'Whitefield, Bangalore',
    price: 18000000, type: 'Villa', bedrooms: 4, bathrooms: 3, area: 2800,
    roi: 7.2, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    status: 'Available', featured: true,
  },
  {
    id: 4, title: 'Studio Apartment', location: 'Koramangala, Bangalore',
    price: 8500000, type: 'Studio', bedrooms: 1, bathrooms: 1, area: 600,
    roi: 9.1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    status: 'Sold', featured: false,
  },
];

const marketplaceListings = [
  { id: 1, title: 'Retail Space — Phoenix Mall', location: 'Chennai', price: '₹3.2Cr', yield: '11%', type: 'Retail', status: 'Open' },
  { id: 2, title: 'Warehouse Complex', location: 'Pune Industrial Zone', price: '₹8.5Cr', yield: '13.5%', type: 'Industrial', status: 'Open' },
  { id: 3, title: 'Co-working Hub', location: 'Hyderabad HITEC City', price: '₹5.1Cr', yield: '10.2%', type: 'Commercial', status: 'Closing Soon' },
  { id: 4, title: 'Luxury Resort Plot', location: 'Goa Beachfront', price: '₹12Cr', yield: '9.8%', type: 'Hospitality', status: 'Open' },
];

const stats = [
  { label: 'Total Listings', value: '240+', icon: Building2, color: 'text-primary' },
  { label: 'Avg. ROI', value: '9.8%', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Active Investors', value: '1,200+', icon: Users, color: 'text-blue-600' },
  { label: 'Deals Closed', value: '₹450Cr+', icon: BarChart3, color: 'text-amber-600' },
];

const RealEstatePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatPrice = (price: number) =>
    price >= 10000000 ? `₹${(price / 10000000).toFixed(1)}Cr` : `₹${(price / 100000).toFixed(0)}L`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs">Premium</Badge>
          </div>
          <h1 className="text-3xl font-bold">Real Estate Legacy & Marketplace</h1>
          <p className="text-muted-foreground">Exclusive premium properties & investment marketplace</p>
        </div>
        <Button className="gradient-primary">
          <Building2 className="w-4 h-4 mr-2" />
          List Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="legacy">
        <TabsList>
          <TabsTrigger value="legacy">
            <Building2 className="w-4 h-4 mr-2" />
            Legacy Properties
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        {/* Legacy Properties Tab */}
        <TabsContent value="legacy" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search properties..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="w-3 h-3 mr-1" />Featured
                        </Badge>
                      )}
                      <Badge className={property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="icon" variant="secondary" className="w-8 h-8"><Heart className="w-4 h-4" /></Button>
                      <Button size="icon" variant="secondary" className="w-8 h-8"><Eye className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />{property.location}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4" />{property.roi}% ROI
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {property.bedrooms > 0 && <div className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} Bed</div>}
                      <div className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms} Bath</div>
                      <div className="flex items-center gap-1"><Square className="w-4 h-4" />{property.area} sqft</div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" variant="outline">View Details</Button>
                      <Button className="flex-1 gradient-primary" disabled={property.status === 'Sold'}>
                        {property.status === 'Sold' ? 'Sold Out' : 'Invest Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {marketplaceListings.map((listing, i) => (
              <motion.div key={listing.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{listing.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />{listing.location}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">{listing.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-bold text-lg">{listing.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Yield</p>
                        <p className="font-bold text-green-600 flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />{listing.yield}
                        </p>
                      </div>
                      <div>
                        <Badge className={listing.status === 'Closing Soon' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                          {listing.status}
                        </Badge>
                      </div>
                      <Button className="gradient-primary">Invest</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstatePage;
