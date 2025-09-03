import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Envelope, 
  Phone, 
  GeoAlt, 
  Globe, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram 
} from 'react-bootstrap-icons';

const Footer = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  
  const companyInfo = settings?.companyInformation || {};
  const socialMedia = companyInfo.socialMedia || {};

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Team', path: '/team' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' }
    ],
    services: [
      { label: 'Web Development', path: '/services/web-development' },
      { label: 'Mobile Apps', path: '/services/mobile-apps' },
      { label: 'UI/UX Design', path: '/services/ui-ux-design' },
      { label: 'Consulting', path: '/services/consulting' }
    ],
    resources: [
      { label: 'Portfolio', path: '/portfolio' },
      { label: 'Case Studies', path: '/case-studies' },
      { label: 'Documentation', path: '/docs' },
      { label: 'Support', path: '/support' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'GDPR', path: '/gdpr' }
    ]
  };

  const FooterSection = ({ title, links, className = '' }) => (
    <Col lg={3} md={6} className={className}>
      <h6 className="footer-section-title mb-3">{title}</h6>
      <ul className="footer-links list-unstyled">
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <Link to={link.path} className="footer-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Col>
  );

  const SocialLink = ({ icon: Icon, href, label, variant = 'outline-light' }) => {
    if (!href) return null;
    
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-${variant} btn-sm social-link`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={label}
      >
        <Icon size={16} />
      </motion.a>
    );
  };

  return (
    <footer className="footer bg-dark text-light">
      <Container>
        {/* Main Footer Content */}
        <Row className="py-5">
          {/* Company Info */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand mb-4">
              <h4 className="text-white fw-bold">CodeAxis</h4>
              <p className="text-muted">
                We create innovative digital solutions that help businesses grow and succeed in the digital age.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="footer-contact">
              <div className="d-flex align-items-center mb-2">
                <Envelope className="text-primary me-2" />
                <span className="text-muted">
                  {companyInfo.email || 'info@codeaxis.com'}
                </span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Phone className="text-primary me-2" />
                <span className="text-muted">
                  {companyInfo.phone || '+94 11 234 5678'}
                </span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <GeoAlt className="text-primary me-2" />
                <span className="text-muted">
                  {companyInfo.address || 'Colombo, Sri Lanka'}
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="footer-social">
              <h6 className="text-white mb-3">Follow Us</h6>
              <div className="d-flex gap-2">
                <SocialLink 
                  icon={Linkedin} 
                  href={socialMedia.linkedin} 
                  label="LinkedIn"
                />
                <SocialLink 
                  icon={Twitter} 
                  href={socialMedia.twitter} 
                  label="Twitter"
                />
                <SocialLink 
                  icon={Facebook} 
                  href={socialMedia.facebook} 
                  label="Facebook"
                />
                <SocialLink 
                  icon={Instagram} 
                  href={socialMedia.instagram} 
                  label="Instagram"
                />
              </div>
            </div>
          </Col>

          {/* Footer Links */}
          <FooterSection title="Company" links={footerLinks.company} />
          <FooterSection title="Services" links={footerLinks.services} />
          <FooterSection title="Resources" links={footerLinks.resources} />
        </Row>

        {/* Newsletter Section */}
        <Row className="py-4 border-top border-secondary">
          <Col lg={6} className="mb-3 mb-lg-0">
            <h6 className="text-white mb-2">Stay Updated</h6>
            <p className="text-muted small mb-0">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
          </Col>
          <Col lg={6}>
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </Col>
        </Row>

        {/* Bottom Footer */}
        <Row className="py-3 border-top border-secondary">
          <Col md={6} className="mb-2 mb-md-0">
            <p className="text-muted small mb-0">
              © {currentYear} CodeAxis. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="footer-legal">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={index}>
                  <Link to={link.path} className="footer-link small me-3">
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-muted">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
