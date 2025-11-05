"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, type ComponentProps, type MouseEvent, useRef } from "react"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns"
import { parseAsString, useQueryState } from "nuqs"
import { Calendar } from "@/components/ui/calendar"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useQuery } from "@tanstack/react-query"
import { getDatesOfShows } from "@/lib/queries"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { parseDate } from "chrono-node/fr"
import { CalendarIcon } from "@heroicons/react/24/outline"
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { fr } from "date-fns/locale"

const left = `0%`
const right = `100%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `#0000`
const opaque = `red`
function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  )

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      )
    } else if (value >= 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      )
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      )
    }
  })

  return maskImage
}

const DateElement = ({ className, ...props }: ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center md:flex-row md:gap-[0.4ch] rounded-xl border aria-pressed:bg-gray-white aria-pressed:text-gray-background px-4 py-2 md:py-2.5 leading-none border-gray-200 text-sm aria-disabled:border-gray-200/50 aria-disabled:text-gray-300 aria-disabled:cursor-default aria-pressed:border-gray-white aria-disabled:pointer-events-none whitespace-break-spaces last:mr-2 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const formatDate = (date: Date) => {
  const formatted = format(date, "eee dd LLL", { locale: fr }).replace(
    /\./g,
    ""
  )
  return capitalize(formatted)
}

export const FilterDate = () => {
  const ref = useRef(null)

  const isMobile = useIsMobile()

  const { scrollXProgress } = useScroll({ container: ref })
  const maskImage = useScrollOverflowMask(scrollXProgress)

  const supabase = useSupabaseBrowser()

  const [selectedDate, setSelectedDate] = useQueryState(
    "date",
    parseAsString.withOptions({ clearOnDefault: true }).withDefault("tout")
  )

  const [open, setOpen] = useState<boolean>(false)

  const { data } = useQuery({
    queryKey: ["shows-with-dates"],
    queryFn: async () => await getDatesOfShows(supabase),
  })

  const next2WeeksDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const hasShow =
      data?.filter((show) => {
        if (!show.date) return false

        const showDate = new Date(show.date)

        return isSameDay(showDate, date)
      }) ?? []

    const day = formatDate(date)

    const [weekDay, dayNumber, month] = day.split(" ")

    return {
      day: (
        <>
          {weekDay}
          <span className="text-base md:text-sm">{dayNumber}</span>
          <span className="capitalize md:lowercase">{month}</span>
        </>
      ),
      value: day.toLowerCase(),
      disabled: hasShow.length === 0,
      count: hasShow.length,
    }
  })

  const handleDateSelect = (e: MouseEvent<HTMLButtonElement>) => {
    const date = (e.currentTarget.value || formatDate(new Date())).toLowerCase()

    if (date === "tout") return setSelectedDate("tout")

    if (date === selectedDate) return setSelectedDate("tout")

    setSelectedDate(date)
  }

  const lastDate = (data ?? []).at(-1)?.date

  const startMonth = startOfMonth(new Date())
  const endMonth = endOfMonth(
    lastDate ? new Date(lastDate) : new Date(2027, 0, 1)
  )

  const disabledDates = eachDayOfInterval({
    start: startMonth,
    end: endMonth,
  }).filter((date) => {
    const hasShow =
      data?.filter((show) => {
        if (!show.date) return false

        const showDate = new Date(show.date)
        return isSameDay(showDate, date)
      }) ?? []

    return hasShow.length === 0
  })

  return (
    <section className="basis-full flex gap-1 overflow-x-auto">
      <motion.div
        className="flex gap-2 overflow-x-scroll whitespace-nowrap flex-nowrap [&>*]:grow-0 [&>*]:basis-auto md:[&>*]:shrink-0 overscroll-contain no-scrollbar"
        ref={ref}
        style={{ maskImage }}
      >
        <DateElement
          onClick={handleDateSelect}
          value="tout"
          aria-pressed={selectedDate === "tout"}
        >
          Tout
        </DateElement>

        {next2WeeksDays.map(({ value, day, disabled }) => {
          const isToday = formatDate(new Date()).toLowerCase()

          const _isTomorrow = new Date()
          _isTomorrow.setDate(_isTomorrow.getDate() + 1)
          const isTomorrow = formatDate(_isTomorrow).toLowerCase()

          const dayLabel =
            isToday === value
              ? "Aujourd'hui"
              : isTomorrow === value
              ? "Demain"
              : day

          return (
            <DateElement
              onClick={handleDateSelect}
              key={value}
              aria-disabled={disabled}
              aria-pressed={selectedDate === value}
              value={value.toLowerCase()}
            >
              {isMobile ? day : dayLabel}
            </DateElement>
          )
        })}
      </motion.div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="shrink-0 w-14 h-auto px-0 md:w-10 ml-auto mr-0 [&_svg]:size-6 md:[&_svg]:size-5 rounded-xl bg-gray-100 border-gray-100 md:bg-gray-200 md:border-gray-200"
            variant="outline"
          >
            <CalendarIcon className="" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={parseDate(selectedDate, new Date())}
            captionLayout="dropdown"
            onSelect={(date) => {
              setSelectedDate(date ? formatDate(date).toLowerCase() : "tout")
              setOpen(false)
            }}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
    </section>
  )
}
