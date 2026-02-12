import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaShoppingBag, FaShoppingCart, FaClock, FaPlus, FaTrash } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { useAuth0 } from '@auth0/auth0-react';
import getBaseUrl from "../../../utils/baseURL";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mt-6 mb-12 text-center">
        <h2 className="sita-main-heading">
          Profile Overview
        </h2>
        <img
          src="/sita-motif.webp"
          alt="Sita Motif"
          className="mx-auto mb-8 motif"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-28 bg-gradient-to-r from-[#bc6430] to-[#8B4513]"></div>
            <div className="px-6 pb-6 text-center -mt-12 relative z-10">
              <div className="inline-block rounded-full p-1 bg-white mb-3 shadow-md">
                <AvatarWithInitials src={profile?.avatar || currentUser?.picture} firstName={profile?.name?.firstName || profile?.name || currentUser?.name} lastName={profile?.name?.lastName || ""} size={90} />
              </div>

              <h3 className="text-xl font-bold text-gray-800 break-words mb-1">
                {profile?.name?.firstName || profile?.name || currentUser?.name || "User"} {profile?.name?.lastName || ""}
              </h3>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-6">
                <FaEnvelope className="text-[#bc6430] text-xs" />
                <span className="truncate max-w-[200px]">{profile?.email || currentUser?.email}</span>
              </p>

              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white py-2.5 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm">
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white py-2.5 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm">
                    <FaSave /> Save
                  </button>
                  <button onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm">
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-br from-[#bc6430] to-[#a35528] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaUser size={100} />
            </div>
            <h3 className="text-lg font-semibold mb-4 relative z-10">Account Status</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <span className="text-orange-100 text-sm">Account Type</span>
                <span className="font-bold uppercase text-xs bg-white text-[#bc6430] px-2 py-1 rounded">{profile?.role || "User"}</span>
              </div>
              <div className="pt-2 border-t border-white/20">
                <div className="flex items-center gap-2 text-orange-100 mb-1">
                  <FaClock className="text-xs" />
                  <span className="text-xs">Member Since</span>
                </div>
                <p className="text-white">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/my-orders" className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors group no-underline">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#bc6430] group-hover:scale-110 transition-transform">
                  <FaShoppingBag />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-[#bc6430] transition-colors">View Orders</span>
              </Link>
              <Link to="/cart" className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors group no-underline">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#bc6430] group-hover:scale-110 transition-transform">
                  <FaShoppingCart />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-[#bc6430] transition-colors">View Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h4 className="sita-sub-heading flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#bc6430]">
                <FaUser size={18} />
              </span>
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block sita-label-text text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input type="email" value={profile?.email || currentUser?.email || ""} disabled className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed sita-body-text" />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">Email address cannot be changed for security reasons.</p>
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input type="text" name="firstName" value={formData.name.firstName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" placeholder="First Name" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">{profile?.name?.firstName || "Not provided"}</div>
                )}
              </div>
              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input type="text" name="lastName" value={formData.name.lastName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" placeholder="Last Name" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">{profile?.name?.lastName || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Username</label>
                {isEditing ? (
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" placeholder="Username" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">{profile?.username || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input type="date" name="dateOfBirth" value={formData.demographics.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">
                    {profile?.demographics?.dateOfBirth ? new Date(profile.demographics.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Primary Phone</label>
                {isEditing ? (
                  <input type="tel" name="primaryPhone" value={formData.phone.primary} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" placeholder="Primary Phone" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">{profile?.phone?.primary || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Secondary Phone</label>
                {isEditing ? (
                  <input type="tel" name="secondaryPhone" value={formData.phone.secondary} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text" placeholder="Secondary Phone (Optional)" />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 sita-body-text">{profile?.phone?.secondary || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block sita-label-text text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select name="gender" value={formData.demographics.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#bc6430]/10 focus:border-[#bc6430] transition-all sita-body-text">
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 capitalize sita-body-text">
                    {profile?.demographics?.gender?.replace(/-/g, ' ') || "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h4 className="sita-sub-heading flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#bc6430]">
                  <FaMapMarkerAlt size={18} />
                </span>
                Saved Addresses
              </h4>
              <button onClick={() => openAddressModal()} className="flex items-center gap-2 bg-[#C76F3B] hover:bg-[#A35427] text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <FaPlus className="text-xs" /> Add New
              </button>
            </div>

            {profile?.addresses && profile.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.addresses.map((address) => (
                  <div key={address._id} className="group border border-gray-200 rounded-2xl p-6 hover:border-[#bc6430] hover:shadow-lg transition-all duration-300 relative bg-white flex flex-col h-full">
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 bg-[#C76F3B] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider shadow-sm">Default</span>
                    )}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#bc6430] text-xs">
                          <FaMapMarkerAlt />
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{address.type}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">{address.fullName}</h3>
                    </div>

                    <div className="space-y-1 mb-6 flex-grow">
                      <p className="text-gray-600 leading-relaxed text-sm">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-gray-600 leading-relaxed text-sm">{address.addressLine2}</p>}
                      <p className="text-gray-800 font-medium mt-2 text-sm">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p className="text-gray-500 text-sm">{address.country}</p>

                      {address.phone && (
                        <div className="pt-3 mt-3 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-600">
                          <MdPhone className="text-[#bc6430]" /> {address.phone}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openAddressModal(address)} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#C76F3B] text-gray-700 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(address._id)} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 group hover:border-[#bc6430]/30 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300 group-hover:text-[#bc6430] transition-colors">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-1">No addresses saved yet</h5>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Add your delivery addresses here to make checkout faster and easier.</p>
                <button onClick={() => openAddressModal()} className="inline-flex items-center gap-2 text-[#bc6430] font-semibold hover:underline">
                  <FaPlus className="text-xs" /> Add your first address
                </button>
              </div>
            )}
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
                  <label className="block sita-label-text text-gray-700 mb-2">Address Type</label>
                  <select name="type" value={addressFormData.type} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text">
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block sita-label-text text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="fullName" value={addressFormData.fullName} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="Enter full name" required />
                </div>
                <div>
                  <label className="block sita-label-text text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={addressFormData.phone} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="Enter phone number" required />
                </div>
                <div>
                  <label className="block sita-label-text text-gray-700 mb-2">Address Line 1</label>
                  <input type="text" name="addressLine1" value={addressFormData.addressLine1} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="House No., Building Name" required />
                </div>
                <div>
                  <label className="block sita-label-text text-gray-700 mb-2">Address Line 2 (Optional)</label>
                  <input type="text" name="addressLine2" value={addressFormData.addressLine2} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="Road Name, Area, Colony" />
                </div>
                <div>
                  <label className="block sita-label-text text-gray-700 mb-2">Landmark (Optional)</label>
                  <input type="text" name="landmark" value={addressFormData.landmark} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="Near famous place" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block sita-label-text text-gray-700 mb-2">City</label>
                    <input type="text" name="city" value={addressFormData.city} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="City" required />
                  </div>
                  <div>
                    <label className="block sita-label-text text-gray-700 mb-2">State</label>
                    <input type="text" name="state" value={addressFormData.state} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="State" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block sita-label-text text-gray-700 mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={addressFormData.postalCode} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="PIN Code" required />
                  </div>
                  <div>
                    <label className="block sita-label-text text-gray-700 mb-2">Country</label>
                    <input type="text" name="country" value={addressFormData.country} onChange={handleAddressInputChange} className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bc6430] focus:border-transparent sita-body-text" placeholder="Country" required />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="isDefault" checked={addressFormData.isDefault} onChange={handleAddressInputChange} className="w-5 h-5 text-[#bc6430] focus:ring-[#bc6430] rounded" />
                  <label className="sita-body-text font-medium text-gray-700">Set as default address</label>
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
      )
      }
    </div >
  );
};

export default UserDashboard;
