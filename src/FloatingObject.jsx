import { motion } from 'framer-motion'

export default function FloatingObject({ className = '', children, style, delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ y: 0, rotateX: 0, rotateY: 0 }}
      animate={{ y: [-6, 6, -6], rotateX: [0.5, -0.5, 0.5], rotateY: [-0.5, 0.5, -0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`relative rounded-2xl backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ${className}`}
      style={{ perspective: 1000, ...style }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-white/10" />
      <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/70 to-transparent opacity-60" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
