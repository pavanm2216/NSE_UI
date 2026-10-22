import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  fallback: string;
  linkedin: string;
}

const team: TeamMember[] = [
  {
    name: 'Deepak Dash',
    role: 'Founder & Managing Director',
    image: '/deepak01.jpeg',
    fallback: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/deepak-dash-783bb123',
  },
  {
    name: 'Prachi Bothra',
    role: 'Head of Public Relation & CSR',
    image: '/csr2.jpeg',
    fallback: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/prachi-bothra-1a0bb788/',
  },
  {
    name: 'Brigadier Inder Sethi',
    role: 'Head of Global Strategy',
    image: '/img1.png',
    fallback: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/brigindersethi',
  },
  {
    name: 'Mohan Srinivas Kanala',
    role: 'Chief Technology Officer',
    image: '/cto.jpeg',
    fallback: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/kanalamohan/',
  },
  {
    name: 'Minerva Jha',
    role: 'Head of Startup Incubation',
    image: '/minerva.jpeg',
    fallback: 'https://images.unsplash.com/photo-1573496359180-b8d87734a5a2?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/minervajha?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    name: 'Satish Peddada',
    role: 'Head of AI & Transformation',
    image: '/ai&t.png',
    fallback: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/satishpeddada/',
  },
  {
    name: 'Ravindra Appasani',
    role: 'Head of Venture Capital Advisory',
    image: '/ravi.jpeg',
    fallback: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/ravindraappasani/',
  },
  {
    name: 'Soumyah Sinha',
    role: 'Head of Business Development & Planning',
    image: '/soumyah.jpeg',
    fallback: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/soumyahsinha',
  },
  {
    name: 'Dhruv Dash',
    role: 'Founder & Director',
    image: '/druv.jpeg',
    fallback: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/dhruv-dash/',
  },
  {
    name: 'CA Lakshminath Kothuri',
    role: 'Chief Financial Officer',
    image: '/lucky.jpeg',
    fallback: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/loka-lakshminath-k-79bb6b47/',
  },
  {
    name: 'Varsha Gada',
    role: 'Chartered Accountant – Compliance & Regulatory Affairs',
    image: '/varsha.jpeg',
    fallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/ca-varsha-gada-87637416a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    name: 'Sudhakar Peddada',
    role: 'Chief Operating Officer',
    image: '/sudakar.jpeg',
    fallback: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/sudhakarpeddada',
  },
  {
    name: 'Bhabani Shankar',
    role: 'Head of Governance',
    image: '/dirr.png',
    fallback: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop',
    linkedin: '#',
  },
  {
    name: 'Poonam Dash',
    role: 'Head of Capital Market & Operations',
    image: '/poona.jpeg',
    fallback: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/poonam-dash-268027191/',
  },
   {
    name: 'Kaluguri Manikanta',
    role: 'Product Manager & Tech Architect',
    image: '/mani2.jpeg',
    fallback: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=500&fit=crop',
    linkedin: 'https://www.linkedin.com/in/kaluguri-manikanta-21419a287/',
  },
];

const MeetOurTeam: React.FC = () => {
  return (
    <section style={{ background: '#e0f2fe', padding: '80px 24px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            color: '#0f172a', 
            fontSize: 'clamp(36px, 6vw, 54px)', 
            fontWeight: 800, 
            fontFamily: 'serif',
            marginBottom: '40px',
            letterSpacing: '-0.02em'
          }}>
            Meet Our Team
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          padding: '0 10px'
        }}>
          {team.map((member, index) => (
            <div key={index} style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '3/4',
              backgroundColor: '#1a1a1a',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <img
                src={member.image}
                alt={member.name}
                onError={e => { (e.currentTarget as HTMLImageElement).src = member.fallback; }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#ffffff', 
                      margin: 0, 
                      fontSize: '22px', 
                      fontWeight: 800, 
                      letterSpacing: '0.01em',
                      textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {member.name}
                    </h3>
                    
                    <div style={{
                      marginTop: '10px',
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '5px 14px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <p style={{ 
                        color: '#fff', 
                        margin: 0, 
                        fontSize: '11px', 
                        textTransform: 'uppercase',
                        fontWeight: 700, 
                        letterSpacing: '0.06em'
                      }}>
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Updated LinkedIn Icon Section */}
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      transition: 'transform 0.2s',
                      marginBottom: '4px',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {/* Setting both fill and color to make it completely blue */}
                    <FaLinkedin 
                      size={24} 
                      color="#0077b5"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeam;