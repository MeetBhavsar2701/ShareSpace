import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";

export function Filters({ filters, setFilters }) {
  const handleSwitchChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName] === null ? true : !prev[filterName],
    }));
  };

  const handleSliderChange = (value) => {
    setFilters(prev => ({ ...prev, rent: value }));
  };
  
  const handleRentInputChange = (index, value) => {
    const newRent = [...filters.rent];
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    newRent[index] = isNaN(numericValue) ? newRent[index] : numericValue;
    setFilters(prev => ({ ...prev, rent: newRent }));
  };

  const clearFilters = () => {
    setFilters({
      pets_allowed: null,
      smoking_allowed: null,
      rent: [0, 100000],
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <Label>Rent Range</Label>
            <Slider
                min={0}
                max={100000}
                step={1000}
                value={filters.rent}
                onValueChange={handleSliderChange}
            />
            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                    <Input
                        type="number"
                        value={filters.rent[0]}
                        onChange={(e) => handleRentInputChange(0, e.target.value)}
                        className="pl-6"
                    />
                </div>
                <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                    <Input
                        type="number"
                        value={filters.rent[1]}
                        onChange={(e) => handleRentInputChange(1, e.target.value)}
                        className="pl-6"
                    />
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="pets_allowed">Pets Allowed</Label>
                <Switch 
                    id="pets_allowed" 
                    checked={filters.pets_allowed === true}
                    onCheckedChange={() => handleSwitchChange('pets_allowed')} 
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="smoking_allowed">Smoking Allowed</Label>
                <Switch 
                    id="smoking_allowed"
                    checked={filters.smoking_allowed === true}
                    onCheckedChange={() => handleSwitchChange('smoking_allowed')} 
                />
            </div>
        </div>
        
        <Button variant="outline" onClick={clearFilters} className="w-full">Clear Filters</Button>
      </CardContent>
    </Card>
  );
}