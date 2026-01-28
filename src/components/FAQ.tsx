import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is cybersecurity and why does my business need it?",
    answer: "Cybersecurity encompasses the practices, technologies, and processes designed to protect your digital systems, networks, and data from cyber attacks. Every business, regardless of size, is a potential target for hackers. A single breach can result in financial losses, reputation damage, legal penalties, and loss of customer trust.",
  },
  {
    question: "How do I know if my business has been hacked?",
    answer: "Common signs include: unusual account activity, slow system performance, unexpected pop-ups, employees receiving suspicious emails from internal accounts, unauthorized password changes, and unexplained data transfers. If you suspect a breach, contact us immediately for incident response support.",
  },
  {
    question: "What services does CyberHawk UG offer?",
    answer: "We offer comprehensive cybersecurity services including: Network Security, Penetration Testing, Security Audits & Compliance, Incident Response, Data Protection & Encryption, Cloud Security, and 24/7 Security Monitoring. We tailor our solutions to meet your specific business needs.",
  },
  {
    question: "How often should we conduct security assessments?",
    answer: "We recommend conducting comprehensive security assessments at least annually, with vulnerability scans performed quarterly. However, assessments should also be done after any major system changes, new software deployments, or if you suspect any security incidents.",
  },
  {
    question: "What is penetration testing and do I need it?",
    answer: "Penetration testing (pen testing) is a simulated cyber attack against your systems to identify vulnerabilities before real hackers do. It's essential for any business that handles sensitive data, processes payments, or must comply with security regulations. It provides a realistic assessment of your security posture.",
  },
  {
    question: "How quickly can you respond to a security incident?",
    answer: "Our incident response team is available 24/7. For critical incidents, we guarantee initial response within 1 hour. We'll immediately begin containment procedures while conducting forensic analysis to understand the breach scope and prevent further damage.",
  },
  {
    question: "Do you provide security training for employees?",
    answer: "Yes! Human error is the leading cause of security breaches. We offer customized security awareness training that covers phishing recognition, password best practices, social engineering tactics, and safe browsing habits. Training can be delivered on-site or remotely.",
  },
  {
    question: "How much do your cybersecurity services cost?",
    answer: "Our pricing varies based on your organization's size, complexity, and specific needs. We offer flexible packages ranging from one-time assessments to ongoing managed security services. Contact us for a free consultation and customized quote tailored to your requirements.",
  },
];

const FAQ = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return (
      <section ref={ref} className="py-16 md:py-24 bg-card" {...props}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get answers to common cybersecurity questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-background rounded-xl px-6 border border-border shadow-soft data-[state=open]:shadow-elevated transition-shadow"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  }
);

FAQ.displayName = "FAQ";

export default FAQ;
