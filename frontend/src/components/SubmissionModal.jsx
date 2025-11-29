import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

export default function SubmissionModal({ submission, onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Submission Details</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            View the complete details of this form submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Submission ID</p>
            <p className="font-mono text-xs sm:text-sm mt-1 break-all">{submission.id}</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Created At</p>
            <p className="text-xs sm:text-sm mt-1">{new Date(submission.createdAt).toLocaleString()}</p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-200 mb-3">Form Data</h3>
            <div className="space-y-3">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </p>
                  <div className="text-xs sm:text-sm text-gray-200 sm:col-span-2 break-words">
                    {formatValue(value, key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatValue(value, key) {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 cursor-default"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        value 
          ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/40' 
          : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
      } hover:shadow-md transition-all duration-200 cursor-default`}>
        {value ? 'Yes' : 'No'}
      </span>
    );
  }
  if (key === 'department' && value) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-default">
        {value}
      </span>
    );
  }
  if (value === null || value === undefined) {
    return <span className="text-gray-500 italic">N/A</span>;
  }
  return String(value);
}