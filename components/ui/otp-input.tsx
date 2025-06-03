"use client"

import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface OTPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  length?: number
  value?: string
  onChange?: (value: string) => void
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, length = 6, value = "", onChange, ...props }, ref) => {
    const [otp, setOTP] = React.useState<string[]>(value.split(""))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    React.useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, [])

    const handleChange = (index: number, value: string) => {
      const newOTP = [...otp]
      newOTP[index] = value

      setOTP(newOTP)
      onChange?.(newOTP.join(""))

      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    return (
      <div className="flex gap-2">
        {[...Array(length)].map((_, index) => (
          <Input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "w-10 h-10 text-center text-lg font-semibold",
              className
            )}
            {...props}
          />
        ))}
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

export { OTPInput }