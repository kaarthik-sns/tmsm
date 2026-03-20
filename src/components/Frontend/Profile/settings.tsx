'use client';

import { useState } from 'react';
import { signOut } from "next-auth/react";
import Swal from 'sweetalert2';
import { TriangleAlert, Lock, Eye, EyeOff, LogOut, Power } from "lucide-react";

type ChangePasswordProps = {
  myId: string;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ myId }) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'password' | 'account'>('password');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    id: myId,
    is_admin: "false",
  });

  const validatePassword = (password: string): string | null => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return lang === 'ta'
        ? "குறைந்தபட்சம் 6 எழுத்துகள், பெரிய, சிறிய, எண், சிறப்பு எழுத்து வேண்டும்"
        : "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.";
    }
    return null;
  };

  const handleDeactivateAccount = async () => {
    const { value: reason } = await Swal.fire({
      title: lang === 'ta' ? "நிச்சயமாகவா?" : "Are you sure?",
      text: lang === 'ta'
        ? "செயலிழக்கச் செய்தவுடன், நீங்கள் வெளியேற்றப்படுவீர்கள், மேலும் நிர்வாகி அனுமதிக்கும் வரை உங்களால் உள்நுழைய முடியாது."
        : "Once deactivated, you'll be logged out and can't log in until admin approval.",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: lang === 'ta' ? "செயலிழக்கச் செய்வதற்கான காரணத்தை உள்ளிடவும்..." : "Enter the reason for deactivation...",
      inputAttributes: { required: "true" },
      showCancelButton: true,
      confirmButtonText: lang === 'ta' ? "ஆம், செயலிழக்கச் செய்!" : "Yes, deactivate it!",
      cancelButtonText: lang === 'ta' ? "இல்லை, ரத்து செய்" : "No, cancel",
      customClass: { confirmButton: "confirm-color", cancelButton: "cancel-color" },
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage(lang === 'ta' ? "நீங்கள் காரணத்தை உள்ளிட வேண்டும்." : "You must enter a reason for deactivation.");
        }
        return inputValue;
      },
    });

    if (reason) {
      setPending(true);
      const res = await fetch(`/api/update-user-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: myId, is_active: false, reason }),
      });

      const data = await res.json();

      if (res.ok) {
        setPending(false);
        Swal.fire({
          title: lang === 'ta' ? "செயலிழக்கப்பட்டது!" : "Deactivated!",
          text: lang === 'ta' ? "உங்கள் கணக்கு செயலிழக்கப்பட்டது." : "Your account has been deactivated.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: { confirmButton: "confirm-color" },
        });
        signOut();
      } else {
        setPending(false);
        Swal.fire("Error", data.message, "error");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "password") {
        setPasswordError(validatePassword(value));
        if (updated.confirmPassword && updated.confirmPassword !== value) {
          setConfirmPasswordError(lang === 'ta' ? "கடவுச்சொற்கள் பொருந்தவில்லை." : "Passwords do not match.");
        } else {
          setConfirmPasswordError(null);
        }
      }
      if (name === "confirmPassword") {
        setConfirmPasswordError(updated.password !== value ? (lang === 'ta' ? "கடவுச்சொற்கள் பொருந்தவில்லை." : "Passwords do not match.") : null);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccessMessage("");

    let valid = true;
    if (!form.password) {
      setPasswordError(lang === 'ta' ? "கடவுச்சொல் காலியாக இருக்கக்கூடாது." : "Password cannot be empty.");
      valid = false;
    } else {
      setPasswordError(validatePassword(form.password));
    }

    if (!form.confirmPassword) {
      setConfirmPasswordError(lang === 'ta' ? "கடவுச்சொல்லை உறுதியற்ற காலியாக இருக்கக்கூடாது." : "Confirm Password cannot be empty.");
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      setConfirmPasswordError(lang === 'ta' ? "கடவுச்சொற்கள் பொருந்தவில்லை." : "Passwords do not match.");
      valid = false;
    }

    if (!valid) {
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/change-password-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordError(null);
        setConfirmPasswordError(null);
        setForm({ ...form, password: "", confirmPassword: "" });
        setSuccessMessage(lang === 'ta' ? "உங்கள் கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." : "Your password has been updated successfully.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error, please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Premium Container Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all duration-200 border-b-2 ${
              activeTab === 'password' 
                ? 'border-[#923d27] text-[#923d27]' 
                : 'border-transparent text-gray-500 hover:text-[#923d27] hover:bg-white'
            }`}
          >
            {lang === 'ta' ? 'கடவுச்சொல்லை மாற்றவும்' : 'Change Password'}
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all duration-200 border-b-2 ${
              activeTab === 'account' 
                ? 'border-[#923d27] text-[#923d27]' 
                : 'border-transparent text-gray-500 hover:text-[#923d27] hover:bg-white'
            }`}
          >
            {lang === 'ta' ? 'கணக்கு அமைப்புகள்' : 'Account Settings'}
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {activeTab === 'password' ? (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#653D27]">
                  {lang === 'ta' ? 'கடவுச்சொல்லைப் புதுப்பிக்கவும்' : 'Update Your Password'}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {lang === 'ta' ? 'உங்கள் கணக்கைப் பாதுகாக்க வலுவான கடவுச்சொல்லைப் பயன்படுத்தவும்.' : 'Use a strong password to protect your account.'}
                </p>
              </div>

              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-x-3 text-sm text-green-700 animate-in fade-in slide-in-from-top-2">
                  <p>{successMessage}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-x-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                  <TriangleAlert className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-[#653D27] flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {lang === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password'}
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full rounded-xl border-2 ${
                        passwordError ? "border-red-300 focus:border-red-500" : "border-gray-100 focus:border-[#FFD16C]"
                      } bg-gray-50/30 py-4 pl-5 pr-12 text-black text-sm sm:text-base transition-all duration-200 outline-none focus:bg-white focus:ring-4 focus:ring-[#FFD16C]/10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#923d27] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-red-600 text-xs font-medium pl-1">{passwordError}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-[#653D27] flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {lang === 'ta' ? 'கடவுச்சொல்லை உறுதியற்றவும்' : 'Confirm Password'}
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full rounded-xl border-2 ${
                        confirmPasswordError ? "border-red-300 focus:border-red-500" : "border-gray-100 focus:border-[#FFD16C]"
                      } bg-gray-50/30 py-4 pl-5 pr-12 text-black text-sm sm:text-base transition-all duration-200 outline-none focus:bg-white focus:ring-4 focus:ring-[#FFD16C]/10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#923d27] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPasswordError && <p className="text-red-600 text-xs font-medium pl-1">{confirmPasswordError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-[#FFD16C] hover:bg-[#ffc645] text-[#653D27] font-extrabold py-4 rounded-xl shadow-lg shadow-[#FFD16C]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base sm:text-lg"
                >
                  {pending ? (
                    <div className="w-6 h-6 border-4 border-[#653D27]/20 border-t-[#653D27] rounded-full animate-spin" />
                  ) : (
                    <>
                      {lang === 'ta' ? 'கடவுச்சொல்லை மாற்றவும்' : 'Update Password'}
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 py-4">
              <div className="flex flex-col space-y-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#653D27]">
                  {lang === 'ta' ? 'கணக்கு மேலாண்மை' : 'Account Management'}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {lang === 'ta' ? 'உங்கள் கணக்கு அணுகல் மற்றும் நிலையை நிர்வகிக்கவும்.' : 'Manage your account access and status.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: lang === 'ta' ? 'வெளியேற விரும்புகிறீர்களா?' : 'Are you sure?',
                      text: lang === 'ta' ? 'நீங்கள் உண்மையில் வெளியேற விரும்புகிறீர்களா?' : 'Do you want to logout?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: lang === 'ta' ? 'ஆம், வெளியேறு' : 'Yes, logout',
                      cancelButtonText: lang === 'ta' ? 'இல்லை, ரத்து செய்' : 'No, cancel',
                      customClass: { confirmButton: 'confirm-color', cancelButton: 'cancel-color' },
                    });
                    if (result.isConfirmed) {
                      signOut({ callbackUrl: '/login' });
                    }
                  }}
                  className="group flex flex-col items-start p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-[#FFD16C] transition-all duration-300 hover:shadow-lg text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFD16C] transition-colors">
                    <LogOut className="w-6 h-6 text-gray-600 group-hover:text-[#653D27]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#653D27] mb-1">
                    {lang === 'ta' ? 'வெளியேறு' : 'Logout Account'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {lang === 'ta' ? 'இந்தச் சாதனத்திலிருந்து பாதுகாப்பாக வெளியேறவும்.' : 'Securely sign out of your account from this device.'}
                  </p>
                </button>

                <button
                  onClick={handleDeactivateAccount}
                  className="group flex flex-col items-start p-6 rounded-2xl border-2 border-red-50 bg-red-50/30 hover:border-red-200 transition-all duration-300 hover:shadow-lg text-left"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                    <Power className="w-6 h-6 text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-red-600 mb-1">
                    {lang === 'ta' ? 'கணக்கை செயலிழக்கச் செய்யவும்' : 'Deactivate Account'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {lang === 'ta' ? 'நிர்வாகியால் அங்கீகரிக்கப்படும் வரை உங்கள் கணக்கைத் தற்காலிகமாக முடக்குங்கள்.' : 'Temporarily disable your account until approved by an admin.'}
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFD16C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#AF2C2C] rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ChangePassword;
