import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatarUrl?: string;
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[];
}

const CircularTestimonials: React.FC<CircularTestimonialsProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-carousel functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getItemStyle = (index: number) => {
    const totalItems = testimonials.length;
    const angle = (index - activeIndex) * (360 / totalItems);
    const radius = 120;
    
    return {
      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
      opacity: index === activeIndex ? 1 : 0.6,
      scale: index === activeIndex ? 1.2 : 1,
      transition: 'all 0.4s ease',
    };
  };

  return (
    <div className="circular-testimonials">
      <div className="testimonials-container">
        {/* Circular Ring */}
        <div className="circle-container">
          <div className="circle-items">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="circle-item"
                style={getItemStyle(index)}
                onClick={() => setActiveIndex(index)}
              >
                {testimonial.avatarUrl ? (
                  <img src={testimonial.avatarUrl} alt={testimonial.name} />
                ) : (
                  <div className="avatar-initials">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="navigation-arrows">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="nav-arrow nav-arrow-left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="nav-arrow nav-arrow-right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Active Testimonial Content */}
        <div className="testimonial-content" aria-live="polite">
          <div className="content-wrapper" key={activeIndex}>
            <blockquote>"{testimonials[activeIndex].text}"</blockquote>
            <h3>{testimonials[activeIndex].name}</h3>
            <p className="role">{testimonials[activeIndex].role}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .circular-testimonials {
          padding: 4rem 0;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .testimonials-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .circle-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto;
        }

        .circle-items {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .circle-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          margin: -30px 0 0 -30px;
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          border: 3px solid hsl(var(--primary));
          background: hsl(var(--card));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circle-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          font-weight: 600;
          font-size: 1.2rem;
          color: hsl(var(--primary));
        }

        .navigation-arrows {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          gap: 2rem;
          z-index: 10;
        }

        .nav-arrow {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid hsl(var(--primary));
          background: hsl(var(--background));
          color: hsl(var(--primary));
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .nav-arrow:hover {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .nav-arrow:focus {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }

        .testimonial-content {
          padding: 2rem;
        }

        .content-wrapper {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        blockquote {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }

        h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .role {
          color: hsl(var(--primary));
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .testimonials-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .circle-container {
            width: 250px;
            height: 250px;
          }

          .circle-item {
            width: 50px;
            height: 50px;
            margin: -25px 0 0 -25px;
          }

          .navigation-arrows {
            gap: 1.5rem;
          }

          .nav-arrow {
            width: 40px;
            height: 40px;
          }

          blockquote {
            font-size: 1.1rem;
          }

          h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CircularTestimonials;