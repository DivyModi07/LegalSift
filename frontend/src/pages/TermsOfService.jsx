import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
              Terms of Service
            </h1>
          </div>
          
          {/* Content Card */}
          <div className="card p-8 md:p-10">
            <div className="prose max-w-none prose-neutral">
              <p className="mb-6">
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the LegalSift application (the "Service") operated by us.
              </p>

              <h2 className="font-bold">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>

              <h2 className="font-bold">2. Description of Service</h2>
              <p className="mb-6">
                LegalSift provides an AI-powered platform for informational purposes related to the Indian Penal Code. The information provided by our AI is not a substitute for professional legal advice.
              </p>

              <h2 className="font-bold">3. User Accounts</h2>
              <p className="mb-6">
                When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>

              <h2 className="font-bold">4. Disclaimer</h2>
              <p className="mb-6">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied. The information provided is for informational purposes only and does not constitute legal advice.
              </p>

              <h2 className="font-bold">5. Limitation of Liability</h2>
              <p className="mb-6">
                In no event shall LegalSift, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2 className="font-bold">6. Contact Us</h2>
              <p className="mb-6">
                If you have any questions about these Terms, please contact us at LegalSift@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
