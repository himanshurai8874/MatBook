import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Loader2, ChevronUp, ChevronDown, Download, Copy, Check, Eye, FileText, CheckCircle, Search, ArrowUpDown, X } from 'lucide-react';
import { getSubmissions } from '../api/client';
import SubmissionModal from '../components/SubmissionModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['submissions', page, limit, sortOrder],
    queryFn: () => getSubmissions({ page, limit, sortBy: 'createdAt', sortOrder }),
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToCSV = () => {
    if (!data?.data || data.data.length === 0) return;

    // Prepare CSV headers
    const headers = ['Submission ID', 'Created Date', 'Full Name', 'Email', 'Age', 'Department', 'Skills', 'Start Date', 'Bio', 'Agree to Terms'];
    
    // Prepare CSV rows
    const rows = data.data.map(submission => [
      submission.id,
      new Date(submission.createdAt).toLocaleString(),
      submission.data.fullName || '',
      submission.data.email || '',
      submission.data.age || '',
      submission.data.department || '',
      Array.isArray(submission.data.skills) ? submission.data.skills.join('; ') : '',
      submission.data.startDate || '',
      submission.data.bio || '',
      submission.data.agreeToTerms ? 'Yes' : 'No'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4 h-8 text-xs sm:text-sm font-medium hover:text-primary-400 px-4"
        >
          ID
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const id = getValue();
        const shortId = id.substring(0, 8);
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm text-primary-400 font-semibold">{shortId}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(id, id)}
              className="h-6 w-6 p-0 hover:bg-gray-700"
              title="Copy full ID"
            >
              {copiedId === id ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 hover:text-gray-200" />
              )}
            </Button>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'data.fullName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4 h-8 text-xs sm:text-sm font-medium hover:text-primary-400 px-4"
        >
          Name
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-semibold text-xs border border-primary-500/30">
            {(getValue() || 'N')[0].toUpperCase()}
          </div>
          <span className="text-xs sm:text-sm text-gray-200 font-medium">{getValue() || 'N/A'}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'data.email',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4 h-8 text-xs sm:text-sm font-medium hover:text-primary-400 px-4"
        >
          Email
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs sm:text-sm text-gray-300">{getValue() || 'N/A'}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'data.department',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4 h-8 text-xs sm:text-sm font-medium hover:text-primary-400 px-4"
        >
          Department
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const dept = getValue();
        return dept ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer">
            {dept}
          </span>
        ) : (
          <span className="text-xs text-gray-500">N/A</span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4 h-8 text-xs sm:text-sm font-medium hover:text-primary-400 px-4"
        >
          Submitted On
          <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm text-gray-300 font-medium">
            {new Date(getValue()).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric'
            })}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(getValue()).toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'status',
      header: () => <span className="font-medium px-4">Status</span>,
      cell: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Completed</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className="font-medium px-4">Actions</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedSubmission(row.original)}
          className="h-8 gap-1.5 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-all"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">View Details</span>
        </Button>
      ),
      enableSorting: false,
    },
  ], [copiedId]);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const id = row.original.id?.toLowerCase() || '';
      const name = row.original.data?.fullName?.toLowerCase() || '';
      const email = row.original.data?.email?.toLowerCase() || '';
      const department = row.original.data?.department?.toLowerCase() || '';
      
      return id.includes(searchValue) || 
             name.includes(searchValue) || 
             email.includes(searchValue) ||
             department.includes(searchValue);
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <Card className="overflow-hidden border-gray-700">
          <CardHeader className="border-b border-gray-700 bg-gray-800/50">
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded">
                <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 flex-1 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Submissions</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { totalSubmissions, totalPages, currentPage } = data?.pagination || {};

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Form Submissions</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {totalSubmissions === 0 ? 'No submissions yet' : `${totalSubmissions} total submission${totalSubmissions !== 1 ? 's' : ''}`}
            </p>
          </div>
          {totalSubmissions > 0 && (
            <Button
              onClick={exportToCSV}
              className="gap-2 bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          )}
        </div>
        
        {totalSubmissions > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, name, email, or department..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-10 h-11 bg-gray-800/50 border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 text-gray-200 placeholder:text-gray-500"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGlobalFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-700"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        )}
      </div>

      {totalSubmissions === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-700 bg-gray-900/50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-2 border-gray-700">
              <FileText className="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Submissions Yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Your submission records will appear here once someone fills out the form.
                Get started by creating your first submission!
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="mt-4 border-primary-500 text-primary-400 hover:bg-primary-500/10"
            >
              Create First Submission
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden border-gray-700 shadow-xl">
            <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-800/80 to-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-200">
                  Submission Records
                  {globalFilter && (
                    <span className="ml-3 text-sm font-normal text-gray-400">
                      ({table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="bg-gray-800/30">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getFilteredRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Search className="h-8 w-8 text-gray-600" />
                          <p className="text-sm">No submissions found matching your search.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-800/40 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="mt-4 border-gray-700 shadow-lg">
            <CardContent className="p-4 bg-gradient-to-r from-gray-800/40 to-gray-800/20">
              {/* Mobile Layout */}
              <div className="flex flex-col gap-4 sm:hidden">
                {/* Page Info - Mobile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Show</span>
                    <Select
                      value={limit.toString()}
                      onValueChange={(value) => {
                        setLimit(Number(value));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-16 h-8 bg-gray-800 border-gray-600 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 rounded-lg border border-gray-700">
                    <span className="text-xs font-semibold text-primary-400">{currentPage}</span>
                    <span className="text-xs text-gray-500">/</span>
                    <span className="text-xs font-medium text-gray-300">{totalPages}</span>
                  </div>
                </div>
                
                {/* Navigation Buttons - Mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 border-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 border-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
                  >
                    Next
                    <ChevronDown className="h-4 w-4 -rotate-90 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Rows per page:</span>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-9 bg-gray-800 border-gray-600 hover:bg-gray-750 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <span className="text-xs text-gray-400 font-medium">Page</span>
                    <span className="text-sm font-bold text-primary-400">{currentPage}</span>
                    <span className="text-xs text-gray-500">of</span>
                    <span className="text-sm font-semibold text-gray-300">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-4 border-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 px-4 border-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                      <ChevronDown className="h-4 w-4 -rotate-90 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
