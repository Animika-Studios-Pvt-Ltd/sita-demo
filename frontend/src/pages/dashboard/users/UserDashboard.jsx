import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaShoppingBag, FaShoppingCart, FaClock, FaPlus, FaTrash } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { useAuth0 } from '@auth0/auth0-react';
import getBaseUrl from "../../../../utils/baseURL";

const API_URL = getBaseUrl();

const encodeUID = (uid) => {
  return encodeURIComponent(uid);
};

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last || '?';
};

const getRandomColor = (name) => {
  const colors = ['#bc6430', '#C76F3B', '#A35427', '#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460'];
  const index = (name || '').length % colors.length;
  return colors[index];
};

const AvatarWithInitials = ({ src, firstName, lastName, size = 80 }) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(firstName, lastName);
  const bgColor = getRandomColor(firstName + lastName);
  if (src && !imgError) {
    return (
      <img src={src} alt="Profile" className={`rounded-full object-cover border-4 border-[#C76F3B] shadow-lg`} style={{ width: `${size}px`, height: `${size}px` }} onError={() => setImgError(true)} />
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center border-4 border-[#C76F3B] shadow-lg font-bold text-white" style={{ width: `${size}px`, height: `${size}px`, backgroundColor: bgColor, fontSize: `${size / 2.5}px` }}>
      {initials}
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser, isAuthenticated, updateUserProfile } = useAuth();
  const { getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: { firstName: "", lastName: "" },
    username: "",
    phone: { primary: "", secondary: "" },
    demographics: { dateOfBirth: "", gender: "prefer-not-to-say" }
  });
  const [addressFormData, setAddressFormData] = useState({
    type: "home",
    isDefault: false,
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
    phone: ""
  });

  const getAuthHeaders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email phone"
        }
      });
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    } catch (error) {
      console.error('Error getting token:', error);
      return { headers: { 'Content-Type': 'application/json' } };
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && currentUser?.sub) {
        try {
          const encodedUID = encodeUID(currentUser.sub);
          const config = await getAuthHeaders();
          const response = await axios.get(`${API_URL}/api/users/${encodedUID}`, config);
          setProfile(response.data);
          setFormData({
            name: {
              firstName: response.data.name?.firstName || "",
              lastName: response.data.name?.lastName || ""
            },
            username: response.data.username || "",
            phone: {
              primary: response.data.phone?.primary || "",
              secondary: response.data.phone?.secondary || ""
            },
            demographics: {
              dateOfBirth: response.data.demographics?.dateOfBirth ? new Date(response.data.demographics.dateOfBirth).toISOString().split('T')[0] : "",
              gender: response.data.demographics?.gender || "prefer-not-to-say"
            }
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile({
            name: {
              firstName: currentUser.name?.split(' ')[0] || currentUser.name || "",
              lastName: currentUser.name?.split(' ').slice(1).join(' ') || ""
            },
            email: currentUser.email,
            username: currentUser.nickname,
            avatar: currentUser.picture,
            addresses: []
          });
          setFormData({
            name: {
              firstName: currentUser.name?.split(' ')[0] || currentUser.name || "",
              lastName: currentUser.name?.split(' ').slice(1).join(' ') || ""
            },
            username: currentUser.nickname || "",
            phone: { primary: "", secondary: "" },
            demographics: { dateOfBirth: "", gender: "prefer-not-to-say" }
          });
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [currentUser, isAuthenticated, getAccessTokenSilently]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") {
      setFormData(prev => ({
        ...prev,
        name: { ...prev.name, [name]: value }
      }));
    } else if (name === "primaryPhone" || name === "secondaryPhone") {
      const phoneField = name === "primaryPhone" ? "primary" : "secondary";
      setFormData(prev => ({
        ...prev,
        phone: { ...prev.phone, [phoneField]: value }
      }));
    } else if (name === "dateOfBirth" || name === "gender") {
      setFormData(prev => ({
        ...prev,
        demographics: { ...prev.demographics, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const encodedUID = encodeUID(currentUser.sub);
      const config = await getAuthHeaders();
      await updateUserProfile(currentUser.sub, formData);
      const response = await axios.get(`${API_URL}/api/users/${encodedUID}`, config);
      setProfile(response.data);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your information has been saved successfully.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update your profile. Please try again."
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: {
        firstName: profile?.name?.firstName || "",
        lastName: profile?.name?.lastName || ""
      },
      username: profile?.username || "",
      phone: {
        primary: profile?.phone?.primary || "",
        secondary: profile?.phone?.secondary || ""
      },
      demographics: {
        dateOfBirth: profile?.demographics?.dateOfBirth ? new Date(profile.demographics.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profile?.demographics?.gender || "prefer-not-to-say"
      }
    });
    setIsEditing(false);
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddressId(address._id);
      setAddressFormData({
        type: address.type || "home",
        isDefault: address.isDefault || false,
        fullName: address.fullName || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "India",
        landmark: address.landmark || "",
        phone: address.phone || ""
      });
    } else {
      setEditingAddressId(null);
      setAddressFormData({
        type: "home",
        isDefault: false,
        fullName: `${profile?.name?.firstName || ""} ${profile?.name?.lastName || ""}`.trim(),
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        landmark: "",
        phone: profile?.phone?.primary || ""
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddressId(null);
  };

  const handleSaveAddress = async () => {
    try {
      const encodedUID = encodeUID(currentUser.sub);
      const config = await getAuthHeaders();
      if (editingAddressId) {
        await axios.put(`${API_URL}/api/users/${encodedUID}/addresses/${editingAddressId}`, addressFormData, config);
        Swal.fire({
          icon: "success",
          title: "Address Updated!",
          text: "Your address has been updated successfully.",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await axios.post(`${API_URL}/api/users/${encodedUID}/addresses`, addressFormData, config);
        Swal.fire({
          icon: "success",
          title: "Address Added!",
          text: "Your address has been added successfully.",
          timer: 2000,
          showConfirmButton: false
        });
      }
      const response = await axios.get(`${API_URL}/api/users/${encodedUID}`, config);
      setProfile(response.data);
      closeAddressModal();
    } catch (error) {
      console.error("Error saving address:", error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.response?.data?.message || "Failed to save address. Please try again."
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C76F3B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        const encodedUID = encodeUID(currentUser.sub);
        const config = await getAuthHeaders();
        await axios.delete(`${API_URL}/api/users/${encodedUID}/addresses/${addressId}`, config);
        const response = await axios.get(`${API_URL}/api/users/${encodedUID}`, config);
        setProfile(response.data);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Address has been deleted.",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error deleting address:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete address. Please try again."
        });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-lg sm:text-xl text-red-500 font-semibold">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#bc6430]"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <div className="mt-10">
          <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            Profile Overview
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mt-1 w-40 sm:w-48 mb-8"
          />
        </div>
        <div className="max-w-8xl mx-auto p-4 mt-8 border-[#C76F3B] rounded-xl border-1 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <AvatarWithInitials src={profile?.avatar || currentUser?.picture} firstName={profile?.name?.firstName || profile?.name || currentUser?.name} lastName={profile?.name?.lastName || ""} size={80} />
                <div className="text-center sm:text-left w-full">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">
                    {profile?.name?.firstName || profile?.name || currentUser?.name || "User"} {profile?.name?.lastName || ""}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
                    <FaEnvelope className="text-xs sm:text-sm flex-shrink-0" />
                    <span className="truncate sm:truncate-none break-words max-w-full">{profile?.email || currentUser?.email}</span>
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium shadow-md w-full sm:w-auto text-sm sm:text-base">
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium shadow-md text-sm sm:text-base">
                    <FaSave /> Save
                  </button>
                  <button onClick={handleCancel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 font-medium shadow-md text-sm sm:text-base">
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                    <FaUser className="text-[#bc6430] text-lg sm:text-xl" />Profile Information
                  </h2>
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaEnvelope className="text-gray-500 text-xs sm:text-sm" />Email Address
                      </label>
                      <input type="email" value={profile?.email || currentUser?.email || ""} disabled className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base" />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUser className="text-gray-500 text-xs sm:text-sm" />First Name
                      </label>
                      {isEditing ? (
                        <input type="text" name="firstName" value={formData.name.firstName} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" placeholder="Enter your first name" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">{profile?.name?.firstName || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUser className="text-gray-500 text-xs sm:text-sm" />Last Name
                      </label>
                      {isEditing ? (
                        <input type="text" name="lastName" value={formData.name.lastName} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" placeholder="Enter your last name" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">{profile?.name?.lastName || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUser className="text-gray-500 text-xs sm:text-sm" />Username
                      </label>
                      {isEditing ? (
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" placeholder="Enter your username" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">{profile?.username || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MdPhone className="text-gray-500 text-xs sm:text-sm" />Primary Phone Number
                      </label>
                      {isEditing ? (
                        <input type="tel" name="primaryPhone" value={formData.phone.primary} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" placeholder="Enter your primary phone number" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">{profile?.phone?.primary || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MdPhone className="text-gray-500 text-xs sm:text-sm" />Secondary Phone Number (Optional)
                      </label>
                      {isEditing ? (
                        <input type="tel" name="secondaryPhone" value={formData.phone.secondary} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" placeholder="Enter your secondary phone number" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">{profile?.phone?.secondary || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                      {isEditing ? (
                        <input type="date" name="dateOfBirth" value={formData.demographics.dateOfBirth} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base" />
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium text-sm sm:text-base">
                          {profile?.demographics?.dateOfBirth ? new Date(profile.demographics.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not provided"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                      {isEditing ? (
                        <select name="gender" value={formData.demographics.gender} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent text-sm sm:text-base">
                          <option value="prefer-not-to-say">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-700 font-medium capitalize text-sm sm:text-base">
                          {profile?.demographics?.gender?.replace(/-/g, ' ') || "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - 1 column */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-[#bc6430] to-[#a35528] rounded-xl shadow-lg p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-100 text-sm sm:text-base">Account Type</span>
                      <span className="font-bold uppercase text-xs sm:text-sm">{profile?.role || "User"}</span>
                    </div>
                    <div className="border-t border-orange-300 pt-3">
                      <div className="flex items-center gap-2 text-orange-100 mb-1">
                        <FaClock className="text-xs sm:text-sm" />
                        <span className="text-xs sm:text-sm">Member Since</span>
                      </div>
                      <p className="font-semibold text-sm sm:text-base">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/orders" className="w-full flex items-center gap-3 px-3 no-underline sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors text-left group">
                      <FaShoppingBag className="text-[#bc6430] text-base sm:text-lg group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">View Orders</span>
                    </Link>
                    <Link to="/cart" className="w-full flex items-center gap-3 px-3 no-underline sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors text-left group">
                      <FaShoppingCart className="text-[#bc6430] text-base sm:text-lg group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">View Cart</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#bc6430] text-lg sm:text-xl" />
                    Saved Addresses
                  </h2>
                  <button onClick={() => openAddressModal()} className="flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-4 sm:px-5 py-2.5 rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md">
                    <FaPlus className="text-xs" /> Add Address
                  </button>
                </div>
                {profile?.addresses && profile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((address) => (
                      <div key={address._id} className="border-1 border-gray-200 rounded-xl p-5 hover:border-[#bc6430] hover:shadow-md transition-all relative bg-white">
                        {address.isDefault && (
                          <span className="absolute top-3 right-3 bg-[#C76F3B] text-white text-xs px-3 py-1 rounded-full font-medium">Default</span>
                        )}
                        <div className="mb-4 pr-20">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{address.fullName}</h3>
                          <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#bc6430] text-xs" />
                            {address.type} Address
                          </p>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="grid grid-cols-1 gap-1">
                            <p className="text-sm text-gray-700 font-medium">{address.addressLine1}</p>
                            {address.addressLine2 && (
                              <p className="text-sm text-gray-700">{address.addressLine2}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
                              <p className="text-sm text-gray-800 font-medium">{address.city}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">State</p>
                              <p className="text-sm text-gray-800 font-medium">{address.state}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">PIN Code</p>
                              <p className="text-sm text-gray-800 font-medium">{address.postalCode}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                              <p className="text-sm text-gray-800 font-medium">{address.country}</p>
                            </div>
                          </div>
                          {address.landmark && (
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Landmark</p>
                              <p className="text-sm text-gray-700">{address.landmark}</p>
                            </div>
                          )}
                          {address.phone && (
                            <div className="pt-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                              <p className="text-sm text-gray-800 font-medium flex items-center gap-1">
                                <MdPhone className="text-[#bc6430]" />
                                {address.phone}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button onClick={() => openAddressModal(address)} className="flex-1 flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md">
                            <FaEdit className="text-sm" />
                            <span>Edit</span>
                          </button>
                          <button onClick={() => handleDeleteAddress(address._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md">
                            <FaTrash className="text-sm" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-1 border-dashed border-gray-300">
                    <FaMapMarkerAlt className="text-5xl mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium text-gray-600">No addresses saved yet</p>
                    <p className="text-sm text-gray-500 mt-1">Click "Add Address" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
                <button onClick={closeAddressModal} className="text-gray-500 hover:text-gray-700 text-2xl"><FaTimes /></button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type</label>
                  <select name="type" value={addressFormData.type} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent">
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="fullName" value={addressFormData.fullName} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="Enter full name" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={addressFormData.phone} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="Enter phone number" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1</label>
                  <input type="text" name="addressLine1" value={addressFormData.addressLine1} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="House No., Building Name" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2 (Optional)</label>
                  <input type="text" name="addressLine2" value={addressFormData.addressLine2} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="Road Name, Area, Colony" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark (Optional)</label>
                  <input type="text" name="landmark" value={addressFormData.landmark} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="Near famous place" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input type="text" name="city" value={addressFormData.city} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="City" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input type="text" name="state" value={addressFormData.state} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="State" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={addressFormData.postalCode} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="PIN Code" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input type="text" name="country" value={addressFormData.country} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent" placeholder="Country" required />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="isDefault" checked={addressFormData.isDefault} onChange={handleAddressInputChange} className="w-5 h-5 text-[#bc6430] focus:ring-[#bc6430] rounded" />
                  <label className="text-sm font-medium text-gray-700">Set as default address</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveAddress} className="flex-1 flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium">
                  <FaSave /> {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
                <button onClick={closeAddressModal} className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium">
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
