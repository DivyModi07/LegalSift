import { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, ArrowRight, FileText, Shield } from 'lucide-react';

const IPCExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const categories = [
    'all',
    'offenses against person',
    'offenses against property',
    'offenses against state',
    'offenses against public tranquility',
    'offenses affecting human body',
    'offenses against women',
    'cyber crimes',
    'economic offenses'
  ];

  // Mock IPC sections data
  useEffect(() => {
    const mockSections = [
      {
        id: 1,
        section: '302',
        title: 'Murder',
        description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
        category: 'offenses against person',
        punishment: 'Death or imprisonment for life and fine',
        bailable: 'Non-bailable',
        cognizable: 'Cognizable',
        court: 'Court of Session'
      },
      {
        id: 2,
        section: '420',
        title: 'Cheating and Dishonestly Inducing Delivery of Property',
        description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished.',
        category: 'economic offenses',
        punishment: 'Imprisonment up to 7 years and fine',
        bailable: 'Non-bailable',
        cognizable: 'Cognizable',
        court: 'Any Magistrate'
      },
      {
        id: 3,
        section: '354',
        title: 'Assault or Criminal Force to Woman with Intent to Outrage her Modesty',
        description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished.',
        category: 'offenses against women',
        punishment: 'Imprisonment up to 2 years, or fine, or both',
        bailable: 'Bailable',
        cognizable: 'Cognizable',
        court: 'Any Magistrate'
      },
      {
        id: 4,
        section: '379',
        title: 'Theft',
        description: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
        category: 'offenses against property',
        punishment: 'Imprisonment up to 3 years, or fine, or both',
        bailable: 'Bailable',
        cognizable: 'Cognizable',
        court: 'Any Magistrate'
      },
      {
        id: 5,
        section: '376',
        title: 'Rape',
        description: 'Whoever commits rape shall be punished with rigorous imprisonment for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.',
        category: 'offenses against women',
        punishment: 'Rigorous imprisonment 10 years to life and fine',
        bailable: 'Non-bailable',
        cognizable: 'Cognizable',
        court: 'Court of Session'
      },
      {
        id: 6,
        section: '307',
        title: 'Attempt to Murder',
        description: 'Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished.',
        category: 'offenses against person',
        punishment: 'Imprisonment up to 10 years and fine',
        bailable: 'Non-bailable',
        cognizable: 'Cognizable',
        court: 'Court of Session'
      },
      {
        id: 7,
        section: '66C',
        title: 'Identity Theft',
        description: 'Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, shall be punished.',
        category: 'cyber crimes',
        punishment: 'Imprisonment up to 3 years and fine up to ₹1 lakh',
        bailable: 'Bailable',
        cognizable: 'Cognizable',
        court: 'Any Magistrate'
      },
      {
        id: 8,
        section: '124A',
        title: 'Sedition',
        description: 'Whoever, by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards, the Government established by law.',
        category: 'offenses against state',
        punishment: 'Imprisonment for life and fine, or imprisonment up to 3 years and fine',
        bailable: 'Non-bailable',
        cognizable: 'Cognizable',
        court: 'Court of Session'
      }
    ];

    setTimeout(() => {
      setSections(mockSections);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            IPC Explorer
          </h1>
          <p className="text-neutral-600">
            Search and explore Indian Penal Code sections
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by section number, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input w-full lg:w-48"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredSections.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No sections found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search criteria or browse all categories
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">
                  IPC Sections ({filteredSections.length})
                </h2>
              </div>
              
              <div className="grid gap-6">
                {filteredSections.map((section) => (
                  <div key={section.id} className="card p-6 hover:shadow-medium transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">
                              Section {section.section}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {section.category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                            {section.title}
                          </h4>
                          <p className="text-neutral-600 leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Punishment</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.punishment}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Bailable</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.bailable}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Cognizable</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.cognizable}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Court</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.court}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="btn btn-secondary text-sm inline-flex items-center">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-8 card p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">About IPC Sections</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                The Indian Penal Code (IPC) is the main criminal code of India. It is a comprehensive code intended to cover all substantive aspects of criminal law. 
                The code was drafted in 1860 on the recommendations of the first law commission of India established in 1834 under the Charter Act of 1833.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPCExplorer;
