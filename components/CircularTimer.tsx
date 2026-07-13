import React from 'react'


   const CircularTimer = ({ seconds, totalSeconds }: { seconds: number; totalSeconds: number }) => {
    const radius = 20
    const circumference = 2 * Math.PI * radius
    const progress = seconds / totalSeconds
    const offset = circumference * (1 - progress)

    return (
        <div className="relative flex items-center justify-center h-12 w-12">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                />
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <span className="absolute text-xs font-medium text-slate-700">
                {seconds}
            </span>
        </div>
    )
}


export default CircularTimer