"use client"

import SpeechBubble from '../components/SpeechBubble'
import Quote from '@/components/Quote/Quote'
import { motion } from 'motion/react'

export default function Step4() {
  return (
    <div className="flex flex-col gap-[40px] px-6">
      {/* Heading (speech bubble acts as heading in this step) */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <SpeechBubble message="Turning your skills into income is the best!!" />
      </motion.div>
      
      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
      >
        <Quote>
          <p>
            Hundreds of creators mastered <strong>template development</strong> and <strong>freelancing</strong> through Framer University courses.
          </p>
          <p>
            Be ready to join the community of designers who turned their Framer expertise into passive income streams.
          </p>
        </Quote>
      </motion.div>
    </div>
  )
}
