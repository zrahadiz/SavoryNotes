import {
  HiMail,
  HiUser,
  HiCheck,
  HiX,
  HiClock,
  HiUserGroup,
  HiSearch,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { useEffect, useState } from "react";

import api from "@/api/axios";
import { toast } from "@/lib/toast";
import Loading from "@/components/Loading";

export default function PendingUserInbox() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    prev: null,
    next: null,
    max: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);

  const fetchPendingUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(search && { search }),
      };

      const { data } = await api.get("/users/pending", { params });

      console.log(data);
      setPendingUsers(data.payload.datas || []);
      setPagination(
        data.pagination || {
          total: 0,
          prev: null,
          next: null,
          max: 1,
        }
      );

      if (data.payload.datas.length > 0) {
        setSelectedUser(data.payload.datas[0]);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      toast(
        error.response.data.payload.message || "Failed to load pending users",
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPendingUsers(1, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAction = async (userId, approved) => {
    try {
      setLoadingState(true);
      setLoadingText("Sending responses...");

      const { data } = await api.post("/users/approve", {
        userId,
        approved,
      });

      toast(data.payload.message || "Response has been sent!", {
        type: "success",
      });

      await fetchPendingUsers(currentPage, searchQuery);
    } catch (error) {
      toast(
        error.response.data.payload.message || "Failed to update user status.",
        {
          type: "error",
        }
      );
    } finally {
      setLoadingState(false);
      setLoadingText("");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.max) {
      setCurrentPage(newPage);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (pagination.max <= maxVisiblePages) {
      for (let i = 1; i <= pagination.max; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(pagination.max);
      } else if (currentPage >= pagination.max - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = pagination.max - 3; i <= pagination.max; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(pagination.max);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50">
      <Loading status={loadingState} fullscreen text={loadingText} />
      {/* Header */}
      <div className="bg-linear-to-r from-green-500 to-green-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <HiUserGroup className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  Pending Users
                </h1>
                <p className="text-green-100 text-sm sm:text-base">
                  Review and manage registration requests
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <HiClock className="w-5 h-5" />
              <span className="font-semibold">{pagination.total}</span>
              <span className="text-sm">pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="overflow-y-auto max-h-[600px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      {searchQuery ? "No users found" : "No pending users"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchQuery
                        ? "Try a different search term"
                        : "All registration requests have been reviewed 🎉"}
                    </p>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-100">
                      {pendingUsers.map((user) => (
                        <li
                          key={user._id}
                          onClick={() => setSelectedUser(user)}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:bg-green-50 ${
                            selectedUser?._id === user._id
                              ? "bg-green-50 border-l-4 border-primary"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">
                              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {getInitials(user.name)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(user.createdAt)}
                              </p>
                            </div>
                            {selectedUser?._id === user._id && (
                              <div className="shrink-0">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Pagination */}
                    {pagination.max > 1 && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.prev}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                          >
                            <HiChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                          </button>

                          <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) =>
                              page === "..." ? (
                                <span
                                  key={`ellipsis-${index}`}
                                  className="px-2 text-gray-400"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition cursor-pointer ${
                                    currentPage === page
                                      ? "bg-primary text-white"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            )}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.next}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <HiChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-2">
                          Showing {(currentPage - 1) * limit + 1} to{" "}
                          {Math.min(currentPage * limit, pagination.total)} of{" "}
                          {pagination.total} users
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {!selectedUser ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <HiUser className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Select a user to view details
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Click on a user from the list to review their information
                  </p>
                </div>
              ) : (
                <div>
                  {/* User Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6  pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {getInitials(selectedUser.name)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedUser.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <HiMail className="w-4 h-4" />
                          <span>{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiClock className="w-4 h-4" />
                          <span>{formatDate(selectedUser.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="mb-8">
                    <div className="flex items-start gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="shrink-0 mt-1">
                        <HiUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedUser.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="shrink-0 mt-1">
                        <HiMail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Email Address
                        </p>
                        <p className="text-lg font-semibold text-gray-900 break-all">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="shrink-0 mt-1">
                        <HiClock className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Registration Date
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(selectedUser.createdAt).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "long",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="shrink-0 mt-1">
                        <HiFilter className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Status
                        </p>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                    <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      Action Required
                    </h3>
                    <p className="text-orange-800 mb-6">
                      Please review this user's information carefully before
                      approving or rejecting their registration request.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleAction(selectedUser._id, true)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-hprimary text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg cursor-pointer"
                      >
                        <HiCheck className="w-6 h-6" />
                        <span>Approve User</span>
                      </button>

                      <button
                        onClick={() => handleAction(selectedUser._id, false)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg cursor-pointer"
                      >
                        <HiX className="w-6 h-6" />
                        <span>Reject User</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
