"use client";

import { useEffect, useState } from "react";
import { Check, ArrowClockwise } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface AdminAnalyticsPageProps {
  darkMode: boolean;
  token: string | null;
  apiGet: (path: string, token?: string) => Promise<any>;
  apiPost: (path: string, body: unknown, token?: string) => Promise<any>;
  navigation?: React.ReactNode;
}

export function AdminAnalyticsPage({ darkMode, token, apiGet, apiPost, navigation }: AdminAnalyticsPageProps) {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [pendingHospitals, setPendingHospitals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadAll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [overviewRes, hospitalsRes, pendingRes, usersRes, apptsRes, auditRes] = await Promise.all([
        apiGet("/api/admin/overview", token),
        apiGet("/api/admin/hospitals", token),
        apiGet("/api/admin/pending-hospitals", token),
        apiGet("/api/admin/users", token),
        apiGet("/api/admin/appointments?scope=today&limit=50", token),
        apiGet("/api/admin/audit?limit=100", token),
      ]);
      if (overviewRes?.success) setOverview(overviewRes.data);
      if (hospitalsRes?.success) setHospitals(hospitalsRes.data || []);
      if (pendingRes?.success) setPendingHospitals(pendingRes.data || []);
      if (usersRes?.success) setUsers(usersRes.data || []);
      if (apptsRes?.success) setAppointments(apptsRes.data || []);
      if (auditRes?.success) setAuditLogs(auditRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const approveHospital = async (hospitalId: string) => {
    if (!token) return;
    const res = await apiPost("/api/admin/approve-hospital", { hospitalId }, token);
    if (res?.success) {
      await loadAll();
    } else {
      alert(res?.error || "Failed to approve hospital");
    }
  };

  const exportCsv = (filename: string, rows: Record<string, any>[]) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
      {navigation}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Analytics</h1>
            <p className="text-muted-foreground">Global performance and approvals</p>
          </div>
          <Button variant="outline" onClick={loadAll} disabled={loading}>
            {loading ? <ArrowClockwise size={16} className="animate-spin" /> : "Refresh"}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/70">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Hospitals", value: overview?.totalHospitals ?? 0 },
                { label: "Active Hospitals", value: overview?.activeHospitals ?? 0 },
                { label: "Users", value: overview?.totalUsers ?? 0 },
                { label: "Appointments", value: overview?.totalAppointments ?? 0 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pending Approvals</h3>
              {pendingHospitals.length === 0 ? (
                <p className="text-muted-foreground">No pending hospitals.</p>
              ) : (
                <div className="space-y-3">
                  {pendingHospitals.map((row) => {
                    const h = row.hospital || row;
                    return (
                    <div key={h.id} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{h.name}</p>
                        <p className="text-sm text-muted-foreground">{h.region} • {row.adminPhone || h.adminPhone || "—"}</p>
                      </div>
                      <Button onClick={() => approveHospital(h.id)}>
                        <Check size={16} className="mr-2" />
                        Approve
                      </Button>
                    </div>
                  )})}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">All Hospitals</h3>
                <Button variant="outline" onClick={() => exportCsv("hospitals.csv", hospitals)}>
                  Export CSV
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>{h.region}</TableCell>
                      <TableCell>{h.isActive ? "Active" : "Pending"}</TableCell>
                      <TableCell>{h.adminName || "—"} ({h.adminPhone || "—"})</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Users</h3>
                <Button variant="outline" onClick={() => exportCsv("users.csv", users)}>
                  Export CSV
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name || "—"}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Appointments</h3>
                <Button variant="outline" onClick={() => exportCsv("appointments.csv", appointments)}>
                  Export CSV
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>#{a.tokenNumber}</TableCell>
                      <TableCell>{a.patientName || "—"}</TableCell>
                      <TableCell>{a.patientPhone || "—"}</TableCell>
                      <TableCell>{a.departmentName || "—"}</TableCell>
                      <TableCell>{a.hospitalName || "—"}</TableCell>
                      <TableCell>{a.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Audit Log</h3>
                <Button variant="outline" onClick={() => exportCsv("audit-log.csv", auditLogs)}>
                  Export CSV
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.type}</TableCell>
                      <TableCell>{a.channel}</TableCell>
                      <TableCell>{a.recipient}</TableCell>
                      <TableCell>{a.status}</TableCell>
                      <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {auditLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No audit logs.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
