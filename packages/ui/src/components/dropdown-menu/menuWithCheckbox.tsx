"use client"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./index"
import { Button } from "../button"

export type DropdownMenuChecked = DropdownMenuCheckboxItemProps["checked"]

interface CheckboxItem {
    label: string;
    checked: boolean;
    onCheckedChange: (newValue: boolean) => void;
    disabled?: boolean;
}
interface Props{
    trigger?:React.ReactNode
    data:CheckboxItem[]
}
  
  export function DropdownMenuCheckboxes({ data, trigger }: Props) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data.map((checkbox, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={checkbox.checked}
              onCheckedChange={checkbox.onCheckedChange}
              disabled={checkbox.disabled}
            >
              {checkbox.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }