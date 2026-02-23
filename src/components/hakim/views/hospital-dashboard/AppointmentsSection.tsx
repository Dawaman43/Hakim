"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { DashboardAppointment } from "./types";

interface AppointmentsSectionProps {
  darkMode: boolean;
  t: Record<string, string>;
  appointments: DashboardAppointment[];
  onUpdateStatus: (appointmentId: string, status: string) => void;
  loading: boolean;
}

export function AppointmentsSection({
  darkMode,
  t,
  appointments,
  onUpdateStatus,
  loading,
}: AppointmentsSectionProps) {
  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border border-border bg-card p-6 transition-colors duration-300 ${darkMode ? "" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t.appointments}</h3>
          {loading && <ArrowClockwise size={16} className="animate-spin text-muted-foreground" />}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>#{a.tokenNumber}</TableCell>
                <TableCell>{a.patientName || "—"}</TableCell>
                <TableCell>{a.patientPhone || "—"}</TableCell>
                <TableCell>{a.departmentName || "—"}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(a.id, "COMPLETED")}>
                      Complete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(a.id, "SKIPPED")}>
                      Skip
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onUpdateStatus(a.id, "CANCELLED")}>
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
