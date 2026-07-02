import React, { useState } from 'react';

const faqs = [
  {
    q: 'Can I track the location of my booked bus online?',
    a: 'Yes, you can track your bus online using our "Track My Bus" feature. This allows passengers and their families to follow the live bus location on a map, helping you plan your trip to the boarding point and ensuring safety for everyone.',
  },
  {
    q: 'What are the advantages of purchasing a bus ticket with BlueBus?',
    a: 'BlueBus lets you book from the comfort of your home, compare schedules and operators, access exclusive deals, and choose your seat. Payment security is guaranteed, and you get real-time updates on any schedule changes.',
  },
  {
    q: 'Why book bus tickets online on BlueBus?',
    a: 'Online booking is faster, more convenient, and often cheaper. You can compare prices, pick your preferred seat, and receive instant confirmation — all without standing in queues.',
  },
  {
    q: 'Do I need to create an account to book a bus ticket?',
    a: 'An account is required to book tickets, which allows us to securely store your booking history and passenger details. Registration is quick and only takes a minute.',
  },
  {
    q: 'Does online bus booking cost more?',
    a: 'Not at all! The ticket price is the same as at any bus counter. In fact, BlueBus often offers exclusive online discounts, making it a more cost-effective choice.',
  },
  {
    q: 'How can I get discounts on bus bookings?',
    a: 'Check our Primo Bus services for premium travel at competitive rates. We regularly offer promotional discounts and special deals for frequent travelers. Keep an eye on our homepage for the latest offers.',
  },
];

const AccordionItem = ({ q, a, isOpen, onToggle }) => (
  <div className={`border border-surface-200 rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'shadow-card' : ''}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-surface-50 transition-colors duration-150"
      aria-expanded={isOpen}
    >
      <span className={`text-sm font-medium pr-4 ${isOpen ? 'text-primary-700' : 'text-surface-800'}`}>{q}</span>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-primary-100 rotate-180' : 'bg-surface-100'}`}>
        <svg className={`w-3.5 h-3.5 ${isOpen ? 'text-primary-600' : 'text-surface-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    {isOpen && (
      <div className="px-6 pb-5 bg-white border-t border-surface-100 animate-fade-in">
        <p className="text-sm text-surface-600 leading-relaxed pt-3">{a}</p>
      </div>
    )}
  </div>
);

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-surface-500">Everything you need to know about booking with BlueBus.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accordion;
