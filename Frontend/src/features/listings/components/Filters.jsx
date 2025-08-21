import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const CompactToggle = ({ label, value, onValueChange }) => {
  const selectedClass = "bg-emerald-500 text-white hover:bg-emerald-600";
  const unselectedClass = "bg-gray-100 hover:bg-gray-200 text-gray-700";
  const stringValue = value === true ? 'true' : value === false ? 'false' : 'any';

  const handleSelect = (selectedValue) => {
    if (selectedValue === stringValue) {
      onValueChange(null);
    } else {
      onValueChange(selectedValue === 'true');
    }
  };
  
  return (
    <div className="flex items-center justify-between">
        <Label htmlFor={`${label}-yes`} className="font-semibold">{label}</Label>
        <RadioGroup value={stringValue} onValueChange={handleSelect} className="flex items-center gap-2">
            <div>
                <RadioGroupItem value="true" id={`${label}-yes`} className="sr-only peer" />
                <Label htmlFor={`${label}-yes`} className={cn("flex items-center justify-center rounded-md h-9 px-4 text-xs font-medium cursor-pointer transition-colors", stringValue === 'true' ? selectedClass : unselectedClass)}>Yes</Label>
            </div>
            <div>
                <RadioGroupItem value="false" id={`${label}-no`} className="sr-only peer" />
                <Label htmlFor={`${label}-no`} className={cn("flex items-center justify-center rounded-md h-9 px-4 text-xs font-medium cursor-pointer transition-colors", stringValue === 'false' ? selectedClass : unselectedClass)}>No</Label>
            </div>
        </RadioGroup>
    </div>
  );
};

export function Filters({ filters, setFilters }) {
  const handleRentInputChange = (index, value) => {
    const newRent = [...filters.rent];
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    newRent[index] = isNaN(numericValue) ? 0 : numericValue;
    setFilters(prev => ({ ...prev, rent: newRent }));
  };

  // --- ENHANCEMENT: "Clear Filters" logic is now back inside this component ---
  const clearFilters = () => {
    setFilters({
      pets_allowed: null,
      smoking_allowed: null,
      rent: [0, 100000],
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-stone-800">Price Range</Label>
        <div className="flex items-center gap-2">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <Input
                    type="text"
                    placeholder="Min"
                    value={filters.rent[0].toLocaleString('en-IN')}
                    onChange={(e) => handleRentInputChange(0, e.target.value)}
                    className="pl-6 h-11"
                />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <Input
                    type="text"
                    placeholder="Max"
                    value={filters.rent[1].toLocaleString('en-IN')}
                    onChange={(e) => handleRentInputChange(1, e.target.value)}
                    className="pl-6 h-11"
                />
            </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-stone-800">Preferences</Label>
        <CompactToggle 
          label="Pets Allowed" 
          value={filters.pets_allowed}
          onValueChange={(value) => setFilters(prev => ({...prev, pets_allowed: value}))}
        />
        <CompactToggle 
          label="Smoking Allowed"
          value={filters.smoking_allowed}
          onValueChange={(value) => setFilters(prev => ({...prev, smoking_allowed: value}))}
        />
      </div>

      {/* --- ENHANCEMENT: Added the button back with a divider --- */}
      <div className="pt-5 border-t">
        <Button variant="outline" onClick={clearFilters} className="w-full h-12 text-base border-green-300 text-green-800 hover:bg-green-100 hover:text-green-900">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}