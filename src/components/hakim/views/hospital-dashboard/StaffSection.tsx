"use client";

import { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StaffSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  staff: Array<{ id: string; name: string; phone: string; role: string; createdAt: string }>;
  onAdd: (payload: { name: string; phone: string; role: string }) => void;
  onRemove: (id: string) => void;
  loading: boolean;
}

export function StaffSection({ t, staff, onAdd, onRemove, loading }: StaffSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("STAFF");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.staff}</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="09XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Role (e.g., Nurse)" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <Button
          onClick={() => {
            if (!name || !phone) return;
            onAdd({ name, phone, role });
            setName("");
            setPhone("");
            setRole("STAFF");
          }}
          disabled={loading}
        >
          <Plus size={16} className="mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => onRemove(s.id)}>
                    <Trash size={14} className="mr-1" />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No staff added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
