import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const ViewBy = ({ options, onChange, defaultValue = "", placeholder }) => {
  return (
    <Select
      onValueChange={(value) => onChange(value)}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-[200px] mb-4">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ViewBy;
