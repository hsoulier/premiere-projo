"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type Log = {
  message: string
  type: string
  icon: React.JSX.Element
  color: string
  id: number
  timestamp: string
}

const logVariants: Variants = {
  initial: { opacity: 0, y: -5 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, y: 5, transition: { duration: 0.3 } },
}

export const logTypes = {
  INFO: {
    type: "INFO",
    icon: <InfoIcon className="h-4 w-4 text-blue-400" />,
    color: "text-blue-400",
  },
  SUCCESS: {
    type: "SUCCESS",
    icon: <CheckCircleIcon className="h-4 w-4 text-green-400" />,
    color: "text-green-400",
  },
  WARNING: {
    type: "WARNING",
    icon: <AlertTriangleIcon className="h-4 w-4 text-yellow-400" />,
    color: "text-yellow-400",
  },
  ERROR: {
    type: "ERROR",
    icon: <AlertTriangleIcon className="h-4 w-4 text-red-400" />,
    color: "text-red-400",
  },
}

const logMessages = [
  "Initializing system...",
  "Connection established to primary server.",
  "User authentication successful.",
  "Data packet received.",
  "Compiling assets...",
  "Deployment complete.",
  "High memory usage detected.",
  "Failed to connect to database.",
  "API endpoint returned 503.",
  "System health check OK.",
]

const KineticLogStream = ({ logs }: { logs: Log[] }) => {
  const logContainerRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomLogType =
  //       logTypes[Math.floor(Math.random() * logTypes.length)]
  //     const randomMessage =
  //       logMessages[Math.floor(Math.random() * logMessages.length)]
  //     const newLog = {
  //       id: Date.now() + Math.random(),
  //       timestamp: new Date().toLocaleTimeString(),
  //       ...randomLogType,
  //       message: randomMessage,
  //     }

  //     setLogs((prevLogs) => [...prevLogs, newLog])
  //   }, 1500)

  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <motion.div className="mt-8 relative w-full h-[500px] rounded-xl border border-gray-100">
      <div
        ref={logContainerRef}
        className="h-full overflow-y-hidden font-mono text-sm text-slate-300 p-4"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              layout
              variants={logVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-start gap-4 mb-2"
            >
              <span className="text-slate-600">{log.timestamp}</span>
              <div
                className={cn(
                  "flex items-center gap-2 font-bold w-24",
                  log.color
                )}
              >
                {log.icon}
                <span>[{log.type}]</span>
              </div>
              <span>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default KineticLogStream
