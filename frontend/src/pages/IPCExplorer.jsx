import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Filter,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader,
  ArrowLeft
} from 'lucide-react';
import api from '../services/api'; 
import { toast } from 'react-hot-toast';

const IPCExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [expandedSection, setExpandedSection] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchIpcData = async () => {
      try {
        const response = await api.get('/ml/ipc/');
        const data = response.data;
        setSections(data);
        const uniqueCategories = [...new Set(data.map((section) => section.mapped_category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error("Failed to fetch IPC sections:", error);
        toast.error("Could not fetch IPC sections.");
      } finally {
        setLoading(false);
      }
    };

    fetchIpcData();
  }, []);

  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      section.section_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.short_description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      section.mapped_category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sectionsToShow = filteredSections.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const toggleDetails = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

   if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-[#C9A227]" />
          <p className="text-[#7A7A7A] text-lg font-medium">Loading IPC Explorer form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="relative mb-12 p-8 bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] rounded-2xl shadow-xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227] opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-3">
                IPC <span className="text-[#C9A227]">Explorer</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Search and explore Indian Penal Code sections
              </p>
            </div>
          </div>
       
        {/* Search and Filter */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-[#E5E5E5]">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7A7A7A]" />
              <input
                type="text"
                placeholder="Search by section number, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#DDD] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-[#1C1C1C]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#7A7A7A]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#DDD] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none text-[#1C1C1C]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all'
                      ? 'All Categories'
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredSections.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1C1C1C]">
                IPC Sections ({filteredSections.length})
              </h2>
            </div>
          )}

          {sectionsToShow.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center shadow-sm">
              <BookOpen className="h-12 w-12 text-[#7A7A7A] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1C1C1C] mb-2">
                No sections found
              </h3>
              <p className="text-[#7A7A7A]">
                Try adjusting your search criteria or browse all categories
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {sectionsToShow.map((section) => (
                <div
                  key={section.id}
                  className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#FAFAF5] p-3 rounded-lg flex-shrink-0">
                        <FileText className="h-6 w-6 text-[#C9A227]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-[#1C1C1C]">
                            Section {section.section_number}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C9A227]/10 text-[#C9A227]">
                            {section.mapped_category.charAt(0).toUpperCase() +
                              section.mapped_category.slice(1)}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-[#1C1C1C] mb-2">
                          {section.title}
                        </h4>
                        <p className="text-[#7A7A7A] leading-relaxed">
                          {section.short_description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-[#FAFAF5] p-3 rounded-lg">
                      <p className="text-sm text-[#7A7A7A] mb-1">Punishment</p>
                      <p className="font-medium text-[#1C1C1C] text-sm">
                        {section.punishment}
                      </p>
                    </div>
                    <div className="bg-[#FAFAF5] p-3 rounded-lg">
                      <p className="text-sm text-[#7A7A7A] mb-1">Bailability</p>
                      <p className="font-medium text-[#1C1C1C] text-sm">
                        {section.bailability_status}
                      </p>
                    </div>
                    <div className="bg-[#FAFAF5] p-3 rounded-lg">
                      <p className="text-sm text-[#7A7A7A] mb-1">Court</p>
                      <p className="font-medium text-[#1C1C1C] text-sm">
                        {section.court_jurisdiction}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#E5E5E5] pt-6">
                    <button
                      onClick={() => toggleDetails(section.id)}
                      className="flex items-center justify-between w-full text-[#C9A227] hover:text-[#7A7A7A] font-medium transition-colors"
                    >
                      <span>
                        {expandedSection === section.id
                          ? 'Hide Full Legal Explanation'
                          : 'View Full Legal Explanation'}
                      </span>
                      {expandedSection === section.id ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </button>

                    {expandedSection === section.id && (
                      <div className="mt-4 p-4 bg-[#FAFAF5] rounded-lg">
                        <p className="text-[#1C1C1C] whitespace-pre-wrap">
                          {section.full_legal_text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredSections.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 rounded-lg bg-[#C9A227] text-white font-medium shadow-sm hover:bg-[#A7841F] transition-colors"
              >
                Load More Sections
              </button>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 shadow-md">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                About IPC Sections
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                The Indian Penal Code (IPC) is the main criminal code of India. It
                is a comprehensive code intended to cover all substantive aspects
                of criminal law. The code was drafted in 1860 on the recommendations
                of the first law commission of India established in 1834 under the
                Charter Act of 1833.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPCExplorer;
