import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

const CUISINE_OPTIONS = ['Indian', 'Italian', 'Chinese', 'Cafe', 'Fast Food', 'Dessert', 'Healthy', 'Continental'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    subscriptionPlan: 'free',
    restaurantName: '',
    ownerName: '',
    email: '',
    mobileNumber: '',
    cuisineType: [],
    password: '',
    repeatPassword: '',

    // Step 2
    gstin: '',
    fssaiLicense: '',
    businessPan: '',
    street: '',
    locality: '',
    cityPincode: '',
    mapPin: ''
  });

  const [files, setFiles] = useState({
    fssaiCertificate: null,
    panCard: null,
    bankPassbook: null,
    shopPhoto: null,
    restaurantLogo: null,
    // menuImages: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-scroll to top when error occurs so the user sees it
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  // Auto-scroll to top when moving between steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCuisineToggle = (cuisine) => {
    setFormData((prev) => {
      if (prev.cuisineType.includes(cuisine)) {
        return { ...prev, cuisineType: prev.cuisineType.filter((c) => c !== cuisine) };
      }
      return { ...prev, cuisineType: [...prev.cuisineType, cuisine] };
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    // if (name === 'menuImages') {
    //   setFiles({ ...files, [name]: Array.from(selectedFiles) });
    // } else {
    setFiles({ ...files, [name]: selectedFiles[0] });
    // }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.restaurantName || !formData.ownerName || !formData.email || !formData.password || !formData.repeatPassword || !formData.mobileNumber) {
      setError('Please fill all required fields in Step 1.');
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    // Validate mandatory files
    if (!files.panCard || !files.bankPassbook || !files.shopPhoto || !files.fssaiCertificate) {
      setError('Please upload all mandatory documents (PAN Card, Bank Passbook, Shop Photo, FSSAI Certificate).');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'repeatPassword') return;
        if (key === 'cuisineType') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (files.fssaiCertificate) data.append('fssaiCertificate', files.fssaiCertificate);
      if (files.panCard) data.append('panCard', files.panCard);
      if (files.bankPassbook) data.append('bankPassbook', files.bankPassbook);
      if (files.shopPhoto) data.append('shopPhoto', files.shopPhoto);
      if (files.restaurantLogo) data.append('restaurantLogo', files.restaurantLogo);
      // if (files.menuImages && files.menuImages.length > 0) {
      //   files.menuImages.forEach(file => data.append('menuImages', file));
      // }

      const response = await fetch('/api/restaurants/register', {
        method: 'POST',
        body: data
      });
      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted</h2>
          <p className="text-gray-600 mb-8">
            Your details have been sent to our team. We will review your application and approve it shortly.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="text-3xl font-extrabold text-gray-900">Partner with MenuBaran</h1>
          <p className="text-gray-500 mt-2">Digitalize your restaurant in minutes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold transition-colors ${step >= 1 ? 'bg-amber-600' : 'bg-gray-300'}`}>1</div>
            <div className={`w-16 h-1 transition-colors ${step >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold transition-colors ${step >= 2 ? 'bg-amber-600' : 'bg-gray-300'}`}>2</div>
          </div>

          {error && (<div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">⚠️ {error}</div>)}

          <form onSubmit={(e) => step === 1 ? nextStep(e) : handleSubmit(e)} className="space-y-6">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Subscription Plan */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Subscription Plan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <div className="border-2 border-amber-500 bg-amber-50 rounded-xl p-4 cursor-pointer relative shadow-sm">
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">Selected</div>
                      <h3 className="font-bold text-lg text-gray-900">Free</h3>
                      <p className="text-sm text-gray-600 mb-2">3 Months Trial</p>
                      <div className="text-2xl font-extrabold text-amber-600">₹0</div>
                      <ul className="mt-4 text-sm text-gray-600 space-y-1">
                        <li>✔️ Full feature access</li>
                        <li>✔️ Priority setup</li>
                        <li>✔️ Email support</li>
                      </ul>
                    </div>

                    {/* Gold Plan */}
                    <div className="border-2 border-gray-200 opacity-60 bg-gray-50 rounded-xl p-4 relative cursor-not-allowed">
                      <div className="absolute top-0 right-0 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">Coming Soon</div>
                      <h3 className="font-bold text-lg text-gray-900">Gold</h3>
                      <p className="text-sm text-gray-600 mb-2">6 Months</p>
                      <div className="text-2xl font-extrabold text-gray-500">₹500</div>
                      <ul className="mt-4 text-sm text-gray-600 space-y-1">
                        <li>✔️ Priority support</li>
                        <li>✔️ Advanced analytics</li>
                        <li>✔️ Marketing tools</li>
                      </ul>
                    </div>

                    {/* Diamond Plan */}
                    <div className="border-2 border-gray-200 opacity-60 bg-gray-50 rounded-xl p-4 relative cursor-not-allowed">
                      <div className="absolute top-0 right-0 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">Coming Soon</div>
                      <h3 className="font-bold text-lg text-gray-900">Diamond</h3>
                      <p className="text-sm text-gray-600 mb-2">1 Year</p>
                      <div className="text-2xl font-extrabold text-gray-500">₹750</div>
                      <ul className="mt-4 text-sm text-gray-600 space-y-1">
                        <li>✔️ 24/7 Phone support</li>
                        <li>✔️ Custom integrations</li>
                        <li>✔️ Dedicated manager</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mt-8">Basic Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name *</label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="The Spice Garden"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Owner/Manager Name *</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine Type (Select multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_OPTIONS.map((cuisine) => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => handleCuisineToggle(cuisine)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition ${formData.cuisineType.includes(cuisine)
                          ? 'bg-amber-100 border-amber-500 text-amber-800'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Repeat Password *</label>
                    <input
                      type="password"
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition flex justify-center items-center gap-2"
                >
                  Continue to Step 2 ➡️
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">

                {/* Legal Identifiers */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Legal Identifiers (Mandatory)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number *</label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="GSTIN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">FSSAI License *</label>
                      <input
                        type="text"
                        name="fssaiLicense"
                        value={formData.fssaiLicense}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="FSSAI Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business PAN *</label>
                      <input
                        type="text"
                        name="businessPan"
                        value={formData.businessPan}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="PAN Number"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Address */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Physical Address (Mandatory)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="123 Food Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Locality/Area *</label>
                        <input
                          type="text"
                          name="locality"
                          value={formData.locality}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                          placeholder="Downtown"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City & Pincode *</label>
                        <input
                          type="text"
                          name="cityPincode"
                          value={formData.cityPincode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                          placeholder="Mumbai, 400001"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Map Pin (Geolocation URL) *</label>
                      <input
                        type="text"
                        name="mapPin"
                        value={formData.mapPin}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Document Uploads */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Document Uploads (Mandatory)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">FSSAI Certificate (PDF/JPEG) *</label>
                      <input
                        type="file"
                        name="fssaiCertificate"
                        onChange={handleFileChange}
                        accept="image/jpeg,application/pdf"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business/Personal PAN Card (PDF/JPEG) *</label>
                      <input
                        type="file"
                        name="panCard"
                        onChange={handleFileChange}
                        accept="image/jpeg,application/pdf"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Passbook/Cancelled Cheque (PDF/JPEG) *</label>
                      <input
                        type="file"
                        name="bankPassbook"
                        onChange={handleFileChange}
                        accept="image/jpeg,application/pdf"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Photo (JPEG/PNG) *</label>
                      <input
                        type="file"
                        name="shopPhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Logo (Square preferred) (Optional)</label>
                      <input
                        type="file"
                        name="restaurantLogo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                  >
                    ⬅️ Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {loading && <LoadingSpinner size="sm" />}
                    {loading ? 'Submitting...' : 'Submit All'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            Already registered?{' '}
            <button onClick={() => navigate('/staff/login')} className="font-semibold text-amber-600 hover:text-amber-500 transition">
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
