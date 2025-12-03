import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface University {
  name_english: string;
  name_bangla: string;
}

interface UniversitySelectorProps {
  universities: University[];
  value: string | undefined;
  onChange: (value: { name_english: string; name_bangla: string }) => void;
  placeholder?: string;
  className?: string;
}

export default function UniversitySelector({
  universities,
  value,
  onChange,
  placeholder = "Select University",
  className = "",
}: UniversitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isOthers, setIsOthers] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter universities based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUniversities(universities.slice(0, 50)); // Show first 50 initially
    } else {
      const filtered = universities.filter((university) =>
        university.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.name_bangla.includes(searchTerm)
      );
      setFilteredUniversities(filtered.slice(0, 20)); // Limit to 20 results
    }
  }, [searchTerm, universities]);

  // Set initial value if provided
  useEffect(() => {
    if (value && !selectedUniversity && !isOthers) {
      const found = universities.find(
        (uni) => uni.name_english === value || uni.name_bangla === value
      );
      if (found) {
        setSelectedUniversity(found);
        setSearchTerm(language === "bn" ? found.name_bangla : found.name_english);
      } else {
        setIsOthers(true);
        setManualInput(value);
      }
    }
  }, [value, universities, selectedUniversity, isOthers, language]);

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setSearchTerm(language === "bn" ? university.name_bangla : university.name_english);
    setIsOpen(false);
    setIsOthers(false);
    onChange(university);
  };

  const handleOthersSelect = () => {
    setIsOthers(true);
    setSelectedUniversity(null);
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleManualInputChange = (inputValue: string) => {
    setManualInput(inputValue);
    onChange({
      name_english: inputValue,
      name_bangla: inputValue,
    });
  };

  const handleSearchInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    setIsOpen(true);
    
    if (isOthers) {
      setIsOthers(false);
      setManualInput("");
    }
  };

  // const displayValue = () => {
  //   if (isOthers) {
  //     return manualInput;
  //   }
  //   if (selectedUniversity) {
  //     return language === "bn" ? selectedUniversity.name_bangla : selectedUniversity.name_english;
  //   }
  //   return searchTerm;
  // };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={isOthers ? manualInput : searchTerm}
          onChange={(e) => {
            if (isOthers) {
              handleManualInputChange(e.target.value);
            } else {
              handleSearchInputChange(e.target.value);
            }
          }}
          onFocus={() => {
            if (!isOthers) {
              setIsOpen(true);
            }
          }}
          placeholder={isOthers ? "Enter university name manually" : placeholder}
          className="border-emerald-200 dark:border-emerald-700 pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isOthers ? (
            <Search className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !isOthers && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredUniversities.length > 0 ? (
            <>
              {filteredUniversities.map((university, index) => (
                <div
                  key={index}
                  onClick={() => handleUniversitySelect(university)}
                  className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="text-sm font-medium">
                    {language === "bn" ? university.name_bangla : university.name_english}
                  </div>
                  {language === "bn" && university.name_english && (
                    <div className="text-xs text-gray-500 mt-1">
                      {university.name_english}
                    </div>
                  )}
                  {language === "en" && university.name_bangla && (
                    <div className="text-xs text-gray-500 mt-1">
                      {university.name_bangla}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No universities found
            </div>
          )}
          
          {/* Others Option */}
          <div
            onClick={handleOthersSelect}
            className="px-4 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900 cursor-pointer border-t-2 border-yellow-200 dark:border-yellow-700 bg-yellow-25 dark:bg-yellow-950"
          >
            <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              📝 Others (Manual Input)
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              Enter university name manually
            </div>
          </div>
        </div>
      )}

      {/* Others Mode Indicator */}
      {isOthers && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            ✏️ Manual input mode
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setIsOthers(false);
              setManualInput("");
              setSearchTerm("");
              setSelectedUniversity(null);
            }}
            className="text-xs h-6 px-2"
          >
            Select from list
          </Button>
        </div>
      )}
    </div>
  );
}