"use client";
import { getCookie } from "@/utils/getToken";
import axios from "axios";
import {
  Eye,
  Filter,
  Search,
  X,
  Check,
  Clock,
  User,
  Calendar,
  CreditCard,
  Mail,
  Shield,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
interface UserId {
  _id: string;
  email: string;
  role: string;
}

interface Payment {
  _id: string;
  approvalStatus: "approved" | "pending" | "rejected";
  createdAt: string;
  durationInMonths: number;
  name: string;
  paidAmount: number;
  paymentDate: string;
  subscriptionType: string;
  updatedAt: string;
  userId: UserId;
  __v: number;
}

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [approving, setApproving] = useState<string | null>(null);

  // const {token} = useAuth()
  const token = getCookie("token");
  // console.log(token)
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          timeout: 10000,
        }
      );
      setPayments(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (paymentId: string) => {
    try {
      setApproving(paymentId);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/approve/${paymentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      // Update local state
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, approvalStatus: "approved" as const }
            : payment
        )
      );

      // Update modal if it's open
      if (selectedPayment && selectedPayment._id === paymentId) {
        setSelectedPayment({ ...selectedPayment, approvalStatus: "approved" });
      }
      toast.success("Payment approved success");
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment. Please try again.");
    } finally {
      setApproving(null);
    }
  };

  const openModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <X className="w-3 h-3" />;
    }
  };

  // Filter payments based on search and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment?.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || payment.approvalStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Management
        </h2>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Plan
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Duration
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {payment.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {payment?.userId?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">
                    ৳{payment.paidAmount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-medium">
                      {payment.subscriptionType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {payment.durationInMonths} months
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(payment.paymentDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        payment.approvalStatus
                      )}`}
                    >
                      {getStatusIcon(payment.approvalStatus)}
                      {payment.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(payment)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {payment.approvalStatus === "pending" && (
                        <button
                          onClick={() => approvePayment(payment._id)}
                          disabled={approving === payment._id}
                          className="text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-colors disabled:opacity-50"
                          title="Approve Payment"
                        >
                          {approving === payment._id ? (
                            <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {payment.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {payment?.userId?.email}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    payment.approvalStatus
                  )}`}
                >
                  {getStatusIcon(payment.approvalStatus)}
                  {payment.approvalStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <p className="font-semibold text-emerald-600">
                    ${payment.paidAmount}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Plan:</span>
                  <p className="font-medium capitalize">
                    {payment.subscriptionType}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium">
                    {payment.durationInMonths} months
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">
                    {formatDate(payment.paymentDate)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openModal(payment)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {payment.approvalStatus === "pending" && (
                  <button
                    onClick={() => approvePayment(payment._id)}
                    disabled={approving === payment._id}
                    className="text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-colors disabled:opacity-50"
                  >
                    {approving === payment._id ? (
                      <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No payment records available at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Payment Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      selectedPayment.approvalStatus
                    )}`}
                  >
                    {getStatusIcon(selectedPayment.approvalStatus)}
                    {selectedPayment.approvalStatus.toUpperCase()}
                  </span>
                </div>

                {selectedPayment.approvalStatus === "pending" && (
                  <button
                    onClick={() => approvePayment(selectedPayment._id)}
                    disabled={approving === selectedPayment._id}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {approving === selectedPayment._id ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approve Payment
                  </button>
                )}
              </div>

              {/* User Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{selectedPayment.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedPayment?.userId?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">User ID</label>
                    <p className="font-mono text-sm text-gray-600">
                      {selectedPayment.userId._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {selectedPayment.userId.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Amount Paid</label>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${selectedPayment.paidAmount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Subscription Type
                    </label>
                    <p className="font-medium capitalize">
                      {selectedPayment.subscriptionType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Duration</label>
                    <p className="font-medium">
                      {selectedPayment.durationInMonths} months
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Payment ID</label>
                    <p className="font-mono text-sm text-gray-600">
                      {selectedPayment._id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Payment Date
                    </label>
                    <p className="font-medium">
                      {formatDate(selectedPayment.paymentDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Created At</label>
                    <p className="font-medium">
                      {formatDate(selectedPayment.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Last Updated
                    </label>
                    <p className="font-medium">
                      {formatDate(selectedPayment.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
