import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How quickly can I send my first campaign?",
    answer:
      "Most people send their first campaign within 10 minutes. Import your contacts, pick a template, write your subject line, and hit send. No technical setup required.",
  },
  {
    question: "Can I see who opened and clicked my emails?",
    answer:
      "Yes. Every campaign shows a real-time breakdown of opens, clicks, bounces, and unsubscribes down to the individual contact level.",
  },
  {
    question: "How do I add my contacts?",
    answer:
      "Upload a CSV file or add contacts one at a time. You can tag them, group them into lists, and filter by any combination so the right people always get the right email.",
  },
  {
    question: "Can I personalise emails with each contact's name?",
    answer:
      "Yes. Use merge tags like {{firstName}} anywhere in your subject line or body. They get replaced automatically at send time.",
  },
  {
    question: "What happens if someone unsubscribes?",
    answer:
      "Their status updates instantly and they are excluded from all future campaigns. You never have to manage it manually.",
  },
  {
    question: "Can I schedule campaigns to send later?",
    answer:
      "Yes. Pick any future date and time when creating your campaign. NamiSend handles the rest even if you close the browser.",
  },
];

function FaqRow({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid var(--color-pencil-gray)" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left bg-transparent border-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <span className="font-medium text-base text-foreground">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0 text-2xl leading-none select-none"
          style={{ color: "var(--color-pencil-gray)" }}
          aria-hidden
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-5 text-sm text-foreground/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="px-6 py-24 max-w-3xl mx-auto" aria-labelledby="faq-heading">
      <motion.h2
        id="faq-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-foreground mb-12"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
          letterSpacing: "0.04em",
          lineHeight: 1.05,
        }}
      >
        Questions
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        role="list"
        style={{ borderTop: "1px solid var(--color-pencil-gray)" }}
      >
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} role="listitem">
            <FaqRow {...item} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
