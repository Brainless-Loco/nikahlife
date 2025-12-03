"use client"

import { getCookie } from "@/utils/getToken"
import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Eye, Trash2, MapPin, Phone, User, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import InfoRow from "./InfoRow"
import { Biodata } from "@/types/dashboard/allBiodata"


const AllBiodata = () => {
  const token = getCookie("token") || ""
  const [biodataList, setBiodataList] = useState<Biodata[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBiodata, setSelectedBiodata] = useState<Biodata | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [biodataToDelete, setBiodataToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchAllBiodata()
  }, [])

  const fetchAllBiodata = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/admin/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        timeout: 10000,
      })

      if (response.data.success) {
        setBiodataList(response.data.data)
      }
    } catch (error: unknown) {
      console.error("Error fetching all biodata:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch biodata")
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (biodata: Biodata) => {
    setSelectedBiodata(biodata)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (biodataId: string) => {
    setBiodataToDelete(biodataId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!biodataToDelete) return

    try {
      setIsDeleting(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/biodata/admin/${biodataToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        timeout: 10000,
      })

      toast.success("Biodata deleted successfully")
      setBiodataList(biodataList.filter((b) => b._id !== biodataToDelete))
      setDeleteDialogOpen(false)
      setBiodataToDelete(null)
    } catch (error: unknown) {
      console.error("Error deleting biodata:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete biodata")
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Biodata</h1>
        <p className="text-muted-foreground">Manage and view all biodata submissions</p>
      </div>

      {biodataList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No biodata found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biodataList.map((biodata) => (
            <Card key={biodata._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{biodata.name}</h3>
                    <Badge variant={biodata.isApproved === "approved" ? "default" : "secondary"} className="mt-2">
                      {biodata.isApproved}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{biodata.gender}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{biodata.userId.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium">
                      {biodata.address.present.address}, {biodata.address.present.district}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-3">
                <Button
                  onClick={() => handleViewDetails(biodata)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button onClick={() => handleDeleteClick(biodata._id)} variant="destructive" className="flex-1 cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedBiodata?.name}</DialogTitle>
            <DialogDescription className="text-base">
              Age: {selectedBiodata?.age} | Gender: {selectedBiodata?.gender}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(85vh-120px)] pr-4">
            {selectedBiodata && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow label="Height" value={selectedBiodata.personal.height} />
                  <InfoRow label="Marital Status" value={selectedBiodata.personal.maritalStatus} />
                  <InfoRow label="Email" value={selectedBiodata.userId.email} />
                  <InfoRow label="Phone" value={selectedBiodata.userId.phone} />
                  <InfoRow
                    label="Guardian Phone"
                    value={`${selectedBiodata.contactInfo.guardianPhone} (${selectedBiodata.contactInfo.relation})`}
                  />
                  <InfoRow label="Dress Style" value={selectedBiodata.personal.dress} />
                </div>

                <Separator className="my-6" />

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Present Address</p>
                      <p className="text-base">
                        {selectedBiodata.address.present.address}, {selectedBiodata.address.present.upazila},{" "}
                        {selectedBiodata.address.present.district}, {selectedBiodata.address.present.division}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Permanent Address</p>
                      <p className="text-base">
                        {selectedBiodata.address.permanent.address}, {selectedBiodata.address.permanent.upazila},{" "}
                        {selectedBiodata.address.permanent.district}, {selectedBiodata.address.permanent.division}
                      </p>
                    </div>
                    <InfoRow label="Grew Up At" value={selectedBiodata.address.grewUpAt} />
                    <InfoRow label="Country" value={selectedBiodata.address.country} />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Religious Practice */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Religious Practice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Prayer Habit" value={selectedBiodata.personal.prayerHabit} />
                    <InfoRow label="Quran Reading" value={selectedBiodata.personal.quranReading} />
                    <InfoRow label="Fiqh" value={selectedBiodata.personal.fiqh} />
                    <InfoRow label="Maintain Mahram" value={selectedBiodata.personal.maintainMahram} />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Education */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Education</h3>
                  <InfoRow label="Education Method" value={selectedBiodata.education.method} />
                  <div className="mt-4 space-y-3">
                    {selectedBiodata.education.history.map((edu) => (
                      <div key={edu._id} className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-semibold text-base">
                          {edu.level} - {edu.subject}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">
                          Year: {edu.year} | Result: {edu.result}
                        </p>
                      </div>
                    ))}
                  </div>
                  {selectedBiodata.education.other.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Other Education</p>
                      <p className="text-base">{selectedBiodata.education.other.join(", ")}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Occupation */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Occupation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Current Occupation" value={selectedBiodata.occupation.current} />
                    <InfoRow
                      label="Monthly Income"
                      value={`${selectedBiodata.occupation.income.amount} ${selectedBiodata.occupation.income.currency}`}
                    />
                  </div>
                  {selectedBiodata.occupation.description && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-base">{selectedBiodata.occupation.description}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Family */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Father's Profession" value={selectedBiodata.family.fatherProfession} />
                    <InfoRow label="Mother's Profession" value={selectedBiodata.family.motherProfession} />
                    <InfoRow label="Father Status" value={selectedBiodata.family.fatherAlive ? "Alive" : "Not Alive"} />
                    <InfoRow label="Mother Status" value={selectedBiodata.family.motherAlive ? "Alive" : "Not Alive"} />
                    <InfoRow label="Brothers" value={selectedBiodata.family.brothers.toString()} />
                    <InfoRow label="Sisters" value={selectedBiodata.family.sisters.toString()} />
                    <InfoRow label="Financial Status" value={selectedBiodata.family.financialStatus} />
                    <InfoRow label="Religious Practice" value={selectedBiodata.family.religiousPractice} />
                  </div>
                  {selectedBiodata.family.brothersInfo.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Brothers Info</p>
                      <p className="text-base">{selectedBiodata.family.brothersInfo.join(", ")}</p>
                    </div>
                  )}
                  {selectedBiodata.family.sistersInfo.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Sisters Info</p>
                      <p className="text-base">{selectedBiodata.family.sistersInfo.join(", ")}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Partner Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Partner Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Age Range" value={selectedBiodata.preference.ageRange} />
                    <InfoRow label="Height" value={selectedBiodata.preference.height} />
                    <InfoRow label="Complexion" value={selectedBiodata.preference.complexion} />
                    <InfoRow label="Education" value={selectedBiodata.preference.education} />
                    <InfoRow label="Location" value={selectedBiodata.preference.location} />
                    <InfoRow label="Marital Status" value={selectedBiodata.preference.maritalStatus} />
                    <InfoRow label="Profession" value={selectedBiodata.preference.profession} />
                    <InfoRow label="Financial Condition" value={selectedBiodata.preference.financialCondition} />
                  </div>
                  {selectedBiodata.preference.qualities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Desired Qualities</p>
                      <p className="text-base">{selectedBiodata.preference.qualities.join(", ")}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Personal Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Entertainment" value={selectedBiodata.personal.entertainment} />
                    <InfoRow label="Health Issues" value={selectedBiodata.personal.healthIssues || "None"} />
                    <InfoRow label="Special Skills" value={selectedBiodata.personal.specialSkills || "None"} />
                  </div>
                  {selectedBiodata.personal.hobbies.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Hobbies</p>
                      <p className="text-base">{selectedBiodata.personal.hobbies.join(", ")}</p>
                    </div>
                  )}
                  {selectedBiodata.personal.favoriteBooks.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Favorite Books</p>
                      <p className="text-base">{selectedBiodata.personal.favoriteBooks.join(", ")}</p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Marriage Expectations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-600">Marriage Expectations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Guardians Agree" value={selectedBiodata.marriage.guardiansAgree ? "Yes" : "No"} />
                    <InfoRow label="Continue Study" value={selectedBiodata.marriage.studyContinue} />
                    <InfoRow label="Job After Marriage" value={selectedBiodata.marriage.jobStatus} />
                  </div>
                  {selectedBiodata.marriage.reason && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Reason for Marriage</p>
                      <p className="text-base">{selectedBiodata.marriage.reason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the biodata from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AllBiodata
