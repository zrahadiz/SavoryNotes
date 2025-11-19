import { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "@/lib/toast";
import {
  HiMail,
  HiUser,
  HiCheck,
  HiX,
  HiClock,
  HiUserGroup,
  HiSearch,
  HiFilter,
} from "react-icons/hi";

export default function PendingUserInbox() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/pending");

      setPendingUsers(data.payload.datas || []);
      if (data.payload.datas.length > 0) {
        setSelectedUser(data.payload.datas[0]);
      }
    } catch (error) {
      console.error(error.response || "Failed to fetch");
      toast(error.response.data.payload.message || "Failed to fetch", {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAction = async (userId, approved) => {
    try {
      setActionLoading(true);

      const { data } = await api.post("/users/approve", {
        userId,
        approved,
      });

      toast(data.payload.message || "Respond Sent Successfully", {
        type: "success",
      });

      const updatedUsers = pendingUsers.filter((u) => u._id !== userId);
      setPendingUsers(updatedUsers);

      if (updatedUsers.length > 0) {
        setSelectedUser(updatedUsers[0]);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error(error.response || "Failed to fetch");
      toast(error.response.data.payload.message || "Failed to response", {
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter users by search query
  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <HiUserGroup className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Pending Users</h1>
                <p className="text-orange-100 mt-1">
                  Review and manage registration requests
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <HiClock className="w-5 h-5" />
              <span className="font-semibold">{pendingUsers.length}</span>
              <span className="text-sm">pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL — USER LIST */}
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
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 outline-none transition"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="overflow-y-auto max-h-[600px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
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
                  <ul className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <li
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:bg-orange-50 ${
                          selectedUser?._id === user._id
                            ? "bg-orange-50 border-l-4 border-orange-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
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
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — USER DETAILS */}
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
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
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
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <HiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          Full Name
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 ml-13">
                        {selectedUser.name}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <HiMail className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          Email Address
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 ml-13 break-all">
                        {selectedUser.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <HiClock className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          Registration Date
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 ml-13">
                        {new Date(selectedUser.createdAt).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "long",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <HiFilter className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Status</h3>
                      </div>
                      <div className="ml-13">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <HiClock className="w-4 h-4" />
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleAction(selectedUser._id, true)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                      >
                        {actionLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <HiCheck className="w-6 h-6" />
                            <span>Approve User</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleAction(selectedUser._id, false)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                      >
                        {actionLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <HiX className="w-6 h-6" />
                            <span>Reject User</span>
                          </>
                        )}
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
