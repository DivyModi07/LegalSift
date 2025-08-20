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
    'Secure and confidential platform',
    'Easy-to-use interface',
    '24/7 accessibility',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-100/80 via-amber-50/50 to-stone-50 py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/5 to-transparent"></div>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-4 rounded-2xl shadow-lg border border-amber-200/50">
                <Scale className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-800 mb-6 leading-tight">
              Your AI-Powered
              <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent"> Legal Assistant</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Get instant legal analysis and explore IPC sections. Empowering citizens with accessible legal guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white text-lg px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/ipc-explorer"
                className="group border-2 border-stone-300 hover:border-yellow-500 text-stone-700 hover:text-yellow-700 text-lg px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg inline-flex items-center justify-center"
              >
                Explore IPC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-stone-50/70">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
              Everything You Need for Legal Guidance
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools you need to understand and navigate legal matters.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-stone-200/50 hover:border-yellow-300/50 transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="flex justify-center mb-8">
                  <div className="bg-gradient-to-br from-yellow-100 to-amber-100 group-hover:from-yellow-200 group-hover:to-amber-200 p-4 rounded-2xl shadow-md transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-yellow-600 group-hover:text-yellow-700 transition-colors" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Simple steps to get the legal guidance you need
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
            {/* Step 1 */}
            <div className="text-center flex-1 group">
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 group-hover:from-yellow-200 group-hover:to-amber-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-yellow-700">1</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Submit Your Complaint</h3>
              <p className="text-stone-600 text-lg leading-relaxed max-w-xs mx-auto">
                Describe your legal issue in detail. Our AI will analyze and provide relevant legal guidance.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden lg:flex flex-shrink-0 px-8 text-yellow-400">
                <ArrowRight size={50} strokeWidth={1.5} />
            </div>

            {/* Step 2 */}
            <div className="text-center flex-1 group">
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 group-hover:from-yellow-200 group-hover:to-amber-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-yellow-700">2</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Get AI Analysis</h3>
              <p className="text-stone-600 text-lg leading-relaxed max-w-xs mx-auto">
                Receive instant analysis including relevant IPC sections, urgency level, and recommended actions.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden lg:flex flex-shrink-0 px-8 text-yellow-400">
                <ArrowRight size={50} strokeWidth={1.5} />
            </div>

            {/* Step 3 */}
            <div className="text-center flex-1 group">
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 group-hover:from-yellow-200 group-hover:to-amber-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl font-bold text-yellow-700">3</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Explore and Understand</h3>
              <p className="text-stone-600 text-lg leading-relaxed max-w-xs mx-auto">
                Use our tools to explore the IPC and chat with our AI assistant to clarify your legal questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-stone-100/80 to-amber-50/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                Why Choose LegalSift?
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Experience the future of legal assistance with our cutting-edge platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                      <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    </div>
                    <span className="text-stone-700 text-lg font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {benefits.slice(3).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                      <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    </div>
                    <span className="text-stone-700 text-lg font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;