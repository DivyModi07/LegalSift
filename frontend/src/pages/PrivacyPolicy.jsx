import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              Privacy Policy
            </h1>
          </div>

          {/* Content Card */}
          <div className="card p-8 md:p-10">
            <div className="prose max-w-none prose-neutral">
              <p className="mb-6">
                Welcome to LegalSift. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>

              <h2 className="font-bold">1. Information We Collect</h2>
              <p className="mb-6">
                We may collect personal information that you provide to us directly, such as your name, email address, and phone number when you register for an account. We also collect the content of the complaints you submit for analysis.
              </p>

              <h2 className="font-bold">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="mb-6">
                <li>Provide, operate, and maintain our services.</li>
                <li>Analyze the complaints you submit to provide legal insights.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the application.</li>
                <li>Send you emails and other communications.</li>
              </ul>

              <h2 className="font-bold">3. Disclosure of Your Information</h2>
              <p className="mb-6">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. The content of your complaints is processed by our secure machine learning models and is not shared with third parties.
              </p>

              <h2 className="font-bold">4. Data Security</h2>
              <p className="mb-6">
                We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.
              </p>

              <h2 className="font-bold">5. Your Consent</h2>
              <p className="mb-6">
                By using our site, you consent to our web site privacy policy.
              </p>

              <h2 className="font-bold">6. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us at LegalSift@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
