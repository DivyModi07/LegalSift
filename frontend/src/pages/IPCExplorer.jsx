import { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, FileText, Shield, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import api from '../services/api';

const IPCExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true); // Stays true until timeout
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    // --- THIS IS THE MODIFIED LOADING LOGIC ---
    // 1. Set a timer to ensure the loading spinner shows for at least 1 second.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1000 milliseconds = 1 second

    const fetchIpcData = async () => {
      try {
        // 2. Fetch data in the background. Note that setLoading is no longer here.
        const response = await api.get('/ml/ipc/');
        const data = response.data;
        setSections(data);
        setFilteredSections(data);

        const uniqueCategories = [...new Set(data.map(section => section.mapped_category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error("Failed to fetch IPC sections:", error);
        // If there's an error, we should still stop loading
        setLoading(false);
      }
    };

    fetchIpcData();

    // 3. Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const applyFilters = () => {
      const matchesSearch = (section) =>
        section.section_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.short_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = (section) =>
        selectedCategory === 'all' || section.mapped_category.toLowerCase() === selectedCategory.toLowerCase();

      const newFilteredSections = sections.filter(section => matchesSearch(section) && matchesCategory(section));
      setFilteredSections(newFilteredSections);
    };

    applyFilters();
  }, [searchTerm, selectedCategory, sections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const toggleDetails = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

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
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
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
                              Section {section.section_number}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {section.mapped_category.charAt(0).toUpperCase() + section.mapped_category.slice(1)}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                            {section.title}
                          </h4>
                          <p className="text-neutral-600 leading-relaxed">
                            {section.short_description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Punishment</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.punishment}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Bailability</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.bailability_status}</p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Court</p>
                        <p className="font-medium text-neutral-900 text-sm">{section.court_jurisdiction}</p>
                      </div>
                    </div>
                    
                    {/* Collapsible Full Text Section */}
                    <div className="mt-6 border-t border-neutral-200 pt-6">
                      <button 
                        onClick={() => toggleDetails(section.id)}
                        className="flex items-center justify-between w-full text-primary-600 hover:text-primary-500 font-medium transition-colors"
                      >
                        <span>
                          {expandedSection === section.id ? 'Hide Full Legal Explanation' : 'View Full Legal Explanation'}
                        </span>
                        {expandedSection === section.id ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </button>
                      
                      {expandedSection === section.id && (
                        <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                          <p className="text-neutral-700 whitespace-pre-wrap">{section.full_legal_text}</p>
                        </div>
                      )}
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