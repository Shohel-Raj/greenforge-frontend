
import BookAppointmentModal from "@/components/modules/Patient/Appointments/BookAppointmentModal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserInfo } from "@/services/auth.services"
import { getmemberById } from "@/services/member.services"
import { type ImemberDetails } from "@/types/member.types"
import { format } from "date-fns"
import Link from "next/link"

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a")
}

const getInitials = (name?: string) => {
  if (!name) {
    return "DR"
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("")
}

const getTodayStart = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const ConsultationmemberByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const currentUser = await getUserInfo()

  let memberDetails: ImemberDetails | null = null
  let errorMessage = ""

  try {
    const response = await getmemberById(id)
    memberDetails = response.data
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      errorMessage = error.response.data.message
    } else {
      errorMessage = "Failed to load member details"
    }
  }

  if (!memberDetails) {
    return (
      <section className="space-y-4">
        <Button asChild variant="outline">
          <Link href="/consultation">Back to Consultation</Link>
        </Button>
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage || "member details not available."}
        </div>
      </section>
    )
  }

  const todayStart = getTodayStart()

  const availableUpcomingSchedules = (memberDetails.memberchedules ?? [])
    .filter((item) => {
      if (item.isBooked) {
        return false
      }

      if (!item.schedule?.startDateTime) {
        return false
      }

      const startDate = new Date(item.schedule.startDateTime)
      if (Number.isNaN(startDate.getTime())) {
        return false
      }

      return startDate >= todayStart
    })
    .sort((a, b) => {
      const leftValue = new Date(a.schedule?.startDateTime ?? 0).getTime()
      const rightValue = new Date(b.schedule?.startDateTime ?? 0).getTime()
      return leftValue - rightValue
    })

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Button asChild variant="outline">
        <Link href="/consultation">Back to Consultation</Link>
      </Button>

      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-r from-sky-50 via-white to-cyan-50 p-6">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <Avatar className="size-24 ring-4 ring-white shadow-sm">
            <AvatarImage src={memberDetails.profilePhoto} alt={memberDetails.name} />
            <AvatarFallback>{getInitials(memberDetails.name)}</AvatarFallback>
          </Avatar>

          <div className="relative space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{memberDetails.name}</h1>
            <p className="text-muted-foreground">{memberDetails.designation || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{memberDetails.currentWorkingPlace || "N/A"}</p>

            <div className="flex flex-wrap gap-2">
              {(memberDetails.specialties ?? []).map((item) => (
                <Badge key={item.specialty.id} variant="secondary">
                  {item.specialty.title}
                </Badge>
              ))}
              {(!memberDetails.specialties || memberDetails.specialties.length === 0) && (
                <Badge variant="secondary">No specialties listed</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <Badge variant="outline">Experience: {memberDetails.experience ?? 0} yrs</Badge>
              <Badge variant="outline">Fee: ${memberDetails.appointmentFee?.toFixed(2) ?? "N/A"}</Badge>
              <Badge variant="outline">Rating: {memberDetails.averageRating?.toFixed(1) ?? "0.0"}</Badge>
            </div>

            <div className="pt-3">
              <BookAppointmentModal
                memberId={String(memberDetails.id)}
                memberName={memberDetails.name}
                isAuthenticated={Boolean(currentUser)}
                viewerRole={currentUser?.role ?? null}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold">Professional Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Qualification:</span> {memberDetails.qualification || "N/A"}</p>
            <p><span className="font-medium">Experience:</span> {memberDetails.experience ?? 0} years</p>
            <p><span className="font-medium">Registration Number:</span> {memberDetails.registrationNumber || "N/A"}</p>
            <p><span className="font-medium">Appointment Fee:</span> ${memberDetails.appointmentFee?.toFixed(2) ?? "N/A"}</p>
            <p><span className="font-medium">Average Rating:</span> {memberDetails.averageRating?.toFixed(1) ?? "0.0"}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold">Contact Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Email:</span> {memberDetails.email || "N/A"}</p>
            <p><span className="font-medium">Contact Number:</span> {memberDetails.contactNumber || "N/A"}</p>
            <p><span className="font-medium">Gender:</span> {memberDetails.gender || "N/A"}</p>
            <p><span className="font-medium">Address:</span> {memberDetails.address || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold">Available member Schedules</h2>
          <Badge variant="secondary">Today onward</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {availableUpcomingSchedules.slice(0, 18).map((item, index) => (
            <div
              key={item.id ?? item.schedule?.id ?? `schedule-${index}`}
              className="rounded-xl border bg-muted/20 p-4 text-sm"
            >
              <p><span className="font-medium">Start:</span> {formatDateTime(item.schedule?.startDateTime)}</p>
              <p><span className="font-medium">End:</span> {formatDateTime(item.schedule?.endDateTime)}</p>
              <p className="pt-1 text-xs text-emerald-700">Available</p>
            </div>
          ))}
          {availableUpcomingSchedules.length === 0 && (
            <p className="text-sm text-muted-foreground">No available schedules from today onward.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">Patient Reviews</h2>
        <div className="space-y-3">
          {(memberDetails.reviews ?? []).map((review, index) => (
            <div key={review.id ?? `review-${index}`} className="rounded-md border p-3 text-sm">
              <p><span className="font-medium">Rating:</span> {review.rating ?? "N/A"} / 5</p>
              <p><span className="font-medium">Comment:</span> {review.comment || "N/A"}</p>
              <p><span className="font-medium">Patient ID:</span> {review.patientId || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(review.createdAt)}</p>
            </div>
          ))}
          {(!memberDetails.reviews || memberDetails.reviews.length === 0) && (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ConsultationmemberByIdPage