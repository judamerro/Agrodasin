import React from "react";
import { Link } from "react-router-dom";
import { Leaf, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Inicio", path: "/" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Servicios", path: "/servicios" },
    { name: "Convocatorias", path: "/convocatorias" },
    { name: "Blog", path: "/blog" },
    { name: "Contacto", path: "/contacto" },
  ];

  // Bulletproof SVG social links config
  const socialLinks = [
    {
      label: "Facebook",
      url: "https://facebook.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1H13a5 5 0 0 0-5 5v2Z" />
        </svg>
      )
    },
    {
      label: "Instagram",
      url: "https://instagram.com",
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      label: "Twitter (X)",
      url: "https://twitter.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com",
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-400 pt-16 pb-8 border-t-4 border-green-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-green-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Leaf size={22} className="fill-white/10" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                AGRO<span className="text-secondary-500">DASIN</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Impulsamos la prosperidad del campo colombiano mediante proyectos de cofinanciación viables, asistencia técnica especializada de alta calidad y fortalecimiento asociativo rural.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-green-700 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Directory */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">
              Enlaces Rápidos
            </h3>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm font-medium">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-secondary-500 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-green-500 text-xs">▶</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours / Contact Coordinates */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-500 shrink-0 mt-0.5" />
                <span>Calle 15 # 6-64, Piso 1 Local 2, Centro, Santa Marta, Magdalena</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500 shrink-0" />
                <a href="tel:+573052397368" className="hover:text-secondary-500 transition-colors">
                  +57 (305) 239-7368
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500 shrink-0" />
                <a href="tel:+573015194386" className="hover:text-secondary-500 transition-colors">
                  +57 (301) 519-4386
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500 shrink-0" />
                <a href="mailto:contacto@agrodasin.org.co" className="hover:text-secondary-500 transition-colors">
                  contacto@agrodasin.org.co
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours Details */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-green-500">
              Horario de Atención
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Lunes a Viernes:</p>
                  <p className="text-xs mt-0.5">8:00 AM - 12:00 PM</p>
                  <p className="text-xs">2:00 PM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Sábados:</p>
                  <p className="text-xs mt-0.5">8:00 AM - 12:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {currentYear} AGRODASIN · NIT 806013024-7 · Santa Marta, Magdalena, Colombia.
          </p>
          <p className="mt-2 sm:mt-0 text-center sm:text-right font-medium">
            Desarrollado para el Fortalecimiento del Sector Agropecuario y Rural Sostenible.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
