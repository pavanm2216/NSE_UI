import React, { useState } from 'react';
import { Search, MapPin, Star, Shield, CheckCircle2, Home, Plus, Building2, Briefcase, X, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import AddBusinessModal from '@/components/marketplace/AddBusinessModal';
import { motion } from 'framer-motion';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const localities: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat'],
  'Himachal Pradesh': ['Shimla', 'Dharamsala', 'Manali'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Manipur': ['Imphal', 'Thoubal', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri'],
};

const projectTypes = ['Residential', 'Commercial', 'Plots', 'Villas', 'Apartments'];

const getProperties = (state: string, locality: string, projectType: string) => [
  {
    id: 1,
    name: `${locality} Heights`,
    location: `${locality}, ${state}`,
    price: '₹65L – ₹1.1Cr',
    bhk: '2-3 BHK',
    area: '1100-1700 sq ft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
    rating: 4.5,
    type: 'New' as const,
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Security'],
    possession: 'Ready to Move',
    builder: `${state} Builders Pvt Ltd`,
  },
  {
    id: 2,
    name: `${locality} Grand Residency`,
    location: `${locality}, ${state}`,
    price: '₹80L – ₹1.4Cr',
    bhk: '2-4 BHK',
    area: '1200-2000 sq ft',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop',
    rating: 4.3,
    type: 'New' as const,
    amenities: ['Garden', 'Jogging Track', 'Kids Play', 'Intercom'],
    possession: 'Dec 2025',
    builder: `${locality} Infra Group`,
  },
  {
    id: 3,
    name: `${locality} ${projectType} Park`,
    location: `${locality}, ${state}`,
    price: '₹55L – ₹95L',
    bhk: '1-3 BHK',
    area: '850-1500 sq ft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop',
    rating: 4.4,
    type: 'Resale' as const,
    amenities: ['Gym', 'CCTV', 'Parking', 'Lift'],
    possession: 'Ready to Move',
    builder: 'Godrej Properties',
  },
  {
    id: 4,
    name: `${state} Elite ${projectType}s`,
    location: `${locality}, ${state}`,
    price: '₹70L – ₹1.2Cr',
    bhk: '2-3 BHK',
    area: '1000-1800 sq ft',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=250&fit=crop',
    rating: 4.6,
    type: 'Resale' as const,
    amenities: ['Mall Access', 'Schools Nearby', 'Hospital', 'Parks'],
    possession: 'Ready to Move',
    builder: `${state} Realty Corp`,
  },
];

const businesses = [
  { id: '1', name: 'Mani Ventures', category: 'Technology', location: 'Mumbai', rating: 4.5, description: 'Leading IT solutions provider specializing in cloud computing and AI', subscriptionType: 'Premium' },
  { id: '2', name: 'Priya Organics', category: 'Food & Beverage', location: 'Delhi', rating: 4.8, description: 'Organic food delivery service with farm-fresh produce', subscriptionType: 'Basic' },
  { id: '3', name: 'A1 Wellness', category: 'Healthcare', location: 'Bangalore', rating: 4.9, description: 'Multi-specialty healthcare clinic with 24/7 emergency services', subscriptionType: 'Pro' },
  { id: '4', name: 'Ki Edutech', category: 'Education', location: 'Pune', rating: 4.6, description: 'Online learning platform for competitive exams and skill development', subscriptionType: 'Premium' },
  { id: '5', name: 'xyz Collections', category: 'Retail', location: 'Mumbai', rating: 4.3, description: 'Trendy clothing and accessories for men and women', subscriptionType: 'Basic' },
  { id: '6', name: 'leo Digital', category: 'Technology', location: 'Bangalore', rating: 4.7, description: 'Full-service digital marketing agency for startups and enterprises', subscriptionType: 'Premium' },
];

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  'Food & Beverage': 'bg-green-100 text-green-700',
  Healthcare: 'bg-red-100 text-red-700',
  Education: 'bg-purple-100 text-purple-700',
  Retail: 'bg-orange-100 text-orange-700',
};

const subBadgeColors: Record<string, string> = {
  Premium: 'bg-secondary/10 text-secondary border-secondary/20',
  Pro: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Basic: 'bg-gray-100 text-gray-600 border-gray-200',
};

