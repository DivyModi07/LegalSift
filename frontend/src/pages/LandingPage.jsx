import { Link } from 'react-router-dom';
import { Shield, Search, MessageSquare, Scale, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Complaint Analysis',
      description: 'Get instant legal analysis of your complaints with our advanced AI system that identifies relevant IPC sections and provides guidance.',
    },
    {
      icon: Search,
      title: 'Comprehensive IPC Explorer',
      description: 'Explore the complete Indian Penal Code with our intelligent search and categorization system.',
    },
    {
      icon: MessageSquare,
      title: 'Legal Assistant Chatbot',
      description: 'Get instant answers to your legal questions with our AI-powered chatbot trained on Indian law.',
    },
  ];

  const benefits = [
    'Instant legal analysis and guidance',
    'Comprehensive IPC section exploration',
    'AI-powered legal assistant',
    'Professional lawyer recommendations',
    'Secure and confidential',
    '24/7 accessibility',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 p-3 rounded-full">
                <Scale className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Your AI-Powered
              <span className="text-primary-500"> Legal Assistant</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get instant legal analysis, explore IPC sections, and connect with qualified lawyers. 
              Empowering citizens with accessible legal guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/ipc-explorer"
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Explore IPC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need for Legal Guidance
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to understand and navigate legal matters.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Simple steps to get the legal guidance you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Submit Your Complaint</h3>
              <p className="text-neutral-600">
                Describe your legal issue in detail. Our AI will analyze and provide relevant legal guidance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Get AI Analysis</h3>
              <p className="text-neutral-600">
                Receive instant analysis including relevant IPC sections, urgency level, and recommended actions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Connect with Lawyers</h3>
              <p className="text-neutral-600">
                For high-urgency cases, get connected with qualified lawyers in your area with transparent fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Why Choose LegalSift?
              </h2>
              <p className="text-xl text-neutral-600">
                Experience the future of legal assistance with our cutting-edge platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {benefits.slice(3).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who trust LegalSift for their legal guidance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/lawyer-application"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Apply as Lawyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
