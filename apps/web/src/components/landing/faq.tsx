import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

interface FaqItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Which email providers do you support?",
    answer:
      "Resend and AWS SES. Switch between them in settings without changing your templates.",
  },
  {
    question: "Can I schedule campaigns in advance?",
    answer:
      "Yes. Set a date and time. The system sends automatically when the time arrives.",
  },
  {
    question: "How does CSV import work?",
    answer:
      "Upload any CSV. Map your column headers to contact fields. We process in batches and show progress as it runs.",
  },
  {
    question: "Is click tracking automatic?",
    answer:
      "Yes. Every link in your template gets wrapped with a tracking URL. You do not need to modify your HTML.",
  },
  {
    question: "What happens when someone unsubscribes?",
    answer:
      "Their contact status updates immediately. They will not receive future campaigns from your account.",
  },
]

function FaqRow({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-left gap-4 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        whileTap={{ scale: 0.995 }}
      >
        <span className="font-medium text-base transition-colors duration-150 hover:text-foreground/80">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0 text-2xl leading-none text-muted-foreground select-none"
          aria-hidden
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
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
        className="font-bold text-foreground mb-12 tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display-s)",
        }}
      >
        Questions.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        role="list"
      >
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} role="listitem">
            <FaqRow {...item} />
          </div>
        ))}
      </motion.div>
    </section>
  )
}