const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ state: '', locality: '', projectType: '' });
  const [results, setResults] = useState<ReturnType<typeof getProperties>>([]);
  const [searched, setSearched] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'New' | 'Resale' | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<ReturnType<typeof getProperties>[0] | null>(null);

  const handleSearch = () => {
    const props = getProperties(
      filters.state || 'Maharashtra',
      filters.locality || 'Mumbai',
      filters.projectType || 'Residential'
    );
    setResults(props);
    setSearched(true);
    setActiveTab(null);
  };

  const displayedResults = activeTab ? results.filter(p => p.type === activeTab) : results;

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
      <TopHeader />
      <Header />
      {showPopup && <UnderDevelopmentPopup onHide={() => setShowPopup(false)} />}

      <div className="flex flex-1 flex-col lg:flex-row" style={{ height: 'calc(100vh - 112px)' }}>

        {/* ── LEFT: Pre-Verified Properties ── */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">Pre-Verified Properties</h2>
                <p className="text-xs text-gray-500">Legally verified premium properties across India</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter Properties</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Select value={filters.state} onValueChange={v => setFilters({ ...filters, state: v, locality: '' })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={filters.locality} onValueChange={v => setFilters({ ...filters, locality: v })} disabled={!filters.state}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Locality" /></SelectTrigger>
                  <SelectContent>{(localities[filters.state] || []).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={filters.projectType} onValueChange={v => setFilters({ ...filters, projectType: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Project Type" /></SelectTrigger>
                  <SelectContent>{projectTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
                <Button onClick={handleSearch} className="h-9 gradient-primary text-sm font-medium">
                  <Search className="w-4 h-4 mr-1.5" /> Search
                </Button>
              </div>
            </div>

            {!searched && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, t: 'Legal Verification', d: 'Thorough legal & document checks', color: 'text-blue-600 bg-blue-50' },
                  { icon: CheckCircle2, t: 'Quality Assured', d: 'Certified engineer inspections', color: 'text-green-600 bg-green-50' },
                  { icon: Star, t: 'Prime Locations', d: 'Handpicked premium areas', color: 'text-secondary bg-secondary/10' },
                  { icon: Home, t: 'Ready to Move', d: 'Immediate possession available', color: 'text-purple-600 bg-purple-50' },
                ].map((f, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className={`w-9 h-9 rounded-lg ${f.color} flex items-center justify-center mb-3`}>
                      <f.icon className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-sm text-gray-800">{f.t}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.d}</p>
                  </div>
                ))}
              </div>
            )}

            {searched && (
              <>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{results.length} properties found</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab(activeTab === 'New' ? null : 'New')}
                      className={`px-5 py-1.5 rounded-md text-sm font-semibold border transition-colors ${
                        activeTab === 'New' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >New</button>
                    <button
                      onClick={() => setActiveTab(activeTab === 'Old' ? null : 'Old')}
                      className={`px-5 py-1.5 rounded-md text-sm font-semibold border transition-colors ${
                        activeTab === 'Old' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >Resale</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {displayedResults.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
                        <div className="relative">
                          <img src={p.image} alt={p.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            p.type === 'New' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                          }`}>{p.type}</span>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-1">{p.name}</h3>
                          <div className="flex items-center gap-1 text-gray-500 text-xs mb-1.5">
                            <MapPin className="w-3 h-3" />{p.location}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-secondary text-secondary" />
                            <span className="text-xs font-medium text-gray-700">{p.rating}</span>
                            <span className="text-xs text-gray-400 ml-1">{p.bhk}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{p.area}</p>
                          <p className="font-bold text-primary text-sm mb-3">{p.price}</p>
                          <Button size="sm" variant="outline" onClick={() => setSelectedProperty(p)} className="w-full h-8 text-xs border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Property Details Popup */}
            {selectedProperty && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProperty(null)}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative">
                    <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-44 object-cover" />
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                    <button onClick={() => setSelectedProperty(null)} className="absolute top-3 right-3 w-7 h-7 bg-white/90 text-gray-700 rounded-full flex items-center justify-center hover:bg-white shadow">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Name + Rating */}
                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedProperty.name}</h2>
                      <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-sm font-bold px-2.5 py-1 rounded-lg ml-2 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {selectedProperty.rating}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedProperty.location}
                    </div>

                    {/* 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Configuration</p>
                        <p className="text-sm font-bold text-gray-800">{selectedProperty.bhk}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Area</p>
                        <p className="text-sm font-bold text-gray-800">{selectedProperty.area}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Estimated Price</p>
                        <p className="text-sm font-bold text-primary">{selectedProperty.price}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Possession</p>
                        <p className="text-sm font-bold text-gray-800">{selectedProperty.possession}</p>
                      </div>
                    </div>

                    {/* Builder */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-0.5">Builder / Developer</p>
                      <p className="text-sm font-bold text-gray-900">{selectedProperty.builder}</p>
                    </div>

                    {/* Amenities */}
                    <div className="mb-5">
                      <p className="text-xs text-gray-400 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map((a) => (
                          <span key={a} className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 bg-white">{a}</span>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 py-2.5 rounded-xl bg-[#1E3A6D] hover:bg-[#16305c] text-white text-sm font-semibold transition-colors">
                        Schedule Visit
                      </button>
                      <button onClick={() => setSelectedProperty(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
        </div>

        
         
      <Footer />
      <AddBusinessModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default PropertiesPage;
