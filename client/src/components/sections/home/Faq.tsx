import Container from '@/components/container/Container'
import React from 'react'
import { FaQuestion } from 'react-icons/fa6';

function Faq() {
    const faqQuestions = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, debit cards, UPI, net banking, PayPal, and select digital wallets. All transactions are secured using advanced encryption technologies for your safety.",
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping usually takes between 3 to 7 business days depending on your location. Expedited delivery options are available during checkout for faster service if needed urgently.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, you can return or exchange most products within 7 days of delivery. Items must be unused, in original condition, and include all original packaging materials.",
  },
  {
    question: "How do I track my order?",
    answer: "After your order is shipped, we’ll send you a tracking number via email or SMS. You can also log in to your account to track it anytime.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only deliver orders within our home country. However, international shipping is planned soon. Subscribe to our newsletter for updates on global availability.",
  },
  {
    question: "Is it safe to shop on your website?",
    answer: "Yes, our website uses SSL encryption and secure payment gateways to protect your data. We prioritize your privacy and never store sensitive payment information directly.",
  }
];

  return (
   <section className='py-20 bg-primary '>
   <Container>
    <div className=' flex flex-col justify-center items-center gap-3'>
         <span className='text-gray-100'>Most Asked Questions</span>
         <h1 className=' text-3xl md:text-5xl text-white font-semibold'>
            Questions  & Answers
         </h1>
    </div>
    <div className='mt-10 grid  md:grid-cols-2 gap-5'>
      {
        faqQuestions.map((question,index)=>(
            <div key={index} className=' p-5 flex flex-col md:flex-row gap-3 hover:-translate-y-3 transition-transform duration-100 group hover:cursor-pointer'>
              <span className=' text-3xl md:text-4xl p-3 bg-secondary rounded-full size-fit'><FaQuestion /></span>
              <div className='space-y-3'>
                <p className='text-xl font-medium text-white'>{question.question}</p>
                <p className='text-gray-100'>{question.answer}</p>
              </div>
            </div>
        ))
      }
    </div>
   </Container>
   </section>
  )
}

export default Faq